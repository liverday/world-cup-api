import Coach from './coach';
import Player from './player';

type Team = {
  IdTeam: string;
  Score: number;
  Side: string;
  IdCountry: string;
  TeamType: number;
  AgeType: number;
  Tactics: string;
  Coaches: Coach[];
  Players: Player[];
  Bookings: any[];
  Goals: any[];
  Substitutions: any[];
  FootballType: number;
  Gender: number;
};

export default Team;
