import path from 'path';
import os from 'os';
import { spawnSync } from 'child_process';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { sync } from 'shell-env';
import defaultShell from 'default-shell';
import routes from '../constants/routes';
import { findNpmLinks } from '../utils/findNpmLinks';
import type { Job } from '../constants/types';

import styles from './JobLinks.css';

type Props = {
  job: Job
};

const globalLinksDir = path.join(os.homedir(), '.config/yarn/link');

export default class JobLinks extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);

    this.state = {
      localLinks: [],
      globalLinks: [],
      localLoading: true,
      globalLoading: true
    };
  }

  componentDidMount() {
    this.initLocalLinks();
    this.initGlobalLinks();
  }

  refresh = () => {
    this.initLocalLinks();
    this.initGlobalLinks();
  };

  getSubPackageDir() {
    return path.resolve(this.props.job.cwd, this.props.job.subPackageDir || '');
  }

  getLocalLinksDir() {
    return path.join(this.getSubPackageDir(), 'node_modules');
  }

  async initLocalLinks() {
    try {
      const localLinks = await findNpmLinks(this.getLocalLinksDir());
      this.setState({
        localLinks,
        localLoading: false
      });
    } catch (err) {
      window.alert(err.toString());
    }
  }

  async initGlobalLinks() {
    try {
      const globalLinks = await findNpmLinks(globalLinksDir);
      this.setState({
        globalLinks,
        globalLoading: false
      });
    } catch (err) {
      // eslint-disable-next-line no-alert
      window.alert(err.toString());
    }
  }

  yarnLink(link) {
    const result = spawnSync('yarn', ['link', link.packageName], {
      encoding: 'utf8',
      env: sync(defaultShell),
      cwd: this.getSubPackageDir()
    });
    if (result.error) {
      console.error(result.error);
      // eslint-disable-next-line no-alert
      window.alert(`yarn link ${link.packageName}: ${result.error.toString()}`);
      return;
    }
    this.initLocalLinks();
  }

  yarnUnlink(link) {
    const result = spawnSync('yarn', ['unlink', link.packageName], {
      encoding: 'utf8',
      env: sync(defaultShell),
      cwd: this.getSubPackageDir()
    });
    if (result.error) {
      console.error(result.error);
      // eslint-disable-next-line no-alert
      window.alert(
        `yarn unlink ${link.packageName}: ${result.error.toString()}`
      );
      return;
    }
    this.initLocalLinks();
  }

  renderLocalLinkTarget(link) {
    const target = path.resolve(
      this.getLocalLinksDir(),
      link.packageName,
      '..',
      link.target
    );
    return link.exists ? target : <del>{target}</del>;
  }

  renderLocalLinks() {
    const { localLoading, localLinks } = this.state;
    if (localLoading) {
      return null;
    }
    return (
      <div>
        <h3 style={{ marginTop: 0 }}>
          Local Links:{' '}
          <code className={classNames(styles['root-path'], 'text-code')}>
            &lt;
            {this.getSubPackageDir()}
            &gt;
          </code>
        </h3>
        <table className={classNames(styles['table-links'], 'text-code')}>
          <thead>
            <tr>
              <th>Package Name</th>
              <th>Link Target</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {localLinks.map(link => (
              <tr key={link.packageName}>
                <td className="break-word">{link.packageName}</td>
                <td className="break-word">
                  {this.renderLocalLinkTarget(link)}
                </td>
                <td>
                  <button type="button" onClick={() => this.yarnUnlink(link)}>
                    Unlink
                  </button>
                </td>
              </tr>
            ))}
            {localLinks.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center">
                  No Local Links Found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    );
  }

  renderGlobalLinks() {
    const { globalLoading, globalLinks, localLinks } = this.state;
    if (globalLoading) {
      return null;
    }
    return (
      <div>
        <h3>
          Global Links:{' '}
          <code className={classNames(styles['root-path'], 'text-code')}>
            &lt;
            {globalLinksDir}
            &gt;
          </code>
        </h3>
        <table className={classNames(styles['table-links'], 'text-code')}>
          <thead>
            <tr>
              <th>Package Name</th>
              <th>Link Target</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {globalLinks.map(link => (
              <tr key={link.packageName}>
                <td className="break-word">{link.packageName}</td>
                <td className="break-word">
                  {link.exists ? link.target : <del>{link.target}</del>}
                </td>
                <td>
                  {localLinks.some(
                    localLink => localLink.packageName === link.packageName
                  ) ? (
                    <button type="button" disabled>
                      Linked
                    </button>
                  ) : (
                    <button type="button" onClick={() => this.yarnLink(link)}>
                      Link
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {globalLinks.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center">
                  No Global Links Found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    return (
      <div className={styles['links-container']}>
        {this.renderLocalLinks()}
        {this.renderGlobalLinks()}
        <div className={styles.toolbar}>
          <Link to={routes.HOME}>
            <i className="fa fa-arrow-left" style={{ marginRight: '5px' }} />
            Back to Home
          </Link>
          <button
            type="button"
            style={{ float: 'right' }}
            onClick={this.refresh}
          >
            <i className="fa fa-redo" style={{ marginRight: '5px' }} />
            Refresh
          </button>
        </div>
      </div>
    );
  }
}
