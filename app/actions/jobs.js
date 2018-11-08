import { spawn } from 'child_process';
import { max } from 'lodash';
import { sync } from 'shell-env';
import defaultShell from 'default-shell';
import { addTask, findTaskByJobId, removeTaskByJobId } from '../utils/tasks';
import storage from '../storage';

export const ADD_JOB = 'ADD_JOB';
export const UPDATE_JOB = 'UPDATE_JOB';
export const REMOVE_JOB = 'REMOVE_JOB';
export const REPLACE_JOBS = 'REPLACE_JOBS';
export const START_JOB = 'START_JOB';
export const STARTED_JOB = 'STARTED_JOB';
export const STOP_JOB = 'STOP_JOB';
export const JOB_OUTPUT = 'JOB_OUTPUT';
export const JOB_CLOSE = 'JOB_CLOSE';
export const JOB_ERROR = 'JOB_ERROR';
export const JOB_EXIT = 'JOB_EXIT';
export const CLEAR_JOB_OUTPUT = 'CLEAR_JOB_OUTPUT';
export const ACTIVATE_JOB = 'ACTIVATE_JOB';

export const addJob = ({ name, cmd, cwd }) => dispatch => {
  const jobs = storage.get('jobs', []);
  const nextId = jobs.length === 0 ? 1 : max(jobs.map(item => item.id)) + 1;
  const newJob = {
    id: nextId,
    name,
    cmd,
    cwd
  };
  storage.set('jobs', [...jobs, newJob]);

  dispatch({
    type: ADD_JOB,
    job: newJob
  });
};

export const updateJob = ({ id, name, cmd, cwd }) => dispatch => {
  const job = { id, name, cmd, cwd };
  const jobs = storage.get('jobs');
  const originalJob = jobs.find(item => item.id === job.id);
  Object.assign(originalJob, job);
  storage.set('jobs', jobs);

  dispatch({
    type: UPDATE_JOB,
    job
  });
};

export const replaceJobs = jobs => dispatch => {
  storage.set('jobs', jobs);

  dispatch({
    type: REPLACE_JOBS,
    jobs
  });
};

export const removeJob = job => dispatch => {
  const jobs = storage.get('jobs');
  storage.set('jobs', jobs.filter(item => item.id !== job.id));

  dispatch({
    type: REMOVE_JOB,
    job
  });
};

const jobOutput = (job, output) => ({
  type: JOB_OUTPUT,
  job,
  output
});

const jobClose = (job, code, signal) => ({
  type: JOB_CLOSE,
  job,
  code,
  signal
});

const jobError = (job, error) => ({
  type: JOB_ERROR,
  job,
  error
});

const jobExit = (job, code, signal) => ({
  type: JOB_EXIT,
  job,
  code,
  signal
});

export const startJob = job => dispatch => {
  if (job.starting || job.running) {
    return;
  }

  dispatch({
    type: START_JOB,
    job
  });

  const task = spawn(job.cmd, [], {
    detached: true,
    cwd: job.cwd,
    env: sync(defaultShell),
    shell: defaultShell
  });

  addTask(job.id, task);

  dispatch({
    type: STARTED_JOB,
    job
  });

  task.stdout.on('data', data => {
    dispatch(jobOutput(job, data.toString()));
  });
  task.stderr.on('data', data => {
    dispatch(jobOutput(job, data.toString()));
  });
  task.on('close', (code, signal) => {
    removeTaskByJobId(job.id);
    dispatch(jobClose(job, code, signal));
  });
  task.on('error', error => {
    removeTaskByJobId(job.id);
    dispatch(jobError(job, error));
  });
  task.on('exit', (code, signal) => {
    removeTaskByJobId(job.id);
    dispatch(jobExit(job, code, signal));
  });
};

export const stopJob = job => dispatch => {
  if (!job.running || job.stopping) {
    return;
  }

  const task = findTaskByJobId(job.id);
  if (task === undefined) {
    return;
  }

  process.kill(-task.pid);

  return dispatch({
    type: STOP_JOB,
    job
  });
};

export const clearJobOutput = job => ({
  type: CLEAR_JOB_OUTPUT,
  job
});

export const activateJob = job => ({
  type: ACTIVATE_JOB,
  job
});
