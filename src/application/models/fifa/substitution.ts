import Localized from './locale';
import { PlayerResponse } from './player';

export type SubstitutionResponse = {
  minute: string;
  playerIn: Omit<PlayerResponse, 'position'>;
  playerOut: Omit<PlayerResponse, 'position'>;
};

export type Substitution = {
  IdTeam: string;
  Minute: string;
  Period: number;
  Reason: number;
  IdEvent: string | null;
  IdPlayerOn: string;
  IdPlayerOff: string;
  PlayerOnName: Localized[];
  PlayerOffName: Localized[];
  SubstitutePosition: number;
};
