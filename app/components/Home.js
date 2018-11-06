// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TaskContainer from '../containers/TaskContainer';
import routes from '../constants/routes';
import type { Job } from '../constants/types';

import styles from './Home.css';

type Props = {
  jobs: Job[]
};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    const { jobs } = this.props;
    const rows = Math.ceil(jobs.length / 2);
    const gridTemplateRows = `repeat(${rows}, 1fr)`;
    const gridTemplateColumns = jobs.length > 1 ? '1fr 1fr' : '1fr';
    return (
      <div className={styles.container}>
        <div
          className={styles.tasks}
          style={{ gridTemplateRows, gridTemplateColumns }}
        >
          {jobs.map(job => (
            <TaskContainer jobId={job.id} key={job.id} />
          ))}
        </div>
        <div className={styles.toolbar}>
          <Link
            to={routes.SETTINGS}
            className={styles.btn}
            title="Settings"
          >
            <i className="fa fa-cogs fa-2x" />
          </Link>
          <Link
            to={routes.JOB_CREATE}
            className={styles.btn}
            title="Add Job"
          >
            <i className="fa fa-plus fa-2x" />
          </Link>
        </div>
      </div>
    );
  }
}
