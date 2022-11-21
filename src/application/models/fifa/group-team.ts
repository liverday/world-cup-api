type GroupTeam = {
  MatchDay: string;
  IdCompetition: string;
  IdSeason: string;
  IdStage: string;
  IdTeam: string;
  Date: string;
  Won: number;
  Lost: number;
  Drawn: number;
  Played: number;
  HomeWon: number;
  HomeLost: number;
  HomeDrawn: number;
  HomePlayed: number;
  AwayWon: number;
  AwayLost: number;
  AwayDrawn: number;
  AwayPlayed: number;
  Against: number;
  For: number;
  HomeAgainst: number;
  HomeFor: number;
  AwayAgainst: number;
  AwayFor: number;
  Position: number;
  HomePosition: number;
  AwayPosition: number;
  Points: number;
  HomePoints: number;
  AwayPoints: number;
  PreviousPosition: string | null;
  GoalsDiference: number;
  Team: {
    IdTeam: string;
  };
};

export default GroupTeam;
