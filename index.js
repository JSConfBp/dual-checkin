const name = 'Test Checkin list'
const slug = 'p4KavnVadFjfFLA2wkj2kXA'


if(process.env.NODE_ENV !== "production") {
	require('dotenv').config()
}

const uuid = require('uuid/v4')

process.env.NONCE = uuid()

const server = require('./server')
const routing = require('./routing')
const config = require('./next.config')

server(routing, config)

/*
	- app betolt
	- lehuzza a listakat, css/js
	- lehuzza a chekineket
	- mezo megjelenik

	- mezobe irunk
	- first name vagy last name vagy ticket reference
	- keresni a jegyek kozott
	- listazni a talalatokat
	- jelezve hogy melyk esemeny

	- kattinva modalban a jegy info
	- checkinelt e mar
	- chekcin (ha meg nem) / cancel

	- checkin eseten a megfelelo konf fele elkuldi az adatot
	- updatelni a chekineket
	- alap UI allapotra vissza

*/


// EZ ADJA A TARTALMAT
// https://checkin.tito.io/checkin_lists/p4KavnVadFjfFLA2wkj2kXA/tickets

/*
[
	{
===>>>  "id": 3903473,
        "slug": "pGS1keaD8htcjhdPIN1vCLg",
        "first_name": "Oliver",
        "last_name": "Goossens",
        "email": "oliver.goossens@gmail.com",
        "phone_number": null,
        "company_name": "inMotionMedia s.r.o.",
        "release_title": "Early Bird JS Ticket",
        "reference": "PQEU-1",
        "registration_reference": "PQEU",
        "tags": null,
        "created_at": "2018-12-03T09:05:01.000Z",
        "updated_at": "2018-12-03T09:06:04.000Z"
	}
	...
	...
]
*/

// EZ ADJA HOGY KI CHECKINELT BE EDDIG
// https://checkin.tito.io/checkin_lists/p4KavnVadFjfFLA2wkj2kXA/checkins

/*
[
    {
        "id": 1791997,
        "uuid": "0cce5075-e1b8-42ff-aae7-ce67c4580541",
        "created_at": "2019-08-25T06:37:09.000Z",
        "updated_at": "2019-08-25T06:37:09.000Z",
===>>>  "ticket_id": 3903473,
        "deleted_at": null
	}
	...
]
*/

// uj checkin
// POST https://checkin.tito.io/checkin_lists/:checkin_list_slug/checkins

/*

curl --request POST \
  --url 'https://checkin.tito.io/checkin_lists/:checkin_list_slug/checkins' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"checkin":{"ticket_id":111111}}'

*/