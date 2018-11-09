// @flow
import os from 'os';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import type { Job } from '../constants/types';

import styles from './JobCreate.css';

type Props = {
  addJob: Job => void,
  updateJob: Job => void,
  removeJob: Job => void,
  job: Job,
  isEdit: boolean,
  history: {
    push: string => void
  }
};

export default class JobCreate extends Component<Props> {
  props: Props;

  constructor(props: Props) {
    super(props);

    this.state = props.isEdit
      ? {
          name: props.job.name,
          cmd: props.job.cmd,
          cwd: props.job.cwd
        }
      : {
          name: '',
          cmd: '',
          cwd: ''
        };
  }

  handleJobNameChange = (e: Event) => {
    this.setState({
      name: e.target.value
    });
  };

  handleCmdChange = (e: Event) => {
    this.setState({
      cmd: e.target.value
    });
  };

  handleCwdChange = (e: Event) => {
    this.setState({
      cwd: e.target.value
    });
  };

  storeJob = () => {
    const { name, cmd, cwd } = this.state;
    if (!name || !cmd || !cwd) {
      return;
    }
    if (this.props.isEdit) {
      this.props.updateJob({
        id: this.props.job.id,
        name,
        cmd,
        cwd
      });
    } else {
      this.props.addJob({
        name,
        cmd,
        cwd
      });
    }
    this.props.history.push(routes.HOME);
  };

  confirmToRemoveJob = () => {
    const { job, removeJob, history } = this.props;
    // eslint-disable-next-line no-alert
    if (window.confirm(`Are you sure to remove \`${job.name}\`?`)) {
      removeJob(job);
      history.push(routes.HOME);
    }
  };

  render() {
    const { name, cmd, cwd } = this.state;
    const disabled = !name || !cmd || !cwd;
    return (
      <form className={styles.form} onSubmit={this.storeJob}>
        <label htmlFor="jobName" className={styles['form-group']}>
          <span className={styles['form-label']}>Job Name:</span>
          <input
            type="text"
            className={styles['form-control']}
            id="jobName"
            value={name}
            onChange={this.handleJobNameChange}
            placeholder="Console-W"
            required
          />
        </label>

        <label htmlFor="name" className={styles['form-group']}>
          <span className={styles['form-label']}>Command:</span>
          <input
            type="text"
            className={styles['form-control']}
            id="cmd"
            value={cmd}
            onChange={this.handleCmdChange}
            placeholder="yarn start"
            required
          />
        </label>

        <label htmlFor="name" className={styles['form-group']}>
          <span className={styles['form-label']}>
            Current Working Directory:
          </span>
          <input
            type="text"
            className={styles['form-control']}
            id="cwd"
            value={cwd}
            onChange={this.handleCwdChange}
            placeholder={`${os.homedir()}/easyops/Console-W`}
            required
          />
        </label>

        <div className={styles['form-group']}>
          <span className={styles['form-label']} />
          <div className={styles['form-control']}>
            <button
              type="submit"
              disabled={disabled}
              style={{ marginRight: '10px' }}
            >
              {this.props.isEdit ? 'Update ' : 'Add '} Job
            </button>
            <Link to={routes.HOME}>Cancel</Link>
            {this.props.isEdit ? (
              <button
                type="button"
                style={{ color: '#f34235', float: 'right' }}
                onClick={this.confirmToRemoveJob}
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>
      </form>
    );
  }
}
