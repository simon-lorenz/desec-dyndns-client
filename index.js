const { CronJob } = require('cron')

const { run } = require('./src/client')
const { logger } = require('./src/logger')
const config = require('./src/config')

const { cron } = config

logger.info(`Initiating cron job with pattern "${cron}"`)

new CronJob(cron, run, null, true, null, null, true)
