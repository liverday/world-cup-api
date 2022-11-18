/* eslint-disable no-param-reassign */
import Match from '@/application/models/fifa/match';
import UseCase from '@/application/usecase';
import prisma from '@/lib/prisma';
import { Match as PrismaMatch } from '@prisma/client';

export type UpdateMatchByJsonRequest = {
  newMatch: Match;
  current: PrismaMatch;
};

export type UpdateMatchByJson = UseCase<UpdateMatchByJsonRequest, PrismaMatch>;

type MatchUpdater = {
  supports(status: string): boolean;
  handle: (source: PrismaMatch, json: Match) => void;
};

export default class UpdateMatchByJsonImpl implements UpdateMatchByJson {
  private pipeline: MatchUpdater[] = [
    {
      supports: () => true,
      handle: this.writeGameStats,
    },
    {
      supports: status => this.isGameInProgress(status),
      handle: this.writeTimeInfo,
    },
    {
      supports: status => this.isGameInProgress(status),
      handle: this.writeScoreInfo,
    },
    {
      supports: status => this.isGameInProgress(status),
      handle: this.writeHomeStats,
    },
    {
      supports: status => this.isGameInProgress(status),
      handle: this.writeAwayStats,
    },
    {
      supports: status => this.isGameInProgress(status),
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

    this.pipeline
      .filter(updater => updater.supports(current.status))
      .forEach(updater => updater.handle(newMatchToUpdate, newMatch));

    return prisma.match.update({
      where: {
        id: newMatchToUpdate.id,
      },
      data: newMatchToUpdate,
    });
  }

  writeScoreInfo(source: PrismaMatch, json: Match): void {
    source.homeTeamScore = json.Home.Score;
    source.awayTeamScore = json.Away.Score;
    source.homeTeamPenalties = json.HomeTeamPenaltyScore;
    source.awayTeamPenalties = json.AwayTeamPenaltyScore;
  }

  writeTimeInfo(source: PrismaMatch, json: Match): void {
    source.time = json.MatchTime;
    source.firstHalfTime = json.FirstHalfTime;
    source.firstHalfExtraTime = json.FirstHalfExtraTime;
    source.secondHalfTime = json.SecondHalfTime;
    source.secondHalfExtraTime = json.SecondHalfExtraTime;
  }

  writeHomeStats(source: PrismaMatch, json: Match): void {
    // TODO: get home stats
  }

  writeAwayStats(source: PrismaMatch, json: Match): void {
    // TODO: get away stats
  }

  writeEvents(source: PrismaMatch, json: Match): void {
    // TODO: get events
  }

  writeGameStats(source: PrismaMatch, json: Match): void {
    // TODO: start match
  }

  isGameInProgress(status: string): boolean {
    return status === 'in_progress';
  }
}
