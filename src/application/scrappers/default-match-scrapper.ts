import api from '@/lib/api';
import MatchScrapper from '../match-scrapper';
import Match from '../models/fifa/match';

export default class DefaultMatchScrapper implements MatchScrapper {
  private ALL_MATCHES_PATH =
    '/calendar/matches?from=2022-11-19T00%3A00%3A00Z&to=2022-12-31T23%3A59%3A59Z&language=en&count=500&idCompetition=17';

  private SINGLE_MATCH_PATH = (stageId: string, matchId: string) =>
    `/live/football/17/255711/${stageId}/${matchId}`;

  async findAllMatches(): Promise<Match[]> {
    const { data } = await api.get<Match[]>(this.ALL_MATCHES_PATH);
    return data;
  }

  async findLiveMatch(
    fifaStageId: string,
    fifaMatchId: string,
  ): Promise<Match> {
    const path = this.SINGLE_MATCH_PATH(fifaStageId, fifaMatchId);
    const { data } = await api.get<Match>(path);
    return data;
  }
}
