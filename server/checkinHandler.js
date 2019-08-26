const fetch = require('isomorphic-unfetch')
const cssCheckin = process.env.CSS_CHECKIN_SLUG
const jsCheckin = process.env.JS_CHECKIN_SLUG

module.exports.get = async (req, res) => {

	// if (!token) {
	// 	res.sendStatus(403)
	// 	return
	// }

	try {

		const data = await Promise.all([
			fetch(
				`https://checkin.tito.io/checkin_lists/${jsCheckin}/checkins`
			).then(raw => raw.json()),
			fetch(
				`https://checkin.tito.io/checkin_lists/${cssCheckin}/checkins`
			).then(raw => raw.json()),
		])

		res.send(data)
	} catch (e) {
		res.sendStatus(403)
	}
}

module.exports.post = async (req, res) => {
	try {


		res.send('OK')
	} catch (e) {
		console.error(e);

		res.status(403)
		res.send(e.message)
	}
}

