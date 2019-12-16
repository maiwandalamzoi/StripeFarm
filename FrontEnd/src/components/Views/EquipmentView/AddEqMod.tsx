/* External imports */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, Input, FormHelperText, Button, Typography } from '@material-ui/core';

/* Local imports */
import { addEquipmentModel } from '../../../utils/Controllers/EquipmentModelController';
import { EquipmentModel } from '../../../common/EquipmentModel';

/*
    Styles for the view
*/
const useStyles = makeStyles(theme => ({
	description: {
		margin: theme.spacing(4, 0, 2),
		fontSize: 26,
		fontWeight: 900
	},
	form: {
		marginBottom: theme.spacing(4)
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
	brand_name: '',
	model: '',
	model_year: 2019,
	series: '',
	software_version: '',
	description: ''
};

/*
    The initial error state for the error constants of this view and its children
*/
const initialErrorState = {
	brand_name: '',
	model: '',
	model_year: '',
	series: '',
	software_version: '',
	description: ''
};

/*
    Renders the equipment model dialog and buttons
*/
const AddEqMod = (dialogStatus: any) => {
    const classes = useStyles();

    /*
        state: contains the decomposed state based on the initial state
        error: contains the error messages based on the initial state
    */
	const [{ brand_name, model, model_year, series, software_version, description }, setInfo] = useState(initialState);
    const [error, setError] = useState(initialErrorState);

    /*
        onChange(): function that handles the inputs of the form
        @param e: event that triggered the onChange function
    */
	const onChange = (e: any) => {
		const { id, value } = e.target;
		setInfo(prevState => ({ ...prevState, [id]: value }));
	};

    /*
        handleCancel(): cancels the form input and closes the dialog
    */
	const handleCancel = () => {
		dialogStatus.setOpen(false);
	};

    /*
        handleSubmit(): handles the submit of the form
    */
	const handleSubmit = () => {
        // Reset errors
		setError(initialErrorState);

		// Brand name field empty
		if (!brand_name) {
			setError(error => ({...error, brand_name: 'Please fill in a brand name'}));
			return;
		}

		// Model field empty
		if (!model) {
			setError(error => ({...error, model: 'Please fill in a model'}));
			return;
		}

		//  Model_year is no year
		const today: Date = new Date();
		if (!model_year || model_year <= 1900 || model_year >= today.getFullYear() + 20) {
			setError(error => ({...error, model_year: 'Please fill in a year'}));
			return;
		}

        // Create a equipment model object based on its name
		let equipmentModel: EquipmentModel = new EquipmentModel(brand_name, model, model_year, series, software_version, description, undefined, undefined);

		/*
            addEquipmentModel(): tries to create a new equipment model
            @param equipmentModel: equipment model object created by the form values
        */
		addEquipmentModel(equipmentModel).then((res: any) => {
            // Adding equipment succesfull
			if (res) {
				dialogStatus.setOpen(false);
			}
			// Error
			else {
				setError(error => ({ ...error, name: 'Something went wrong, please try again' }));
			}
		});
	};

    /*
        Return: return creates the view where the equipment model form and corresponding buttons are shown
    */
	return (
		<React.Fragment>
			<Typography className={classes.description} color='primary'>
				Add new equipment model
			</Typography>
			<form
				className={classes.form}
				noValidate
				onKeyPress={event => {
					if (event.key === 'Enter') {
						handleSubmit();
					}
				}}
			>
                {/* Brand name input field */}
				<FormControl className={classes.formControl} required fullWidth>
					<InputLabel htmlFor='brand_name'>Brand name</InputLabel>
					<Input id='brand_name' type='text' value={brand_name} onChange={onChange} aria-describedby='brand_name-error-text' />
					<FormHelperText id='brand_name-error-text' error>
						{error.brand_name}
					</FormHelperText>
				</FormControl>
                {/* Model input field */}
				<FormControl className={classes.formControl} required fullWidth>
					<InputLabel htmlFor='model'>Model</InputLabel>
					<Input id='model' type='text' value={model} onChange={onChange} aria-describedby='model-error-text' />
					<FormHelperText id='model-error-text' error>
						{error.model}
					</FormHelperText>
				</FormControl>
                {/* Model year input field */}
				<FormControl className={classes.formControl} required fullWidth>
					<InputLabel htmlFor='model_year'>Model year</InputLabel>
					<Input id='model_year' type='number' value={model_year} onChange={onChange} aria-describedby='model_year-error-text' />
					<FormHelperText id='model_year-error-text' error>
						{error.model_year}
					</FormHelperText>
				</FormControl>
                {/* Series input field */}
				<FormControl className={classes.formControl} fullWidth>
					<InputLabel htmlFor='series'>Series</InputLabel>
					<Input id='series' type='text' value={series} onChange={onChange} aria-describedby='series-error-text' />
					<FormHelperText id='series-error-text' error>
						{error.series}
					</FormHelperText>
				</FormControl>
                {/* Software version input field */}
				<FormControl className={classes.formControl} fullWidth>
					<InputLabel htmlFor='software_version'>Software version</InputLabel>
					<Input id='software_version' type='text' value={software_version} onChange={onChange} aria-describedby='software_version-error-text' />
					<FormHelperText id='software_version-error-text' error>
						{error.software_version}
					</FormHelperText>
				</FormControl>
                {/* Description input field */}
				<FormControl className={classes.formControl} fullWidth>
					<InputLabel htmlFor='description'>Description</InputLabel>
					<Input id='description' type='text' value={description} onChange={onChange} aria-describedby='description-error-text' />
					<FormHelperText id='description-error-text' error>
						{error.description}
					</FormHelperText>
				</FormControl>
				<div className={classes.flex}>
					<Button className={classes.textbutton} onClick={handleCancel}>
						Cancel
					</Button>
					<Button className={classes.submit} onClick={handleSubmit}>
						Add model
					</Button>
				</div>
			</form>
		</React.Fragment>
	);
}

export default AddEqMod;
