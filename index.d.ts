export class Jobs {
  constructor(
    projectName: string,
    serviceAccount: string
  );
  
  isJobRunning(jobId: string): Promise<boolean>;
  runJob(jobId: string): Promise<boolean>;
}
