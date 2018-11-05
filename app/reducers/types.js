import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';
import type { Job } from '../constants/types';

export type jobsStateType = {
  +jobs: {
    ids: string[],
    entities: {
      [key: string]: Job
    },
    active: number
  }
};

export type Action = {
  +type: string
};

export type GetState = () => jobsStateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
