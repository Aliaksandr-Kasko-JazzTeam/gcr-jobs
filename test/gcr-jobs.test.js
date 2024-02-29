const mocha = require('mocha');
const chai = require('chai');
chai.use(require('chai-as-promised'))

const {Jobs} = require('../dist');

const expect = chai.expect;

describe('gcr-jobs', () => {
  
  const jobs = new Jobs(process.env.PROJECT_NAME, process.env.SERVICE_ACCOUNT);
  const jobName = "test";
  const image = "us-docker.pkg.dev/cloudrun/container/job:latest";
  
  it('should create job', async () => {
    const createdJob = await jobs.createJob({
      jobName,
      image
    });
    expect(createdJob).to.not.null;
    expect(createdJob.metadata.name).to.equal(jobName);
    expect(createdJob.spec.template.spec.template.spec.containers[0].image).to.equal(image);
  }).timeout(20000);
  
  it('should run a job', async () => {
    const success = await jobs.runJob(jobName);
    expect(success).to.equal(true);
  }).timeout(10000);
  
  it('should receive jobs list', async () => {
    const listJobs = await jobs.listJobs();
    expect(listJobs).to.not.empty;
  }).timeout(10000);
  
  it('should receive a single job', async () => {
    const job = await jobs.getJob(jobName);
    expect(job).to.not.empty;
  }).timeout(10000);
  
  it('should check job is running', async () => {
    const isJobRunning = await jobs.isJobRunning(jobName);
    expect(isJobRunning).to.equal(false);
  }).timeout(10000);
  
  it('should receive executions list for a single job', async () => {
    const listExecutions = await jobs.listExecutions(jobName);
    expect(listExecutions).to.not.empty;
  }).timeout(20000);
  
  it('should receive job execution health', async () => {
    const jobExecutionHealth = await jobs.getJobExecutionHealth(jobName, 10);
    expect(jobExecutionHealth).to.not.empty;
  }).timeout(10000);
  
  it('should delete a job', async () => {
    const operation = await jobs.deleteJob(jobName);
    expect(operation).to.not.empty;
    expect(operation.error).to.equal(undefined);
  }).timeout(20000);
  
  it('should throw an error on not found job', async () => {
    expect(jobs.getJob("_")).to.be.rejectedWith(Error);
  }).timeout(10000);
  
  it('should throw an error on wrong take', async () => {
    expect(jobs.getJobExecutionHealth("", -1)).to.be.rejectedWith(Error);
  }).timeout(10000);
  
  // it('expect job successful run', async () => {
  //   const runJob = await jobs.runJob(process.env.JOB_NAME);
  //   expect(runJob).to.equal(true);
  // }).timeout(10000);
});
