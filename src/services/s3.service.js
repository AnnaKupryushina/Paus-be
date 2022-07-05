import fs from 'fs';
import S3 from 'aws-sdk/clients/s3.js';

import config from '../config/index.js';
import { getLogger } from '../common/logger.js';

let s3Service = null;

export default (() => {
	class S3Service {
		constructor() {
			this.logger = getLogger('S3Service');
			this._bucket = config.aws.s3.bucket;

			this._client = new S3({
				region: config.aws.region,
				accessKeyId: config.aws.access,
				secretAccessKey: config.aws.secret
			});
		}

		static instance() {
			return s3Service;
		}

		uploadFile(file) {
			const fileStream = fs.createReadStream(file.path);

			const uploadParams = {
				Bucket: this._bucket,
				Body: fileStream,
				Key: file.filename
			};

			return this._client.upload(uploadParams).promise();
		}

		getReadStream(fileKey) {
			const downloadParams = {
				Key: fileKey,
				Bucket: this._bucket
			};

			const fileObject = this._client.getObject(downloadParams);

			return fileObject.createReadStream().on('error', (error) => {
				this.logger.error(error);
			});
		}
	}

	if (!s3Service) {
		s3Service = new S3Service();
	}

	return S3Service;
})();
