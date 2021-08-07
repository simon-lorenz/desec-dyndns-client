const fetch = require('node-fetch')

const { logger } = require('./logger')
const config = require('./config')

let currentIp

async function run() {
	try {
		const publicIPv6 = await getPublicIPv6()

		if (publicIPv6 === currentIp) {
			logger.debug('Public IPv6 did not change')
		} else {
			logger.info(`Found new public IPv6: ${publicIPv6}`)
			currentIp = publicIPv6
			await sendDynDNSUpdateRequest(publicIPv6)
		}
	} catch (err) {
		logger.error({ err }, err.message)
	}
}

async function getPublicIPv6() {
	const { ipCheckUrl } = config

	const res = await fetch(ipCheckUrl)

	if (res.status === 200) {
		return res.text()
	} else {
		throw new Error(`Could not get public IPv6 (${res.status})`)
	}
}

async function sendDynDNSUpdateRequest(ip) {
	const { server, domains, username, token } = config

	const updateUrl = `${server}/?hostname=${domains.join(',')}&myip=${ip}`

	const res = await fetch(updateUrl, {
		method: 'GET',
		headers: { Authorization: `Basic ${Buffer.from(`${username}:${token}`).toString('base64')}` }
	})

	if (res.status === 200) {
		logger.info('DNS-Update successful!')
	} else {
		throw new Error(`DNS-Update failed (${res.status})`)
	}
}

module.exports = { run }
