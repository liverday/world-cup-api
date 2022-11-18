import prisma from '@/lib/prisma';
import MatchScrapper from '../match-scrapper';
import DefaultMatchScrapper from '../scrappers/default-match-scrapper';
import UpdateMatchByJsonImpl, {
  UpdateMatchByJson,
} from '../usecases/matches/update-match-by-json';
import CronJob from './cron-job';

export default class InProgressMatchJob extends CronJob {
  private scrapper: MatchScrapper;

  private updateMatchByJson: UpdateMatchByJson;

  constructor() {
    super();
    this.scrapper = new DefaultMatchScrapper();
    this.updateMatchByJson = new UpdateMatchByJsonImpl();
  }

  schedule(): string {
    return '*/1 * * * *';
  }

  async execute(): Promise<void> {
    const [currentMatch] = await prisma.match.findMany({
      where: {
        status: 'in_progress',
      },
      orderBy: {
        date: 'asc',
      },
    });

    if (!currentMatch) {
      return;
    }

    const updatedMatch = await this.scrapper.findLiveMatch(
      currentMatch.fifaStageId,
      currentMatch.fifaId,
    );

    await this.updateMatchByJson.execute({
      current: currentMatch,
      newMatch: updatedMatch,
    });
  }
}
