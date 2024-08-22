# gcr-jobs

## This project is no longer maintained
Please use [@google-cloud/run](https://npmjs.com/package/@google-cloud/run) instead.


Google Cloud Run Jobs Helper.  
Allows you to run job and check if job is currently running.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [License](#license)

## Install

```bash
$ npm install gcr-jobs
```

## Usage

```js
const {Jobs} = require('gcr-jobs');

// replace with your Project ID and Service Account
const PROJECT_ID = 'my-example-project';
const SERVICE_ACCOUNT = '111111111111-compute@developer.gserviceaccount.com';

// replace with your Job name
const JOB_ID = 'my-example-job';

// create class instance
const jobs = new Jobs(PROJECT_ID, SERVICE_ACCOUNT);

// run job
const result = await jobs.runJob(JOB_ID);

// check if job is currently running
const isJobRunning = await jobs.isJobRunning(JOB_ID);
```

## License

[MIT](LICENSE)
