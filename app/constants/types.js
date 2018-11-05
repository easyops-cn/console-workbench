export type Job = {
  id: string,
  name: string,
  cmd: string,
  cwd: string,
  running: boolean,
  starting: boolean,
  stopping: boolean,
  output: string
};
