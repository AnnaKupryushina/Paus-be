import express from 'express';
import { getLogger } from '../common/logger.js';

const METHODS = ['get', 'post'];

const checkMethods = (method) => {
	if (!METHODS.includes(method)) {
		this.logger.error(`Method [ ${method} is not supported ]`);

		return false;
	}

	return true;
};

export default class BaseController {
	constructor(name) {
		this.name = name;
		this.logger = getLogger(name);
		this._router = express.Router();
	}

	get router() {
		return this._router;
	}

	addRoute(method, url, handler, middlewares = []) {
		if (!checkMethods.call(this, method)) {
			return;
		}

		this._router[method](url, ...middlewares, handler);

		this.logger.debug(`Added new [ ${method} ] method to the [ ${this.name} controller ]`);
	}

	bootstrap() {
		return new Error('This method is not implemented');
	}
}
