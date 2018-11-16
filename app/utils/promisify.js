import fs from 'fs';

const promisify = (object, method) => (...args) =>
  new Promise((resolve, reject) => {
    object[method](...args, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

export const fsPromisify = ['readdir', 'stat', 'lstat', 'readlink'].reduce(
  (acc, method) => {
    acc[method] = promisify(fs, method);
    return acc;
  },
  {}
);
