import { create } from 'ipfs-http-client';
import fs from 'fs';

import { getLogger } from '../common/logger.js';

let ipfsService = null;

export default (() => {
	/**
	 * Service to upload data to IPFS
	 *
	 */
	class IpfsService {
		constructor() {
			this.logger = getLogger('IpfsService');
			this.client = create();
		}

		/**
		 * Returns the service instance
		 *
		 * @returns {IpfsService}
		 */
		static instance() {
			return ipfsService;
		}

		async uploadImage(file) {
			if (!file || typeof file !== 'object') {
				throw new Error(`Unable to process the image [ ${file} ]`);
			}

			const { path, filename } = file;

			if (!fs.existsSync(path)) {
				throw new Error(`Unable to find the image by path [ ${path} ]`);
			}

			const image = fs.readFileSync(path);

			const filesAdded = await this.client.add(
				{ path: filename, content: image },
				{
					progress: (len) => this.logger.debug(`Uploading file [ ${filename} ] ... ${len} `)
				}
			);

			const fileHash = filesAdded.cid.toString();

			this.logger.debug(`File - [ ${filename} ], Hash - [ ${fileHash} ]`);

			return fileHash;
		}

		async uploadMetadata(file) {
			const metadata = await this.client.add(file);

			return metadata.cid.toString();
		}
	}

	if (!ipfsService) {
		ipfsService = new IpfsService();
	}

	return IpfsService;
})();
