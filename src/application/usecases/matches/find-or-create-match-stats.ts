import UseCase from '@/application/usecase';
import prisma from '@/lib/prisma';
import { MatchStats } from '@prisma/client';

type FindOrCreateMatchStatsRequest = {
  teamId: string;
  matchId: string;
};

export type FindOrCreateMatchStatsUseCase = UseCase<
  FindOrCreateMatchStatsRequest,
  MatchStats
>;

export default class FindOrCreateMatchStatsUseCaseImpl
  implements FindOrCreateMatchStatsUseCase
{
  async execute({
    teamId,
    matchId,
  }: FindOrCreateMatchStatsRequest): Promise<MatchStats> {
    const currentMatchStats = await prisma.matchStats.findUnique({
      where: {
        teamId_matchId: {
          teamId,
          matchId,
        },
      },
    });

    if (!currentMatchStats) {
      return prisma.matchStats.create({
        data: {
          teamId,
          matchId,
        },
      });
    }

    return currentMatchStats;
  }
}
