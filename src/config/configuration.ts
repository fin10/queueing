import { InternalServerErrorException } from '@nestjs/common';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (): any => {
  const configFilePath = path.resolve('config.yml');
  if (!fs.existsSync(configFilePath)) throw new InternalServerErrorException('config.yml should exists.');

  return yaml.load(fs.readFileSync(configFilePath, 'utf-8'));
};
