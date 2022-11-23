import Booking from './booking';
import Goal from './goal';
import Localized from './locale';
import Official from './official';
import Player from './player';
import Team from './team';

type Match = {
  IdMatch: string;
  IdCompetition: string;
  IdSeason: string;
  IdGroup: string;
  IdStage: string;
  StageName: Localized[];
  Date: string;
  LocalDate: string;
  HomeTeam: Team;
  AwayTeam: Team;
  Winner: string | null;
  Attendance: string;
  MatchDay: number | null;
  Stadium: {
    Name: Localized[];
    CityName: Localized[];
  };
  ResultType: number;
  HomeTeamPenaltyScore: number;
  AwayTeamPenaltyScore: number;
  AggregateHomeTeamScore: number | null;
  AggregateAwayTeamScore: number | null;
  MatchTime: string;
  SecondHalfTime: string;
  FirstHalfTime: string;
  FirstHalfExtraTime: string;
  SecondHalfExtraTime: string;
  Period: number;
  BallPossession: {
    Intervals: any[];
    LastX: any[];
    OverallHome: number | null;
    OverallAway: null;
  };
  TerritorialPossesion: any;
  TerritorialThirdPossesion: any;
  Officials: Official[];
  MatchStatus: number;
  OfficialityStatus: number;
  TimeDefined: boolean;
  Bookings: Booking[];
  Goals: Goal[];
};

export default Match;
