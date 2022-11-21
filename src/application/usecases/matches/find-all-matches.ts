import prisma from '@/lib/prisma';
import UseCase from '@/application/usecase';
import { Match } from '@prisma/client';

type FindAllMatchesRequest = Record<any, any>;

export type FindAllMatchesUseCase = UseCase<FindAllMatchesRequest, Match[]>;

export default class FindAllMatchesUseCaseImpl
  implements FindAllMatchesUseCase
{
  async execute(_: FindAllMatchesRequest): Promise<Match[]> {
    return prisma.match.findMany({
      include: {
        homeTeam: {
          select: {
            id: true,
            country: true,
            alternateName: true,
            fifaCode: true,
          },
        },
        awayTeam: {
          select: {
            id: true,
            country: true,
            alternateName: true,
            fifaCode: true,
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
  }
}
