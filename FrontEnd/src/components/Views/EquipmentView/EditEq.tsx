/* External imports */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, FormControl, InputLabel, Input, FormHelperText, Grid, Select, MenuItem, Button, Switch, Dialog, DialogContent } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

/* Libraries */
import GridLoader from 'react-spinners/GridLoader';

/* Local imports */
import AddEqMod from './AddEqMod';
import { getEquipment, updateEquipment } from '../../../utils/Controllers/EquipmentController';
import { AccessibilityType } from '../../../common/AccessibilityType';
import { EquipmentModel } from '../../../common/EquipmentModel';
import { Equipment } from '../../../common/Equipment';
import { getEquipmentModels } from '../../../utils/Controllers/EquipmentModelController';
import { WolkyTolkyEq } from '../../../common/WolkyTolkyEq';
import { getWolkyTolkyEq, updateWolkyTolkyEq, deleteWolkyTolkyEq, addWolkyTolkyEq } from '../../../utils/Controllers/WolkyTolkyEqController';
import { Field } from '../../../common/Field';
import { getFarmFields } from '../../../utils/Controllers/FieldController';
import { CropField } from '../../../common/CropField';
import { getCropFields } from '../../../utils/Controllers/CropFieldController';
import { EquipmentInformation } from '../../../common/EquipmentInformation';
import { addEquipmentInfo, getEquipmentInfo, updateEquipmentInfo, deleteEquipmentInfo } from '../../../utils/Controllers/EquipmentInfoController';

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
	add: {},
	flex: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	dialog: {
		margin: '0 auto',
		padding: 20
	}
}));

/*
    The initial state for the state constants of this view and its children
*/
const initialState = {
	name: '', description: '', model: '', manufacturing_date: '2019-01-01', serial_number: '', wt_key: '', wt_stationId: 0, field: '', cropfield: '', savedata: false, access: false,
};

/*
    The initial error state for the error constants of this view and its children
*/
const initialErrorState = {
	name: '', description: '', model: '', manufacturing_date: '', serial_number: '', wt_key: '', wt_stationId: '', field: '', cropfield: '', savedata: '', access: ''
};

var eqInfoExists: boolean = false;
var eqWtExists: boolean = false;
var modelId: number | undefined = undefined;
var cropId: number | undefined = undefined;
var fieldId: number | undefined = undefined;

