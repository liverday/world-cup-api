import prisma from '@/lib/prisma';
import UseCase from '@/application/usecase';
import { Match } from '@prisma/client';

type FindMatchesByCountryRequest = {
  country: string;
};

type MatchResponse = Match & {
  homeTeam: any;
  awayTeam: any;
};

export type FindMatchesByCountryUseCase = UseCase<
  FindMatchesByCountryRequest,
  MatchResponse[]
>;

export default class FindMatchesByContryUseCaseImpl
  implements FindMatchesByCountryUseCase
{
  async execute({
    country,
  }: FindMatchesByCountryRequest): Promise<MatchResponse[]> {
    return prisma.match.findMany({
      where: {
        OR: [
          {
            homeTeam: {
              country,
            },
          },
          {
            awayTeam: {
              country,
            },
          },
        ],
      },
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
