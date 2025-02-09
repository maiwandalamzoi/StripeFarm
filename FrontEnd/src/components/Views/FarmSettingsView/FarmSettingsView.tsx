/* External imports */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { MenuItem, Grid, FormControl, InputLabel, Input, FormHelperText, Select, Switch, Button } from '@material-ui/core';

/* Libraries */
import GridLoader from 'react-spinners/GridLoader';

/* Local imports */
import UserManagementTable from './UserManagementTable';
import { Farm } from '../../../common/Farm';
import { Country } from '../../../common/Country';
import { AccessibilityType } from '../../../common/AccessibilityType';
import { getCountries } from '../../../utils/Controllers/TypesController';
import { getFarm, updateFarm, deleteFarm } from '../../../utils/Controllers/FarmController';

/*
    Styles for the view
*/
const useStyles = makeStyles((theme: any) => ({
	form: {
		width: '60%',
		margin: '20px auto'
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
	farmname: '',
	address: '',
	postalcode: '',
	email: '',
	phone: '',
	website: '',
	country: '',
	access: false
};

/*
    Renders the farm settings form and user management table
*/
const FarmSettingsView = (props: any) => {
	const classes = useStyles();

	/*
        farmId: contains the farmId of the current active farm
        state: contains the decomposed state based on the initial state
        error: contains the error messages based on the initial state
        countryList: contains the list of countries retrieved from the database
        isLoading: this constant handles the state of the loading icon
    */
	const farmId = props.fID;
	const [{ farmname, address, postalcode, email, phone, website, country, access }, setInfo] = useState(initialState);
	const [error, setError] = useState(initialState);
	const [countryList, setCountryList] = React.useState(Array<Country>());
	const [isLoading, setIsLoading] = useState(false);

	/*
        onChange(): function that handles the inputs of the form
        @param e: event that triggered the onChange function
    */
	const onChange = (e: any) => {
		const { id, value } = e.target;
		if (e.target.type === 'checkbox') {
			setInfo(prevState => ({ ...prevState, [id]: e.target.checked }));
			return;
		}
		setInfo(prevState => ({ ...prevState, [id]: value }));
	};

	/*
        onSelectCountry(): function that handles the model input
        @param e: event that triggered the onSelectCountry function
    */
	const onSelectCountry = (e: any) => {
		const { value } = e.target;
		setInfo(prevState => ({ ...prevState, country: value }));
	};

	/*
        fetchCountries(): fetchCountries gets all the countries that are stored in the database and returns them
    */
	async function fetchCountries() {
		try {
			const res = await getCountries();
			return res;
		} catch (e) {
			console.error(e.message);
		}
	}

	/*
        fetchFarm(): fetchFarm gets all info of a farm by id that is stored in the database and returns it
    */
	async function fetchFarm() {
		try {
			const res = await getFarm(farmId);
			return res;
		} catch (e) {
			console.error(e.message);
		}
	}

	/*
        useEffect(): useEffect refreshes the render after a state has been updated
    */
	useEffect(() => {
		setIsLoading(true);

		/*
            getCountries(): handle the loading icon state and call fetchCountries() to ensure the result is not empty
        */
		async function getCountries() {
			const res = await fetchCountries();
			if (res) {
				setCountryList(res);
			}
			setIsLoading(false);
		}

		/*
            getCountries(): handle the loading icon state and call fetchCountries() to ensure the result is not empty
        */
		async function getFarm() {
			const res = await fetchFarm();
			if (res) {
				setInfo(prevState => ({ ...prevState, farmname: res.name, address: res.address, postalcode: res.postal_code, email: res.email, phone: res.phone, website: res.webpage, country: res.country.name }));
				if (res.accessibility === 'public') {
					setInfo(prevState => ({ ...prevState, access: true }));
				}
			}
			setIsLoading(false);
		}
		getFarm();
		getCountries();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.fID]);

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

		// Farmname field empty
		if (!farmname) {
			setError(error => ({ ...error, farmname: 'Please fill in your farm name' }));
			return;
		}
		// Address field empty
		if (!address) {
			setError(error => ({ ...error, address: 'Please fill in your address' }));
			return;
		}
		// Postal code field empty
		if (!postalcode) {
			setError(error => ({ ...error, postalcode: 'Please fill in your postal code' }));
			return;
		}
		// Email field does not match regex
		if (!email.match('.+@.+..+')) {
			setError(error => ({ ...error, email: 'Please use a valid email address' }));
			return;
		}
		// Phonefield empty
		if (!phone) {
			setError(error => ({ ...error, phone: 'Please fill in your phone number' }));
			return;
		}
		// Website field does not match regex
		if (!website.match('([w_-]+(?:(?:.[w_-]+)+))([w.,@?^=%&:/~+#-]*[w@?^=%&/~+#-])?')) {
			setError(error => ({ ...error, website: 'Please use a valid website' }));
			return;
		}
		// Country field is empty
		if (!country) {
			setError(error => ({ ...error, country: 'Please select a country' }));
			return;
		}

		// Create a country object based on its name
		const countryObj: Country | undefined = countryList.find((item: any) => item.name === country);

		// Check if valid
		if (countryObj === undefined) {
			throw new Error('not a country');
		}

		// Creates a accessibility type object based on @Boolean(access)
		const accessType = access ? AccessibilityType.public : AccessibilityType.private;

		// Create a new farm object based on the form values
		let farm: Farm = new Farm(farmId, farmname, address, postalcode, email, phone, website, countryObj, accessType);

		/*
            updateFarm(): tries to update an existing farm
            @param farm: farm object composed of the form values
        */
		updateFarm(farm).then(res => {
			// Updating farm successful
			if (res) {
				window.location.reload();
			}
			// Error
			else {
				setError(error => ({ ...error, farmName: 'Something went wrong, please try again' }));
			}
		});
	};

	/*
        handleDelete(): handles the deletion of a farm by id and reloads the window
    */
	const handleDelete = async () => {
		try {
			if (window.confirm('Are you sure, you want to delete this farm?')) {
				const res = await deleteFarm(farmId);
				// Deleting farm successful
				if (res) {
					window.location.reload();
				}
				// Error
				else {
					setError(error => ({ ...error, farmname: 'Something went wrong, please try again' }));
				}
			}
		} catch (error) {
			// Error
			setError(error => ({ ...error, farmname: 'Something went wrong, please try again' }));
		}
	};

	/*
        Return: return creates the view where the farm settings form and corresponding buttons are shown if @state{isLoading} is false
        isLoading:
            true: show loading icon
            false: show field name and cropfield cards
    */
	return (
		<React.Fragment>
			{isLoading ? (
				<Loading />
			) : (
				<React.Fragment>
					<form
						className={classes.form}
						noValidate
						onKeyPress={event => {
							if (event.key === 'Enter') {
								handleSubmit();
							}
						}}
					>
                        {/* Farm name input field */}
						<FormControl className={classes.formControl} required fullWidth>
							<InputLabel htmlFor='farmname'>Farm name</InputLabel>
							<Input id='farmname' type='text' value={farmname} onChange={onChange} aria-describedby='farmname-error-text' />
							<FormHelperText id='farmname-error-text' error>
								{error.farmname}
							</FormHelperText>
						</FormControl>
						<Grid container spacing={2}>
							<Grid item xs={7}>
                                {/* Address input field */}
								<FormControl className={classes.formControl} required fullWidth>
									<InputLabel htmlFor='address'>Address</InputLabel>
									<Input id='address' type='text' value={address} onChange={onChange} aria-describedby='address-error-text' />
									<FormHelperText id='address-error-text' error>
										{error.address}
									</FormHelperText>
								</FormControl>
							</Grid>
							<Grid item xs={5}>
                                {/* Postal code input field */}
								<FormControl className={classes.formControl} required fullWidth>
									<InputLabel htmlFor='postalcode'>Postal code</InputLabel>
									<Input id='postalcode' type='text' value={postalcode} onChange={onChange} aria-describedby='postalcode-error-text' />
									<FormHelperText id='postalcode-error-text' error>
										{error.postalcode}
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
                        {/* Phone number input field */}
						<FormControl className={classes.formControl} required fullWidth>
							<InputLabel htmlFor='phone'>Phone number</InputLabel>
							<Input id='phone' type='tel' value={phone} onChange={onChange} aria-describedby='phone-error-text' />
							<FormHelperText id='phone-error-text' error>
								{error.phone}
							</FormHelperText>
						</FormControl>
                        {/* Website input field */}
						<FormControl className={classes.formControl} required fullWidth>
							<InputLabel htmlFor='website'>Website</InputLabel>
							<Input id='website' type='text' value={website} onChange={onChange} aria-describedby='website-error-text' />
							<FormHelperText id='website-error-text' error>
								{error.website}
							</FormHelperText>
						</FormControl>
                        {/* Country input field */}
						<FormControl className={classes.formControl} required fullWidth>
							<InputLabel htmlFor='country'>Country</InputLabel>
							<Select id='country' type='text' value={country} onChange={onSelectCountry} aria-describedby='country-error-text'>
								{countryList.map((countryItem: Country) => (
									<MenuItem id='country' key={countryItem.code} value={countryItem.name}>
										{countryItem.name}
									</MenuItem>
								))}
							</Select>
							<FormHelperText id='country-error-text' error>
								{error.country}
							</FormHelperText>
						</FormControl>
                        {/* Access input field */}
						<FormControl className={classes.formControl}>
							<Grid component='label' container alignItems='center' spacing={2}>
								<Grid item>Private</Grid>
								<Grid item>
									<Switch id='access' checked={access} onChange={onChange} value={access} />
								</Grid>
								<Grid item>Public</Grid>
							</Grid>
						</FormControl>
						<div className={classes.flex}>
							<Button className={classes.textbutton} type='submit'>
								Discard
							</Button>
							<Button className={classes.submit} onClick={handleDelete}>
								Delete farm
							</Button>
							<Button className={classes.submit} onClick={handleSubmit}>
								Save changes
							</Button>
						</div>
					</form>
                    {/* User managing table */}
					<UserManagementTable farmId={farmId} />
				</React.Fragment>
			)}
		</React.Fragment>
	);
};

export default FarmSettingsView;
