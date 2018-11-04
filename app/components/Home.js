// @flow
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import routes from '../constants/routes';
import { uniqueId } from 'lodash';
import styles from './Home.css';

type Job = {
  id: string,
  title: string
}

type StateJob = {
  ids: string[],
  entities: {
    [key: string]: Job
  }
}

type Props = {
  jobs: StateJob[]
}

/*
<div className={styles.container} data-tid="container">
        <h2>Home</h2>
        <Link to={routes.COUNTER}>to Counter</Link>
      </div>
*/

export default class Home extends Component<Props> {
  props: Props;

  addJob = () => {
    const id = uniqueId();
    this.props.addJob({
      id,
      title: `title: ${id}`
    });
  }

  renderJob(job: Job) {
    return (
      <div className={styles.item} key={job.title}>
        <h3>{job.title}</h3>
        <pre><code>{job.log}</code></pre>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.container} data-tid="container">
        {
          this.props.jobs.ids.map(jobId => this.renderJob(this.props.jobs.entities[jobId]))
        }
        <div className="item">
          <button type="button" onClick={this.addJob}>+</button>
        </div>
      </div>
    );
  }
}
