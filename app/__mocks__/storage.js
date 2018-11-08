const storeMap = new Map();

// eslint-disable-next-line no-underscore-dangle
const __reset = () => {
  storeMap.clear();
  storeMap.set('jobs', [
    {
      id: 1,
      name: 'existed test job',
      cmd: 'whoami',
      cwd: '/home/root'
    }
  ]);
};

__reset();

const storage = {
  get: (key, defaults) => (storeMap.has(key) ? storeMap.get(key) : defaults),
  set: (key, value) => {
    storeMap.set(key, value);
  },
  __reset
};

export default storage;
