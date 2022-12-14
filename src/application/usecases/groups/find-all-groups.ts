import prisma from '@/lib/prisma';
import UseCase from '@/application/usecase';
import { Group, Team } from '@prisma/client';

type FindAllGroupsRequest = Record<any, any>;

type GroupResponse = Group & {
  teams: Partial<
    Team & {
      group: Group;
    }
  >[];
};

export type FindAllGroupsUseCase = UseCase<
  FindAllGroupsRequest,
  GroupResponse[]
>;

export default class FindAllGroupsUseCaseImpl implements FindAllGroupsUseCase {
  async execute(_: FindAllGroupsRequest): Promise<GroupResponse[]> {
    const groups = await prisma.group.findMany({
      include: {
        teams: {
          select: {
            id: true,
            country: true,
            alternateName: true,
            points: true,
            draws: true,
            losses: true,
            goalsConceded: true,
            goalsScored: true,
            goalsDifference: true,
            wins: true,
            fifaCode: true,
            position: true,
            homeMatches: {
              where: {
                stageName: 'First stage',
              },
              select: {
                id: true,
                venue: true,
                location: true,
                status: true,
                stageName: true,
                createdAt: true,
                updatedAt: true,
                homeTeamScore: true,
                homeTeamPenalties: true,
                awayTeamPenalties: true,
                awayTeamScore: true,
                date: true,
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
            },
            awayMatches: {
              where: {
                stageName: 'First stage',
              },
              select: {
                id: true,
                venue: true,
                location: true,
                status: true,
                stageName: true,
                createdAt: true,
                updatedAt: true,
                date: true,
                homeTeamScore: true,
                homeTeamPenalties: true,
                awayTeamPenalties: true,
                awayTeamScore: true,
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
            },
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
      orderBy: {
        code: 'asc',
      },
    });

    return groups;
  }
}
