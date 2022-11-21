import prisma from '@/lib/prisma';
import UseCase from '@/application/usecase';
import { atEndOfDay, atStartOfDay } from '@/lib/date';
import { Match } from '@prisma/client';

type FindTodayMatchesRequest = {
  date: Date;
};

export type FindTodayMatchesUseCase = UseCase<FindTodayMatchesRequest, Match[]>;

export default class FindTodayMatchesUseCaseImpl
  implements FindTodayMatchesUseCase
{
  async execute({ date = new Date() }): Promise<Match[]> {
    const [gte, lte] = [atStartOfDay(date), atEndOfDay(date)];

    return prisma.match.findMany({
      where: {
        date: {
          gte,
          lte,
        },
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
  }
}
