const logger = require('pino')({
	level: process.env.LOG_LEVEL || 'info',
	prettyPrint: {
		translateTime: true,
		ignore: 'pid,hostname'
	}
})

module.exports = { logger }
