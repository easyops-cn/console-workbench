// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import jobs from './jobs';

export default history =>
  combineReducers({
    router: connectRouter(history),
    jobs
  });
