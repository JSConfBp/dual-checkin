import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

const useStyles = makeStyles(theme => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}))

const Form = ({ onSearch, emptyData }) => {
  const classes = useStyles()
  const [search, updateSearch] = useState(emptyData)
  const update = (field, value) => {
    const newData = Object.assign({}, search, {
      [field]: value
    })

    updateSearch(newData);
    onSearch(newData)
  }

  useEffect(() => {

    updateSearch(emptyData)

    return () => {}
  }, [emptyData])

  return (
    <div className={classes.paper}>
      <form className={classes.form} noValidate>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
          spacing={2}
        >
          <Grid item xs={5}>
            <TextField
              autoComplete="first_name"
              name="first_name"
              variant="outlined"
              value={ emptyData.first_name }
              fullWidth
              id="first_name"
              label="First Name"
              autoFocus
              onChange={ e => update('first_name', e.target.value) }
            />
          </Grid>

          <Grid item xs={5}>
            <TextField
              variant="outlined"
              fullWidth
              value={ emptyData.last_name }
              id="last_name"
              label="Last Name"
              name="last_name"
              autoComplete="last_name"
              onChange={ e => update('last_name', e.target.value) }
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              variant="outlined"
              fullWidth
              id="reference"
              label="Ticket Reference (ABCD-1)"
              name="reference"
              autoComplete="reference"
              onChange={ e => update('reference', e.target.value) }
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              variant="outlined"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              onChange={ e => update('email', e.target.value) }
            />
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default Form
