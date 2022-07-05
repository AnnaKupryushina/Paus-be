import BaseController from '../base.controller.js';
import S3Service from '../../services/s3.service.js';
import UploadService from '../../services/upload.service.js';

class WatchController extends BaseController {
	async watch(req, res) {
		this.logger.debug('Start [ Watch ] method');

		try {
			const key = req.params.key;

			const readStream = S3Service.instance().getReadStream(key);

			readStream.pipe(res);
		} catch (error) {
			this.logger.error(error);

			res.status(400).send({ message: 'Unable to find film with such ID' });
		}
	}

	bootstrap() {
		this.addRoute('get', '/:key' , this.watch.bind(this), [UploadService.instance().uploadVideo]);

		this.logger.debug(`The [ ${this.name} ] has been initialized`);
	}
}

let watchController = null;

export default (() => {
	if (!watchController) {
		watchController = new WatchController('WatchController');

		watchController.bootstrap();
	}

	return watchController;
})();
