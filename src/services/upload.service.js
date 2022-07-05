import multer from 'multer';
import path from 'path';

import { getLogger } from '../common/logger.js';

const MB = 1048576;

let uploadService = null;

export default (() => {
	class UploadService {
		constructor() {
			this.logger = getLogger('UploadService');

			this.videoStorage = multer.diskStorage({
				destination: 'public',
				filename: (req, file, cb) => {
					cb(
						null,
						file.fieldname + '_' + Date.now() + path.extname(file.originalname)
					);
				}
			});

			this.imageStorage = multer.diskStorage({
				destination: 'public',
				filename: (req, file, cb) => {
					cb(
						null,
						file.fieldname + '_' + Date.now() + path.extname(file.originalname)
					);
				}
			});

			this.uploadVideo =  multer({
				storage: this.videoStorage,
				limits: {
					fileSize: 100 * MB
				},
				fileFilter(req, file, cb) {
					if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
						return cb(new Error('Please upload a video'));
					}
					cb(undefined, true);
				}
			}).single('video');

			this.uploadImage = multer({
				storage: this.imageStorage,
				limits: {
					fileSize: 10 * MB
				},
				fileFilter(req, file, cb) {
					if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
						return cb(new Error('Please upload an image'));
					}
					cb(undefined, true);
				}
			}).single('image');
		}

		static instance() {
			return uploadService;
		}

	}

	if (!uploadService) {
		uploadService = new UploadService();
	}

	return UploadService;
})();
