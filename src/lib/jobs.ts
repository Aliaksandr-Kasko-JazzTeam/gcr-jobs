import {Axios, AxiosRequestConfig} from "axios";
import {getAuthHeader} from "./util/auth";
import {CreateJobArgs, Job, JobExecutionHealth, ListExecutionsResponse, ListJobsResponse, Operation} from "./types";

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
  
  async createJob(createJobArgs: CreateJobArgs): Promise<Job> {
    const {
      jobName,
      image,
      command,
      args,
      env,
      timeoutSeconds,
      maxRetries,
      taskCount,
      cpu,
      memory
    } = createJobArgs;
    const config = await getAxiosConfig(this.projectName, this.serviceAccount);
    config.headers!["Content-Type"] = 'application/json';
    const body = {
      apiVersion: "run.googleapis.com/v1",
      kind: "Job",
      metadata: {
        name: jobName,
        namespace: this.serviceAccount.split('-')[0],
        generation: 2
      },
      spec: {
        template: {
          spec: {
            taskCount: taskCount || 1,
            template: {
              spec: {
                containers: [
                  {
                    image,
                    command,
                    args,
                    env,
                    resources: {
                      limits: {
                        cpu: cpu || "1000m",
                        memory: memory || "512Mi"
                      }
                    },
                    
                  }
                ],
                timeoutSeconds: (timeoutSeconds || 600).toString(),
                serviceAccountName: this.serviceAccount,
                maxRetries: maxRetries || 3
              }
            }
          }
        }
      }
    } as Job;
    const axios = new Axios({});
    const {data} = await axios.post(JOBS_API_HOST + this.projectName + '/jobs', JSON.stringify(body), config);
    const parsedData = JSON.parse(data);
    if (parsedData.error) throw Error(JSON.stringify(parsedData.error));
    return parsedData;
  }
  
  async isJobRunning(jobId: string): Promise<boolean> {
    const config = await getAxiosConfig(this.projectName, this.serviceAccount);
    config.params = {
      page_size: 1,
      labelSelector: `run.googleapis.com/job=${jobId}`
    };
    const axios = new Axios({});
    try {
      const response = await axios.get(
        JOBS_API_HOST + this.projectName + '/executions',
        config
      );
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
      const response = await axios.post(
        JOBS_API_HOST + this.projectName + '/jobs/' + jobId + ':run',
        "",
        config
      );
      return response.status == 200;
    } catch (e) {
      return false;
    }
  }
  
  async listJobs(): Promise<ListJobsResponse> {
    const config = await getAxiosConfig(this.projectName, this.serviceAccount);
    const axios = new Axios({});
    const {data} = await axios.get(JOBS_API_HOST + this.projectName + '/jobs', config);
    return JSON.parse(data);
  }
  
  async getJob(jobId: string): Promise<Job> {
    const config = await getAxiosConfig(this.projectName, this.serviceAccount);
    const axios = new Axios({});
    const {data} = await axios.get(JOBS_API_HOST + this.projectName + '/jobs/' + jobId, config);
    const parsedData = JSON.parse(data);
    if (parsedData.error) throw Error(JSON.stringify(parsedData.error));
    return parsedData;
  }
  
  async deleteJob(jobId: string): Promise<Operation> {
    const config = await getAxiosConfig(this.projectName, this.serviceAccount);
    const axios = new Axios({});
    const axiosResponse = await axios.delete(
      JOBS_API_HOST + this.projectName + '/jobs/' + jobId,
      config
    );
    const parsedData = JSON.parse(axiosResponse.data);
    if (parsedData.error) throw Error(JSON.stringify(parsedData.error));
    return parsedData;
  }
  
  async listExecutions(jobId: string): Promise<ListExecutionsResponse> {
    const config = await getAxiosConfig(this.projectName, this.serviceAccount);
    config.params = {
      labelSelector: `run.googleapis.com/job=${jobId}`
    };
    const axios = new Axios({});
    const {data} = await axios.get(JOBS_API_HOST + this.projectName + '/executions', config);
    return JSON.parse(data);
  }
  
  async getJobExecutionHealth(jobId: string, take: number): Promise<JobExecutionHealth> {
    if (take <= 0) throw new Error("take must be positive");
    const job = await this.getJob(jobId);
    const listExecutions = await this.listExecutions(jobId);
    
    const items = listExecutions.items || [];
    
    return {
      executionCount: job.status?.executionCount || 0,
      lastFailedCount: items?.slice(0, take)
        .filter(execution => (execution?.status?.failedCount || 0) > 0).length || 0,
      lastExecutionStatus: items[0]?.status?.conditions
        ?.find(condition => condition.type == "Completed")?.status || "Unknown",
      startTime: items[0]?.status?.startTime,
      completionTime: items[0]?.status?.completionTime
    }
  }
}
