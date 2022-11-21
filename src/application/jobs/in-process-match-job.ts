import prisma from '@/lib/prisma';
import Scrapper from '../scrapper';
import DefaultScrapper from '../scrappers/default-scrapper';
import UpdateMatchByJsonUseCaseImpl, {
  UpdateMatchByJsonUseCase,
} from '../usecases/matches/update-match-by-json';
import CronJob from './cron-job';

export default class InProgressMatchJob extends CronJob {
  private scrapper: Scrapper;

  private updateMatchByJson: UpdateMatchByJsonUseCase;

  constructor() {
    super();
    this.scrapper = new DefaultScrapper();
    this.updateMatchByJson = new UpdateMatchByJsonUseCaseImpl();
  }

  schedule(): string {
    return '*/1 * * * *';
  }

  async execute(): Promise<void> {
    console.log('[InProgressMatchJob] fetching in progress match data');
    const matches = await prisma.match.findMany({
      where: {
        status: 'in_progress',
      },
      orderBy: {
        date: 'asc',
      },
    });

    if (matches.length === 0) {
      console.log(
        '[InProgressMatchJob] no match found with "in_progress" status',
      );
      return;
    }

    const promises = matches.map(async currentMatch => {
      console.log('[InProgressMatchJob] match found', currentMatch);
      console.log(
        `[InProgressMatchJob] scrapping live match data with the following stageId: ${currentMatch.fifaStageId}, matchId: ${currentMatch.fifaId}`,
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

    console.log(`[InProgressMatchJob] job finished`);
  }
}
