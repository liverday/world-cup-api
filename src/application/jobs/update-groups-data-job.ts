import { Team } from '@prisma/client';
import GroupTeam from '../models/fifa/group-team';
import Scrapper from '../scrapper';
import DefaultScrapper from '../scrappers/default-scrapper';
import FindAllGroupsUseCaseImpl, {
  FindAllGroupsUseCase,
} from '../usecases/groups/find-all-groups';
import UpdateTeamByJsonUseCaseImpl, {
  UpdateTeamByJsonUseCase,
} from '../usecases/teams/update-team-by-json';
import CronJob from './cron-job';

export default class UpdateGroupsDataJob extends CronJob {
  private scrapper: Scrapper;

  private findAllGroups: FindAllGroupsUseCase;

  private updateTeamByJson: UpdateTeamByJsonUseCase;

  constructor() {
    super();
    this.scrapper = new DefaultScrapper();
    this.findAllGroups = new FindAllGroupsUseCaseImpl();
    this.updateTeamByJson = new UpdateTeamByJsonUseCaseImpl();
  }

  schedule(): string {
    return '*/30 * * * *';
  }

  async execute(): Promise<void> {
    console.log('[UpdateGroupsDataJob] updating group data');
    const teamGroupDataByFifaId = await this.scrapper
      .findGroupsData()
      .then(groups =>
        groups.reduce((accumulator, current) => {
          accumulator[current.IdTeam] = current;

          return accumulator;
        }, {} as any),
      );

    const persistedGroups = await this.findAllGroups.execute({});

    const promises = persistedGroups.map(async group => {
      const teamPromises = group.teams
        .filter(team => !!teamGroupDataByFifaId[team.fifaCode!])
        .map(async team => {
          const groupData = teamGroupDataByFifaId[team.fifaCode!];

          return this.updateTeamByJson.execute({
            currentTeam: team as Team,
            newTeam: groupData as GroupTeam,
          });
        });

      return Promise.all(teamPromises);
    });

    await Promise.all(promises);

    console.log('[UpdateGroupsDataJob] finishing update');
  }
}
