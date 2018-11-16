import path from 'path';
import { sortBy } from 'lodash';
import { fsPromisify } from './promisify';

const readlinkRecursively = async (filePath, depth = 1, MAX_DEPTH = 3) => {
  const target = path.resolve(
    filePath,
    '..',
    await fsPromisify.readlink(filePath)
  );
  if ((await fsPromisify.lstat(target)).isSymbolicLink()) {
    if (depth >= MAX_DEPTH) {
      console.error('max depth for `readlinkRecursively()` reached');
      return target;
    }
    return readlinkRecursively(target, depth + 1, MAX_DEPTH);
  }
  return target;
};

export async function findNpmLinks(dir) {
  const links = [];
  const files = await fsPromisify.readdir(dir, { encoding: 'utf8' });
  await Promise.all(
    files.map(async filename => {
      if (filename.startsWith('.')) {
        return;
      }
      const fileStats = await fsPromisify.lstat(path.join(dir, filename));
      if (fileStats.isSymbolicLink()) {
        links.push({
          packageName: filename,
          link: await readlinkRecursively(path.join(dir, filename))
        });
      } else if (fileStats.isDirectory() && filename.startsWith('@')) {
        const dirWithScope = path.join(dir, filename);
        const filesInScope = await fsPromisify.readdir(dirWithScope, {
          encoding: 'utf8'
        });
        await Promise.all(
          filesInScope.map(async filenameInScope => {
            if (filenameInScope.startsWith('.')) {
              return;
            }
            const fileStatsInScope = await fsPromisify.lstat(
              path.join(dirWithScope, filenameInScope)
            );
            if (fileStatsInScope.isSymbolicLink()) {
              links.push({
                packageName: path.join(filename, filenameInScope),
                link: await readlinkRecursively(
                  path.join(dirWithScope, filenameInScope)
                )
              });
            }
          })
        );
      }
    })
  );
  return sortBy(links, 'packageName');
}
