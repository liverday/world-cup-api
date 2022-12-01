import ClearCacheJob from '@/application/jobs/clear-cache-job';
import CronJob from '@/application/jobs/cron-job';
import InProgressMatchJob from '@/application/jobs/in-progress-match-job';
import ScheduledMatchesJob from '@/application/jobs/scheduled-matches-job';
import UpdateAllMatchesJob from '@/application/jobs/update-all-matches-job';
import UpdateGroupsDataJob from '@/application/jobs/update-groups-data-job';

const jobs: CronJob[] = [
  new InProgressMatchJob(),
  new ScheduledMatchesJob(),
  new UpdateGroupsDataJob(),
  new ClearCacheJob(),
  new UpdateAllMatchesJob(),
];

async function main() {
  console.log(`[Scheduler] starting ${jobs.length} jobs`);
  jobs.forEach(job => job.initialize());
}

main();
