import Localized from './locale';
import Match from './match';

type Stage = {
  IdStage: string;
  Matches: Match[];
  Name: Localized[];
  SequenceOrder: number;
};

export default Stage;
