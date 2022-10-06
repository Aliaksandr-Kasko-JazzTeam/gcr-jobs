import axios from "axios";
import {getAuthHeader} from "./util/auth";
import {wait} from "./util/time";

const scopes = [ 'https://www.googleapis.com/auth/cloud-platform' ];
const JOBS_API_HOST = "https://us-central1-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/";

async function getAxiosConfig(projectName, serviceAccount) {
  const headers = await getAuthHeader(projectName, serviceAccount, scopes);
  return {headers};
}

export class Jobs {
  
  constructor(projectName, serviceAccount) {
    this.projectName = projectName;
    this.serviceAccount = serviceAccount;
  }
  
  async isJobRunning(jobId) {
    const config = await getAxiosConfig(this.projectName, this.serviceAccount);
    config.params = {
      page_size: 1,
      labelSelector: `run.googleapis.com/job=${jobId}`
    };
    while (true) {
      try {
        const {data} = await axios.get(JOBS_API_HOST + this.projectName + '/executions', config);
        if (data.items?.length > 0) {
          const runningCount = data.items[0]?.status?.runningCount || 0;
          return runningCount > 0;
        } else return false;
      } catch (e) {
        await wait(10 * 1000);
      }
    }
  }
  
  async runJob(jobId) {
    try {
      const config = await getAxiosConfig(this.projectName, this.serviceAccount);
      const response = await axios.post(JOBS_API_HOST + this.projectName + '/jobs/' + jobId + ':run', {}, config);
      return true;
    } catch (e) {
      return false;
    }
  }
}
