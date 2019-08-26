const fetch = require('isomorphic-unfetch')
const cssCheckin = process.env.CSS_CHECKIN_SLUG
const jsCheckin = process.env.JS_CHECKIN_SLUG

const responseHandler = async (res) => {
	console.log(res.status);

	if (res.status >= 400) {
		throw new Error(`API request came back with ${res.status}`)
	}

	return res
}

const getCheckins = async () => {
	const [js,css] = await Promise.all([
		fetch(
			`https://checkin.tito.io/checkin_lists/${jsCheckin}/checkins`
		).then(responseHandler).then(raw => raw.json()),
		fetch(
			`https://checkin.tito.io/checkin_lists/${cssCheckin}/checkins`
		).then(responseHandler).then(raw => raw.json()),
	])

	return {
		js,
		css
	}
}

const postCheckins = async (jsTicket, cssTicket) => {
	const requests = []

console.log(jsTicket, cssTicket);


	if (jsTicket) {
		requests.push(fetch(
			`https://checkin.tito.io/checkin_lists/${jsCheckin}/checkins`,
			{
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					checkin: {
						ticket_id: jsTicket
					}
				})
			}
		).then(responseHandler))
	}

	if (cssTicket) {
		requests.push(fetch(
			`https://checkin.tito.io/checkin_lists/${cssCheckin}/checkins`,
			{
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					checkin: {
						ticket_id: cssTicket
					}
				})
			}
		).then(responseHandler))
	}
	return await Promise.all(requests)
}

module.exports.get = async (req, res) => {
	try {
		const checkins = await getCheckins()
		res.send(checkins)
	} catch (e) {
		res.sendStatus(403)
	}
}

module.exports.post = async (req, res) => {
	try {
		const {
			jsTicketId = '',
			cssTicketId = ''
		} = req.body || {}

		await postCheckins(jsTicketId, cssTicketId)
		const checkins = await getCheckins()
		res.send(checkins)
	} catch (e) {
		console.error(e);

		res.status(400)
		res.send(e.message)
	}
}

