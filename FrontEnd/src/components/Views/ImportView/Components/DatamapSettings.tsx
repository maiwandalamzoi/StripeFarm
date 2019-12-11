/* External imports */
import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Input, FormHelperText, makeStyles, FormLabel, FormGroup, FormControlLabel, Checkbox, Select, MenuItem, Grid, Switch } from '@material-ui/core';

/* Libraries */
import GridLoader from 'react-spinners/GridLoader';

/* Internal imports */
import { getEquipmentModels } from '../../../../utils/Controllers/EquipmentModelController';
import { EquipmentModel } from '../../../../common/EquipmentModel';

/*
    Styles for the view
*/
const useStyles = makeStyles(theme => ({
	root: {
		maxWidth: 600,
		width: '80%',
		margin: '0 auto'
	},
	formControl: {
		marginBottom: theme.spacing(1)
	},
	formLabel: {
		paddingTop: theme.spacing(4)
	}
}));

/*
    Renders the additional settings for the datamap inside the stepper
*/
const ImportSettings = (props: any) => {
	const classes = useStyles();

	/*
        equipmentModels: contains the list of equipment models retrieved from the database
        isLoading: this constant handles the state of the loading icon
    */
	const [equipmentModels, setEquipmentModels] = useState(Array<EquipmentModel>());
	const [isLoading, setIsLoading] = useState(false);

	/*
        fetchEquipmentModels(): fetchEquipmentModels gets all the equipment models that are stored in the database and returns them
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
				setEquipmentModels(res);
			}
			setIsLoading(false);
		}
		getEquipmentModels();
	}, []);

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
			props.setInfo((prevState: any) => ({
				...prevState,
				[id]: e.target.checked
			}));
			console.log(id, e.target.checked)
			return;
		}
		props.setInfo((prevState: any) => ({ ...prevState, [id]: value }));
	};

	/*
        onSelectModel(): function that handles the equipment model input field
        @param e: event that triggered the onSelectModel function
    */
	const onSelectModel = (e: any) => {
		const { value } = e.target;
		props.setInfo((prevState: any) => ({ ...prevState, modelId: value }));
	};

	/*
        Return: return creates the view where the additional settings of the datamap inside the stepper are shown if @state{isLoading} is false
        isLoading:
            true: show loading icon
            false: show field name and cropfield cards
    */
	return (
		<div className={classes.root}>
			{isLoading ? (
				<Loading />
			) : (
				<React.Fragment>
					{/* Datamap name input field */}
					<FormControl className={classes.formControl} required fullWidth>
						<InputLabel htmlFor='name'>Datamap name</InputLabel>
						<Input id='name' type='text' value={props.info.name} onChange={onChange} aria-describedby='name-error-text' />
						<FormHelperText id='name-error-text' error>
							{props.error.name}
						</FormHelperText>
					</FormControl>
					{/* Datamap description input field */}
					<FormControl className={classes.formControl} required fullWidth>
						<InputLabel htmlFor='description'>Description</InputLabel>
						<Input id='description' type='text' value={props.info.description} onChange={onChange} aria-describedby='description-error-text' />
						<FormHelperText id='description-error-text' error>
							{props.error.description}
						</FormHelperText>
					</FormControl>
					{/* Equipment model input field */}
					<FormControl className={classes.formControl} required fullWidth>
						<InputLabel htmlFor='modelId'>Select equipment model</InputLabel>
						<Select id='modelId' type='text' value={props.info.modelId} onChange={onSelectModel}>
							{equipmentModels.map((equipmentModel: EquipmentModel) => (
								<MenuItem id='modelId' key={equipmentModel.id} value={equipmentModel.id}>
									{equipmentModel.model}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					{/* Checkbox input fields */}
					<FormControl component='fieldset' className={classes.formControl} fullWidth>
						<FormLabel component='legend' className={classes.formLabel}>
							Additional declarations
						</FormLabel>
						<FormGroup row={true}>
							<FormControlLabel htmlFor='has_header' label='has_header' control={<Checkbox id='has_header' onChange={onChange} />} />
							<FormControlLabel htmlFor='has_coordinate' label='has_coordinate' control={<Checkbox id='has_coordinate' onChange={onChange} />} />
							<FormControlLabel htmlFor='has_date' label='has_date' control={<Checkbox id='has_date' onChange={onChange} />} />
							<FormControlLabel htmlFor='has_time' label='has_time' control={<Checkbox id='has_time' onChange={onChange} />} />
						</FormGroup>
					</FormControl>
					{/* Access input field */}
					<FormControl className={classes.formControl} required fullWidth>
						<Grid component='label' container alignItems='center' spacing={2}>
							<Grid item>Private</Grid>
							<Grid item>
								<Switch id='accessibility' checked={props.info.accessibility} onChange={onChange} value={props.info.accessibility} />
							</Grid>
							<Grid item>Public</Grid>
						</Grid>
					</FormControl>
				</React.Fragment>
			)}
		</div>
	);
};

export default ImportSettings;
