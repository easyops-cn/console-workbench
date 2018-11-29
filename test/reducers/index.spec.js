/* eslint-disable import/first */
jest.mock('../../app/storage');

import rootReducers from '../../app/reducers';

describe('reducers', () => {
  describe('root', () => {
    it('should handle initial state', () => {
      expect(
        rootReducers({
          location: '/'
        })(undefined, {})
      ).toMatchSnapshot();
    });
  });
});
