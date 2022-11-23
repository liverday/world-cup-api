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
  };
  awayTeam: {
    country: string;
    name: string;
    goals: number;
    penalties: number;
  };
  winner?: string;
  createdAt: Date;
  updatedAt: Date;
}
