/* External imports */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    FormControl,
    InputLabel,
    Input,
    FormHelperText,
    Button,
    Typography
} from '@material-ui/core';

/* Local imports */
import Cloudia from '../../../../assets/Cloudia.png';

/*
    Styles for the view
*/
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
    logo: {
        height: 200,
        width: 200
    },
    // Font for the description
    description: {
        fontSize: 26,
        fontWeight: 900
    },
    // Layout of the form
    form: {
        width: '40%',
        [theme.breakpoints.down('xs')]: {
            margin: '50px 0 0 0',
            width: '90%'
        }
    },
    // Margin on bottom of the form
    formControl: {
        marginBottom: theme.spacing(1)
    },
    // Style parameters for the textbutton
    textbutton: {
        padding: theme.spacing(1.5, 4),
        color: theme.palette.primary.dark,
        transition: 'all 0.2s ease',
        '&:hover': {
            color: theme.palette.primary.main
        }
    },
    // Style parameters submit button
    submit: {
        margin: theme.spacing(2, 0),
        padding: theme.spacing(1.5, 4),
        fontSize: 14,
        fontWeight: 900,
        color: 'white',
        background: theme.palette.primary.main,
        boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.2s ease',
        '&:hover': {
            background: theme.palette.primary.dark
        }
    },
    // Allignment of flex class
    flex: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
}));

// Interface for parent function
interface ChildProps {
    cancel: () => void;
}

// Initialize email parameter to empty string
const initialState = {
    email: ''
};

/**
 * ForgotPasswordComponent() renders and returns the ForgotPassword dialog
 * @param props contains the cancel parameter from the parent class
 */
const ForgotPasswordComponent: React.FC<ChildProps> = (props: any) => {
    const classes = useStyles();

    /**
     * email: contains the email adres and is set to the initial state
     * error: contains the error messages based on the initial state
     */
    const [{ email }, setInfo] = useState(initialState);
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

        // Email field does not match regex
        if (!email.match('.+@.+..+')) {
            setError(error => ({
                ...error,
                email: 'Please use a valid email address'
            }));
            return;
        }

        // Request reset
        console.log(email);
    };

    return (
        <React.Fragment>
            {/* Header of the dialog, contains logo of stripefarmer */}
            <div className={classes.header}>
                <img className={classes.logo} src={Cloudia} alt="Cloudia" />
                <Typography className={classes.description} color="primary">
                    Reset Password
                </Typography>
            </div>
            {/* Form for email */}
            <form
                className={classes.form}
                noValidate
                // handleSubmit() if the Enter key is pressed
                onKeyPress={event => {
                    if (event.key === 'Enter') {
                        handleSubmit();
                    }
                }}
            >
                <Typography component="h5">
                    Enter your email address to reset your password.
                </Typography>
                <FormControl className={classes.formControl} required fullWidth>
                    {/* Input field for email */}
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={onChange}
                        aria-describedby="email-error-text"
                    />
                    <FormHelperText id="email-error-text" error>
                        {error.email}
                    </FormHelperText>
                </FormControl>
                {/* Form cancel and submit buttons */}
                <div className={classes.flex}>
                    <Button
                        className={classes.textbutton}
                        onClick={props.cancel}
                    >
                        Cancel
                    </Button>
                    <Button className={classes.submit} onClick={handleSubmit}>
                        Reset password
                    </Button>
                </div>
            </form>
        </React.Fragment>
    );
};

export default ForgotPasswordComponent;
