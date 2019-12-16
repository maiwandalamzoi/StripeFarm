/* External imports */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { MenuItem, FormControl, InputLabel, Input, FormHelperText, Select, Grid, Switch, Button } from '@material-ui/core';

/* Libraries */
import GridLoader from 'react-spinners/GridLoader';

/* Local imports */
import { SoilType } from '../../../../../common/SoilType';
import { Field } from '../../../../../common/Field';
import { getSoilTypes } from '../../../../../utils/Controllers/TypesController';
import { addFarmField, updateFarmField } from '../../../../../utils/Controllers/FieldController';
import { AccessibilityType } from '../../../../../common/AccessibilityType';

/*
    Styles for the view
*/
const useStyles = makeStyles(theme => ({
	form: {
		width: '80%',
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
	fieldName: '',
	soilType: '',
	access: false
};

/*
    Renders the add/edit fields component and retrieves field data if @boolean{props.info.editInfo}
*/
const AddFieldComponent = (props: any) => {
	const classes = useStyles();

	/*
		field: contains the field that is currently selected
        state: contains the decomposed state based on the initial state
        error: contains the error messages based on the initial state
		soilTypeList: contains the list of soiltypes retrieved from the database
        isLoading: this constant handles the state of the loading icon
    */
   	const field = props.info.infoField;
	const [{ fieldName, soilType, access }, setInfo] = useState(initialState);
	const [error, setError] = useState(initialState);
    const [soilTypeList, setSoilTypeList] = useState(Array<SoilType>());
	const [isLoading, setIsLoading] = useState(false);

	/*
    	fetchSoilTypes(): retrieves all soil types stored in the database
    */
	async function fetchSoilTypes() {
		try {
			const res = await getSoilTypes();
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
            getSoilTypes(): handle the loading icon state and call fetchSoilTypes() to ensure the result is not empty
        */
		async function getSoilTypes() {
			const res = await fetchSoilTypes();
			if (res) {
				setSoilTypeList(res);
			}
			setIsLoading(false);
        }
		
		/*
            setData(): handle the loading icon state and sets the current data to a reference local state
        */
        async function setData() {
            setInfo(prevState => ({ ...prevState, fieldName: field.field_name }));
            setInfo(prevState => ({ ...prevState, soilType: field.soil_type.name }));
            if (field.accessibility === 'public') {
                setInfo(prevState => ({ ...prevState, access: true }));
            }
			setIsLoading(false);
        }

        getSoilTypes();
        if (props.info.editInfo) {
            setData();
        }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [field]);

	/*
        Loading: this component creates a loading icon while fetching data until complete to give feedback to the user
    */
	const Loading = () => {
		return <GridLoader css={'margin: 30vw auto 0'} sizeUnit={'px'} size={20} color={'#E07A5F'} />;
	};

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
        onChangeSoilType(): function that handles the model input
        @param e: event that triggered the onChangeSoilType function
    */
	const onChangeSoilType = (e: any) => {
		const { value } = e.target;
		setInfo(prevState => ({ ...prevState, soilType: value }));
	};

	/*
        handleSubmit(): handles the submit of the form
    */
	const handleSubmit = () => {
		// Reset errors
        setError(initialState);

        // Stop drawing
        props.setInfo((prevState: any) => ({ ...prevState, editable: false }));

		// Field name field empty
		if (!fieldName) {
			setError(error => ({
				...error,
				fieldName: 'Please fill in your field name'
			}));
			return;
		}

		// Create a soil type object based on its name
		const soiltypeObj: SoilType | undefined = soilTypeList.find((item: any) => item.name === soilType);

		// Check if valid
		if (soiltypeObj === undefined) {
			throw new Error('not a soil type');
		}

		// Creates a accessibility type object based on @Boolean(access)
		const accessType = access ? AccessibilityType.public : AccessibilityType.private;

		// Check if field is new or if it is editable
        if (props.info.editInfo) {

			// Create a field object based on the form
            let fieldObj: Field = new Field(field.id, fieldName, field.coordinates, field.size_in_hectare, soiltypeObj, accessType);

			/*
                updateFarmField(): tries to update the current field
				@param farmId: id of the current active farm
				@param fieldObj: field object that contains the updated values
            */
            updateFarmField(props.info.farmId, fieldObj).then(res => {
                if (res) {
                    // Updated farm succesfully
                    window.location.reload();
                } else {
                    setError(error => ({
                        ...error,
                        fieldName: 'Something went wrong, please try again'
                    }));
                    // Error
                    console.error('Something went wrong');
                }
            });
        } else {
			
			// Create a field object based on the form
            let fieldObj: Field = new Field(undefined, fieldName, props.info.coords, props.info.polygonSize, soiltypeObj, accessType);

			/*
                addFarmField(): tries to create a new field
				@param farmId: id of the current active farm
				@param fieldObj: field object that contains the new values
            */
            addFarmField(props.info.farmId, fieldObj).then(res => {
                if (res) {
                    // Added farm succesfully
                    window.location.reload();
                } else {
                    setError(error => ({
                        ...error,
                        fieldName: 'Something went wrong, please try again'
                    }));
                    // Error
                    console.error('Something went wrong');
                }
            });
        }
	};

	/*
        Return: return creates the view where the create/edit field form is shown if @state{isLoading} is false
		isLoading:
			true: show loading icon
			false: show create/edit field form
	*/
	return (
		<React.Fragment>
			{isLoading ? (
				<Loading />
			) : (
				<form
					className={classes.form}
					noValidate
					onKeyPress={event => {
						if (event.key === 'Enter') {
							handleSubmit();
						}
					}}
				>
					{/* Field name input field */}
					<FormControl className={classes.formControl} required fullWidth>
						<InputLabel htmlFor='fieldName'>Field name</InputLabel>
						<Input id='fieldName' type='text' value={fieldName} onChange={onChange} aria-describedby='fieldName-error-text' />
						<FormHelperText id='fieldName-error-text' error>
							{error.fieldName}
						</FormHelperText>
					</FormControl>
					{/* Soil type input field */}
					<FormControl className={classes.formControl} required fullWidth>
						<InputLabel htmlFor='soilType'>Soil type</InputLabel>
						<Select id='soilType' type='text' value={soilType} onChange={onChangeSoilType} aria-describedby='soilType-error-text'>
							{soilTypeList.map((soilType: SoilType, index: number) => (
								<MenuItem id='soilType' key={index} value={soilType.name}>
									{soilType.name}
								</MenuItem>
							))}
						</Select>
						<FormHelperText id='soilType-error-text' error>
							{error.soilType}
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
						<Button className={classes.textbutton} onClick={() => {
                                props.setInfo((prevState: any) => ({ ...prevState, drawer: 'info' }));
                                props.setInfo((prevState: any) => ({ ...prevState, editInfo: false }));
                            }}
                        >
							Discard
						</Button>
						<Button className={classes.submit} onClick={handleSubmit}>
							Save
						</Button>
					</div>
				</form>
			)}
		</React.Fragment>
	);
};

export default AddFieldComponent;
