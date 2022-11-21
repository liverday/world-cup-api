import UseCase from '@/application/usecase';
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
      data: this.convertNullToUndefined(data),
    });
  }

  convertNullToUndefined(payload: any): any {
    return Object.entries(payload).reduce((accumulator, [key, value]) => {
      accumulator[key] = value ?? undefined;

      return accumulator;
    }, {} as any);
  }
}
