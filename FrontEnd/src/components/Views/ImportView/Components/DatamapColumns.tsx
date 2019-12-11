/* External imports */
import React, { useState } from 'react';
import { FormControl, InputLabel, Input, makeStyles, Grid, IconButton, Typography, Select, MenuItem } from '@material-ui/core';
import PlusIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

/* Local imports */
import { ObservationObjectType } from '../../../../common/ObservationObjectType';

/*
    Styles for the view
*/
const useStyles = makeStyles(theme => ({
	grid: {
		marginTop: theme.spacing(2),
		padding: theme.spacing(2),
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		border: '1px solid grey',
		borderRadius: 5
	},
	formControl: {
		marginBottom: theme.spacing(1)
	},
	iconbutton: {
		margin: theme.spacing(2),
		color: theme.palette.primary.main
	}
}));

/*
    The initial state for the state constants of this view and its children
*/
const initialState = {
	typeString: '',
	type: '',
	context: '',
	parameter: '',
	unit: '',
	condParameter: '',
	condValue: '',
	condUnit: ''
};

/*
    Renders the columns for the datamap inside the stepper
*/
const ImportDatamap = (props: any) => {
	const classes = useStyles();

	/*
        dataColumns: contains the state that handles the data per column based on the initial state
        typeList: contains the list of equipment models retrieved from the database
        isLoading: this constant handles the state of the loading icon
    */
	const [dataColumns, setDataColumns] = useState(props.info.maps);
	const typeList = ['environment', 'harvest', 'crop', 'datetime', 'coordinate'];

	// Set datamaps to saved values
	// setDataColumns(props.info.maps);

	/*
        onChangeType(): changes the type of ObservationObjectType from a string value
        @param e: event that the target should be updated of
        @param index: index of datacolumn that should be updated
    */
	const onChangeType = (e: any, index: number) => {
		const { value } = e.target;
		let tempOOT: ObservationObjectType = ObservationObjectType.environment;
		switch (value) {
			case 'environment':
				tempOOT = ObservationObjectType.environment;
				break;
			case 'harvest':
				tempOOT = ObservationObjectType.harvest;
				break;
			case 'crop':
				tempOOT = ObservationObjectType.crop;
				break;
			case 'datetime':
				tempOOT = ObservationObjectType.datetime;
				break;
			case 'coordinate':
				tempOOT = ObservationObjectType.coordinate;
				break;
			default:
				tempOOT = ObservationObjectType.environment;
				break;
		}
		setDataColumns(dataColumns.map((column: any, colIndex: number) => (colIndex === index ? { ...column, type: tempOOT, typeString: value } : column)));
		props.setInfo((prevState: any) => ({ ...prevState, maps: dataColumns }));
	};

	/*
        onChange(): function that handles the inputs of the form
        @param e: event that triggered the onChange function
        @param index: index of the datacolumn that should be updated
    */
	const onChange = (e: any, index: number) => {
		const { id, value } = e.target;
		if (e.target.type === 'checkbox') {
			setDataColumns(dataColumns.map((column: any, colIndex: number) => (colIndex === index ? { ...column, [id]: e.target.checked } : column)));
			props.setInfo((prevState: any) => ({ ...prevState, maps: dataColumns }));
        }
        // else if (id === 'condValue') {
        //     setDataColumns(dataColumns.map((column: any, colIndex: number) => (colIndex === index ? { ...column, [id]: Number(value) } : column)));
        // }
        else {
			setDataColumns(dataColumns.map((column: any, colIndex: number) => (colIndex === index ? { ...column, [id]: value } : column)));
		}
		props.setInfo((prevState: any) => ({ ...prevState, maps: dataColumns }));
	};

	/*
        addColumn(): function that creates a new datacolumn and updates the state
    */
	const addColumn = () => {
		const newColumns = [...dataColumns];
		newColumns.splice(dataColumns.length + 1, 0, initialState);
		setDataColumns(newColumns);
	};

	/*
        removeColumnAtIndex(): function that removes a datacolumn at a given index
        @param index: index at which the datamap should be removed from
    */ function removeColumnAtIndex(index: number) {
		if (index === 0 && dataColumns.length === 1) return;
		setDataColumns((dataColumns: any) => dataColumns.slice(0, index).concat(dataColumns.slice(index + 1, dataColumns.length)));
	}

	/*
        Return: return creates the view where the datamap columns are shown inside of the stepper
    */
	return (
		<React.Fragment>
			<Typography>{props.error.columnError}</Typography>
			{dataColumns.map((columnInfo: any, index: number) => (
				<Grid container key={index} className={classes.grid} spacing={2}>
					<Grid item key={index * 10}>
						{/* Type input field */}
						<FormControl className={classes.formControl} required fullWidth>
							<InputLabel htmlFor='type'>Type</InputLabel>
							<Select id='type' type='text' value={columnInfo.typeString} onChange={e => onChangeType(e, index)}>
								{typeList.map((type: any, index: number) => (
									<MenuItem id='country' key={index} value={type}>
										{type}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item key={index * 10 + 1}>
						{/* Context input field */}
						<FormControl className={classes.formControl} required>
							<InputLabel htmlFor='context'>Context</InputLabel>
							<Input id='context' type='text' value={columnInfo.context} onChange={e => onChange(e, index)} />
						</FormControl>
					</Grid>
					<Grid item key={index * 10 + 2}>
						{/* Parameter input field */}
						<FormControl className={classes.formControl} required>
							<InputLabel htmlFor='parameter'>Parameter</InputLabel>
							<Input id='parameter' type='text' value={columnInfo.parameter} onChange={e => onChange(e, index)} />
						</FormControl>
					</Grid>
					<Grid item key={index * 10 + 3}>
						{/* Unit input field */}
						<FormControl className={classes.formControl} required>
							<InputLabel htmlFor='unit'>Unit</InputLabel>
							<Input id='unit' type='text' value={columnInfo.unit} onChange={e => onChange(e, index)} />
						</FormControl>
					</Grid>
					<Grid item key={index * 10 + 4}>
						{/* Condition parameter input field */}
						<FormControl className={classes.formControl} required>
							<InputLabel htmlFor='condParameter'>Condition parameter</InputLabel>
							<Input id='condParameter' type='text' value={columnInfo.condParameter} onChange={e => onChange(e, index)} />
						</FormControl>
					</Grid>
					<Grid item key={index * 10 + 5}>
						{/* Condition value input field */}
						<FormControl className={classes.formControl} required>
							<InputLabel htmlFor='condValue'>Condition value</InputLabel>
							<Input id='condValue' type='text' value={columnInfo.condValue} onChange={e => onChange(e, index)} />
						</FormControl>
					</Grid>
					<Grid item key={index * 10 + 6}>
						{/* Condition unit input field */}
						<FormControl className={classes.formControl} required>
							<InputLabel htmlFor='condUnit'>Condition unit</InputLabel>
							<Input id='condUnit' type='text' value={columnInfo.condUnit} onChange={e => onChange(e, index)} />
						</FormControl>
					</Grid>
					{dataColumns.length !== 1 && (
						<IconButton color='primary' onClick={() => removeColumnAtIndex(index)}>
							<DeleteIcon />
						</IconButton>
					)}
				</Grid>
			))}
			{/* Button to add an extra datacolumn */}
			<IconButton className={classes.iconbutton} onClick={addColumn}>
				<PlusIcon />
			</IconButton>
		</React.Fragment>
	);
};

export default ImportDatamap;
