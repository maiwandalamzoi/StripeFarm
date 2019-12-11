/* External imports */
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Input, InputLabel, MenuItem, FormControl, Select, Grid } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

/* Libraries */
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

/* Local imports */
import { getEquipments } from '../../../utils/Controllers/EquipmentController';
import { getFarmFields } from '../../../utils/Controllers/FieldController';
import { getCropFields } from '../../../utils/Controllers/CropFieldController';
import RenderCharts from './RenderCharts';

/*
    Renders the farm addition dialog
*/
const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
		maxWidth: 300
	},
	chips: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	chip: {
		margin: 2
	},
	noLabel: {
		marginTop: theme.spacing(3)
	},
	paper: {
		padding: theme.spacing(3, 2),
		width: '80%',
		marginLeft: '10%',
		marginTop: '3%',
		marginBottom: '5%'
	}
}));

// Item height
const ITEM_HEIGHT = 48;

// Item padding
const ITEM_PADDING_TOP = 8;

//Menu item properties
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250
		}
	}
};

// Enum for parameter type
enum typeInterface {
	environment = 'environment',
	crop = 'crop',
	harvest = 'harvest'
}

// Defefintion of type
const type = ['environment', 'crop', 'harvest'];

// Component rendering the history view which draws all dropdowns to select datasource and then draws linegraphs according to
// data selected. Relies heavily on controller functions to get fields, cropfields and sensors.
export default function HistoryView(Props: any) {
	const classes = useStyles();

	// States for the datepickers
	const [selectedStartDate, setSelectedStartDate] = React.useState<Date | null>(new Date('2019-10-01'));
	const [selectedEndDate, setSelectedEndDate] = React.useState<Date | null>(new Date('2019-10-22'));

	/*
        handleStartDateChange(): function that handles the change of the start date
        @param date: start date to be set to
    */
	const handleStartDateChange = (date: Date | null) => {
		setSelectedStartDate(date);
	};

	/*
        handleEndDateChange(): function that handles the change of the end date
        @param date: end date to be set to
    */
	const handleEndDateChange = (date: Date | null) => {
		setSelectedEndDate(date);
	};

	// States used in component
	const [farmId, setFarmId] = React.useState(Props.fID);
	const [fields, setFields] = React.useState();
	const [selectedFields, setSelectedFields] = React.useState<string[]>([]);
	const [cropFields, setCropFields] = React.useState();
	const [selectedCropFields, setSelectedCropFields] = React.useState<string[]>([]);
	const [cropTypes, setCropTypes] = React.useState();
	const [selectedCropTypes, setSelectedCropTypes] = React.useState<string[]>([]);
	const [selectedType, setSelectedType] = React.useState<typeInterface>(typeInterface.environment);
	const [equipments, setEquipments] = React.useState();
	const [selectedEquipment, setSelectedEquipment] = React.useState<string[]>([]);

	// if the farmId has changed reload the page
	if (Props.fID !== farmId) {
		setFarmId(Props.fID);
	}
	/*
        fetchFields(): fetchFields gets all the fields that are stored in the database and returns them
    */
	async function fetchFields() {
		const bufferFields = await getFarmFields(farmId);
		setFields(bufferFields);
    }

	/*
        fetchCropFields(): fetchCropFields gets all the cropfields that are stored in the database and returns them
    */
	async function fetchCropFields() {
		if (fields !== undefined) {
			const bufferCropFields = await Promise.all(
				fields.map((field: any) => {
					if (selectedFields.includes(field.id)) {
						return getCropFields(farmId, field.id);
					} else {
						return undefined;
					}
				})
			);
			createCropFieldsList(bufferCropFields);
		}
    }

    /*
        createCropFieldsList(): changes the array of arrays into an array of cropField objects
        @param bufferCropFields: the temporary cropfield list that have to be converted
    */
	function createCropFieldsList(bufferCropFields: any) {
		let cropFieldsTemp = [{}];
		let i = 0;
		for (let field in bufferCropFields) {
			createCropFieldsLists(bufferCropFields[field]);
		}
		function createCropFieldsLists(field: any) {
			for (let cropField in field) {
				cropFieldsTemp[i] = field[cropField];
				i++;
			}
		}
		setCropFields(cropFieldsTemp);
	}

    /*
        findAvailableTypes(): finds the available crop types based on the selected cropFields
    */
	function findAvailableTypes() {
		if (cropFields !== undefined) {
			const bufferCropTypes = cropFields.map((cropField: any) => {
				if (selectedCropFields.includes(cropField.id)) {
					return cropField.crop_type;
				} else {
					return undefined;
				}
			});
			var alreadyIn: any = [];
			var temp: any = [];
			for (let cropTypes in bufferCropTypes) {
				if (bufferCropTypes[cropTypes] !== undefined) {
					if (!alreadyIn.includes(bufferCropTypes[cropTypes].id)) {
						alreadyIn.push(bufferCropTypes[cropTypes].id);
						temp.push(bufferCropTypes[cropTypes]);
					}
				}
			}
			setCropTypes(temp);
		}
    }

	/*
        fetchSensors(): fetchSensors gets all the equipments that are stored in the database and returns them
    */
	async function fetchSensors() {
		const bufferEquipment = await getEquipments(farmId);
		setEquipments(bufferEquipment);
	}

    /*
        useEffect(): useEffect refreshes the render after a state has been updated
    */
	useEffect(() => {
		fetchFields();
		fetchSensors();
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [farmId]);

	/*
        useEffect(): useEffect refreshes the render after a state has been updated
    */
	useEffect(() => {
		fetchCropFields();
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFields]);

	/*
        useEffect(): useEffect refreshes the render after a state has been updated
    */
	useEffect(() => {
		findAvailableTypes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedCropFields]);

    /*
        Return render of this component
    */
	return (
		<div className={classes.root} style={{ height: '100%', width: '100%' }}>
			<div style={{ width: '100vw', border: '1px solid grey' }}>
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<Grid container justify='space-around'>
						{/* Start date picker */}
						<KeyboardDatePicker
							disableToolbar
							variant='inline'
							format='MM/dd/yyyy'
							margin='normal'
							id='date-picker-inline'
							label='Start Date'
							value={selectedStartDate}
							onChange={handleStartDateChange}
							KeyboardButtonProps={{
								'aria-label': 'change date'
							}}
						/>
						{/* end date picker */}
						<KeyboardDatePicker
							disableToolbar
							variant='inline'
							format='MM/dd/yyyy'
							margin='normal'
							id='date-picker-inline'
							label='End Date'
							value={selectedEndDate}
							onChange={handleEndDateChange}
							KeyboardButtonProps={{
								'aria-label': 'change date'
							}}
						/>
						{/* Field selecter */}
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor='select-multiple'>Field</InputLabel>
							<Select multiple value={selectedFields} onChange={e => setSelectedFields(e.target.value as string[])} input={<Input id='select-multiple' />} MenuProps={MenuProps}>
								{fields !== undefined &&
									fields.map((field: any) => (
										<MenuItem key={field.id} value={field.id}>
											{field.field_name}
										</MenuItem>
									))}
							</Select>
						</FormControl>

						{/* Cropfield selector */}
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor='select-multiple-chip'>Crop Field</InputLabel>
							<Select multiple value={selectedCropFields} onChange={e => setSelectedCropFields(e.target.value as string[])} input={<Input id='select-multiple-chip' />}>
								{cropFields !== undefined &&
									cropFields.map((cropField: any) => (
										<MenuItem key={cropField.id} value={cropField.id}>
											{cropField.name}
										</MenuItem>
									))}
							</Select>
						</FormControl>

						{/* Crop type selector, not used in drawing graphs */}
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor='select-multiple-chip'>Crop Type</InputLabel>
							<Select multiple value={selectedCropTypes} onChange={e => setSelectedCropTypes(e.target.value as string[])} input={<Input id='select-multiple-chip' />}>
								{cropTypes !== undefined &&
									cropTypes.map(
										(cropType: any) =>
											cropType !== undefined && (
												<MenuItem key={cropType.id} value={cropType.id}>
													{cropType.name}
												</MenuItem>
											)
									)}
							</Select>
						</FormControl>

						{/* Type selector */}
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor='select-multiple-chip'>Type</InputLabel>
							<Select value={selectedType} onChange={e => setSelectedType(e.target.value as typeInterface)} input={<Input id='select-multiple-chip' />}>
								{type.map(name => (
									<MenuItem key={name} value={name}>
										{name}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						{/* Sensor selector */}
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor='select-multiple-chip'>Sensor</InputLabel>
							<Select multiple value={selectedEquipment} onChange={e => setSelectedEquipment(e.target.value as string[])} input={<Input id='select-multiple-chip' />}>
								{equipments !== undefined &&
									equipments.map((equipment: any) => (
										<MenuItem key={equipment.id} value={equipment.id}>
											{equipment.name}
										</MenuItem>
									))}
							</Select>
						</FormControl>
					</Grid>
				</MuiPickersUtilsProvider>
			</div>

			{/* Line chart component */}
			<div style={{ height: '84vh', width: '100%', overflowY: 'scroll' }}>
				{/* Only draws line graphs if one or more fields, cropfields and sensors are selected. */}
				{selectedFields.length > 0 && selectedEquipment.length > 0 && selectedCropFields.length > 0 ? <RenderCharts start={selectedStartDate} end={selectedEndDate} selectedCropFields={selectedCropFields} cropfields={cropFields} sensor={selectedEquipment} equipment={equipments} /> : <Typography>Please Select a field, cropfield and sensor first. {}</Typography>}
			</div>
		</div>
	);
}
