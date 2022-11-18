import Match from './models/fifa/match';

export default interface MatchScrapper {
  findAllMatches(): Promise<Match[]>;
  findLiveMatch(fifaStageId: string, fifaMatchId: string): Promise<Match>;
}
