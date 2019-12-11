/* External imports */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, FormControl, InputLabel, Input, FormHelperText, Button } from '@material-ui/core';

/* Libraries */
import GridLoader from 'react-spinners/GridLoader';

/* Internal imports */
import { getUser, updateUser, getUserId } from '../../../utils/Controllers/UserController';
import User from '../../../common/User';

/*
    Styles for the view
*/
const useStyles = makeStyles(theme => ({
	form: {
		width: '40%',
		margin: '5vh auto',
		[theme.breakpoints.down('xs')]: {
			margin: '50px 0 0 0',
			width: '90%'
		}
	},
	formControl: {
		marginBottom: theme.spacing(1)
	},
	textbutton: {
		padding: theme.spacing(1.5, 4),
		color: theme.palette.primary.dark,
		transition: 'all 0.2s ease',
		'&:hover': {
			color: theme.palette.primary.main
		}
	},
	submit: {
		margin: theme.spacing(2, 0),
		padding: theme.spacing(1.5, 4),
		fontSize: 14,
		fontWeight: 900,
		color: 'white',
		background: theme.palette.primary.main,
		boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
		transition: 'all 0.2s ease',
		'&:hover': {
			background: theme.palette.primary.dark
		}
	},
	flex: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
}));

/*
    The initial state for the state constants of this view and its children
*/
const initialState = {
	userId: 0,
	firstname: '',
	lastname: '',
	email: '',
	password: '',
	confirm: ''
};

/*
    PersonalSettings returns a view of all the personal information of the user
*/
const PersonalSettings = () => {
	const classes = useStyles();

	/*
        state: contains the decomposed state based on the initial state
        error: contains the error messages based on the initial state
        isLoading: this constant handles the state of the loading icon
    */
	const [{ userId, firstname, lastname, email, password, confirm }, setInfo] = useState(initialState);
	const [error, setError] = useState(initialState);
	const [isLoading, setIsLoading] = useState(false);

	/*
        onChange(): function that handles the inputs of the form
        @param e: event that triggered the onChange function
    */
	const onChange = (e: any) => {
		const { id, value } = e.target;
		setInfo(prevState => ({ ...prevState, [id]: value }));
	};

	/*
        fetchUser(): fetchUser gets all the information of the user that is stored in the database and returns its
    */
	async function fetchUser() {
		try {
			const resId = await getUserId();
			setInfo(prevState => ({ ...prevState, userId: resId }));

			const res = await getUser(resId);
			return res;
		} catch (e) {
			console.error(e.message);
			setError(error => ({
				...error,
				firstname: 'Something went wrong, please try again'
			}));
		}
	}

	/*
        useEffect(): useEffect refreshes the render after a state has been updated
    */
	useEffect(() => {
		setIsLoading(true);

		/*
            getUser(): handle the loading icon state and call fetchUser() to ensure the result is not empty
        */
		async function getUser() {
			const res = await fetchUser();
			if (res) {
				setInfo(prevState => ({ ...prevState, firstname: res.first_name, lastname: res.last_name, email: res.email }));
			}
			setIsLoading(false);
		}
		getUser();
	}, []);

	/*
        Loading: this component creates a loading icon while fetching data until complete to give feedback to the user
    */
	const Loading = () => {
		return <GridLoader css={'margin: 30vw auto 0'} sizeUnit={'px'} size={20} color={'#E07A5F'} />;
	};

	/*
        handleSubmit(): handles the submit of the form
    */
	const handleSubmit = () => {
		// Reset errors
		setError(initialState);

		// Firstname field empty
		if (!firstname) {
			setError(error => ({ ...error, firstname: 'Please fill in your first name' }));
			return;
		}
		// Lastname field empty
		if (!lastname) {
			setError(error => ({ ...error, lastname: 'Please fill in your last name' }));
			return;
		}
		// Email field does not match regex
		if (!email.match('.+@.+..+')) {
			setError(error => ({ ...error, email: 'Please use a valid email address' }));
			return;
		}
		// Password field empty
		if (!password) {
			setError(error => ({ ...error, password: 'Please fill in your password' }));
			return;
		}
		// Wrong password type
		if (password.length < 5) {
			setError(error => ({ ...error, password: 'Password must have at least 5 characters' }));
			return;
		}
		// Passwords do not match
		if (password !== confirm) {
			setError(error => ({ ...error, password: 'Passwords do not match' }));
			return;
		}

		// Create a new user object based on the form values
		const user = new User(userId, email, firstname, lastname, password);

		/*
            updateUser(): tries to update the existing user
            @param user: user object composed of the form values
        */
		updateUser(user).then(res => {
			// Adding equipment succesfull
			if (res) {
				window.location.reload();
			}
			// Error
			else {
				setError(error => ({ ...error, firstname: 'Something went wrong, please try again' }));
			}
		});
	};

	/*
        Return: return creates the view where the personal settings form and corresponding buttons are shown if @state{isLoading} is false
        isLoading:
            true: show loading icon
            false: show field name and cropfield cards
    */
	return (
		<React.Fragment>
			{isLoading ? (
				<Loading />
			) : (
				<form
					className={classes.form}
					noValidate
					onKeyPress={e => {
						if (e.key === 'Enter') {
							handleSubmit();
						}
					}}
				>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							{/* First name input field */}
							<FormControl className={classes.formControl} required fullWidth>
								<InputLabel htmlFor='firstname'>First name</InputLabel>
								<Input id='firstname' type='text' value={firstname} onChange={onChange} aria-describedby='firstname-error-text' />
								<FormHelperText id='firstname-error-text' error>
									{error.firstname}
								</FormHelperText>
							</FormControl>
						</Grid>
						<Grid item xs={6}>
							{/* Last name input field */}
							<FormControl className={classes.formControl} required fullWidth>
								<InputLabel htmlFor='lastname'>Last name</InputLabel>
								<Input id='lastname' type='text' value={lastname} onChange={onChange} aria-describedby='lastname-error-text' />
								<FormHelperText id='lastname-error-text' error>
									{error.lastname}
								</FormHelperText>
							</FormControl>
						</Grid>
					</Grid>
					{/* Email input field */}
					<FormControl className={classes.formControl} required fullWidth>
						<InputLabel htmlFor='email'>Email</InputLabel>
						<Input id='email' type='email' value={email} onChange={onChange} aria-describedby='email-error-text' />
						<FormHelperText id='email-error-text' error>
							{error.email}
						</FormHelperText>
					</FormControl>
					{/* Password input field */}
					<FormControl className={classes.formControl} required fullWidth>
						<InputLabel htmlFor='password'>Password</InputLabel>
						<Input id='password' type='password' value={password} onChange={onChange} aria-describedby='password-error-text' />
						<FormHelperText id='password-error-text' error>
							{error.password}
						</FormHelperText>
					</FormControl>
					{/* Confirm password input field */}
					<FormControl className={classes.formControl} required fullWidth>
						<InputLabel htmlFor='confirm'>Confirm password</InputLabel>
						<Input id='confirm' type='password' value={confirm} onChange={onChange} aria-describedby='confirm-error-text' />
						<FormHelperText id='confirm-error-text' error>
							{error.confirm}
						</FormHelperText>
					</FormControl>
					<div className={classes.flex}>
						<Button className={classes.textbutton}>
							Discard
						</Button>
						<Button className={classes.submit} onClick={handleSubmit}>
							Save settings
						</Button>
					</div>
				</form>
			)}
		</React.Fragment>
	);
};

export default PersonalSettings;
