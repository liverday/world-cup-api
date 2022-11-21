/* eslint-disable no-param-reassign */
import GroupTeam from '@/application/models/fifa/group-team';
import UseCase from '@/application/usecase';
import { convertNullToUndefined } from '@/application/util/objects';
import prisma from '@/lib/prisma';
import { Team as PrismaTeam } from '@prisma/client';

type UpdateTeamByJsonRequest = {
  currentTeam: PrismaTeam;
  newTeam: GroupTeam;
};

export type UpdateTeamByJsonUseCase = UseCase<
  UpdateTeamByJsonRequest,
  PrismaTeam
>;

export default class UpdateTeamByJsonUseCaseImpl
  implements UpdateTeamByJsonUseCase
{
  async execute({
    currentTeam,
    newTeam,
  }: UpdateTeamByJsonRequest): Promise<PrismaTeam> {
    currentTeam.position = newTeam.Position;
    currentTeam.points = newTeam.Points;
    currentTeam.draws = newTeam.Drawn;
    currentTeam.losses = newTeam.Lost;
    currentTeam.played = newTeam.Played;
    currentTeam.goalsConceded = newTeam.Against;
    currentTeam.goalsScored = newTeam.For;
    currentTeam.goalsDifference = newTeam.GoalsDiference;

    return prisma.team.update({
      where: {
        id: currentTeam.id,
      },
      data: convertNullToUndefined(currentTeam),
    });
  }
}
