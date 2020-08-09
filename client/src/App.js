import React from 'react';
import { connect } from 'react-redux';
import { Route, BrowserRouter } from 'react-router-dom';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import './App.css';
import { mergeClasses } from '@material-ui/styles';

const useStyles = makeStyles({
  App: (props) => ({
    textAlign: 'center',
    minHeight: '100vh',
    minWidth: '99vw',
    margin: 'auto',
    paddingTop: '5vh',
    backgroundColor: props.bgcolor,
  }),
});

const themeObject = {
  palette: {
    primary: {
      main: '#81c784',
    },
    secondary: {
      main: '#ff8a80',
    },
    type: 'light',
  },
};

function useDarkMode(toggled) {
  const theme = themeObject;
  const updatedTheme = {
    ...theme,
    palette: {
      ...theme.palette,
      type: toggled ? 'dark' : 'light',
    },
  };
  return updatedTheme;
}
function App(props) {
  console.log(props);
  const theme = useDarkMode(props.settings.darkMode);
  const themeConfig = createMuiTheme(theme);
  const classes = useStyles({
    bgcolor: themeConfig.palette.background.default,
  });
  return (
    <ThemeProvider theme={themeConfig}>
      <div className={classes.App}></div>
    </ThemeProvider>
  );
}
const mapStateToProps = (state) => ({
  settings: state.settings,
});

export default connect(mapStateToProps)(App);
