/* eslint-disable no-param-reassign */
import Match from '@/application/models/fifa/match';
import UseCase from '@/application/usecase';
import prisma from '@/lib/prisma';
import { Match as PrismaMatch } from '@prisma/client';
import FindOrCreateMatchStatsUseCaseImpl, {
  FindOrCreateMatchStatsUseCase,
} from './find-or-create-match-stats';

export type UpdateMatchByJsonRequest = {
  newMatch: Match;
  current: PrismaMatch;
};

export type UpdateMatchByJson = UseCase<UpdateMatchByJsonRequest, PrismaMatch>;

type MatchUpdater = {
  supports(status: string): boolean;
  handle: (source: PrismaMatch, json: Match) => Promise<void>;
};

export default class UpdateMatchByJsonImpl implements UpdateMatchByJson {
  private PERIOD_TO_FINISH_MATCH = 10;

  private findOrCreateMatchStats: FindOrCreateMatchStatsUseCase;

  constructor() {
    this.findOrCreateMatchStats = new FindOrCreateMatchStatsUseCaseImpl();
  }

  private pipeline: MatchUpdater[] = [
    {
      supports: () => true,
      handle: this.writeGameStats,
    },
    {
      supports: status => this.isMatchInProgress(status),
      handle: this.writeTimeInfo,
    },
    {
      supports: status => this.isMatchInProgress(status),
      handle: this.writeScoreInfo,
    },
    {
      supports: () => true,
      handle: this.writeHomeStats,
    },
    {
      supports: () => true,
      handle: this.writeAwayStats,
    },
    {
      supports: status => this.isMatchInProgress(status),
      handle: this.writeEvents,
    },
  ];

  async execute({
    newMatch,
    current,
  }: UpdateMatchByJsonRequest): Promise<PrismaMatch> {
    const newMatchToUpdate: PrismaMatch = {
      ...current,
      updatedAt: new Date(),
    };

    const promises = this.pipeline
      .filter(updater => updater.supports(current.status))
      .map(updater => updater.handle(newMatchToUpdate, newMatch));

    await Promise.all(promises);

    return prisma.match.update({
      where: {
        id: newMatchToUpdate.id,
      },
      data: newMatchToUpdate,
    });
  }

  async writeScoreInfo(source: PrismaMatch, json: Match): Promise<void> {
    source.homeTeamScore = json.Home.Score;
    source.awayTeamScore = json.Away.Score;
    source.homeTeamPenalties = json.HomeTeamPenaltyScore;
    source.awayTeamPenalties = json.AwayTeamPenaltyScore;
  }

  async writeTimeInfo(source: PrismaMatch, json: Match): Promise<void> {
    source.time = json.MatchTime;
    source.firstHalfTime = json.FirstHalfTime;
    source.firstHalfExtraTime = json.FirstHalfExtraTime;
    source.secondHalfTime = json.SecondHalfTime;
    source.secondHalfExtraTime = json.SecondHalfExtraTime;
  }

  async writeHomeStats(source: PrismaMatch, json: Match): Promise<void> {
    const stats = await this.findOrCreateMatchStats.execute({
      teamId: source.homeTeamId!,
      matchId: source.id,
    });

    stats.startingPlayers = JSON.stringify(json.Home.Players);
    stats.substitutes = JSON.stringify(json.Home.Substitutions);
    stats.tactics = json.Home.Tactics;
  }

  async writeAwayStats(source: PrismaMatch, json: Match): Promise<void> {
    const stats = await this.findOrCreateMatchStats.execute({
      teamId: source.awayTeamId!,
      matchId: source.id,
    });

    stats.startingPlayers = JSON.stringify(json.Away.Players);
    stats.substitutes = JSON.stringify(json.Away.Substitutions);
    stats.tactics = json.Away.Tactics;
  }

  async writeEvents(source: PrismaMatch, json: Match): Promise<void> {
    // TODO: get events
  }

  async writeGameStats(source: PrismaMatch, json: Match): Promise<void> {
    source.status = this.getGameStatusByJson(source.status, json);
  }

  isMatchInProgress(status: string): boolean {
    return status === 'in_progress';
  }

  getGameStatusByJson(currentStatus: string, json: Match): string {
    if (currentStatus === 'scheduled' && parseInt(json.MatchTime, 10) > 0) {
      return 'in_progress';
    }

    if (
      currentStatus === 'in_progress' &&
      json.Period === this.PERIOD_TO_FINISH_MATCH
    ) {
      return 'completed';
    }

    return currentStatus;
  }
}
