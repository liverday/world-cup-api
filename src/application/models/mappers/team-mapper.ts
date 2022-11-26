import { Group, Match, Team } from '@prisma/client';
import MatchResponse from '../responses/match-response';
import TeamResponse from '../responses/team-response';
import Mapper from './mapper';

type PrismaTeamDelegate = Team & {
  group: Group;
  homeMatches: Match[];
  awayMatches: Match[];
};

export default class TeamMapper
  implements Mapper<PrismaTeamDelegate, TeamResponse>
{
  constructor(private matchMapper: Mapper<any, MatchResponse>) {
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
      matches: input.homeMatches
        ?.concat(input.awayMatches ?? [])
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map(this.matchMapper.mapToOutput),
    };
  }
}
