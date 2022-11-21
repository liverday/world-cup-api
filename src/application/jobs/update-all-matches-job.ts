import MatchScrapper from '../match-scrapper';
import DefaultMatchScrapper from '../scrappers/default-match-scrapper';
import FindAllMatchesUseCaseImpl, {
  FindAllMatchesUseCase,
} from '../usecases/matches/find-all-matches';
import UpdateMatchByJsonImpl, {
  UpdateMatchByJson,
} from '../usecases/matches/update-match-by-json';
import CronJob from './cron-job';

export default class UpdateAllMatchesJob extends CronJob {
  private scrapper: MatchScrapper;

  private updateMatchByJson: UpdateMatchByJson;

  private findAllMatches: FindAllMatchesUseCase;

  constructor() {
    super();
    this.scrapper = new DefaultMatchScrapper();
    this.updateMatchByJson = new UpdateMatchByJsonImpl();
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
  }
}
