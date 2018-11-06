const taskPidSet = new Set();

export const addTaskPid = taskPid => taskPidSet.add(taskPid);
export const removeTaskPid = taskPid => taskPidSet.delete(taskPid);
export const forEachTaskPid = fn => taskPidSet.forEach(fn);
