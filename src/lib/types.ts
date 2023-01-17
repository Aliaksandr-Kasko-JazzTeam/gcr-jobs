export type ListJobsResponse = {
  items: Job[];
  apiVersion: string;
  kind: string;
  metadata: ListMeta;
  unreachable: string[];
}

export type Job = {
  apiVersion?: string;
  kind?: string;
  metadata?: ObjectMeta;
  spec?: JobSpec;
  status?: JobStatus;
}

export type ObjectMeta = {
  name: string;
  namespace?: string;
  selfLink?: string;
  uid?: string;
  resourceVersion?: string;
  generation?: number;
  creationTimestamp?: string;
  labels?: object;
  annotations?: object;
  deletionTimestamp?: string;
  
}

export type JobSpec = {
  template?: ExecutionTemplateSpec;
}

export type ExecutionTemplateSpec = {
  metadata?: ObjectMeta;
  spec: ExecutionSpec;
}

export type ExecutionSpec = {
  parallelism?: number;
  taskCount?: number;
  template?: TaskTemplateSpec;
}

export type TaskTemplateSpec = {
  spec?: TaskSpec;
}

export type TaskSpec = {
  volumes?: Volume[];
  containers?: Container[];
  timeoutSeconds?: string;
  serviceAccountName?: string;
  maxRetries?: number;
}

export type Volume = {
  name: string;
  secret: SecretVolumeSource;
}

export type SecretVolumeSource = {
  secretName: string;
  items: KeyToPath[];
  defaultMode: number;
}

export type KeyToPath = {
  key: string;
  path: string;
  mode?: number;
}

export type Container = {
  name: string;
  image: string;
  command?: string[];
  args?: string[];
  env?: EnvVar[];
  resources?: ResourceRequirements;
  workingDir?: string;
  ports?: ContainerPort[];
  volumeMounts?: VolumeMount[];
  livenessProbe?: Probe;
  startupProbe?: Probe;
  terminationMessagePath?: string;
  terminationMessagePolicy?: string;
  imagePullPolicy?: string;
}

export type EnvVar = {
  name: string;
  value?: string;
  valueFrom?: EnvVarSource;
}

export type EnvVarSource = {
  secretKeyRef: SecretKeySelector;
}

export type SecretKeySelector = {
  key: string;
  optional?: boolean;
  name?: string;
  
}

export type ResourceRequirements = {
  limits?: object;
  requests?: object;
}

export type ContainerPort = {
  name?: string;
  containerPort?: number;
  protocol?: string;
}

export type VolumeMount = {
  name: string;
  readOnly?: boolean;
  mountPath: string;
  subPath?: string;
}

export type Probe = {
  initialDelaySeconds?: number;
  timeoutSeconds?: number;
  periodSeconds?: number;
  successThreshold?: number;
  failureThreshold?: number;
  httpGet?: HTTPGetAction;
  tcpSocket?: TCPSocketAction;
  grpc?: GRPCAction;
}

export type HTTPGetAction = {
  path?: string;
  httpHeaders?: HTTPHeader[];
}

export type HTTPHeader = {
  name: string;
  value?: string;
}

export type TCPSocketAction = {
  port?: number;
}

export type GRPCAction = {
  port?: number;
  service?: string;
}

export type ListMeta = {
  selfLink: string;
  resourceVersion: string;
  continue?: string;
}

export type JobStatus = {
  observedGeneration?: number;
  conditions?: Condition[];
  executionCount?: number;
  latestCreatedExecution?: ExecutionReference;
}

export type Condition = {
  type: string;
  status: "True" | "False" | "Unknown";
  reason?: string;
  message?: string;
  lastTransitionTime?: string;
  severity?: string;
}

export type ExecutionReference = {
  name?: string;
  creationTimestamp?: string;
  completionTimestamp?: string;
  
}

export type ListExecutionsResponse = {
  items: Execution[];
  apiVersion: string;
  kind: string;
  metadata: ListMeta;
  unreachable: string[];
}

export type Execution = {
  apiVersion?: string;
  kind?: string;
  metadata?: ObjectMeta;
  spec?: ExecutionSpec;
  status?: ExecutionStatus;
}

export type ExecutionStatus = {
  observedGeneration?: number;
  conditions?: Condition[];
  startTime?: string;
  completionTime?: string;
  runningCount?: number;
  succeededCount?: number;
  failedCount?: number;
  cancelledCount?: number;
  retriedCount?: number;
  logUri?: string;
}

export type JobExecutionHealth = {
  executionCount: number;
  lastFailedCount: number;
  lastExecutionStatus: "True" | "False" | "Unknown"
}
