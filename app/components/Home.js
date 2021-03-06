// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TaskContainer from '../containers/TaskContainer';
import routes from '../constants/routes';

import styles from './Home.css';

type Props = {
  jobIds: string[],
  stopAllJobs: () => void
};

export default class Home extends Component<Props> {
  props: Props;

  stopAllJobs = () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure to stop all running jobs?')) {
      this.props.stopAllJobs();
    }
  };

  render() {
    const { jobIds } = this.props;
    const rows = Math.ceil(jobIds.length / 2);
    const gridTemplateRows = `repeat(${rows}, 1fr)`;
    const odd = jobIds.length % 2 === 1;
    return (
      <div className={styles.container}>
        <div
          className={styles.tasks}
          style={{ gridTemplateRows }}
          data-tid="tasks-container"
        >
          {jobIds.map((jobId, index) => (
            <TaskContainer
              jobId={jobId}
              key={jobId}
              span={odd && index === 0 ? 2 : 1}
            />
          ))}
        </div>
        <div className={styles.toolbar}>
          <a
            role="button"
            className={styles.btn}
            onClick={this.stopAllJobs}
            title="Stop All"
            tabIndex={-1}
          >
            <i className="fa fa-stop fa-2x" />
          </a>
          <Link to={routes.SETTINGS} className={styles.btn} title="Settings">
            <i className="fa fa-cog fa-2x" />
          </Link>
          <Link to={routes.JOB_CREATE} className={styles.btn} title="Add Job">
            <i className="fa fa-plus fa-2x" />
          </Link>
        </div>
      </div>
    );
  }
}