const EditEq = (props: any) => {
	const classes = useStyles();

    /*
        farmID: contains the farmId of the current active farm
        eqId: contains the equipment id of the current selected equipment
        state: contains the decomposed state based on the initial state
        error: contains the error messages based on the initial state
        open: contains the state of the dialog
        modelList: contains the list of equipment models retrieved from the database
		isLoading: this constant handles the state of the loading icon
		modelId: the model ID of the selected model on submition
        cropId: the ID of the selected cropfield
    */
	const farmId: number = props.fID;
	const eqId: number = props.eqId;
	const [{ name, description, model, manufacturing_date, serial_number, wt_key, wt_stationId, field, cropfield, savedata, access }, setInfo] = useState(initialState);
	const [error, setError] = useState(initialErrorState);
	const [open, setOpen] = useState(false);
	const [modelList, setModelList] = React.useState(Array<EquipmentModel>());
	const [fieldList, setFieldList] = React.useState(Array<Field>());
	const [cropfieldList, setCropfieldList] = React.useState(Array<CropField>())
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
        onSelectmodel(): function that handles the model input
        @param e: event that triggered the onSelectModel function
    */	const onSelectModel = (e: any) => {
		const { value } = e.target;
		setInfo(prevState => ({ ...prevState, model: value }));
	};

	/*
	onSelectField(): function that handles the field input
	@param e: event that triggered the onSelectField function
*/
	const onSelectField = (e: any) => {
		const { value } = e.target;
		cropId = undefined;
		setInfo(prevState => ({ ...prevState, cropfield: '' }));
		setInfo(prevState => ({ ...prevState, field: value }));
		if (field) {
			const fieldObj: Field | undefined = fieldList.find((item: any) => item.field_name === field);
			console.log(fieldObj);
			// Check if valid
			if (fieldObj === undefined) {
				throw new Error('not a field model');
			}
			fieldId = fieldObj.id;
			console.log(fieldId);
		}
	};

	async function getCFields() {
		const res = await fetchCropfields();
		if (res) {
			setCropfieldList(res);
		}

	}
	useEffect(() => {
		getCFields();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [field])

	/*
	onSelectCropfield(): function that handles the cropfield input
	@param e: event that triggered the onSelectCropfield function
*/
	const onSelectCropfield = (e: any) => {
		const { value } = e.target;
		setInfo(prevState => ({ ...prevState, cropfield: value }));
	};

    /*
        fetchEquipmentModels(): fetchEquipmentModels gets all the equipment models and returns them
    */
	async function fetchEquipmentModels() {
		try {
			const res = await getEquipmentModels();
			return res;
		} catch (e) {
			console.error(e.message);
		}
	}

    /*
        fetchEquipment(): fetchEquipment gets all the equipments and returns them
    */
	async function fetchEquipment() {
		try {
			const res = await getEquipment(eqId, farmId);
			return res;
		} catch (e) {
			console.error(e.message);
		}
	}

	/*
        fetchFields(): fetchEquipmentModels gets all the equipment models that are stored in the database and returns them
    */
	async function fetchFields() {
		try {
			const res = await getFarmFields(farmId);
			return res;
		} catch (e) {
			console.error(e.message);
		}
	}

	/*
		  fetchEquipmentModels(): fetchEquipmentModels gets all the equipment models that are stored in the database and returns them
	  */
	async function fetchCropfields() {
		try {
			const fieldObj: Field | undefined = fieldList.find((item: any) => item.field_name === field);
			if (fieldObj) {
				fieldId = fieldObj.id;
				const res = await getCropFields(farmId, fieldObj.id);
				return res;
			}
		} catch (e) {
			console.error(e.message);
		}
	}

	async function fetchWolkyTolkyEquipment() {
		try {
			const res = await getWolkyTolkyEq(eqId);
			return res;
		} catch (e) {
			console.error(e.message);
		}
	}

	async function fetchEquipmentInfo() {
		try {
			const res = await getEquipmentInfo(eqId);
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
            getEquipmentModels(): handle the loading icon state and call fetchEquipmentModels() to ensure the result is not empty
        */
		async function getEquipmentModels() {
			const res = await fetchEquipmentModels();
			if (res) {
				setModelList(res);
			}
			setIsLoading(false);
		}

		/*
            getFieldList(): handle the loading icon state and call fetchFields() to ensure the result is not empty
        */
		async function getFieldList() {
			const res = await fetchFields();
			if (res) {
				setFieldList(res);
			}
			setIsLoading(false);
		}

		/*
			getFieldList(): handle the loading icon state and call fetchFields() to ensure the result is not empty
		*/
		async function getCropfieldList() {
			const res = await fetchCropfields();
			if (res) {
				setCropfieldList(res);
			}
			setIsLoading(false);
		}

		getEquipmentModels();
		getFieldList();
		getCropfieldList();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fieldId]);

	/*
        useEffect(): useEffect refreshes the render after a state has been updated
    */
	useEffect(() => {
		setIsLoading(true);

		/*
			getEquipment(): handle the loading icon state and call fetchEquipment() to ensure the result is not empty
		*/
		async function getEquipment() {
			const res = await fetchEquipment();
			if (res) {
				if (res.accessibility === 'public') {
					setInfo(prevState => ({ ...prevState, access: true }));
				}

				if (res.description) {
					const oldDescription = res.description;
					setInfo(prevState => ({ ...prevState, description: oldDescription }));
				}

				setInfo(prevState => ({ ...prevState, name: res.name }));

				const mList = await getEquipmentModels();
				for (var i in mList) {
					if (mList[i].id === res.model_id) {
						const oldModel = mList[i].model;
						setInfo(prevState => ({ ...prevState, model: oldModel }));
					}
				}

				if (res.manufacturing_date) {
					const oldDate = res.manufacturing_date;
					setInfo(prevState => ({ ...prevState, manufacturing_date: oldDate }));
				}

				if (res.serial_number) {
					const oldSerialNumber = res.serial_number;
					setInfo(prevState => ({ ...prevState, serial_number: oldSerialNumber }));
				}
			}
			setIsLoading(false);
		}

		async function loadWolkyTolkyEq() {
			const res = await fetchWolkyTolkyEquipment();
			if (res) {
				if (res.apiKey) {
					const oldapiKey = res.apiKey;
					setInfo(prevState => ({ ...prevState, wt_key: oldapiKey }))
				}

				if (res.stationId) {
					const oldstationId = res.stationId;
					setInfo(prevState => ({ ...prevState, wt_stationId: oldstationId }))
				}
				console.log('wolky tolky equipment exists')
				eqWtExists = true;
			}
		}

		async function loadEquipmentInfo() {
			const res = await fetchEquipmentInfo();
			if (res) {
				const list = await getFarmFields(farmId);

				for (var i in list) {
					if (list[i].id === res.fieldId) {
						const oldField = list[i].field_name;
						setInfo(prevState => ({ ...prevState, field: oldField }));
						// eslint-disable-next-line react-hooks/exhaustive-deps
						fieldId = res.fieldId;
					}
				}

				if (fieldId) {
					const cList = await getCropFields(farmId, fieldId);
					for (var j in cList) {
						if (cList[j].id === res.cropfieldId) {
							const oldCropfield = cList[j].name;
							setInfo(prevState => ({ ...prevState, cropfield: oldCropfield }));
							// eslint-disable-next-line react-hooks/exhaustive-deps
							cropId = res.cropfieldId;
						}
					}
				}

				if (res.savedata) {
					const oldSavedata = res.savedata;
					setInfo(prevState => ({ ...prevState, savedata: oldSavedata }))
				}
				eqInfoExists = true;
			}
		}

		getEquipment();
		loadWolkyTolkyEq();
		loadEquipmentInfo();
	}, []);

    /*
        Loading: this component creates a loading icon while fetching data until complete to give feedback to the user
    */
	const Loading = () => {
		return <GridLoader css={'margin: 30vw auto 0'} sizeUnit={'px'} size={20} color={'#E07A5F'} />;
	};

    /*
        handleCancel(): cancels the form input and closes the dialog
    */
	const handleCancel = () => {
		props.setEditOpen(false);
	};

    /*
        handleSubmit(): handles the submit of the form
    */
	const handleSubmit = () => {
		// Reset errors
		setError(initialErrorState);

		// Name field empty
		if (!name) {
			setError(error => ({ ...error, name: 'Please fill in an equipment name' }));
			return;
		}

		// WolkyTolky API key is missing
		if (wt_stationId && !wt_key) {
			setError(error => ({
				...error,
				wt_key: 'Please fill in the WolkyTolky API key'
			}));
			return;
		}

		// WolkyTolky station ID is missing
		if (!wt_stationId && wt_key) {
			setError(error => ({
				...error,
				wt_stationId: 'Please fill in the WolkyTolky station ID'
			}));
			return;
		}

		// Field is missing
		if (cropfield && !field) {
			setError(error => ({
				...error,
				cropfield: 'Cannot fill in a cropfield without a field'
			}));
			return;
		}


		// Delete WolkyTolky equipment if empty
		if (!wt_stationId && !wt_key) {
			eqWtExists = false;
			deleteWolkyTolkyEq(eqId);
		}

		// Delete equipment information if empty
		if (!cropfield && !field) {
			eqInfoExists = false;
			deleteEquipmentInfo(eqId);
		}


		// If a model object is selected
		// Create a equipment model object based on its name
		if (model) {
			// Create a equipment model object based on its name
			const modelObj: EquipmentModel | undefined = modelList.find((item: any) => item.model === model);

			// Check if valid
			if (modelObj === undefined) {
				throw new Error('not a equipment model');
			} else {
				modelId = modelObj.id;
			}
		}

		// If a field object is selected
		// Create a field object based on its name
		if (field) {
			const fieldObj: Field | undefined = fieldList.find((item: any) => item.field_name === field);
			// Check if valid
			if (fieldObj === undefined) {
				throw new Error('not a equipment model');
			} else {
				fieldId = fieldObj.id;
			}
		}

		// If a cropfield object is selected
		// Create a cropfield object based on its name
		if (cropfield) {
			const cropfieldObj: CropField | undefined = cropfieldList.find((item: any) => item.name === cropfield);
			// Check if valid
			if (cropfieldObj === undefined) {
				throw new Error('not a equipment model');
			} else {
				cropId = cropfieldObj.id;
			}
		}

		// Creates a accessibility type object based on @Boolean(access)
		const accessType = access ? AccessibilityType.public : AccessibilityType.private;

		// Create a new equipment model object based on the form values
		let equipment: Equipment = new Equipment(name, description, modelId, manufacturing_date, serial_number, accessType, eqId);

		/*
            updateEquipment(): tries to update an existing equipment
            @param equipment: equipment object created by the form values
            @param farmId: farm id of the current active farm
        */
		updateEquipment(equipment, farmId).then(res => {
			// Adding equipment succesfull
			if (res) {
				// If WolkyTolky equipment is added
				// Find the created equipment and store its id
				if (wt_key || field) {
					// Check if equipment id is defined
					// Create WolkyTolky equipment object
					if (equipment.id) {
						if (wt_key) {
							let wolkyTolkyEq: WolkyTolkyEq = new WolkyTolkyEq(
								equipment.id,
								wt_stationId,
								wt_key
							)

							if (eqWtExists) {
								updateWolkyTolkyEq(wolkyTolkyEq).then(res => {
									// Check if adding WolkyTolky equipment went well
									if (!res) {
										setError(error => ({
											...error,
											name: 'Something went wrong, please try again'
										}));
										// Error
										console.error('Something went wrong');
									}
								});
							} else {
								console.log('add wt');
								addWolkyTolkyEq(wolkyTolkyEq).then(res => {
									// Check if adding WolkyTolky equipment went well
									if (!res) {
										setError(error => ({
											...error,
											name: 'Something went wrong, please try again'
										}));
										// Error
										console.error('Something went wrong');
									}
								});
							}
						}
						if (fieldId) {
							let equipmentInfo: EquipmentInformation = new EquipmentInformation(farmId, fieldId, cropId, equipment.id, savedata);

							if (eqInfoExists) {
								console.log('update equipment');
								updateEquipmentInfo(equipmentInfo).then(res => {
									// Check if adding equipment information went well
									if (!res) {
										setError(error => ({
											...error,
											name: 'Something went wrong, please try again'
										}));
										// Error
										console.error('Something went wrong');
									}
								});
							} else {
								addEquipmentInfo(equipmentInfo).then(res => {
									// Check if adding equipment information went well
									if (!res) {
										setError(error => ({
											...error,
											name: 'Something went wrong, please try again'
										}));
										// Error
										console.error('Something went wrong');
									}
								});
							}
						}

					}
				}


				// Close dialog and update table
				props.setEditOpen(false);
			}
			// Error
			else {
				setError(error => ({ ...error, name: 'Something went wrong, please try again' }));
			}
		});
	};

    /*
        Return: return creates the view where the equipment form and corresponding buttons are shown if @state{isLoading} is false
        isLoading:
            true: show loading icon
            false: show field name and cropfield cards
    */
	return (
		<React.Fragment>
			<Typography className={classes.description} color='primary'>
				Edit equipment
			</Typography>
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
							{/* Equipment name input field */}
							<FormControl className={classes.formControl} required fullWidth>
								<InputLabel htmlFor='name'>Equipment name</InputLabel>
								<Input id='name' type='text' value={name} onChange={onChange} aria-describedby='name-error-text' />
								<FormHelperText id='name-error-text' error>
									{error.name}
								</FormHelperText>
							</FormControl>
							{/* Equipment description input field */}
							<FormControl className={classes.formControl} fullWidth>
								<InputLabel htmlFor='description'>Equipment description</InputLabel>
								<Input id='description' type='text' value={description} onChange={onChange} aria-describedby='description-error-text' />
								<FormHelperText id='description-error-text' error>
									{error.name}
								</FormHelperText>
							</FormControl>
							<Grid container spacing={2}>
								<Grid item xs={10}>
									{/* Equipment model input field */}
									<FormControl className={classes.formControl} fullWidth>
										<InputLabel htmlFor='model'>Equipment model</InputLabel>
										<Select id='model' type='text' value={model} onChange={onSelectModel} aria-describedby='model-error-text'>
											{modelList.map(({ id, model }, index) => (
												<MenuItem id='model' key={id} value={model}>
													{model}
												</MenuItem>
											))}
										</Select>
										<FormHelperText id='model-error-text' error>
											{error.model}
										</FormHelperText>
									</FormControl>
								</Grid>
								<Grid item xs={2}>
									<Button className={classes.add} variant='contained' color='primary' onClick={() => setOpen(true)}>
										<AddIcon htmlColor='white'/>
									</Button>
								</Grid>
							</Grid>
							{/* Manufacturing date input field */}
							<FormControl className={classes.formControl} required fullWidth>
								<InputLabel htmlFor='manufacturing_date'>Manufacturing date</InputLabel>
								<Input id='manufacturing_date' type='date' value={manufacturing_date} onChange={onChange} aria-describedby='manufacturing_date-error-text' />
								<FormHelperText id='manufacturing_date-error-text' error>
									{error.manufacturing_date}
								</FormHelperText>
							</FormControl>
							{/* Serial number input field */}
							<FormControl className={classes.formControl} fullWidth>
								<InputLabel htmlFor='serial_number'>Serial number</InputLabel>
								<Input id='serial_number' type='text' value={serial_number} onChange={onChange} aria-describedby='serial_number-error-text' />
								<FormHelperText id='serial_number-error-text' error>
									{error.serial_number}
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
							{/* WolkyTolky API key input field*/}
							<FormControl className={classes.formControl} fullWidth>
								<InputLabel htmlFor="wt_key">WolkyTolky API key</InputLabel>
								<Input
									id='wt_key'
									type='text'
									value={wt_key}
									onChange={onChange}
									aria-describedby='wt_key-error-text'
								/>
								<FormHelperText id='wt_key-error-text' error>
									{error.wt_key}
								</FormHelperText>
							</FormControl>
							{/* WolkyTolky station ID input field*/}
							<FormControl className={classes.formControl} fullWidth>
								<InputLabel htmlFor="wt_stationId">WolkyTolky station id</InputLabel>
								<Input
									id='wt_stationId'
									type='number'
									value={wt_stationId}
									onChange={onChange}
									aria-describedby='wt_stationId-error-text'
								/>
								<FormHelperText id='wt_stationId-error-text' error>
									{error.wt_stationId}
								</FormHelperText>
							</FormControl>
							{/* Field input field*/}
							<FormControl className={classes.formControl} fullWidth>
								<InputLabel htmlFor='field'>Field</InputLabel>
								<Select id='field' type='text' value={field} onChange={onSelectField} aria-describedby='field-error-text'>
									{fieldList.map(({ id, field_name }, index) => (
										<MenuItem id='field' key={id} value={field_name}>
											{field_name}
										</MenuItem>
									))}
								</Select>
								<FormHelperText id='field-error-text' error>
									{error.model}
								</FormHelperText>
							</FormControl>
							{/* Cropfield input field*/}
							<FormControl className={classes.formControl} fullWidth>
								<InputLabel htmlFor='cropfield'>Cropfield</InputLabel>
								<Select id='cropfield' type='text' value={cropfield} onChange={onSelectCropfield} aria-describedby='field-error-text'>
									{cropfieldList.map(({ id, name }, index) => (
										<MenuItem id='cropfield' key={id} value={name}>
											{name}
										</MenuItem>
									))}
								</Select>
								<FormHelperText id='field-error-text' error>
									{error.model}
								</FormHelperText>
							</FormControl>
							{/* Save data input field */}
							<FormControl className={classes.formControl}>
								Do you want to store the data of this equipment?
                <Grid component='label' container alignItems='center' spacing={2}>
									<Grid item>No</Grid>
									<Grid item>
										<Switch id='savedata' checked={savedata} onChange={onChange} value={savedata} />
									</Grid>
									<Grid item>Yes</Grid>
								</Grid>
							</FormControl>
							<div className={classes.flex}>
								<Button className={classes.textbutton} onClick={handleCancel}>
									Cancel
					</Button>
								<Button className={classes.submit} onClick={handleSubmit}>
									Save
					</Button>
							</div>
						</form>
						<div>
							{/* Add equipment model dialog */}
							<Dialog open={open} onClose={() => setOpen(false)}>
								<DialogContent className={classes.dialog}>
									<AddEqMod open={open} setOpen={setOpen} />
								</DialogContent>
							</Dialog>
						</div>
					</React.Fragment>
				)}
		</React.Fragment>
	);
}

export default EditEq;
