import Scrapper from '../scrapper';
import DefaultScrapper from '../scrappers/default-scrapper';
import FindAllMatchesUseCaseImpl, {
  FindAllMatchesUseCase,
} from '../usecases/matches/find-all-matches';
import UpdateMatchByJsonUseCaseImpl, {
  UpdateMatchByJsonUseCase,
} from '../usecases/matches/update-match-by-json';
import CronJob from './cron-job';

export default class UpdateAllMatchesJob extends CronJob {
  private scrapper: Scrapper;

  private updateMatchByJson: UpdateMatchByJsonUseCase;

  private findAllMatches: FindAllMatchesUseCase;

  constructor() {
    super();
    this.scrapper = new DefaultScrapper();
    this.updateMatchByJson = new UpdateMatchByJsonUseCaseImpl();
    this.findAllMatches = new FindAllMatchesUseCaseImpl();
  }

  schedule(): string {
    return '*/60 * * * *';
  }

  async execute(): Promise<void> {
    console.log(`[UpdateAllMatchesJob] finding all matches`);
    const matches = await this.findAllMatches.execute({});

    console.log(`[UpdateAllMatchesJob] matches found: ${matches.length}`);

    const promises = matches.map(async currentMatch => {
      console.log(
        `[UpdateAllMatchesJob] scrapping live match data with the following stageId: ${currentMatch.fifaStageId}, matchId: ${currentMatch.fifaId}`,
      );

      const updatedMatch = await this.scrapper.findLiveMatch(
        currentMatch.fifaStageId,
        currentMatch.fifaId,
      );

      if (!updatedMatch) {
        console.log(
          `[UpdateAllMatchesJob] match with fifaId ${currentMatch.fifaId} and stageId: ${currentMatch.fifaStageId} not found`,
        );
        return null;
      }

      return this.updateMatchByJson.execute({
        current: currentMatch as any,
        newMatch: updatedMatch,
      });
    });

    await Promise.all(promises);

    console.log(`[UpdateAllMatchesJob] Finishing job`);
  }
}
