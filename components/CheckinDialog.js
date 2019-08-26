import React from 'react';
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider'
import { yellow, cyan, green } from '@material-ui/core/colors';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});


const useStyles = makeStyles(theme => ({
	ticket: {
		padding: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
	css: {
		backgroundColor: cyan[100]
	},
	js: {
		backgroundColor: yellow[500]
	},
	actions: {
		justifyContent: 'center',
		padding: theme.spacing(2),
	},
	checkin: {
		backgroundColor: green[500],
		color: '#fff'
	}
  }))

export default ({
	open = false,
	data,
	handleClose = () => {}
}) => {
	const classes = useStyles()

	const disabled = data && data.event.find(e => e.checked)

	return (<Dialog
		open={open}
		fullWidth={'sm'}
        maxWidth={'sm'}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
		{ data && (<>
			<DialogTitle id="alert-dialog-slide-title">
				{`Check in ${data.first_name} ${data.last_name}`}
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-slide-description">
					{ data.email }
				</DialogContentText>
				{data.event.map(event => (
					<Paper elevation={2} className={classnames(classes.ticket, classes[event.type])}>
						<Typography variant="h5" component="h3">
							{event.release_title} {event.checked ? ' - CHECKED IN' : ''}
						</Typography>
						<Typography component="p"  color="textSecondary">
							{event.reference}
						</Typography>
					</Paper>
				))}
  				<Divider component="hr" />
			</DialogContent>
		</>)}
		<DialogActions className={classes.actions}>
			<Button
				disabled={disabled}
				size="large" variant="contained" onClick={e => handleClose(e, 'checkin', data)} className={classes.checkin}>
				Check In
			</Button>
			<Button variant="text" onClick={handleClose} color="primary">
				Cancel
			</Button>
		</DialogActions>
      </Dialog>)
}