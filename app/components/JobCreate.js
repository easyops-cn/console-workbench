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
  jobs: Job[],
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
          cwd: props.job.cwd,
          subPackageDir: props.job.subPackageDir || ''
        }
      : {
          template: '',
          name: '',
          cmd: '',
          cwd: '',
          subPackageDir: ''
        };
  }

  handleTemplateChange = (e: Event) => {
    const newState = {
      template: e.target.value
    };
    let selectedJob;
    // eslint-disable-next-line default-case
    switch (newState.template) {
      case 'console-plugins':
        newState.name = 'PLUGIN_NAME';
        newState.cmd = 'yarn start --scope=@console-plugin/PLUGIN_NAME --color';
        newState.cwd = `${os.homedir()}/easyops/console-plugins`;
        newState.subPackageDir = 'packages/PLUGIN_NAME';
        break;
      case 'Console-W':
        newState.name = 'PACKAGE_NAME';
        newState.cmd =
          'lerna run start --scope=@console-plugin/PACKAGE_NAME --stream --color';
        newState.cwd = `${os.homedir()}/easyops/Console-W`;
        newState.subPackageDir = 'packages/PLUGIN_NAME';
        break;
      case '':
        break;
      default:
        selectedJob = this.props.jobs.find(
          job => job.id === +newState.template
        );
        newState.cmd = selectedJob.cmd;
        newState.cwd = selectedJob.cwd;
        newState.subPackageDir = selectedJob.subPackageDir || '';
    }
    this.setState(newState);
  };

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

  handleSubPackageDirChange = (e: Event) => {
    this.setState({
      subPackageDir: e.target.value
    });
  };

  storeJob = event => {
    event.preventDefault();
    const { name, cmd, cwd, subPackageDir } = this.state;
    if (!name || !cmd || !cwd) {
      return;
    }
    if (this.props.isEdit) {
      this.props.updateJob({
        id: this.props.job.id,
        name,
        cmd,
        cwd,
        subPackageDir
      });
    } else {
      this.props.addJob({
        name,
        cmd,
        cwd,
        subPackageDir
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
    const { name, cmd, cwd, subPackageDir, template } = this.state;
    const { isEdit, jobs } = this.props;
    const disabled = !name || !cmd || !cwd;
    return (
      <form className={styles.form} onSubmit={this.storeJob}>
        {isEdit ? null : (
          <label htmlFor="jobTemplate" className={styles['form-group']}>
            <span className={styles['form-label']}>Template:</span>
            <select
              className={styles['form-control']}
              id="jobTemplate"
              value={template}
              onChange={this.handleTemplateChange}
            >
              <option value="">-- no template --</option>
              <option value="Console-W">
                -- Default Console-W packages --
              </option>
              <option value="console-plugins">
                -- Default console-plugins packages --
              </option>
              {jobs.map(job => (
                <option value={job.id} key={job.id}>
                  {job.name}
                </option>
              ))}
            </select>
          </label>
        )}

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

        <label htmlFor="jobCmd" className={styles['form-group']}>
          <span className={styles['form-label']}>Command:</span>
          <input
            type="text"
            className={styles['form-control']}
            id="jobCmd"
            value={cmd}
            onChange={this.handleCmdChange}
            placeholder="yarn start"
            required
          />
        </label>

        <label htmlFor="jobCwd" className={styles['form-group']}>
          <span className={styles['form-label']}>
            Current Working Directory:
          </span>
          <input
            type="text"
            className={styles['form-control']}
            id="jobCwd"
            value={cwd}
            onChange={this.handleCwdChange}
            placeholder={`${os.homedir()}/easyops/Console-W`}
            required
          />
        </label>

        <label htmlFor="jobSubPackageDir" className={styles['form-group']}>
          <span className={styles['form-label']}>Sub Package Dir:</span>
          <input
            type="text"
            className={styles['form-control']}
            id="jobSubPackageDir"
            value={subPackageDir}
            onChange={this.handleSubPackageDirChange}
            placeholder="Relative to CWD (leave empty if equals to CWD)"
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
              {isEdit ? 'Update ' : 'Add '} Job
            </button>
            <Link to={routes.HOME}>Cancel</Link>
            {isEdit ? (
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
