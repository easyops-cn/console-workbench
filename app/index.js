import os from 'os';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import storage from './storage';

import './app.global.css';

let jobs = storage.get('jobs');
if (jobs === undefined) {
  jobs = [
    {
      id: 1,
      name: 'Console-W',
      cmd: 'yarn start',
      cwd: `${os.homedir()}/easyops/Console-W`
    }
  ];
  storage.set('jobs', jobs);
}

const store = configureStore({
  jobs: {
    ids: jobs.map(job => job.id),
    entities: jobs.reduce((acc, job) => {
      acc[job.id] = {
        ...job,
        starting: false,
        running: false,
        stopping: false,
        output: ''
      };
      return acc;
    }, {})
  }
});

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    // eslint-disable-next-line global-require
    const NextRoot = require('./containers/Root').default;
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
