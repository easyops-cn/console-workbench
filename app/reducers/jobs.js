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
  UPDATE_JOB
} from '../actions/jobs';

const ids = (state = [], action: Action) => {
  switch (action.type) {
    case ADD_JOB:
      return [...state, action.job.id];
    case REMOVE_JOB:
      return without(state, action.job.id);
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
          stopping: false,
          output: ''
        }
      };
    case UPDATE_JOB:
      return {
        ...state,
        [action.job.id]: {
          ...state[action.job.id],
          name: action.job.name,
          cmd: action.job.cmd,
          cwd: action.job.cwd
        }
      };
    case REMOVE_JOB:
      return {
        ...state,
        [action.job.id]: undefined
      };
    case START_JOB:
      return {
        ...state,
        [action.job.id]: {
          ...state[action.job.id],
          starting: true,
          output: `$ cd ${action.job.cwd}\n$ ${action.job.cmd}\n`,
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
    case JOB_OUTPUT:
      return {
        ...state,
        [action.job.id]: {
          ...state[action.job.id],
          output: (state[action.job.id].output || '') + action.output
        }
      };
    case JOB_CLOSE:
      if (!state[action.job.id].running) {
        return state;
      }
      return {
        ...state,
        [action.job.id]: {
          ...state[action.job.id],
          running: false,
          stopping: false,
          output: `${state[action.job.id].output}closed with code: ${
            action.code
          }, signal: ${action.signal}\n`
        }
      };
    case JOB_EXIT:
      if (!state[action.job.id].running) {
        return state;
      }
      return {
        ...state,
        [action.job.id]: {
          ...state[action.job.id],
          running: false,
          stopping: false,
          output: `${state[action.job.id].output}exited with code: ${
            action.code
          }, signal: ${action.signal}\n`
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
          stopping: true,
          output: `${state[action.job.id].output}^C\n`
        }
      };
    case CLEAR_JOB_OUTPUT:
      return {
        ...state,
        [action.job.id]: {
          ...state[action.job.id],
          output: ''
        }
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
  active
});

export default jobs;
