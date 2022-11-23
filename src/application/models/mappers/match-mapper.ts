import { Match, MatchStats, Team } from '@prisma/client';
import MatchResponse, {
  MatchStatsResponse,
  OfficialResponse,
} from '../responses/match-response';
import Mapper from './mapper';

type MatchInput = Match & {
  homeTeam: TeamAndStats;
  awayTeam: TeamAndStats;
  winner: Team | null;
};

type TeamAndStats = Team & {
  matchStats: MatchStats[];
};

export default class MatchMapper implements Mapper<MatchInput, MatchResponse> {
  mapToOutput(
    input: Match & {
      homeTeam: TeamAndStats;
      awayTeam: TeamAndStats;
      winner: Team | null;
    },
  ): MatchResponse {
    const homeStats = input.homeTeam.matchStats?.[0];
    const awayStats = input.awayTeam.matchStats?.[0];

    return {
      id: input.id,
      venue: input.venue,
      location: input.location,
      status: input.status,
      stageName: input.stageName,
      time: input.time,
      homeTeam: input.homeTeam && {
        country: input.homeTeam?.country,
        goals: input.homeTeamScore ?? 0,
        name: input.homeTeam?.alternateName,
        penalties: input.homeTeamPenalties ?? 0,
        statistics: homeStats && this.mapStats(homeStats),
      },
      awayTeam: input.awayTeam && {
        country: input.awayTeam.country,
        goals: input.awayTeamScore ?? 0,
        name: input.awayTeam.alternateName,
        penalties: input.awayTeamPenalties ?? 0,
        statistics: awayStats && this.mapStats(awayStats),
      },
      officials: this.mapOfficials(input.officials as any[]),
      createdAt: input.createdAt,
      date: input.date,
      updatedAt: input.updatedAt,
      winner: input.winner?.alternateName,
    };
  }

  mapStats(stats: MatchStats): MatchStatsResponse {
    return {
      attemptsOnGoal: stats.attemptsOnGoal,
      kicksOnTarget: stats.kicksOnTarget,
      kicksOffTarget: stats.kicksOffTarget,
      kicksBlocked: stats.kicksBlocked,
      kicksOnWoodwork: stats.kicksOnWoodwork,
      corners: stats.corners,
      offsides: stats.offsides,
      ballPossession: stats.ballPossession,
      passes: stats.passes,
      passesCompleted: stats.passesCompleted,
      distanceCovered: stats.distanceCovered,
      freeKicks: stats.freeKicks,
      crosses: stats.crosses,
      crossesCompleted: stats.crossesCompleted,
      assists: stats.assists,
      yellowCards: stats.yellowCards,
      redCards: stats.redCards,
      foulsCommited: stats.foulsCommited,
      foulsReceived: stats.foulsReceived,
      tactics: stats.tactics,
    };
  }

  mapOfficials(officials: any[]): OfficialResponse[] {
    return officials.map(official => ({
      name: official.Name[0].Description,
      role: official.TypeLocalized[0].Description,
      country: official.IdCountry,
    }));
  }
}
