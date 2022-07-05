import 'dotenv/config';

import server from './src/server/Server.js';

import uploadController from './src/controllers/upload/upload.controller.js';
import watchController from './src/controllers/watch/watch.controller.js';

server.addController('/watch', watchController);
server.addController('/upload', uploadController);
server.addMiddleware(function (req, res, next) {
	return res.status(404).json({
		error: 'Not found'
	});
});

server.start();
