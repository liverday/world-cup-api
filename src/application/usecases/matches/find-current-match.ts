import prisma from '@/lib/prisma';
import UseCase from '@/application/usecase';
import { notFound } from '@/application/error/app-error';
import { Match } from '@prisma/client';

export type FindCurrentMatchUseCase = UseCase<any, Match>;

export default class FindCurrentMatchUseCaseImpl
  implements FindCurrentMatchUseCase
{
  async execute(_: any): Promise<Match> {
    const [currentMatch] = await prisma.match.findMany({
      where: {
        status: 'in_progress',
      },
    });

    if (!currentMatch) {
      throw notFound('There is not match in progress right now');
    }

    return prisma.match.findUnique({
      where: {
        id: currentMatch.id,
      },
      include: {
        homeTeam: {
          select: {
            id: true,
            country: true,
            alternateName: true,
            fifaCode: true,
            matchStats: {
              where: {
                matchId: currentMatch.id,
              },
            },
          },
        },
        awayTeam: {
          select: {
            id: true,
            country: true,
            alternateName: true,
            fifaCode: true,
            matchStats: {
              take: 1,
            },
          },
        },
        winner: {
          select: {
            id: true,
            country: true,
            alternateName: true,
            fifaCode: true,
          },
        },
      },
    }) as Promise<Match>;
  }
}
