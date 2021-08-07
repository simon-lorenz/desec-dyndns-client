const fs = require('fs')
const path = require('path')
const joi = require('joi')

const { logger } = require('./logger')

const configPath = path.join(process.cwd(), '/config/config.json')

if (!fs.existsSync(configPath)) {
	logger.fatal({ path: configPath }, 'Could not find config file')
	return process.exit(1)
}

let config

try {
	config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
} catch (error) {
	logger.fatal({ error }, 'Could not parse config file')
	return process.exit(1)
}

const schema = joi.object({
	url: joi.string().required(),
	server: joi.string().required(),
	username: joi.string().required(),
	password: joi.string().required(),
	domains: joi.array().items(joi.string()).min(1).required(),
	cron: joi.string().required()
})

const result = schema.validate(config, { abortEarly: false })

if (result.error) {
	logger.fatal(`Config is invalid: ${result.error.message}`)
	process.exit(1)
}

module.exports = config
