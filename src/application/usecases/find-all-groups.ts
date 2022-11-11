import prisma from '@/lib/prisma';
import UseCase from '@/application/usecase';
import { Group } from '@prisma/client';

type FindAllGroupsRequest = Record<any, any>;

export type FindAllGroupsUseCase = UseCase<FindAllGroupsRequest, Group[]>;

export default class FindAllGroupsUseCaseImpl implements FindAllGroupsUseCase {
  async execute(_: FindAllGroupsRequest): Promise<Group[]> {
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
            wins: true,
          },
        },
      },
    });
  }
}
