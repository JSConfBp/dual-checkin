
const findTicket = (ticket, bool, [searchField, searchValue]) => {
	if (!searchValue) return bool
	if (!ticket[searchField]) return false

	if (ticket[searchField] && typeof ticket[searchField] === 'string') {
		const result = ticket[searchField].toLowerCase().startsWith(searchValue.toLowerCase());

		if (bool === null) {
			return result
		}

		return bool && result
	}

	return bool
}

export default (searchData, jsTickets, cssTickets) => {
	const jsResult = jsTickets.filter(ticket => {
		return Object.entries(searchData).reduce((...args) => {
			return findTicket(ticket, ...args)
		}, null)
	})
	.filter(ticket => (!ticket.release_title.includes('Combo')))
	.map(ticket => {
		ticket.type = 'js'
		return ticket
	})

	const cssResult = cssTickets.filter(ticket => {
		return Object.entries(searchData).reduce((...args) => {
			return findTicket(ticket, ...args)
		}, null)
	})
	.filter(ticket => (!ticket.release_title.includes('Combo')))
	.map(ticket => {
		ticket.type = 'css'
		return ticket
	})

	const result = [...jsResult, ...cssResult].map(ticket => {
		const {
			id,
			first_name,
			last_name,
			reference,
			email,
			registration_reference,
			type,
			release_title,
		} = ticket;

		return {
			first_name,
			last_name,
			email,
			registration_reference,
			event: [{
				id,
				type,
				release_title,
				reference
			}],
		}
	}).reduce((arr, ticket) => {
		const index = arr.findIndex((res) => {
			return (res.first_name === ticket.first_name) && (res.last_name === ticket.last_name);
		})

		if (index > -1) {
			arr[index].event.push(...ticket.event)
			return arr
		}

		arr.push(ticket)

		return arr
	}, [])

	return result;
}