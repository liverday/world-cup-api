import { Match, Team } from '@prisma/client';
import MatchResponse from '../responses/match-response';
import Mapper from './mapper';

type MatchInput = Match & {
  homeTeam: Team;
  awayTeam: Team;
  winner: Team | null;
};

export default class MatchMapper implements Mapper<MatchInput, MatchResponse> {
  mapToOutput(
    input: Match & { homeTeam: Team; awayTeam: Team; winner: Team | null },
  ): MatchResponse {
    return {
      id: input.id,
      location: input.location,
      status: input.status,
      stageName: input.stageName,
      homeTeam: input.homeTeam && {
        country: input.homeTeam?.country,
        goals: input.homeTeamScore ?? 0,
        name: input.homeTeam?.alternateName,
        penalties: input.homeTeamPenalties ?? 0,
      },
      awayTeam: input.awayTeam && {
        country: input.awayTeam.country,
        goals: input.awayTeamScore ?? 0,
        name: input.awayTeam.alternateName,
        penalties: input.awayTeamPenalties ?? 0,
      },
      createdAt: input.createdAt,
      date: input.date,
      updatedAt: input.updatedAt,
      winner: input.winner?.alternateName,
    };
  }
}
