export type Job = {
  id: string,
  name: string,
  cmd: string,
  cwd: string,
  subPackageDir: string,
  running: boolean,
  starting: boolean,
  stopping: boolean,
  output: string
};
