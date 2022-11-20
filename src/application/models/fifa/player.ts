import Localized from './locale';

export default interface Player {
  IdPlayer: string;
  IdTeam: string;
  ShirtNumber: string;
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
