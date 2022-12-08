import GroupTeam from './models/fifa/group-team';
import Match from './models/fifa/match';
import SeasonInfo from './models/fifa/season-info';

export default interface Scrapper {
  findAllMatches(): Promise<Match[]>;
  findLiveMatch(
    fifaStageId: string,
    fifaMatchId: string,
  ): Promise<Match | null>;
  findGroupsData(): Promise<GroupTeam[]>;
  findSeasonInfo(): Promise<SeasonInfo>;
}
