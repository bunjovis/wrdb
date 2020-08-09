import React from 'react';
import { connect } from 'react-redux';
import { Route, BrowserRouter } from 'react-router-dom';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Navigation from './components/Navigation';
import HomePage from './components/home/HomePage';
import AddIngredientPage from './components/ingredients/AddIngredientPage';
import EditIngredientPage from './components/ingredients/EditIngredientPage';
import DeleteIngredientPage from './components/ingredients/DeleteIngredientPage';
import IngredientsPage from './components/ingredients/IngredientsPage';
import ShowIngredientPage from './components/ingredients/ShowIngredientPage';
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
  console.log(props);
  const theme = useDarkMode(props.settings.darkMode);
  const themeConfig = createMuiTheme(theme);
  const classes = useStyles({
    bgcolor: themeConfig.palette.background.default,
  });
  return (
    <ThemeProvider theme={themeConfig}>
      <div className={classes.App}>
        <Container>
          <BrowserRouter>
            <Navigation />
            <Paper
              className={classes.content}
              style={{ margin: 10, paddingBottom: 10 }}
              square
              elevation={3}
            >
              <Route exact path="/" component={HomePage} />
              <Route exact path="/ingredients" component={IngredientsPage} />

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
            </Paper>
          </BrowserRouter>
        </Container>
      </div>
    </ThemeProvider>
  );
}
const mapStateToProps = (state) => ({
  settings: state.settings,
});

export default connect(mapStateToProps)(App);
