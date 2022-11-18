import Team from './team';

type Match = {
  IdMatch: string;
  IdCompetition: string;
  IdSeason: string;
  IdGroup: string;
  IdStage: string;
  StageName: [
    {
      Locale: string;
      Description: string;
    },
  ];
  Date: string;
  LocalDate: string;
  Home: Team;
  Away: Team;
  Winner: string | null;
  Attendance: string;
  MatchDay: number | null;
  Stadium: {
    CityName: [
      {
        Locale: string;
        Description: string;
      },
    ];
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
  BallPossession: {
    Intervals: any[];
    LastX: any[];
    OverallHome: number | null;
    OverallAway: null;
  };
  TerritorialPossesion: any;
  TerritorialThirdPossesion: any;
  Officials: any[];
  MatchStatus: number;
  OfficialityStatus: number;
  TimeDefined: boolean;
};

export default Match;
