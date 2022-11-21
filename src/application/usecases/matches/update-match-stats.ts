import UseCase from '@/application/usecase';
import { convertNullToUndefined } from '@/application/util/objects';
import prisma from '@/lib/prisma';
import { MatchStats } from '@prisma/client';

export type UpdateMatchStatsUseCase = UseCase<MatchStats, void>;

export default class UpdateMatchStatsUseCaseImpl
  implements UpdateMatchStatsUseCase
{
  async execute({ teamId, matchId, ...data }: MatchStats): Promise<void> {
    await prisma.matchStats.update({
      where: {
        teamId_matchId: {
          teamId,
          matchId,
        },
      },
      data: convertNullToUndefined(data),
    });
  }
}
