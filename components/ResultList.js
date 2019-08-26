import React from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import Chip from '@material-ui/core/Chip'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper';
import { yellow, cyan } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(8),
    marginRight: theme.spacing(8),
  },
  chip: {
    marginTop: theme.spacing(1),
    marginRight:theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  warning: {
    margin: theme.spacing(10),
  },
  css: {
    backgroundColor: cyan[100],
    color: theme.palette.getContrastText(cyan[100]),
	},
	js: {
    backgroundColor: yellow[500],
    color: theme.palette.getContrastText(yellow[500]),
  },
  avatar: {
    backgroundColor: '#000',
    color: '#fff',
    marginRight:theme.spacing(1),
  },
  checked: {
    opacity: .3
  }
}))

const ResultList = ({ list, onSelect }) => {
  const classes = useStyles()

  if (list.length > 10) {
    return (<Paper elevation={0} className={classes.warning}>
      <Typography variant="h5" component="h3">
        {`${list.length} tickets found`}
      </Typography>
      <Typography component="p"  color="textSecondary">
        Narrow your search please
      </Typography>
    </Paper>)
  }

  return (<List className={classes.root}>
    { list.map(item => (<React.Fragment key={ item.event.map(e => e.id).join('-') }>
      <ListItem
        alignItems="flex-start"
        button
        onClick={ () => onSelect(item) }
      >
        <ListItemText
          primary={
            <Typography
              variant="h5"
              color="textPrimary"
            >
              {`${item.first_name} ${item.last_name}`}
            </Typography>

          }
          disableTypography
          secondary={
            <>
            {item.event.map((event) => (
              <Chip
                key={`${event.id}`}
                size="small"
                label={`${event.release_title}${ event.checked ? ' - CHECKED IN' : '' }`}
                className={classnames(classes.chip, classes[event.type])}
                color={ event.type === 'js' ? "primary" : "secondary"}
              />
            ))}
            </>
          }
        />
      </ListItem>
      <Divider component="li" />
    </React.Fragment>)
    )}
    </List>)
}

export default ResultList
