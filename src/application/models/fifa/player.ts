import Localized from './locale';

export default interface Player {
  IdPlayer: string;
  IdTeam: string;
  ShirtNumber: number;
  Status: number;
  SpecialStatus: number;
  Captain: boolean;
  PlayerName: Localized[];
  ShortName: Localized[];
  Position: number;
  PlayerPicture: string;
  FieldStatus: number;
  LineupX: any;
  LineupY: any;
}

export type PlayerResponse = {
  name: string;
  number: number;
  position: string | null;
};
