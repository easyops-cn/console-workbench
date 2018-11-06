import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import JobCreatePage from './containers/JobCreatePage';
import JobEditPage from './containers/JobEditPage';
import SettingsPage from './containers/SettingsPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.JOB_CREATE} component={JobCreatePage} />
      <Route path={routes.JOB_EDIT} component={JobEditPage} />
      <Route path={routes.SETTINGS} component={SettingsPage} />
      <Route path={routes.HOME} component={HomePage} />
    </Switch>
  </App>
);
