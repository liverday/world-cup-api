import cron from 'node-cron';

export default abstract class CronJob {
  abstract schedule(): string;

  abstract execute(): Promise<void>;

  initialize(): void {
    cron.schedule(this.schedule(), () => this.execute());
  }
}
