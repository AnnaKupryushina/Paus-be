import fs from 'fs';
import util from 'util';

import generatePreview from 'ffmpeg-generate-video-preview/lib/index.js';

import BaseController from '../base.controller.js';
import IpfsService from '../../services/ipfs.service.js';
import S3Service from '../../services/s3.service.js';
import UploadService from '../../services/upload.service.js';

const unlinkFile = util.promisify(fs.unlink);

class UploadController extends BaseController {
	async uploadVideo(req, res) {
		this.logger.debug('Start [ Upload Video ] method');

		try {
			const { file } = req;

			const videoS3 = await S3Service.instance().uploadFile(file);

			const previewPath = `public/${file.filename}_preview.gif`;

			await generatePreview({
				input: file.path,
				output: previewPath,
				width: 256,
				numFrames: 5
			});


			const previewS3 = await S3Service.instance().uploadFile({
				filename: `${file.filename}_preview.gif`,
				path: previewPath
			});

			await unlinkFile(file.path);
			await unlinkFile(previewPath);

			res.send({ video: videoS3, preview: previewS3 });
		} catch (error) {
			this.logger.error(error);

			res.status(400).send({ error: error.message });
		}
	}

	async uploadNftMetadata(req, res) {
		this.logger.debug('Start [ Upload NFT Metadata ] method');

		try {
			const { file } = req;

			const fileHash = await IpfsService.instance().uploadImage(file);

			const fileMetadata = JSON.stringify({
				image: fileHash,
				video: req.body.video,
				preview: req.body.preview
			});

			const metadataHash = await IpfsService.instance().uploadMetadata(fileMetadata);

			await unlinkFile(file.path);

			res.status(201).send({ metadataHash });
		} catch (error) {
			this.logger.error(error);

			res.status(400).send({ error: error.message });
		}
	}

	bootstrap() {
		this.addRoute('post', '/video' , this.uploadVideo.bind(this), [UploadService.instance().uploadVideo]);
		this.addRoute('post', '/nftMetadata' , this.uploadNftMetadata.bind(this), [UploadService.instance().uploadImage]);

		this.logger.debug(`The [ ${this.name} ] has been initialized`);
	}
}

let uploadController = null;

export default (() => {
	if (!uploadController) {
		uploadController = new UploadController('UploadController');

		uploadController.bootstrap();
	}

	return uploadController;
})();
