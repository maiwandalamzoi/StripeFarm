/* External imports */
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

/* Libraries */
import { Redirect } from 'react-router';

/* Local imports */
import Login from './Components/Login';
import ForgotPassword from './Components/ForgotPassword';
import SignUp from './Components/Signup';
import RegisterFarm from '../../Views/AddFarmView/AddFarm';
import { loggedIn } from '../../../utils/Controllers/UserController';

/*
    Styles for the view
*/
const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background:
            'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(https://images.pexels.com/photos/2132171/pexels-photo-2132171.jpeg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        // backgroundImage: "url(https://images.pexels.com/photos/2132171/pexels-photo-2132171.jpeg)" ,
        backgroundPosition: 'center',
        [theme.breakpoints.down('xs')]: {
            background: 'white'
        }
    },
    paper: {
        height: 480,
        width: 860,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        background: 'white',
        borderRadius: 5,
        boxShadow:
            '0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)',
        [theme.breakpoints.down('xs')]: {
            height: '100vh',
            width: '80vw',
            boxShadow: 'none',
            justifyContent: 'flex-start',
            flexDirection: 'column'
        }
    }
}));

/*
    Renders the high-level login component
*/
const LoginView: React.FC = () => {
    const classes = useStyles();

    // Switch view to ForgotPassword
    const forgotPassword = () => {
        setView(<ForgotPassword cancel={cancel} />);
    };

    // Switch view to RegisterFarm
    const doFarmRegister = () => {
        setView(<RegisterFarm />);
    };

    // Switch view to Login
    const cancel = () => {
        setView(<Login forgotPassword={forgotPassword} signup={signup} />);
    };

    // Switch view to SignUp
    const signup = () => {
        setView(<SignUp cancel={cancel} doFarmRegister={doFarmRegister} />);
    };

    // Local high-level state
    const [view, setView] = React.useState(
        <Login forgotPassword={forgotPassword} signup={signup} />
    );

    // Check if logged in
    if (loggedIn()) {
        return <Redirect to="/" />;
    }

    /*
        Returns the grid with the login view
    */
    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <main className={classes.paper}>{view}</main>
        </Grid>
    );
};

export default LoginView;
