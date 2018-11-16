// @flow
import { combineReducers } from 'redux';
import { without } from 'lodash';
import type { Action } from './types';
import {
  ADD_JOB,
  REMOVE_JOB,
  START_JOB,
  STARTED_JOB,
  JOB_OUTPUT,
  STOP_JOB,
  JOB_CLOSE,
  JOB_ERROR,
  JOB_EXIT,
  CLEAR_JOB_OUTPUT,
  ACTIVATE_JOB,
  UPDATE_JOB,
  REPLACE_JOBS
} from '../actions/jobs';
import printable from '../utils/printable';

const ids = (state = [], action: Action) => {
  switch (action.type) {
    case ADD_JOB:
      return [...state, action.job.id];
    case REMOVE_JOB:
      return without(state, action.job.id);
    case REPLACE_JOBS:
      return action.jobs.map(job => job.id);
    default:
      return state;
  }
};

const entities = (state = {}, action: Action) => {
  switch (action.type) {
    case ADD_JOB:
      return {
        ...state,
        [action.job.id]: {
          ...action.job,
          starting: false,
          running: false,
          stopping: false
        }
      };
    case UPDATE_JOB:
      return {
        ...state,
        [action.job.id]: {
          ...state[action.job.id],
          name: action.job.name,
          cmd: action.job.cmd,
          cwd: action.job.cwd,
          subPackageDir: action.job.subPackageDir
        }
      };
    case REMOVE_JOB:
      return {
        ...state,
        [action.job.id]: undefined
      };
    case REPLACE_JOBS:
      return action.jobs.reduce((acc, job) => {
        acc[job.id] = {
          ...job,
          starting: false,
          running: false,
          stopping: false
        };
        return acc;
      }, {});
    case START_JOB:
      return {
        ...state,
        [action.job.id]: {
          ...state[action.job.id],
          starting: true,
          error: undefined
        }
      };
    case STARTED_JOB:
      return {
        ...state,
        [action.job.id]: {
          ...state[action.job.id],
          starting: false,
          running: true
        }
      };
    case JOB_CLOSE:
    case JOB_EXIT:
      if (!state[action.job.id].running) {
        return state;
      }
      return {
        ...state,
        [action.job.id]: {
          ...state[action.job.id],
          running: false,
          stopping: false
        }
      };
    case JOB_ERROR:
      return {
        ...state,
        [action.job.id]: {
          ...state[action.job.id],
          running: false,
          error: action.error
        }
      };
    case STOP_JOB:
      return {
        ...state,
        [action.job.id]: {
          ...state[action.job.id],
          stopping: true
        }
      };
    default:
      return state;
  }
};

const outputs = (state = {}, action) => {
  switch (action.type) {
    case ADD_JOB:
    case REMOVE_JOB:
    case CLEAR_JOB_OUTPUT:
      return {
        ...state,
        [action.job.id]: undefined
      };
    case REPLACE_JOBS:
      return action.jobs.reduce((acc, job) => {
        acc[job.id] = undefined;
        return acc;
      }, {});
    case START_JOB:
      return {
        ...state,
        [action.job.id]: printable(
          undefined,
          `$ cd ${action.job.cwd}\n$ ${action.job.cmd}\n`
        )
      };
    case JOB_OUTPUT:
      return {
        ...state,
        [action.job.id]: printable(state[action.job.id], action.output)
      };
    case JOB_CLOSE:
      return {
        ...state,
        [action.job.id]: printable(
          state[action.job.id],
          `closed with code: ${action.code}, signal: ${action.signal}\n`
        )
      };
    case JOB_EXIT:
      return {
        ...state,
        [action.job.id]: printable(
          state[action.job.id],
          `exited with code: ${action.code}, signal: ${action.signal}\n`
        )
      };
    case STOP_JOB:
      return {
        ...state,
        [action.job.id]: printable(state[action.job.id], '^C\n')
      };
    default:
      return state;
  }
};

const active = (state = null, action) => {
  switch (action.type) {
    case ACTIVATE_JOB:
      return state === action.job.id ? null : action.job.id;
    default:
      return state;
  }
};

const jobs = combineReducers({
  ids,
  entities,
  outputs,
  active
});

export default jobs;
