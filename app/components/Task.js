// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import AnsiUp from 'ansi_up';
import { withRouter } from 'react-router-dom';
import type { Job } from '../constants/types';

import styles from './Task.css';

type Props = {
  startJob: Job => void,
  stopJob: Job => void,
  clearJobOutput: Job => void,
  activateJob: Job => void,
  job: Job,
  output: {
    returned: string,
    buffer: string[],
    cursor: 0
  },
  active: boolean,
  span: number
};

export default class Task extends Component<Props> {
  props: Props;

  ansiUp = new AnsiUp();

  startJob = e => {
    const { job, startJob } = this.props;
    this.stopPropagationIfActive(e);
    startJob(job);
  };

  stopJob = e => {
    const { job, stopJob } = this.props;
    this.stopPropagationIfActive(e);
    stopJob(job);
  };

  clearJobOutput = e => {
    const { job, clearJobOutput } = this.props;
    this.stopPropagationIfActive(e);
    clearJobOutput(job);
  };

  stopPropagationIfActive(e) {
    if (this.props.active) {
      e.stopPropagation();
    }
  }

  renderLabels() {
    const { starting, running, stopping, error } = this.props.job;
    const labels = [];
    if (running) {
      labels.push(
        <span
          className={classNames(styles.label, styles['label-running'])}
          key="running"
        >
          Running
        </span>
      );
    }
    if (starting) {
      labels.push(
        <span
          className={classNames(styles.label, styles['label-starting'])}
          key="starting"
        >
          Starting
        </span>
      );
    }
    if (stopping) {
      labels.push(
        <span
          className={classNames(styles.label, styles['label-stopping'])}
          key="stopping"
        >
          Stopping
        </span>
      );
    }
    if (labels.length === 0) {
      labels.push(
        <span
          className={classNames(styles.label, styles['label-stopped'])}
          key="stopped"
        >
          Stopped
        </span>
      );
    }
    if (error !== undefined) {
      labels.push(
        <span
          className={classNames(styles.label, styles['label-failed'])}
          key="failed"
        >
          {error.toString()}
        </span>
      );
    }
    return labels;
  }

  render() {
    const {
      job,
      output: { returned, buffer },
      active,
      activateJob,
      span
    } = this.props;
    let log = buffer.join('');
    if (returned !== undefined) {
      log = `${returned}\n${log}`;
    }
    const outputHtml = this.ansiUp.ansi_to_html(log);
    const taskClass = classNames(styles.task, {
      [styles.active]: active
    });
    const BtnSettings = withRouter(({ history }) => (
      <button
        type="button"
        onClick={() => history.push(`/job/${job.id}/edit`)}
        data-tid="btn-task-settings"
      >
        <i className="fa fa-cog" title="Settings" />
      </button>
    ));
    const BtnLinks = withRouter(({ history }) => (
      <button
        type="button"
        onClick={() => history.push(`/job/${job.id}/links`)}
        data-tid="btn-task-links"
      >
        <i className="fa fa-link" title="Show Links" />
      </button>
    ));
    const taskStyle =
      span > 1
        ? {
            gridColumn: `span ${span}`
          }
        : null;
    return (
      <a
        className={taskClass}
        role="link"
        tabIndex={0}
        onClick={() => activateJob(job)}
        style={taskStyle}
        data-tclass="task"
      >
        <div className={styles.heading}>
          <span className={styles.name}>{job.name}</span>
          {this.renderLabels()}
          <div className={styles.toolbar}>
            <button
              type="button"
              onClick={this.startJob}
              disabled={job.starting || job.running || job.stopping}
            >
              <i className="fa fa-play" title="Start" />
            </button>
            <button
              type="button"
              onClick={this.stopJob}
              disabled={job.starting || !job.running || job.stopping}
            >
              <i className="fa fa-stop" title="Stop" />
            </button>
            <button type="button" onClick={this.clearJobOutput}>
              <i className="fa fa-eraser" title="Clear Log" />
            </button>
            <BtnSettings />
            <BtnLinks />
          </div>
        </div>
        <pre className={styles.output}>
          {/* eslint-disable-next-line react/no-danger */}
          <code dangerouslySetInnerHTML={{ __html: outputHtml }} />
        </pre>
      </a>
    );
  }
}
