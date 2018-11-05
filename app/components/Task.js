// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import AnsiUp from 'ansi_up';
import styles from './Task.css';

type Props = {
  startJob: any => void,
  stopJob: any => void,
  clearJobOutput: any => void,
  removeJob: any => void,
  activateJob: any => void,
  job: any,
  active: boolean
};

export default class Task extends Component {
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

  confirmToRemoveJob = e => {
    const { job, removeJob } = this.props;
    this.stopPropagationIfActive(e);
    if (window.confirm(`确认要删除 \`${job.title}\` 吗？`)) {
      removeJob(job);
    }
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
    const { job, active, activateJob } = this.props;
    const outputHtml = this.ansiUp.ansi_to_html(job.output);
    const taskClass = classNames(styles.task, {
      [styles.active]: active
    });
    return (
      <a
        className={taskClass}
        role="link"
        tabIndex={0}
        onClick={() => activateJob(job)}
      >
        <div className={styles.heading}>
          <span className={styles.title}>{job.title}</span>
          {this.renderLabels()}
          <div className={styles.toolbar}>
            <button
              type="button"
              onClick={this.startJob}
              disabled={job.starting || job.running || job.stopping}
            >
              Start
            </button>
            <button
              type="button"
              onClick={this.stopJob}
              disabled={job.starting || !job.running || job.stopping}
            >
              Stop
            </button>
            <button type="button" onClick={this.clearJobOutput}>
              Clear Output
            </button>
            <button
              type="button"
              style={{ color: '#f34235' }}
              onClick={this.confirmToRemoveJob}
            >
              Remove
            </button>
          </div>
        </div>
        <pre className={styles.output}>
          <code dangerouslySetInnerHTML={{ __html: outputHtml }} />
        </pre>
      </a>
    );
  }
}
