import CronJob from '@/application/jobs/cron-job';
import InProgressMatchJob from '@/application/jobs/in-process-match-job';
import ScheduledMatchesJob from '@/application/jobs/scheduled-matches-job';

const jobs: CronJob[] = [new InProgressMatchJob(), new ScheduledMatchesJob()];

async function main() {
  console.log(`[Scheduler] starting ${jobs.length} jobs`);
  jobs.forEach(job => job.initialize());
}

main();
