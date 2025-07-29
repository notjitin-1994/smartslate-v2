import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontSize: '3.052rem',
    },
    h2: {
      fontSize: '2.441rem',
    },
    h3: {
      fontSize: '1.953rem',
    },
    h4: {
      fontSize: '1.563rem',
    },
    h5: {
      fontSize: '1.25rem',
    },
    body1: {
      fontSize: '1rem',
    },
    caption: {
      fontSize: '0.8rem',
    },
  },
});

export default theme;