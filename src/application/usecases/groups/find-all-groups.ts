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
    return prisma.group.findMany({
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
  }
}
