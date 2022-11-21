import GroupTeam from './models/fifa/group-team';
import Match from './models/fifa/match';

export default interface Scrapper {
  findAllMatches(): Promise<Match[]>;
  findLiveMatch(fifaStageId: string, fifaMatchId: string): Promise<Match>;
  findGroupsData(): Promise<GroupTeam[]>;
}
