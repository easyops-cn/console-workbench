import { ipcRenderer } from 'electron';

const taskMap = new Map();

export const findTaskByJobId = jobId => taskMap.get(jobId);

export const addTask = (jobId, task) => {
  ipcRenderer.send('addSubprocess', task.pid);
  return taskMap.set(jobId, task);
};

export const removeTaskByJobId = jobId => {
  const task = findTaskByJobId(jobId);
  if (task !== undefined) {
    ipcRenderer.send('removeSubprocess', task.pid);
  }
  return taskMap.delete(jobId);
};
