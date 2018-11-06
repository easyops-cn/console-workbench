import { remote } from 'electron';

const { addTaskPid, removeTaskPid } = remote.require('./tasks');

const taskMap = new Map();

export const findTaskByJobId = jobId => taskMap.get(jobId);

export const addTask = (jobId, task) => {
  addTaskPid(task.pid);
  return taskMap.set(jobId, task);
};

export const removeTaskByJobId = jobId => {
  const task = findTaskByJobId(jobId);
  if (task !== undefined) {
    removeTaskPid(task.pid);
  }
  return taskMap.delete(jobId);
};
