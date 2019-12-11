/** This is the signup module
*/
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import {FormControl,InputLabel,Input, FormHelperText} from '@material-ui/core';
import Cloudia from '../../../../assets/Cloudia.png';
import { register } from '../../../../utils/Controllers/UserController';

const useStyles = makeStyles(theme => ({
    // Style parameters for the header
    header: {
        width: '40%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        [theme.breakpoints.down('xs')]: {
            marginTop: 50
        }
    },
    // Height and with of the logo
    logo: { height: 200, width: 200 },
    // Font for the description
    description: { fontSize: 26, fontWeight: 900 },
    // Layout of the form
    form: {
        width: '40%',
        [theme.breakpoints.down('xs')]: { margin: '50px 0 0 0', width: '90%'}
    },
    // Margin on bottom of the form
    formControl: { marginBottom: theme.spacing(1) },
    // Style parameters for the textbutton
    textbutton: {
        padding: theme.spacing(1.5, 4),
        color: theme.palette.primary.dark,
        transition: 'all 0.2s ease',
        '&:hover': {color: theme.palette.primary.main}
    },
    // Style parameters submit button
    submit: {
        margin: theme.spacing(2, 0),
        padding: theme.spacing(1.5, 4),
        fontSize: 14, fontWeight: 900,
        color: 'white', background: theme.palette.primary.main,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.2s ease',
        '&:hover': {background: theme.palette.primary.dark}
    },
    // Allignment of flex class
    flex: { display: 'flex', justifyContent: 'space-between', alignItems: 'center'}
}));

// Interface for parent function
interface ChildProps {
    cancel: () => void;
    doFarmRegister: () => void;
}

// Initialize user parameters to empty strings
const initialState = {firstname: '', lastname: '', email: '', password: '', confirm: ''};

/**
 * SignUp() renders and returns the SignUp dialog
 * @param props contains the cancel parameter from the parent class
 */
const SignUp: React.FC<ChildProps> = (props: any) => {
    const classes = useStyles();

    /**
     * user parameters: contains all user parameter and sets them to the initial state
     * error: contains the error messages based on the initial state
     */
    const [
        { firstname, lastname, email, password, confirm },
        setInfo
    ] = useState(initialState);
    const [error, setError] = useState(initialState);

    /*
        onChange(): function that handles the inputs of the form
        @param e: event that triggered the onChange function
    */
    const onChange = (e: any) => {
        const { id, value } = e.target;
        setInfo(prevState => ({ ...prevState, [id]: value }));
    };

    /*
        handleSubmit(): handles the submit of the form
    */
    const handleSubmit = () => {
        // Reset errors
        setError(initialState);

        // Firstname field empty
        if (!firstname) {
            setError(error => ({
                ...error,
                firstname: 'Please fill in your first name'
            }));
            return;
        }
        // Lastname field empty
        if (!lastname) {
            setError(error => ({
                ...error,
                lastname: 'Please fill in your last name'
            }));
            return;
        }
        // Email field does not match regex
        if (!email.match('.+@.+..+')) {
            setError(error => ({
                ...error,
                email: 'Please use a valid email address'
            }));
            return;
        }
        // Password field empty
        if (!password) {
            setError(error => ({
                ...error,
                password: 'Please fill in your password'
            }));
            return;
        }
        // Wrong password type
        if (password.length < 5) {
            setError(error => ({
                ...error,
                password: 'Password must have at least 5 characters'
            }));
            return;
        }
        // Passwords do not match
        if (password !== confirm) {
            setError(error => ({
                ...error,
                password: 'Passwords do not match'
            }));
            return;
        }

        // Request register
        register(email, password, firstname, lastname).then(res => {
            // Registration error
            if (res === 0) {
                setError(error => ({
                    ...error,
                    confirm: 'Something went wrong, please try again'
                }));
            }
            // Registration success
            else if (res === 1) {
                window.location.reload();
            }
            // Email already exists
            else if (res === 2) {
                setError(error => ({
                    ...error,
                    email: 'Email already exists'
                }));
            }
        });
    };

    return (
        <React.Fragment>
            {/* Header of the dialog, contains logo of stripefarmer */}
            <div className={classes.header}>
                <img className={classes.logo} src={Cloudia} alt="Cloudia" />
                <Typography className={classes.description} color="primary">
                    Create a new account
                </Typography>
            </div>
            {/* Form for creating a user */}
            <form
                className={classes.form}
                noValidate
                // handleSubmit() if the Enter key is pressed
                onKeyPress={e => {
                    if (e.key === 'Enter') {
                        handleSubmit();
                    }
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        {/* Input field for firstname */}
                        <FormControl
                            className={classes.formControl}
                            required
                            fullWidth
                        >
                            <InputLabel htmlFor="firstname">First name</InputLabel>
                            <Input
                                id="firstname"
                                type="text"
                                value={firstname}
                                onChange={onChange}
                                aria-describedby="firstname-error-text"
                            />
                            <FormHelperText id="firstname-error-text" error>
                                {error.firstname}
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        {/* Input field for lastname */}
                        <FormControl
                            className={classes.formControl}
                            required
                            fullWidth
                        >
                            <InputLabel htmlFor="lastname">Last name</InputLabel>
                            <Input
                                id="lastname"
                                type="text"
                                value={lastname}
                                onChange={onChange}
                                aria-describedby="lastname-error-text"
                            />
                            <FormHelperText id="lastname-error-text" error>
                                {error.lastname}
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
                {/* Input field for email */}
                <FormControl className={classes.formControl} required fullWidth>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={onChange}
                        aria-describedby="email-error-text"
                    />
                    <FormHelperText id="email-error-text" error>{error.email}</FormHelperText>
                </FormControl>
                {/* Input field for password */}
                <FormControl className={classes.formControl} required fullWidth>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={onChange}
                        aria-describedby="password-error-text"
                    />
                    <FormHelperText id="password-error-text" error>
                        {error.password}
                    </FormHelperText>
                </FormControl>
                {/* Input field for password */}
                <FormControl className={classes.formControl} required fullWidth>
                    <InputLabel htmlFor="confirm">Confirm password</InputLabel>
                    <Input
                        id="confirm"
                        type="password"
                        value={confirm}
                        onChange={onChange}
                        aria-describedby="confirm-error-text"
                    />
                    <FormHelperText id="confirm-error-text" error>{error.confirm}</FormHelperText>
                </FormControl>
                {/* Form cancel and submit buttons */}
                <div className={classes.flex}>
                    <Button className={classes.textbutton} onClick={props.cancel}>Cancel</Button>
                    <Button className={classes.submit} onClick={handleSubmit}>Sign up</Button>
                </div>
            </form>
        </React.Fragment>
    );
};

export default SignUp;
