import MatchResponse from './match-response';

type TeamResponse = {
  id: string;
  country: string;
  alternateName: string;
  position: number;
  wins: number;
  points: number;
  draws: number;
  losses: number;
  played: number;
  goalsScored: number;
  goalsConceded: number;
  goalsDifference: number;
  group: string;
  matches: MatchResponse[];
};

export default TeamResponse;
