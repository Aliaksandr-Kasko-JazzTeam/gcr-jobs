import {Axios, AxiosRequestConfig} from "axios";
import {getAuthHeader} from "./util/auth";
import {Job, ListJobsResponse} from "./types";

const scopes = [ 'https://www.googleapis.com/auth/cloud-platform' ];
const JOBS_API_HOST = "https://us-central1-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/";

async function getAxiosConfig(projectName: string, serviceAccount: string): Promise<AxiosRequestConfig> {
  const headers = await getAuthHeader(projectName, serviceAccount, scopes);
  return {headers};
}

export class Jobs {
  private readonly projectName: string;
  private readonly serviceAccount: string;
  
  constructor(projectName: string, serviceAccount: string) {
    this.projectName = projectName;
    this.serviceAccount = serviceAccount;
  }
  
  async isJobRunning(jobId: string): Promise<boolean> {
    const config = await getAxiosConfig(this.projectName, this.serviceAccount);
    config.params = {
      page_size: 1,
      labelSelector: `run.googleapis.com/job=${jobId}`
    };
    const axios = new Axios({});
    try {
      const response = await axios.get(JOBS_API_HOST + this.projectName + '/executions', config);
      const data = JSON.parse(response.data);
      if (data.items?.length > 0) {
        const runningCount = data.items[0]?.status?.runningCount || 0;
        return runningCount > 0;
      } else return false;
    } catch (e: any) {
      throw Error(e.message);
    }
  }

  async runJob(jobId: string): Promise<boolean> {
    try {
      const config = await getAxiosConfig(this.projectName, this.serviceAccount);
      const axios = new Axios({});
      const response = await axios.post(JOBS_API_HOST + this.projectName + '/jobs/' + jobId + ':run', "", config);
      return response.status == 200;
    } catch (e) {
      return false;
    }
  }
  
  async listJobs(): Promise<ListJobsResponse> {
    const config = await getAxiosConfig(this.projectName, this.serviceAccount);
    const axios = new Axios({});
    const {data} = await axios.get<ListJobsResponse>(JOBS_API_HOST + this.projectName + '/jobs', config);
    return data;
  }
  
  async getJob(jobId: string): Promise<Job> {
    const config = await getAxiosConfig(this.projectName, this.serviceAccount);
    const axios = new Axios({});
    const {data} = await axios.get<Job>(JOBS_API_HOST + this.projectName + '/jobs/' + jobId, config);
    return data;
  }
}
