import prisma from '@/lib/prisma';
import UseCase from '@/application/usecase';
import { notFound } from '@/application/error/app-error';
import { Match } from '@prisma/client';

export type FindCurrentMatchUseCase = UseCase<any, Match | Match[]>;

export default class FindCurrentMatchUseCaseImpl
  implements FindCurrentMatchUseCase
{
  async execute(_: any): Promise<Match | Match[]> {
    const currentMatches = await prisma.match.findMany({
      where: {
        status: 'in_progress',
      },
    });

    const currentMatchesIds = currentMatches.map(match => match.id);

    if (currentMatches.length === 0) {
      throw notFound('There is not match in progress right now');
    }

    const foundMatches = await prisma.match.findMany({
      where: {
        id: {
          in: currentMatchesIds,
        },
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
                matchId: {
                  in: currentMatchesIds,
                },
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
              where: {
                matchId: {
                  in: currentMatchesIds,
                },
              },
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
      orderBy: {
        date: 'asc',
      },
    });

    if (foundMatches.length === 1) {
      return foundMatches[0];
    }

    return foundMatches;
  }
}
