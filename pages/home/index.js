import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import fetch from 'isomorphic-unfetch'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'

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

const IndexPage = ({ jsTickets, cssTickets }) => {
  // console.log(jsTickets, cssTickets);
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

  const closeDialog = (event, type, data) => {
    console.log(type, data);

    setDialogProps(Object.assign({}, dialogProps, {
      open: false,
      data: null
    }))

    if (type === 'checkin') {
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

IndexPage.getInitialProps = async () => {
  const jsTickets = await getTickets(jsCheckin)
  const cssTickets = await getTickets(cssCheckin)

  return {
    jsTickets,
    cssTickets
  }
}

export default IndexPage
