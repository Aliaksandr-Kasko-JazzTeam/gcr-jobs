const mocha = require('mocha');
const chai = require('chai');
chai.use(require('chai-as-promised'))

const {Jobs} = require('../dist');

const expect = chai.expect;

describe('gcr-jobs', () => {
  
  const jobs = new Jobs(process.env.PROJECT_NAME, process.env.SERVICE_ACCOUNT);
  
  it('should receive jobs list', async () => {
    const listJobs = await jobs.listJobs();
    expect(listJobs).to.not.empty;
  }).timeout(10000);
  
  it('should receive a single job', async () => {
    const job = await jobs.getJob(process.env.JOB_NAME);
    expect(job).to.not.empty;
  }).timeout(10000);
  
  it('check job is running', async () => {
    const isJobRunning = await jobs.isJobRunning(process.env.JOB_NAME);
    expect(isJobRunning).to.equal(false);
  }).timeout(10000);
  
  it('should receive executions list for a single job', async () => {
    const listExecutions = await jobs.listExecutions(process.env.JOB_NAME);
    expect(listExecutions).to.not.empty;
  }).timeout(10000);
  
  it('should receive job execution health', async () => {
    const jobExecutionHealth = await jobs.getJobExecutionHealth(process.env.JOB_NAME, 10);
    expect(jobExecutionHealth).to.not.empty;
  }).timeout(10000);
  
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
