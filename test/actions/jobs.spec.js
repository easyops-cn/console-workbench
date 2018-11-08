/* eslint-disable import/first */
jest.mock('../../app/storage');

import { spy } from 'sinon';
import * as actions from '../../app/actions/jobs';
import { addTask } from '../../app/utils/tasks';
import storage from '../../app/storage';

describe('jobs actions', () => {
  let originalKill;
  let mockedKill: jest.Mock;

  beforeAll(() => {
    originalKill = process.kill;
    mockedKill = jest.fn();
    Object.defineProperty(process, 'kill', {
      value: mockedKill
    });
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

  it('create stopJob action', () => {
    const fn = actions.stopJob({
      id: 1,
      name: 'test job',
      running: true
    });
    expect(fn).toBeInstanceOf(Function);

    const dispatch = spy();
    fn(dispatch);

    expect(mockedKill.mock.calls[0][0]).toBe(-65536);

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

  afterAll(() => {
    Object.defineProperty(process, 'kill', {
      value: originalKill
    });
  });

  /* it('should incrementIfOdd should create increment action', () => {
    const fn = actions.incrementIfOdd();
    expect(fn).toBeInstanceOf(Function);
    const dispatch = spy();
    const getState = () => ({ counter: 1 });
    fn(dispatch, getState);
    expect(dispatch.calledWith({ type: actions.INCREMENT_COUNTER })).toBe(true);
  });

  it('should incrementIfOdd shouldnt create increment action if counter is even', () => {
    const fn = actions.incrementIfOdd();
    const dispatch = spy();
    const getState = () => ({ counter: 2 });
    fn(dispatch, getState);
    expect(dispatch.called).toBe(false);
  });

  // There's no nice way to test this at the moment...
  it('should incrementAsync', done => {
    const fn = actions.incrementAsync(1);
    expect(fn).toBeInstanceOf(Function);
    const dispatch = spy();
    fn(dispatch);
    setTimeout(() => {
      expect(dispatch.calledWith({ type: actions.INCREMENT_COUNTER })).toBe(
        true
      );
      done();
    }, 5);
  }); */
});
