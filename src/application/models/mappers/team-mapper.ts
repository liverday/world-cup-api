import { Group, Team } from '@prisma/client';
import { TeamResponse } from '../responses/team-response';
import Mapper from './mapper';

type PrismaTeamDelegate = Team & {
  group: Group;
};

export default class TeamMapper
  implements Mapper<PrismaTeamDelegate, TeamResponse>
{
  constructor() {
    this.mapToOutput = this.mapToOutput.bind(this);
  }

  mapToOutput(input: PrismaTeamDelegate): TeamResponse {
    return {
      id: input.id,
      country: input.country,
      alternateName: input.alternateName,
      position: input.position,
      wins: input.wins,
      points: input.points,
      draws: input.draws,
      losses: input.losses,
      played: input.played,
      goalsScored: input.goalsScored,
      goalsConceded: input.goalsConceded,
      goalsDifference: input.goalsDifference,
      group: input.group?.code,
    };
  }
}
