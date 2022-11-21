import cron from 'node-cron';

export default abstract class CronJob {
  abstract schedule(): string;

  abstract execute(): Promise<void>;

  initialize(): void {
    const task = cron.schedule(this.schedule(), async () => this.execute());
    task.start();
  }
}
