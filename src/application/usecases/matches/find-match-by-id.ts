import prisma from '@/lib/prisma';
import UseCase from '@/application/usecase';
import { Match, MatchStats } from '@prisma/client';

type FindMatchByIdRequest = {
  matchId: string;
};

type MatchResponse = Match & {
  homeTeam: any;
  awayTeam: any;
};

export type FindMatchByIdUseCase = UseCase<
  FindMatchByIdRequest,
  MatchResponse | null
>;

export default class FindMatchByIdUseCaseImpl implements FindMatchByIdUseCase {
  async execute({
    matchId,
  }: FindMatchByIdRequest): Promise<MatchResponse | null> {
    return prisma.match.findUnique({
      where: {
        id: matchId,
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
