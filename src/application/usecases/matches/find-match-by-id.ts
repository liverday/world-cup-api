import prisma from '@/lib/prisma';
import UseCase from '@/application/usecase';
import { Match, MatchStats, Team } from '@prisma/client';

type FindMatchByIdRequest = {
  matchId: string;
};

type MatchResponse = Match & {
  homeTeam: Team | null;
  awayTeam: Team | null;
  matchStats: MatchStats[];
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
        homeTeam: true,
        awayTeam: true,
        matchStats: true,
      },
    });
  }
}
