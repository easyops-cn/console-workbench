/* eslint-disable import/first */
jest.mock('../../app/storage');

import { spy, createSandbox } from 'sinon';
import childProcess from 'child_process';
import { ipcRenderer } from 'electron';
import { EventEmitter } from 'events';
import * as actions from '../../app/actions/jobs';
import { addTask } from '../../app/utils/tasks';
import storage from '../../app/storage';

const sandbox = createSandbox();

describe('jobs actions', () => {
  beforeAll(() => {
    addTask(1, { pid: 65536 });
  });

  beforeEach(() => {
    // eslint-disable-next-line no-underscore-dangle
    storage.__reset();
  });

  it('create addJob action', () => {
    const fn = actions.addJob({
      name: 'test job for addJob action',
      cmd: 'ls -l',
      cwd: '/tmp'
    });
    expect(fn).toBeInstanceOf(Function);

    const dispatch = spy();
    fn(dispatch);

    expect(
      dispatch.calledWith({
        type: actions.ADD_JOB,
        job: {
          id: 2,
          name: 'test job for addJob action',
          cmd: 'ls -l',
          cwd: '/tmp'
        }
      })
    ).toBe(true);
  });

  it('create updateJob action', () => {
    const fn = actions.updateJob({
      id: 1,
      name: 'test job for updateJob action',
      cmd: 'ls -l',
      cwd: '/tmp'
    });
    expect(fn).toBeInstanceOf(Function);

    const dispatch = spy();
    fn(dispatch);

    expect(
      dispatch.calledWith({
        type: actions.UPDATE_JOB,
        job: {
          id: 1,
          name: 'test job for updateJob action',
          cmd: 'ls -l',
          cwd: '/tmp'
        }
      })
    ).toBe(true);
  });

  it('create replaceJobs action', () => {
    const fn = actions.replaceJobs([
      {
        id: 3,
        name: 'test job for replaceJobs action',
        cmd: 'ls -l',
        cwd: '/tmp'
      }
    ]);
    expect(fn).toBeInstanceOf(Function);

    const dispatch = spy();
    fn(dispatch);

    expect(
      dispatch.calledWith({
        type: actions.REPLACE_JOBS,
        jobs: [
          {
            id: 3,
            name: 'test job for replaceJobs action',
            cmd: 'ls -l',
            cwd: '/tmp'
          }
        ]
      })
    ).toBe(true);
  });

  it('create removeJob action', () => {
    const fn = actions.removeJob({
      id: 1,
      name: 'test job for removeJob action',
      cmd: 'ls -l',
      cwd: '/tmp'
    });
    expect(fn).toBeInstanceOf(Function);

    const dispatch = spy();
    fn(dispatch);

    expect(
      dispatch.calledWith({
        type: actions.REMOVE_JOB,
        job: {
          id: 1,
          name: 'test job for removeJob action',
          cmd: 'ls -l',
          cwd: '/tmp'
        }
      })
    ).toBe(true);
  });

  it('create startJob action', () => {
    const spawnEvent = new EventEmitter();
    spawnEvent.stdout = new EventEmitter();
    spawnEvent.stderr = new EventEmitter();
    spawnEvent.pid = 65536;
    const mockSpawn = sandbox.stub(childProcess, 'spawn').returns(spawnEvent);
    const mockIpcSend = sandbox.stub(ipcRenderer, 'send');

    const job = {
      id: 2,
      name: 'test job for startJob action',
      cmd: 'ls -l',
      cwd: '/tmp'
    };
    const fn = actions.startJob(job);
    expect(fn).toBeInstanceOf(Function);

    const dispatch = spy();
    fn(dispatch);

    expect(
      dispatch.calledWith({
        type: actions.START_JOB,
        job
      })
    ).toBe(true);

    expect(
      mockSpawn.calledWith(job.cmd, [], {
        detached: true,
        cwd: job.cwd,
        env: {
          PATH: '/bin'
        },
        shell: '/bin/bash'
      })
    ).toBe(true);

    spawnEvent.stdout.emit('data', Buffer.from('good part', 'utf8'));
    expect(
      dispatch.calledWith({
        type: actions.JOB_OUTPUT,
        job,
        output: 'good part'
      })
    ).toBe(true);

    spawnEvent.stderr.emit('data', Buffer.from('bad part', 'utf8'));
    expect(
      dispatch.calledWith({
        type: actions.JOB_OUTPUT,
        job,
        output: 'bad part'
      })
    ).toBe(true);

    spawnEvent.emit('close', 15, 'SIGTERM');
    expect(
      dispatch.calledWith({
        type: actions.JOB_CLOSE,
        job,
        code: 15,
        signal: 'SIGTERM'
      })
    ).toBe(true);

    expect(mockIpcSend.calledWith('addSubprocess', 65536)).toBe(true);

    const error = new Error('Error On Purpose');
    spawnEvent.emit('error', error);
    expect(
      dispatch.calledWith({
        type: actions.JOB_ERROR,
        job,
        error
      })
    ).toBe(true);

    spawnEvent.emit('exit', 1, 'SIGHUP');
    expect(
      dispatch.calledWith({
        type: actions.JOB_EXIT,
        job,
        code: 1,
        signal: 'SIGHUP'
      })
    ).toBe(true);

    sandbox.restore();
  });

  it('create stopJob action', () => {
    const mockKill = sandbox.stub(process, 'kill');

    const fn = actions.stopJob({
      id: 1,
      name: 'test job',
      running: true
    });
    expect(fn).toBeInstanceOf(Function);

    const dispatch = spy();
    fn(dispatch);

    expect(mockKill.calledWith(-65536)).toBe(true);

    expect(
      dispatch.calledWith({
        type: actions.STOP_JOB,
        job: {
          id: 1,
          name: 'test job',
          running: true
        }
      })
    ).toBe(true);

    sandbox.restore();
  });

  it('create stopAllJobs action', () => {
    const mockKill = sandbox.stub(process, 'kill');

    const fn = actions.stopAllJobs();
    expect(fn).toBeInstanceOf(Function);

    const deepDispatch = spy();
    const dispatch = action => action(deepDispatch);
    const getState = () => ({
      jobs: {
        ids: [1, 3],
        entities: {
          1: {
            id: 1,
            name: 'test job 1',
            running: true
          },
          3: {
            id: 3,
            name: 'test job 3',
            running: false
          }
        }
      }
    });
    fn(dispatch, getState);

    expect(mockKill.calledWith(-65536)).toBe(true);

    expect(
      deepDispatch.calledWith({
        type: actions.STOP_JOB,
        job: {
          id: 1,
          name: 'test job 1',
          running: true
        }
      })
    ).toBe(true);

    sandbox.restore();
  });

  it('create clearJobOutput action', () => {
    expect(
      actions.clearJobOutput({
        id: 1,
        name: 'test job'
      })
    ).toMatchSnapshot();
  });

  it('create activateJob action', () => {
    expect(
      actions.activateJob({
        id: 1,
        name: 'test job'
      })
    ).toMatchSnapshot();
  });
});
