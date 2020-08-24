import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Route, BrowserRouter, Redirect } from 'react-router-dom';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Navigation from './components/Navigation';
import HomePage from './components/home/HomePage';
import AddIngredientPage from './components/ingredients/AddIngredientPage';
import EditIngredientPage from './components/ingredients/EditIngredientPage';
import DeleteIngredientPage from './components/ingredients/DeleteIngredientPage';
import IngredientsPage from './components/ingredients/IngredientsPage';
import ShowIngredientPage from './components/ingredients/ShowIngredientPage';
import WinesPage from './components/wines/WinesPage';
import ShowWinePage from './components/wines/ShowWinePage';
import AddWinePage from './components/wines/AddWinePage';
import EditWinePage from './components/wines/EditWinePage';
import DeleteWinePage from './components/wines/DeleteWinePage';
import SettingsPage from './components/settings/SettingsPage';
import { fetchSettings } from './actions/settings';
import './App.css';

const useStyles = makeStyles({
  App: (props) => ({
    textAlign: 'center',
    minHeight: '100vh',
    minWidth: '99vw',
    margin: 'auto',
    paddingTop: '5vh',
    backgroundColor: props.bgcolor,
  }),
  content: {
    minHeight: '70vh',
  },
});

const themeObject = {
  palette: {
    primary: {
      main: '#bf360c',
    },
    secondary: {
      main: '#424242',
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
  const [redirect, setRedirect] = useState(null);
  const [redirected, setRedirected] = useState(false);
  useEffect(() => {
    if (props.user.token) {
      props.fetchSettings(props.user.token);
    }
    window.addEventListener('keyup', (event) => {
      if (event.key === 'F1') {
        setRedirect('/wines/new');
        setRedirected(true);
      }
      if (event.key === 'F2') {
        setRedirect('/ingredients/new');
        setRedirected(true);
      }
    });
  }, []); //eslint-disable-line
  const theme = useDarkMode(props.settings.darkMode);
  const themeConfig = createMuiTheme(theme);
  const classes = useStyles({
    bgcolor: themeConfig.palette.background.default,
  });
  if (redirected) {
    setRedirected(false);
    setRedirect(null);
  }

  return (
    <ThemeProvider theme={themeConfig}>
      <div className={classes.App}>
        <Container>
          <BrowserRouter>
            {redirect ? <Redirect to={redirect} /> : ''}
            <Navigation />
            <Paper
              className={classes.content}
              style={{ margin: 10, paddingBottom: 10 }}
              square
              elevation={3}
            >
              {props.user.token != null ? (
                <Box>
                  <Route exact path="/" component={HomePage} />
                  <Route
                    exact
                    path="/ingredients"
                    component={IngredientsPage}
                  />
                  <Route
                    exact
                    path="/ingredients/:id/show"
                    component={ShowIngredientPage}
                  />
                  <Route
                    exact
                    path="/ingredients/new"
                    component={AddIngredientPage}
                  />
                  <Route
                    exact
                    path="/ingredients/:id/edit"
                    component={EditIngredientPage}
                  />
                  <Route
                    exact
                    path="/ingredients/:id/delete"
                    component={DeleteIngredientPage}
                  />
                  <Route exact path="/wines" component={WinesPage} />
                  <Route
                    exact
                    path="/wines/:id/show"
                    component={ShowWinePage}
                  />
                  <Route exact path="/wines/new" component={AddWinePage} />
                  <Route
                    exact
                    path="/wines/:id/edit"
                    component={EditWinePage}
                  />
                  <Route
                    exact
                    path="/wines/:id/delete"
                    component={DeleteWinePage}
                  />
                  <Route exact path="/settings" component={SettingsPage} />
                </Box>
              ) : (
                <Redirect to="/" />
              )}
            </Paper>
          </BrowserRouter>
        </Container>
      </div>
    </ThemeProvider>
  );
}
const mapStateToProps = (state) => ({
  settings: state.settings,
  user: state.user,
});
const mapDispatchToProps = (dispatch) => ({
  fetchSettings: (token) => dispatch(fetchSettings(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
