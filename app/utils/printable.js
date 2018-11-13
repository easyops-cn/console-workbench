import { forEach } from 'lodash';

export default function printable(
  previous = {
    returned: undefined,
    buffer: [],
    cursor: 0
  },
  log = ''
) {
  let { returned, buffer, cursor } = previous;
  let bufferCopy = buffer.slice();
  forEach(log, chr => {
    if (chr === '\x08') {
      if (cursor > 0) {
        cursor -= 1;
      }
    } else {
      bufferCopy[cursor] = chr;
      cursor += 1;
    }
  });
  const separate = bufferCopy.lastIndexOf('\n');
  if (separate !== -1) {
    if (returned === undefined) {
      returned = '';
    } else {
      returned += '\n';
    }
    returned += bufferCopy.slice(0, separate).join('');
    bufferCopy = bufferCopy.slice(separate + 1);
    cursor -= separate + 1;
    // Keep only last 65535 characters
    returned = returned.substr(-65535, 65535);
  }
  return {
    returned,
    buffer: bufferCopy,
    cursor
  };
}
