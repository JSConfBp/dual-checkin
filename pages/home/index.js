import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import fetch from 'isomorphic-unfetch'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import ErrorIcon from '@material-ui/icons/Error';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';


import Header from '../../components/Header'
import Form from '../../components/Form'
import ResultList from '../../components/ResultList'
import findTickets from './findTickets'
import CheckinDialog from '../../components/CheckinDialog'

const cssCheckin = process.env.CSS_CHECKIN_SLUG
const jsCheckin = process.env.JS_CHECKIN_SLUG

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
}))

const markAsChecked = (tickets, checkins) => {
  checkins.map(c => {
    tickets
      .filter(t => (c.ticket_id === t.id))
      .map(t => {
        t.checked = true
        return t
      })
  })

  return tickets
}

const IndexPage = ({ jsTickets, cssTickets }) => {

  const [ token, setToken ] = useState('');
  const [result, setResult] = useState([])
  const [searchData, updateSearchData] = useState({
    first_name: '',
    last_name: '',
    reference: '',
    email: '',
  })
  const [dialogProps, setDialogProps] = useState({
    open: false,
    data: null
  })
  const [ errorNotification, setErrorNotification ] = useState(false);

	const closeErrorNotification = () => {
		setErrorNotification(false)
	}

	useEffect(() => {
		const rawToken = (new URL(window.location.href)).searchParams.get('token')

		if (rawToken) {
			setToken(rawToken)
		}

		return () => {}
	})

  const reset = () => {
    updateSearchData({
      first_name: '',
      last_name: '',
      reference: '',
      email: '',
    })
    setResult([])
  }

  const search = (data) => {
    const searchResult = findTickets(data, jsTickets, cssTickets)
    updateSearchData(data)
    setResult(searchResult)
  }

  const select = (data) => {
    setDialogProps(Object.assign({}, dialogProps, {
      open: true,
      data
    }))
  }

  const closeDialog = async (event, type, data) => {
    setDialogProps(Object.assign({}, dialogProps, {
      open: false,
      data: null
    }))

    if (type === 'checkin') {
      const tickets = data.event.reduce((obj, event) => {
        if (event.type === 'js') {
          obj.jsTicketId = event.id
        }
        if (event.type === 'css') {
          obj.cssTicketId = event.id
        }
        return obj
      }, {})

      const xhr = await fetch('/api/checkin', {
        method: 'post',
        headers: {
          token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(tickets),
      })

      if (xhr.status >= 400) {
        setErrorNotification(true)
        return;
      }

      const checkins = await xhr.json()

      markAsChecked(jsTickets, checkins.js)
      markAsChecked(cssTickets, checkins.css)

      reset()
    }
  }

  return (
    <>
      <CssBaseline />
      <Header />
      <Container component="main" maxWidth="md">
        <Form
          onSearch={ data => search(data) }
          emptyData={ searchData }
        />
        <ResultList
          list={ result }
          onSelect={ entry => select(entry) }
        />
      </Container>
      <CheckinDialog {...dialogProps} handleClose={(...args) => closeDialog(...args)} />
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={ errorNotification }
        autoHideDuration={5000}
        onClose={closeErrorNotification}
      >
		<SnackbarContent
			aria-describedby="client-snackbar"
			message={
          <span id="client-snackbar">
            <ErrorIcon />
            Could not save check in!
          </span>
        }
    	/>
	  </Snackbar>
    </>
  )
}

const getTickets = async (id) => {
  const data = await fetch(
    `https://checkin.tito.io/checkin_lists/${id}/tickets`,
    {
      mode: 'no-cors',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    }
  )
  return await data.json();
}


const getCheckins = async (id) => {
  const data = await fetch(
    `https://checkin.tito.io/checkin_lists/${id}/checkins`,
    {
      mode: 'no-cors',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    }
  )
  return await data.json();
}


IndexPage.getInitialProps = async ({req, res}) => {

  if (
		!process.browser
		&& process.env.ADMIN_TOKEN
		&& process.env.ADMIN_TOKEN !== req.query.token
	) {
		res.status(401).send()
		return
  }

  const jsTickets = await getTickets(jsCheckin)
  const cssTickets = await getTickets(cssCheckin)

  const jsCheckins = await getCheckins(jsCheckin)
  const cssCheckins = await getCheckins(cssCheckin)

  return {
    jsTickets: markAsChecked(jsTickets, jsCheckins),
    cssTickets: markAsChecked(cssTickets, cssCheckins),
  }
}

export default IndexPage
