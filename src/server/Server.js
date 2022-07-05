import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import config from '../config/index.js';
import { getLogger } from '../common/logger.js';


class Server {
	constructor() {
		this.app = express();
		this.server = null;
		this._port = config.server.port;
		this._isStarted = false;
		this.logger = getLogger('server');

		this.logger.debug('Bootstrapping the server...');
		this.app.use(cors());
		this.app.options('*', cors());
		this.app.use(json());
		this.app.use(urlencoded({ extended: false }));
		this.app.use(cookieParser());
		this.app.use(express.static('public'));
	}

	/**
	 * Attaches a controller to the server
	 *
	 * @param {String} route - an url for the controller
	 * @param {BaseController} controller - a controller that will handle requests
	 */
	addController(route, controller) {
		this.logger.debug('Adding a new controller');
		this.app.use(route, controller.router);
		this.logger.info(`The new [ ${controller.name} ] controller has been added to the route [ ${route} ]`);
	}

	addMiddleware(middleware) {
		this.logger.debug('Adding a new middleware');
		this.app.use(middleware);
		this.logger.info('The new middleware has been added');
	}

	start() {
		this.logger.info('Starting the server');

		if (this._isStarted) {
			this.logger.error('Unable to start the server. The server is already running.');

			return;
		}

		this.server = this.app.listen(this._port, () => {
			this.logger.info(`The server has been started on the [ ${this._port} ] port`);
		});
	}
}

let server = null;

export default (() => {
	if (!server) {
		server = new Server();
	}

	return server;
})();
