import express from 'express';
import { Logger } from './utils';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  Logger.info(`Queuing Service listening on ${port}`);
});
