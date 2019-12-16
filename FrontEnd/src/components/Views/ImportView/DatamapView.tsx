/* External imports */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Stepper, Step, StepLabel, Button } from '@material-ui/core';

/* Local imports */
import DatamapSettings from './Components/DatamapSettings';
import DatamapColumns from './Components/DatamapColumns';
import DatamapTable from './Components/DatamapTable';
import { AccessibilityType } from '../../../common/AccessibilityType';
import { DataColumn } from '../../../common/DataColumn';
import { ObservationVariable } from '../../../common/ObservationVariable';
import { Observation } from '../../../common/Observation';
import { addDataMap } from '../../../utils/Controllers/MappingController';
import { DataMap } from '../../../common/DataMap';

/*
    Styles for the view
*/
const useStyles = makeStyles(theme => ({
	form: {
		height: '100%',
		width: '60%',
		minWidth: 600,
		margin: '0 auto 20%',
		[theme.breakpoints.down('xs')]: {
			margin: '50px 0 0 0',
			width: '90%',
			minWidth: 0
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
		flexDirection: 'column',
        alignItems: 'center'
	},
	flexSpread: {
		width: '100%',
		marginTop: theme.spacing(4),
		display: 'flex',
		justifyContent: 'space-evenly'
	}
}));

/*
    The initial state for the state constants of this view and its children
*/
const initialState = {
	name: '',
	description: '',
	has_header: false,
	has_coordinate: false,
	has_date: false,
	has_time: false,
	modelId: '',
	accessibility: false,
	maps: [],
	columnError: ''
};

/*
    Renders the datamap view, including the stepper with its columns and additional settings
*/
const DatamapView = (props: any) => {
	const classes = useStyles();

    /*
        farmId: contains the farmId of the current active farm
        info: contains the state based on the initial state
        error: contains the error messages based on the initial state
        activeStep: current step of the stepper
        steps: contains a list of steps for the stepper
    */
	const farmId = props.fID;
	const [info, setInfo] = useState(initialState);
    const [error, setError] = useState(initialState);
    const [activeStep, setActiveStep] = React.useState(0);
	const steps = [
		{
			label: 'Create columns',
			component: <DatamapColumns info={info} setInfo={setInfo} error={error} />
		},
		{
			label: 'Datamap settings',
			component: <DatamapSettings info={info} setInfo={setInfo} error={error} setError={setError} />
		}
	];

    /*
        handleSubmit(): handles the submit of the form
    */
	const handleSubmit = () => {
		// Reset errors
		setError(initialState);

		// Name field is empty
		if (!info.name) {
			setError(error => ({...error, name: 'Please fill in a datamap name'}));
			return;
		}

		// Description field is empty
		if (!info.description) {
			setError(error => ({...error, description: 'Please fill in a datamap description'}));
			return;
		}

		// Name field is empty
		if (!info.modelId) {
			setError(error => ({...error, modelId: 'Please select a equipment model'}));
			return;
		}

        // Create a temporary array to store the created datacolumns
		let tempMap = Array<DataColumn>();

        // Map the datacolumn information to the correct objects
		info.maps.forEach((column: any) => {
			let col = String(column.parameter + ' ' + column.condValue + column.condUnit);
			let obsVar = new ObservationVariable(column.condParameter, column.condValue, column.condUnit);
			let desc = String(column.context + ' ' + column.parameter + ' ' + column.condValue + column.condUnit);
			let dataColObs = new Observation(column.type, column.context, column.parameter, desc, column.unit, [obsVar]);
			let dataCol = new DataColumn(col, dataColObs);
			column.condValue = Number(column.condValue);

			tempMap.push(dataCol);
		});

        // Creates a accessibility type object based on @Boolean(access)
		const accessType = info.accessibility ? AccessibilityType.public : AccessibilityType.private;

        /*
            addDatamap(): tries to create a new datamap
            @param name: name of the datamap
            @param description: description of the datamap
            @param has_header: boolean value if the file has column headers
            @param has_coordinate: boolean value if the file has coordinates for the observation
            @param has_date: boolean value if the file has a date for the observation
            @param has_time: boolean value if the file has a time for the observation
            @param modelId: equipment model id for the observation type
            @param accessibility: Accessibility type for users of the datamap
            @farmId: id of the current active farm
        */
		addDataMap(new DataMap(info.name, info.description, info.has_header, info.has_coordinate, info.has_date, info.has_time, Number(info.modelId), accessType, tempMap), farmId).then(res => {
			// Adding equipment succesfull
			if (res) {
				console.log(res);
				//window.location.reload();
			}
			// Error
			else {
				setError(error => ({ ...error, name: 'Something went wrong, please try again' }));
			}
		});
	};

	/*
        getStepContent(): retrieves the content of the stepper at step index
        @param step: current step of which the content should be retrieved
        @returns: Component based on the current step of the stepper
    */
	function getStepContent(step: number) {
		switch (step) {
			case 0:
				return steps[0].component;
			case 1:
				return steps[1].component;
			default:
				return 'This is not supposed to happen';
		}
	}

    /*
        handleNext(): handles the progression to the next step of the stepper
    */
	const handleNext = () => {
		if (info.maps.length === 0) {
			setError(error => ({...error, columnError: 'Please set at minimum one column'}));
			return;
		}
		setActiveStep(prevActiveStep => prevActiveStep + 1);
	};

    /*
        handleBack(): handles the regression to the previous step of the stepper
    */
    const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

    /*
        Return: return creates the view where the stepper and corresponding component content are shown
    */
	return (
        <React.Fragment>
		<form
			className={classes.form}
			noValidate
			onKeyPress={event => {
				if (event.key === 'Enter' && activeStep === steps.length - 1) {
					handleSubmit();
				}
			}}
		>
			<Stepper alternativeLabel activeStep={activeStep}>
				{steps.map(({ label }, index) => (
					<Step key={index}>
						<StepLabel>{label}</StepLabel>
					</Step>
				))}
			</Stepper>

			<div className={classes.flex}>
				<React.Fragment>{getStepContent(activeStep)}</React.Fragment>
				<div className={classes.flexSpread}>
					<Button disabled={activeStep === 0} onClick={handleBack} className={classes.textbutton}>
						Back
					</Button>
					{activeStep !== steps.length - 1 ? (
						<Button onClick={handleNext} className={classes.submit}>
							Next
						</Button>
					) : (
						<Button onClick={handleSubmit} className={classes.submit}>
							Finish
						</Button>
					)}
				</div>
			</div>
		</form>

        <DatamapTable />

        </React.Fragment>
	);
};

export default DatamapView;
