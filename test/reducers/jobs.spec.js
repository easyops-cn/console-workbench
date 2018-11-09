import jobs from '../../app/reducers/jobs';
import {
  ADD_JOB,
  UPDATE_JOB,
  REMOVE_JOB,
  REPLACE_JOBS,
  START_JOB,
  STARTED_JOB,
  JOB_OUTPUT,
  JOB_CLOSE,
  JOB_EXIT,
  JOB_ERROR,
  STOP_JOB,
  CLEAR_JOB_OUTPUT,
  ACTIVATE_JOB
} from '../../app/actions/jobs';

describe('reducers', () => {
  describe('jobs', () => {
    it('should handle initial state', () => {
      expect(jobs(undefined, {})).toMatchSnapshot();
    });

    it('should handle ADD_JOB', () => {
      expect(
        jobs(undefined, {
          type: ADD_JOB,
          job: {
            id: 1,
            name: 'test job for ADD_JOB',
            cmd: 'ls -l',
            cwd: '/tmp'
          }
        })
      ).toMatchSnapshot();
    });

    it('should handle UPDATE_JOB', () => {
      expect(
        jobs(
          {
            ids: [1],
            entities: {
              1: {
                id: 1,
                name: 'test job for UPDATE_JOB',
                cmd: 'ls -l',
                cwd: '/tmp'
              }
            },
            outputs: {
              1: {
                returned: '$ ls -l',
                buffer: ['drwx'],
                cursor: 4
              }
            }
          },
          {
            type: UPDATE_JOB,
            job: {
              id: 1,
              name: 'updated test job for UPDATE_JOB',
              cmd: 'ls -la',
              cwd: '/home'
            }
          }
        )
      ).toMatchSnapshot();
    });

    it('should handle REMOVE_JOB', () => {
      expect(
        jobs(
          {
            ids: [1],
            entities: {
              1: {
                id: 1,
                name: 'test job for REMOVE_JOB',
                cmd: 'ls -l',
                cwd: '/tmp'
              }
            },
            outputs: {
              1: {
                returned: '$ ls -l',
                buffer: ['drwx'],
                cursor: 4
              }
            }
          },
          {
            type: REMOVE_JOB,
            job: {
              id: 1,
              name: 'test job for REMOVE_JOB',
              cmd: 'ls -l',
              cwd: '/tmp'
            }
          }
        )
      ).toMatchSnapshot();
    });

    it('should handle REPLACE_JOBS', () => {
      expect(
        jobs(undefined, {
          type: REPLACE_JOBS,
          jobs: [
            {
              id: 1,
              name: 'test job for REPLACE_JOBS',
              cmd: 'ls -l',
              cwd: '/tmp'
            }
          ]
        })
      ).toMatchSnapshot();
    });

    it('should handle START_JOB', () => {
      expect(
        jobs(
          {
            ids: [1],
            entities: {
              1: {
                id: 1,
                name: 'test job for START_JOB',
                cmd: 'ls -l',
                cwd: '/tmp'
              }
            },
            outputs: {
              1: {
                returned: '$ ls -l',
                buffer: ['drwx'],
                cursor: 4
              }
            }
          },
          {
            type: START_JOB,
            job: {
              id: 1,
              name: 'test job for START_JOB',
              cmd: 'ls -l',
              cwd: '/tmp'
            }
          }
        )
      ).toMatchSnapshot();
    });

    it('should handle STARTED_JOB', () => {
      expect(
        jobs(
          {
            ids: [1],
            entities: {
              1: {
                id: 1,
                name: 'test job for STARTED_JOB',
                cmd: 'ls -l',
                cwd: '/tmp',
                starting: true
              }
            },
            outputs: {
              1: {
                returned: '$ ls -l',
                buffer: ['drwx'],
                cursor: 4
              }
            }
          },
          {
            type: STARTED_JOB,
            job: {
              id: 1,
              name: 'test job for STARTED_JOB',
              cmd: 'ls -l',
              cwd: '/tmp'
            }
          }
        )
      ).toMatchSnapshot();
    });

    it('should handle JOB_OUTPUT', () => {
      expect(
        jobs(
          {
            ids: [1],
            entities: {
              1: {
                id: 1,
                name: 'test job for JOB_OUTPUT',
                cmd: 'ls -l',
                cwd: '/tmp',
                running: true
              }
            },
            outputs: {
              1: {
                returned: '$ ls -l',
                buffer: ['drwx'],
                cursor: 4
              }
            }
          },
          {
            type: JOB_OUTPUT,
            job: {
              id: 1,
              name: 'test job for JOB_OUTPUT',
              cmd: 'ls -l',
              cwd: '/tmp'
            },
            output: '\n10% run\b\b\b\b\b\b\b100% done.\n'
          }
        )
      ).toMatchSnapshot();
    });

    it('should handle JOB_CLOSE', () => {
      expect(
        jobs(
          {
            ids: [1],
            entities: {
              1: {
                id: 1,
                name: 'test job for JOB_CLOSE',
                cmd: 'ls -l',
                cwd: '/tmp',
                running: true
              }
            },
            outputs: {
              1: {
                returned: '$ ls -l',
                buffer: ['drwx'],
                cursor: 4
              }
            }
          },
          {
            type: JOB_CLOSE,
            job: {
              id: 1,
              name: 'test job for JOB_CLOSE',
              cmd: 'ls -l',
              cwd: '/tmp'
            },
            code: 15,
            signal: 'SIGTERM'
          }
        )
      ).toMatchSnapshot();
    });

    it('should handle JOB_EXIT', () => {
      expect(
        jobs(
          {
            ids: [1],
            entities: {
              1: {
                id: 1,
                name: 'test job for JOB_EXIT',
                cmd: 'ls -l',
                cwd: '/tmp',
                running: true
              }
            },
            outputs: {
              1: {
                returned: '$ ls -l',
                buffer: ['drwx'],
                cursor: 4
              }
            }
          },
          {
            type: JOB_EXIT,
            job: {
              id: 1,
              name: 'test job for JOB_EXIT',
              cmd: 'ls -l',
              cwd: '/tmp'
            },
            code: 1,
            signal: 'SIGHUP'
          }
        )
      ).toMatchSnapshot();
    });

    it('should handle JOB_ERROR', () => {
      expect(
        jobs(
          {
            ids: [1],
            entities: {
              1: {
                id: 1,
                name: 'test job for JOB_ERROR',
                cmd: 'ls -l',
                cwd: '/tmp',
                running: true
              }
            },
            outputs: {
              1: {
                returned: '$ ls -l',
                buffer: ['drwx'],
                cursor: 4
              }
            }
          },
          {
            type: JOB_ERROR,
            job: {
              id: 1,
              name: 'test job for JOB_ERROR',
              cmd: 'ls -l',
              cwd: '/tmp'
            },
            error: new Error('error on purpose')
          }
        )
      ).toMatchSnapshot();
    });

    it('should handle STOP_JOB', () => {
      expect(
        jobs(
          {
            ids: [1],
            entities: {
              1: {
                id: 1,
                name: 'test job for STOP_JOB',
                cmd: 'ls -l',
                cwd: '/tmp',
                running: true
              }
            },
            outputs: {
              1: {
                returned: '$ ls -l',
                buffer: ['drwx'],
                cursor: 4
              }
            }
          },
          {
            type: STOP_JOB,
            job: {
              id: 1,
              name: 'test job for STOP_JOB',
              cmd: 'ls -l',
              cwd: '/tmp'
            }
          }
        )
      ).toMatchSnapshot();
    });

    it('should handle CLEAR_JOB_OUTPUT', () => {
      expect(
        jobs(
          {
            ids: [1],
            entities: {
              1: {
                id: 1,
                name: 'test job for CLEAR_JOB_OUTPUT',
                cmd: 'ls -l',
                cwd: '/tmp',
                running: true
              }
            },
            outputs: {
              1: {
                returned: '$ ls -l',
                buffer: ['drwx'],
                cursor: 4
              }
            }
          },
          {
            type: CLEAR_JOB_OUTPUT,
            job: {
              id: 1,
              name: 'test job for CLEAR_JOB_OUTPUT',
              cmd: 'ls -l',
              cwd: '/tmp'
            }
          }
        )
      ).toMatchSnapshot();
    });

    it('should handle ACTIVATE_JOB', () => {
      expect(
        jobs(undefined, {
          type: ACTIVATE_JOB,
          job: {
            id: 1
          }
        })
      ).toMatchSnapshot();
    });

    it('should handle unknown action type', () => {
      expect(jobs(undefined, { type: 'unknown' })).toMatchSnapshot();
    });
  });
});
