import { Resources, UNDEFINED } from './Resources';
import { StringID } from './StringID';

describe('Resources', () => {
  it('string resources should be defined for all of string IDs', () => {
    for (const id in StringID) {
      const string = Resources.getString(id as StringID);
      expect(string).not.toEqual(UNDEFINED);
    }
  });
});
