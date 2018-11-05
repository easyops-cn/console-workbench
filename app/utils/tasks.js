const taskMap = new Map();

export const findTaskByJobId = jobId => taskMap.get(jobId);

export const addTask = (jobId, task) => taskMap.set(jobId, task);

export const removeTaskByJobId = jobId => taskMap.delete(jobId);
