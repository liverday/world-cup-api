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
    currentTeam.wins = newTeam.Won;
    currentTeam.goalsConceded = newTeam.Against;
    currentTeam.goalsScored = newTeam.For;
    currentTeam.goalsDifference = newTeam.GoalsDiference;

    const {
      homeMatches: _,
      awayMatches: _2,
      wonMatches: _3,
      ...teamToUpdate
    } = { ...currentTeam } as any;

    return prisma.team.update({
      where: {
        id: teamToUpdate.id,
      },
      data: convertNullToUndefined(teamToUpdate),
    });
  }
}
