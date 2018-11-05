// @flow
import React, { Component } from 'react';
import { uniqueId } from 'lodash';
import styles from './Home.css';
import config from '../constants/config.json';
import TaskContainer from '../containers/TaskContainer';

type Props = {
  initialJobs: (any[]) => void,
  addJob: any => void,
  jobs: any[]
};

export default class Home extends Component {
  props: Props;

  constructor(props) {
    super(props);

    const jobs = config.jobs.map(job => ({
      ...job,
      id: uniqueId(),
      starting: false,
      running: false,
      stopping: false,
      output: ''
    }));
    props.initialJobs(jobs);
  }

  addJob = () => {
    const id = uniqueId();
    this.props.addJob({
      id,
      title: `title: ${id}`,
      output: ''
    });
  };

  render() {
    const { jobs } = this.props;
    const rows = Math.ceil(jobs.length / 2);
    const gridTemplateRows = `repeat(${rows}, 1fr)`;
    return (
      <div
        className={styles.container}
        style={{ gridTemplateRows }}
        data-tid="container"
      >
        {jobs.map(job => (
          <TaskContainer jobId={job.id} key={job.id} />
        ))}
      </div>
    );
  }
}
