import { CronJob as LibCronJob } from 'cron';

export default abstract class CronJob {
  abstract schedule(): string;

  abstract execute(): Promise<void>;

  initialize(): void {
    const cron = new LibCronJob(this.schedule(), async () => {
      try {
        await this.execute();
      } catch (err) {
        console.log(`[CronJob] unhandled exception`, err);
      }
    });

    cron.start();
  }
}
