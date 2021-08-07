const fetch = require('node-fetch')
const { CronJob } = require('cron')

const { logger } = require('./logger')
const config = require('./config')

const { cron } = config

logger.info(`Initiating cron job with pattern "${cron}"`)

new CronJob(cron, run, null, true, null, null, true)

let currentIp = null

async function run() {
	try {
		const publicIPv6 = await getPublicIPv6()

		if (publicIPv6 === currentIp) {
			logger.debug('Public IPv6 did not change')
		} else {
			logger.info(`Found new public IPv6: ${publicIPv6}`)
			currentIp = publicIPv6
			sendDynDNSUpdateRequest(publicIPv6)
		}
	} catch (err) {
		logger.error({ err }, err.message)
	}
}

async function getPublicIPv6() {
	const { url } = config

	const res = await fetch(url)

	if (res.status === 200) {
		return res.text()
	} else {
		throw new Error(`Could not get public IPv6 (${res.status})`)
	}
}

async function sendDynDNSUpdateRequest(ip) {
	const { server, domains, username, password } = config

	const updateUrl = `${server}/?hostname=${domains.join(',')}&myip=${ip}`

	await fetch(updateUrl, {
		method: 'GET',
		headers: { Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}` }
	})

	logger.info('DNS-Update successful!')
}
