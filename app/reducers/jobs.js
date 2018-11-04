// @flow
import { combineReducers } from 'redux';
import { without } from 'lodash';
import type { Action } from './types';
import { ADD_JOB, REMOVE_JOB, INITIAL_JOBS } from '../actions/jobs'

const ids = (state = [], action: Action) => {
  switch (action.type) {
    case ADD_JOB:
      return [
        ...state,
        action.job.id
      ];
    case REMOVE_JOB:
      return without(state, action.job.id);
    case INITIAL_JOBS:
      return action.jobs.map(job => job.id);
    default:
      return state;
  }
}

const entities = (state = {}, action: Action) => {
  switch (action.type) {
    case ADD_JOB:
      return {
        ...state,
        [action.job.id]: action.job
      };
    case REMOVE_JOB:
      return {
        ...state,
        [action.job.id]: undefined
      };
    case INITIAL_JOBS:
      return action.jobs.reduce((acc, job) => {
        acc[job.id] = job;
      }, {});
    default:
      return state;
  }
}

const jobs = combineReducers({
  ids,
  entities
})

export default jobs;
