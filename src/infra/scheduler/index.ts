import CronJob from '@/application/jobs/cron-job';
import InProgressMatchJob from '@/application/jobs/in-process-match-job';
import ScheduledMatchesJob from '@/application/jobs/scheduled-matches-job';
import UpdateGroupsDataJob from '@/application/jobs/update-groups-data-job';

const jobs: CronJob[] = [
  new InProgressMatchJob(),
  new ScheduledMatchesJob(),
  new UpdateGroupsDataJob(),
];

async function main() {
  console.log(`[Scheduler] starting ${jobs.length} jobs`);
}

main();
