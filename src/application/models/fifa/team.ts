import Booking from './booking';
import Coach from './coach';
import Goal from './goal';
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
  Bookings: Booking[];
  Goals: Goal[];
  Substitutions: any[];
  FootballType: number;
  Gender: number;
};

export default Team;
