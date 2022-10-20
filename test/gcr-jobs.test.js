const mocha = require('mocha');
const chai = require('chai');

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
  
  it('expect job successful run', async () => {
    const runJob = await jobs.runJob(process.env.JOB_NAME);
    expect(runJob).to.equal(true);
  }).timeout(10000);
});
