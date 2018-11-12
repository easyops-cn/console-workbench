// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import type { Job } from '../constants/types';

import styles from './Settings.css';

type Props = {
  jobs: Job[],
  replaceJobs: (Job[]) => void,
  stopJob: Job => void,
  history: {
    push: string => void
  }
};

export default class Settings extends Component<Props> {
  props: Props;

  constructor(props: Props) {
    super(props);

    this.state = {
      settings: JSON.stringify(
        {
          jobs: props.jobs.map(({ name, cmd, cwd }) => ({ name, cmd, cwd }))
        },
        null,
        '  '
      )
    };
  }

  handleSettingsChange = e => {
    this.setState({
      settings: e.target.value
    });
  };

  applySettings = event => {
    event.preventDefault();
    const runningJobs = this.props.jobs.filter(job => job.running);
    if (runningJobs.length > 0) {
      if (
        // eslint-disable-next-line no-alert
        !window.confirm(
          'There are running jobs, are you sure to stop them before apply setting?'
        )
      ) {
        return;
      }
      runningJobs.forEach(job => {
        this.props.stopJob(job);
      });
    }
    let jobs;
    try {
      const settings = JSON.parse(this.state.settings);
      jobs = settings.jobs.map(({ name, cmd, cwd }, index) => ({
        id: index + 1,
        name,
        cmd,
        cwd
      }));
    } catch (e) {
      // eslint-disable-next-line no-alert
      window.alert('Not valid Settings');
      return;
    }
    this.props.replaceJobs(jobs);
    this.props.history.push(routes.HOME);
  };

  render() {
    return (
      <form className={styles.form} onSubmit={this.applySettings}>
        <div className={styles['form-group']}>
          <textarea
            className={styles['form-control']}
            value={this.state.settings}
            onChange={this.handleSettingsChange}
            rows={20}
          />
        </div>
        <div className={styles['form-group']}>
          <button type="submit" style={{ marginRight: '10px' }}>
            Apply
          </button>
          <Link to={routes.HOME}>Cancel</Link>
        </div>
      </form>
    );
  }
}
