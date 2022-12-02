/* eslint-disable no-param-reassign */
import Booking from '@/application/models/fifa/booking';
import Goal from '@/application/models/fifa/goal';
import Match from '@/application/models/fifa/match';
import Player from '@/application/models/fifa/player';
import fifaStatsKeyDictionary from '@/application/models/fifa/stats-key-dictionary';
import { Substitution } from '@/application/models/fifa/substitution';
import UseCase from '@/application/usecase';
import { convertNullToUndefined } from '@/application/util/objects';
import prisma from '@/lib/prisma';
import { Event, Match as PrismaMatch, MatchStats, Team } from '@prisma/client';
import FindTeamByFifaIdUseCaseImpl, {
  FindTeamByFifaIdUseCase,
} from '../teams/find-team-by-fifa-id';
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

  private findTeamByFifaId: FindTeamByFifaIdUseCase;

  constructor() {
    this.findOrCreateMatchStats = new FindOrCreateMatchStatsUseCaseImpl();
    this.updateMatchStats = new UpdateMatchStatsUseCaseImpl();
    this.findTeamByFifaId = new FindTeamByFifaIdUseCaseImpl();
  }

  private pipeline: MatchUpdater[] = [
    this.writeGameStats.bind(this),
    this.writeTimeInfo.bind(this),
    this.writeScoreInfo.bind(this),
    this.writeHomeTeam.bind(this),
    this.writeAwayTeam.bind(this),
    this.writeHomeStats.bind(this),
    this.writeAwayStats.bind(this),
    this.writeHomeEvents.bind(this),
    this.writeAwayEvents.bind(this),
  ];

  async execute({
    newMatch,
    current,
  }: UpdateMatchByJsonRequest): Promise<PrismaMatch> {
    const newMatchToUpdate: PrismaMatchDelegate = {
      ...current,
      updatedAt: new Date(),
    };

    // eslint-disable-next-line no-restricted-syntax
    for (const updater of this.pipeline) {
      // eslint-disable-next-line no-await-in-loop
      await updater(newMatchToUpdate, newMatch);
    }

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
    console.log(`[UpdateMatchByJson] writing score stats`);
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

  async writeHomeTeam(source: PrismaMatchDelegate, json: Match): Promise<void> {
    if (source.homeTeamId || !json.HomeTeam) {
      return;
    }

    const team = await this.findTeamByFifaId.execute({
      fifaId: json.HomeTeam!.IdTeam,
    });

    if (!team) return;

    source.homeTeamId = team.id;
  }

  async writeAwayTeam(source: PrismaMatchDelegate, json: Match): Promise<void> {
    if (source.awayTeamId || !json.AwayTeam) {
      return;
    }

    const team = await this.findTeamByFifaId.execute({
      fifaId: json.AwayTeam!.IdTeam,
    });

    if (!team) return;

    source.awayTeamId = team.id;
  }

  async writeHomeStats(
    source: PrismaMatchDelegate,
    json: Match,
  ): Promise<void> {
    if (!source.homeTeamId) {
      return;
    }

    console.log(`[UpdateMatchByJson] writing home stats`);

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
    if (!source.awayTeamId) {
      return;
    }

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
      this.writeStatisticsForTeam(stats, json.Statistics[json.AwayTeam.IdTeam]);
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

  async writeHomeEvents(
    source: PrismaMatchDelegate,
    json: Match,
  ): Promise<void> {
    if (!source.homeTeamId || !json.HomeTeam) return;

    const players = this.getPlayersGroupedById(json);

    const events: Event[] = ([] as Event[]).concat(
      this.getGoalsEvents(
        players,
        json.HomeTeam.Goals,
        source.homeTeamId,
        source.id,
      ),
      this.getBookingsEvents(
        players,
        json.HomeTeam.Bookings,
        source.homeTeamId,
        source.id,
      ),
      this.getSubstitutionsEvents(
        players,
        json.HomeTeam.Substitutions,
        source.homeTeamId,
        source.id,
      ),
    );

    await prisma.event.createMany({
      data: events as any[],
      skipDuplicates: true,
    });
  }

  async writeAwayEvents(
    source: PrismaMatchDelegate,
    json: Match,
  ): Promise<void> {
    if (!source.awayTeamId || !json.AwayTeam) return;

    const players = this.getPlayersGroupedById(json);

    const events: Event[] = ([] as Event[]).concat(
      this.getGoalsEvents(
        players,
        json.AwayTeam.Goals,
        source.awayTeamId,
        source.id,
      ),
      this.getBookingsEvents(
        players,
        json.AwayTeam.Bookings,
        source.awayTeamId,
        source.id,
      ),
      this.getSubstitutionsEvents(
        players,
        json.AwayTeam.Substitutions,
        source.awayTeamId,
        source.id,
      ),
    );

    await prisma.event.createMany({
      data: events as any[],
      skipDuplicates: true,
    });
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

  getGoalsEvents(
    playersById: Record<string, Player>,
    goals: Goal[],
    teamId: string,
    matchId: string,
  ): Event[] {
    if (!goals) return [];

    return goals.map(goal => {
      const player = playersById[goal.IdPlayer]!.PlayerName[0].Description;
      const assistPlayer = goal.IdAssistPlayer
        ? playersById[goal.IdAssistPlayer]!.PlayerName[0].Description
        : null;
      return {
        id: this.buildEventId({
          teamId,
          matchId,
          time: goal.Minute,
          type: 'goal',
        }),
        fifaId: goal.IdGoal ?? null,
        typeOfEvent: 'goal',
        player,
        time: goal.Minute,
        teamId,
        matchId,
        extraInfo: assistPlayer && {
          assistFrom: assistPlayer,
        },
      } as any;
    });
  }

  getBookingsEvents(
    playersById: Record<string, Player>,
    bookings: Booking[],
    teamId: string,
    matchId: string,
  ): Event[] {
    if (!bookings) return [];

    return bookings.map(booking => {
      const player = playersById[booking.IdPlayer]!.PlayerName[0].Description;

      return {
        id: this.buildEventId({
          teamId,
          matchId,
          time: booking.Minute,
          type: 'booking',
        }),
        fifaId: booking.IdEvent ?? null,
        typeOfEvent: 'booking',
        player,
        time: booking.Minute,
        teamId,
        matchId,
        extraInfo: {
          card: booking.Card === 1 ? 'yellow' : 'red',
        },
      } as any;
    });
  }

  getSubstitutionsEvents(
    playersById: Record<string, Player>,
    substitutions: Substitution[],
    teamId: string,
    matchId: string,
  ): Event[] {
    return substitutions.map(substitution => {
      const playerIn = playersById[substitution.IdPlayerOn];
      const playerOff = playersById[substitution.IdPlayerOff];

      return {
        id: this.buildEventId({
          teamId,
          matchId,
          time: substitution.Minute,
          type: 'substitution',
        }),
        fifaId: substitution.IdEvent ?? null,
        typeOfEvent: 'substitution',
        player: playerIn.PlayerName[0].Description,
        time: substitution.Minute,
        teamId,
        matchId,
        extraInfo: {
          playerIn: playerIn.PlayerName[0].Description,
          playerOff: playerOff.PlayerName[0].Description,
        },
      } as any;
    });
  }

  buildEventId({ teamId, matchId, time, type }: any): string {
    return `${teamId}_${matchId}_${type}_at_${time}`;
  }

  getPlayersGroupedById(json: Match): Record<string, Player> {
    const players = json.HomeTeam.Players.concat(json.AwayTeam.Players);

    return players.reduce((accumulator, curr) => {
      accumulator[curr.IdPlayer] = curr;
      return accumulator;
    }, {} as any);
  }
}
