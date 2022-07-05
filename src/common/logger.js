import log4js from 'log4js';

import config from'../config/index.js';

import log4jsConfig from '../../log4js.config.js';

log4js.configure(log4jsConfig);

export const getLogger = (category) => {
	const logger = log4js.getLogger(category);

	logger.level = config.logger.debug ? log4js.levels.TRACE : log4js.levels.INFO;

	return logger;
};
