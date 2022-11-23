import UpdateAllMatchesJob from '@/application/jobs/update-all-matches-job';

async function main() {
  const job = new UpdateAllMatchesJob();
  await job.execute();
}

main();
