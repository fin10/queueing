import { Logger } from '../utils/Logger';
import { StringID } from './StringID';

const stringResources: { [key: string]: { [key: string]: string } } = {
  'ko-KR': require('./ko-KR/strings.json'),
};

export const UNDEFINED = 'UNDEFINED';

export const Resources = {
  getString: (id: StringID, language = 'ko-KR'): string => {
    try {
      const strings = stringResources[language];
      if (!strings) throw new Error(`'${language}' does not supported.`);

      const string = strings[id];
      if (!string) throw new Error(`string not found with ${id}`);

      return string;
    } catch (err) {
      Logger.error(err);
      return UNDEFINED;
    }
  },
};
