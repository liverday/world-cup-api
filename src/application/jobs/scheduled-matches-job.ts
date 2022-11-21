import Scrapper from '../scrapper';
import DefaultScrapper from '../scrappers/default-scrapper';
import FindTodayMatchesUseCaseImpl, {
  FindTodayMatchesUseCase,
} from '../usecases/matches/find-today-matches';
import UpdateMatchByJsonUseCaseImpl, {
  UpdateMatchByJsonUseCase,
} from '../usecases/matches/update-match-by-json';
import CronJob from './cron-job';

export default class ScheduledMatchesJob extends CronJob {
  private scrapper: Scrapper;

  private updateMatchByJson: UpdateMatchByJsonUseCase;

  private findTodaysMatches: FindTodayMatchesUseCase;

  constructor() {
    super();
    this.scrapper = new DefaultScrapper();
    this.updateMatchByJson = new UpdateMatchByJsonUseCaseImpl();
    this.findTodaysMatches = new FindTodayMatchesUseCaseImpl();
  }

  schedule(): string {
    return '*/1 * * * *';
  }

  async execute(): Promise<void> {
    console.log(`[ScheduledMatchesJob] finding todays matches`);
    const matches = await this.findTodaysMatches.execute({
      date: new Date(),
    });

    console.log(`[ScheduledMatchesJob] matches found: ${matches.length}`);

    const promises = matches.map(async currentMatch => {
      console.log(
        `[ScheduledMatchesJob] scrapping live match data with the following stageId: ${currentMatch.fifaStageId}, matchId: ${currentMatch.fifaId}`,
      );

      const updatedMatch = await this.scrapper.findLiveMatch(
        currentMatch.fifaStageId,
        currentMatch.fifaId,
      );

      await this.updateMatchByJson.execute({
        current: currentMatch as any,
        newMatch: updatedMatch,
      });
    });

    await Promise.all(promises);

    console.log(`[ScheduledMatchesJob] job finished`);
  }
}
