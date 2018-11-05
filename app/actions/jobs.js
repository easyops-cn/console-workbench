import { spawn } from 'child_process';
import { addTask, findTaskByJobId, removeTaskByJobId } from '../utils/tasks';

export const INITIAL_JOBS = 'INITIAL_JOBS';
export const ADD_JOB = 'ADD_JOB';
export const REMOVE_JOB = 'REMOVE_JOB';
export const START_JOB = 'START_JOB';
export const STARTED_JOB = 'STARTED_JOB';
export const STOP_JOB = 'STOP_JOB';
export const JOB_OUTPUT = 'JOB_OUTPUT';
export const JOB_CLOSE = 'JOB_CLOSE';
export const JOB_ERROR = 'JOB_ERROR';
export const JOB_EXIT = 'JOB_EXIT';
export const CLEAR_JOB_OUTPUT = 'CLEAR_JOB_OUTPUT';
export const ACTIVATE_JOB = 'ACTIVATE_JOB';

export const initialJobs = jobs => ({
  type: INITIAL_JOBS,
  jobs
});

export const addJob = job => ({
  type: ADD_JOB,
  job
});

export const removeJob = job => ({
  type: REMOVE_JOB,
  job
});

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

  const task = spawn(job.cmd, ['--color'], {
    cwd: job.cwd,
    env: process.env,
    shell: true
  });

  addTask(job.id, task);

  dispatch({
    type: STARTED_JOB,
    job
  });

  task.stdout.on('data', data => {
    dispatch(jobOutput(job, data));
  });
  task.stderr.on('data', data => {
    dispatch(jobOutput(job, data));
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

  task.kill();

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
