export const ADD_JOB = "ADD_JOB";
export const REMOVE_JOB = "REMOVE_JOB";
export const INITIAL_JOBS = "INITIAL_JOBS";

export const addJob = job => ({
  type: ADD_JOB,
  job
});

export const removeJob = job => ({
  type: REMOVE_JOB,
  job
});

export const initialJobs = jobs => ({
  type: INITIAL_JOBS,
  jobs
});
