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
    });

    if (!currentMatch) {
      throw notFound('There is not match in progress right now');
    }

    return currentMatch;
  }
}
