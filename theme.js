import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import { blue, orange, blueGrey } from '@material-ui/core/colors';


// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[700]
    },
    secondary: {
      main: orange[600]
    },
    error: {
      main: red[400],
    },
    background: {
      default: '#fdfdfd'
    },
  },
});

export default theme;
