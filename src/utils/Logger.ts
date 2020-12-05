import bunyan from 'bunyan';

const logger = bunyan.createLogger({
  name: 'queueing',
});

export default logger;
