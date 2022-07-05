/**
 * Configuration object
 *
 * @param {Object} logger - logger configurations
 * @param {Boolean} logger.debug - debug mode for the logger
 * @param {Object} server - the server configurations
 * @param {String} server.host - the url of the server
 * @param {Number} server.port - the port of the server
 * @param {Object} aws - the aws configuration
 * @param {String} aws.region - the aws region
 * @param {String} aws.s3 - the aws s3 configurations
 * @param {String} aws.s3.bucket - the aws s3 bucket name
 * @param {String} aws.secret - the aws secret key
 * @param {String} aws.access - the aws access key
 */
export default {
	logger: {
		debug: !!process.env.DEBUG
	},
	server: {
		host: process.env.APP_HOST || 'localhost',
		port: +process.env.APP_PORT || 8080
	},
	aws: {
		region: process.env.AWS_REGION,
		s3: {
			bucket: process.env.AWS_BUCKET_NAME
		},
		secret: process.env.AWS_SECRET_KEY,
		access: process.env.AWS_ACCESS_KEY
	}
};
