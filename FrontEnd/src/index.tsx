import React from 'react';
import { render } from 'react-dom';
import './index.css';
import Home from './components/app/App';
import Login from './components/Pages/LoginView/LoginView';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Error404 from './components/Pages/404/404';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';

/**
 * @param theme: this parameter specifies which styles are user for the entire application
 * @param typography: this parameter specifies which font is used for the application
 * @param primary: this parameter specifies what the primary color of the application is.
 * @param secondary: this parameter specifies what the secondary color of the application is.
*/
const theme = createMuiTheme({
  typography: {
    fontFamily: 'Raleway',
  },
  palette: {
      primary: {
          main: '#E07A5F'
      },
      secondary: {
          main: '#136D39'
      }
  }
});
/**
 * The app class specifies the router, thus which page url links to which page
*/
class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route component={Error404} />
            </Switch>
        </Router>
      </MuiThemeProvider>
    );
  }
}
/**
 * The render functoin renders the app to the root DOM element with id root.
*/
render(<App />, document.getElementById('root'));

export default App;
