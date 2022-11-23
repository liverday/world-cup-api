/* eslint-disable no-param-reassign */
import Match from '@/application/models/fifa/match';
import fifaStatsKeyDictionary from '@/application/models/fifa/stats-key-dictionary';
import UseCase from '@/application/usecase';
import { convertNullToUndefined } from '@/application/util/objects';
import prisma from '@/lib/prisma';
import { Match as PrismaMatch, MatchStats, Team } from '@prisma/client';
import FindOrCreateMatchStatsUseCaseImpl, {
  FindOrCreateMatchStatsUseCase,
} from './find-or-create-match-stats';
import UpdateMatchStatsUseCaseImpl, {
  UpdateMatchStatsUseCase,
} from './update-match-stats';

type MatchStatsKey = keyof MatchStats;

type PrismaMatchDelegate = PrismaMatch & {
  homeTeam: Team | null;
  awayTeam: Team | null;
  winner: Team | null;
};

export type UpdateMatchByJsonRequest = {
  newMatch: Match;
  current: PrismaMatchDelegate;
};

export type UpdateMatchByJsonUseCase = UseCase<
  UpdateMatchByJsonRequest,
  PrismaMatch
>;

type MatchUpdater = (source: PrismaMatchDelegate, json: Match) => Promise<void>;

export default class UpdateMatchByJsonUseCaseImpl
  implements UpdateMatchByJsonUseCase
{
  private PERIOD_TO_FINISH_MATCH = 10;

  private LIVE_STATUS_VALUE = 3;

  private findOrCreateMatchStats: FindOrCreateMatchStatsUseCase;

  private updateMatchStats: UpdateMatchStatsUseCase;

  constructor() {
    this.findOrCreateMatchStats = new FindOrCreateMatchStatsUseCaseImpl();
    this.updateMatchStats = new UpdateMatchStatsUseCaseImpl();
  }

  private pipeline: MatchUpdater[] = [
    this.writeGameStats.bind(this),
    this.writeTimeInfo.bind(this),
    this.writeScoreInfo.bind(this),
    this.writeHomeStats.bind(this),
    this.writeAwayStats.bind(this),
  ];

  async execute({
    newMatch,
    current,
  }: UpdateMatchByJsonRequest): Promise<PrismaMatch> {
    const newMatchToUpdate: PrismaMatchDelegate = {
      ...current,
      updatedAt: new Date(),
    };

    const promises = this.pipeline.map(updater =>
      updater(newMatchToUpdate, newMatch),
    );

    await Promise.all(promises);

    const {
      homeTeam: _,
      awayTeam: _1,
      winner: _2,
      ...updatedData
    } = newMatchToUpdate;

    return prisma.match.update({
      where: {
        id: newMatchToUpdate.id,
      },
      data: convertNullToUndefined(updatedData),
    });
  }

  async writeScoreInfo(
    source: PrismaMatchDelegate,
    json: Match,
  ): Promise<void> {
    console.log(`[UpdateMatchByJson] writing score stats`, json);
    source.homeTeamScore = json.HomeTeam.Score;
    source.awayTeamScore = json.AwayTeam.Score;
    source.homeTeamPenalties = json.HomeTeamPenaltyScore;
    source.awayTeamPenalties = json.AwayTeamPenaltyScore;
  }

  async writeTimeInfo(source: PrismaMatchDelegate, json: Match): Promise<void> {
    console.log(`[UpdateMatchByJson] writing time stats`);
    source.time = json.MatchTime;
    source.firstHalfTime = json.FirstHalfTime;
    source.firstHalfExtraTime = json.FirstHalfExtraTime;
    source.secondHalfTime = json.SecondHalfTime;
    source.secondHalfExtraTime = json.SecondHalfExtraTime;
  }

  async writeHomeStats(
    source: PrismaMatchDelegate,
    json: Match,
  ): Promise<void> {
    console.log(`[UpdateMatchByJson] writing home stats`);
    console.log(source);
    const stats = await this.findOrCreateMatchStats.execute({
      teamId: source.homeTeamId!,
      matchId: source.id,
    });

    stats.coaches = json.HomeTeam.Coaches as any[];
    stats.startingPlayers = json.HomeTeam.Players as any[];
    stats.substitutes = json.HomeTeam.Substitutions;
    stats.tactics = json.HomeTeam.Tactics;
    stats.ballPossession = json.BallPossession.OverallHome;

    if (json.Statistics) {
      this.writeStatisticsForTeam(stats, json.Statistics[json.HomeTeam.IdTeam]);
    }

    await this.updateMatchStats.execute(stats);
  }

  async writeAwayStats(
    source: PrismaMatchDelegate,
    json: Match,
  ): Promise<void> {
    console.log(`[UpdateMatchByJson] writing away stats`);
    const stats = await this.findOrCreateMatchStats.execute({
      teamId: source.awayTeamId!,
      matchId: source.id,
    });

    stats.coaches = json.AwayTeam.Coaches as any[];
    stats.startingPlayers = json.AwayTeam.Players as any[];
    stats.substitutes = json.AwayTeam.Substitutions;
    stats.tactics = json.AwayTeam.Tactics;
    stats.ballPossession = json.BallPossession.OverallAway;

    if (json.Statistics) {
      this.writeStatisticsForTeam(stats, json.Statistics[json.HomeTeam.IdTeam]);
    }

    await this.updateMatchStats.execute(stats);
  }

  async writeGameStats(
    source: PrismaMatchDelegate,
    json: Match,
  ): Promise<void> {
    source.status = this.getGameStatusByJson(source.status, json);

    if (json.Winner) {
      if (json.Winner === source.homeTeam?.fifaCode) {
        source.winnerId = source.homeTeamId;
      } else if (json.Winner === source.awayTeam?.fifaCode) {
        source.winnerId = source.awayTeamId;
      }
    }

    source.venue = json.Stadium.Name[0].Description;
    source.location = json.Stadium.CityName[0].Description;
    source.officials = json.Officials as any;
  }

  writeStatisticsForTeam(
    stats: MatchStats,
    statistics: [string, number, boolean][],
  ): void {
    statistics.forEach(([fifaStatKey, value]) => {
      const parsedKey: MatchStatsKey =
        this.fifaStatKeyToMatchStatKey(fifaStatKey);

      if (parsedKey) {
        this.updateSingleStat(stats, parsedKey, value);
      }
    });
  }

  fifaStatKeyToMatchStatKey(fifaStatKey: string): MatchStatsKey {
    return fifaStatsKeyDictionary[fifaStatKey] || null;
  }

  updateSingleStat<K extends keyof MatchStats, V extends MatchStats[K]>(
    stats: MatchStats,
    key: K,
    value: V,
  ): void {
    stats[key] = value;
  }

  isMatchInProgress(status: string): boolean {
    return status === 'in_progress';
  }

  getGameStatusByJson(currentStatus: string, json: Match): string {
    if (json.Period === this.PERIOD_TO_FINISH_MATCH) {
      return 'completed';
    }

    if (
      (currentStatus === 'scheduled' && parseInt(json.MatchTime, 10) > 0) ||
      json.MatchStatus === this.LIVE_STATUS_VALUE
    ) {
      return 'in_progress';
    }

    return currentStatus;
  }
}
