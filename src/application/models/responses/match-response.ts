export type OfficialResponse = {
  name: string;
  country: string;
  role: string;
};

export type MatchStatsResponse = {
  attemptsOnGoal: number | null;
  kicksOnTarget: number | null;
  kicksOffTarget: number | null;
  kicksBlocked: number | null;
  kicksOnWoodwork: number | null;
  corners: number | null;
  offsides: number | null;
  ballPossession: number | null;
  passes: number | null;
  passesCompleted: number | null;
  distanceCovered: number | null;
  freeKicks: number | null;
  crosses: number | null;
  crossesCompleted: number | null;
  assists: number | null;
  yellowCards: number | null;
  redCards: number | null;
  foulsCommited: number | null;
  foulsReceived: number | null;
  officials?: string;
  startingPlayers?: string;
  coaches?: string;
  substitutes?: string;
  tactics: string | null;
};

export default interface MatchResponse {
  id: string;
  location: string;
  status: string;
  stageName: string;
  date: Date;
  time: string | null;
  venue: string | null;
  homeTeam: {
    country: string;
    name: string;
    goals: number;
    penalties: number;
    statistics?: MatchStatsResponse;
  };
  awayTeam: {
    country: string;
    name: string;
    goals: number;
    penalties: number;
    statistics?: MatchStatsResponse;
  };
  officials: OfficialResponse[];
  winner?: string;
  createdAt: Date;
  updatedAt: Date;
}
