const fs = require('fs')
const joi = require('joi')
const { stripComments } = require('jsonc-parser')

const { logger } = require('./logger')

const configPath = '/etc/desec-dyndns-client/config'

if (!fs.existsSync(configPath)) {
	logger.fatal({ path: configPath }, 'Could not find config file')
	return process.exit(1)
}

let config

try {
	config = JSON.parse(stripComments(fs.readFileSync(configPath, 'utf8')))
} catch (err) {
	logger.fatal({ err }, 'Could not parse config file')
	return process.exit(1)
}

const schema = joi.object({
	ipCheckUrl: joi.string().required(),
	server: joi.string().required(),
	username: joi.string().required(),
	token: joi.string().required(),
	domains: joi.array().items(joi.string()).min(1).required(),
	cron: joi.string().required()
})

const result = schema.validate(config, { abortEarly: false })

if (result.error) {
	logger.fatal(`Config is invalid: ${result.error.message}`)
	process.exit(1)
}

module.exports = config
