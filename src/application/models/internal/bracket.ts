import { Match } from '@prisma/client';

type Bracket = {
  name: string;
  matches: Match[];
};

export default Bracket;
