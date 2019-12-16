/* External imports */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { MenuItem, FormControl, InputLabel, Input, FormHelperText, Select, Grid, Switch, Button } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

/* Libraries */
import GridLoader from 'react-spinners/GridLoader';
import Dropzone, { IDropzoneProps, ILayoutProps } from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';

/* Local imports */
import { AccessibilityType } from '../../../../common/AccessibilityType';
import { getEquipments } from '../../../../utils/Controllers/EquipmentController';
import { Equipment } from '../../../../common/Equipment';
import { DataMap } from '../../../../common/DataMap';
import { getDataMaps, importData } from '../../../../utils/Controllers/MappingController';

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
	equipment: '',
    datamap: '',
    access: false,
    file: new File([], ''),
    latitude: '',
    longitude: '',
    datetime: new Date()
};

/*
    Renders the import view with dropzone and inputs
*/
const ImportComponent = (props: any) => {
    const classes = useStyles();

	/*
        state: contains the decomposed state based on the initial state
        error: contains the error messages based on the initial state
		equipments: contains the list of equipments retrieved from the database
		datamaps: contains the list of datamaps retrieved from the database
        isLoading: this constant handles the state of the loading icon
    */
	const [{ equipment, datamap, access, file, latitude, longitude, datetime }, setInfo] = useState(initialState);
	const [error, setError] = useState(initialState);
    const [equipments, setEquipments] = useState(Array<Equipment>());
    const [datamaps, setDatamaps] = useState(Array<DataMap>());
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
        onDatamapChange(): function that handles the model input
        @param e: event that triggered the onDatamapChange function
    */
	const onDatamapChange = (e: any) => {
		const { value } = e.target;
		setInfo(prevState => ({ ...prevState, datamap: value }));
	};

	/*
        onEquipmentChange(): function that handles the model input
        @param e: event that triggered the onEquipmentChange function
    */
    const onEquipmentChange = (e: any) => {
		const { value } = e.target;
		setInfo(prevState => ({ ...prevState, equipment: value }));
	};

	/*
        onDateChange(): function that handles the model input
        @param e: event that triggered the onDateChange function
    */
    const onDateChange = (date: Date | null) => {
        if (date) {
            setInfo(prevState => ({ ...prevState, datetime: date }));
        }
    };

    /*
        fetchEquipments(): fetchEquipments gets all the equipments of a farm and returns them
    */
    async function fetchEquipments() {
        try {
            const res = await getEquipments(props.info.farmId);
            return res;
        } catch (e) {
            console.error(e.message);
        }
    }

    /*
        fetchDatamaps(): fetchDatamaps gets all the datamaps and returns them
    */
    async function fetchDatamaps() {
        try {
            const res = await getDataMaps();
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
		// getEquipments(): handle the loading icon state and call fetchEquipments() to ensure the result is not empty
        async function getEquipments() {
            const res = await fetchEquipments();
            if (res) {
                setEquipments(res);
            }
            setIsLoading(false);
        }
		// getDatamaps(): handle the loading icon state and call fetchDatamaps() to ensure the result is not empty
        async function getDatamaps() {
            const res = await fetchDatamaps();
            if (res) {
                setDatamaps(res);
            }
            setIsLoading(false);
        }

        getEquipments();
        getDatamaps();
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

	// Loading: this component creates a loading icon while fetching data until complete to give feedback to the user
	const Loading = () => {
		return <GridLoader css={'margin: 30vw auto 0'} sizeUnit={'px'} size={20} color={'#E07A5F'} />;
	};

	/*
        handleSubmit(): handles the submit of the form
    */
	const handleSubmit = () => {
		// Reset errors
		setError(initialState);

		// Latitude field empty
		if (!latitude) {
			setError(error => ({...error, latitude: 'Please fill in a latitude'}));
			return;
        }

        // Longitude field empty
		if (!longitude) {
			setError(error => ({...error, longitude: 'Please fill in a longitude'}));
			return;
        }

		// Create a equipment object based on its name
        const equipmentObj: Equipment | undefined = equipments.find((item: any) => item.name === equipment);

		// Check if valid
		if (equipmentObj === undefined) {
			throw new Error('not an equipment');
        }

		// Create a datamap object based on its name
        const datamapObj: DataMap | undefined = datamaps.find((item: any) => item.name === datamap);

		// Check if valid
		if (datamapObj === undefined) {
			throw new Error('not a datamap');
		}

		// Creates a accessibility type object based on @Boolean(access)
		const accessType = access ? AccessibilityType.public : AccessibilityType.private;

		// Check if the import is for a field or cropfield
        if (props.importType === 'field') {
            /*
                importData(): tries to import new data
                @param farmId: id of the current active farm
                @param fieldId: id of the current field
                @param equId: equipment id for the observation type
                @param datamapId: datamap id for the equipment type
                @param accessibility: Accessibility type for users of the datamap
				@param file: csv file with data to be uploaded to the database
				@param latitude: latitude coordinate of the observation
				@param longitude: longitude coordinate of the observation
				@param datetime: date and time of the observation
            */
            importData(props.info.farmId, props.info.infoField.id, Number(equipmentObj.id), Number(datamapObj.id), accessType, file, Number(latitude), Number(longitude), datetime).then(res => {
                // Imported data successful
                if (res) {
                    window.location.reload();
                }
                // Error
                else {
                    setError(error => ({ ...error, equipment: 'Something went wrong, please try again' }));
                }
            });
        } else if (props.importType === 'cropfield') {
            /*
                importData(): tries to import new data
                @param farmId: id of the current active farm
                @param fieldId: id of the current field
                @param equId: equipment id for the observation type
                @param datamapId: datamap id for the equipment type
                @param accessibility: Accessibility type for users of the datamap
				@param file: csv file with data to be uploaded to the database
				@param latitude: latitude coordinate of the observation
				@param longitude: longitude coordinate of the observation
				@param datetime: date and time of the observation
                @param cropfield_id: cropfield id of the current active cropfield
            */
        	importData(props.info.farmId, props.info.infoField.id, Number(equipmentObj.id), Number(datamapObj.id), accessType, file, Number(latitude), Number(longitude), datetime, props.info.infoCropfield).then(res => {
                // Imported data successful
                if (res) {
                    window.location.reload();
                }
                // Error
                else {
                    setError(error => ({ ...error, equipment: 'Something went wrong, please try again' }));
                }
            });
        }
	};

	/*
        DropZoneComponent is the component view that displays the dropzone and handles the file after upload
    */
	const DropZoneComponent = () => {
		// handleUpload(): handleUpload handles the onChangeStatus of the file from the dropzone
		const handleUpload: IDropzoneProps['onChangeStatus'] = ({file}) => {
			setInfo((prevState: any) => ({ ...prevState, file: file }));
		};

		// Return a dropzone component
		return (
			<Dropzone
				onChangeStatus={handleUpload}
				maxFiles={1}
				multiple={false}
				inputContent='Drag file here or click to browse'
				accept='.csv'
				styles={{
					dropzone: {
						width: '90%',
						overflow: 'auto',
						margin: '60px auto'
					},
					inputLabel: {
                        color: '#E07A5F',
                        textAlign: 'center'
					}
				}}
			/>
		);
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
				<form
					className={classes.form}
					noValidate
					onKeyPress={event => {
						if (event.key === 'Enter') {
							handleSubmit();
						}
					}}
				>
					{/* Dropzone component for file uplaoding */}
					<DropZoneComponent />
					{/* Equipment input field */}
					<FormControl className={classes.formControl} required fullWidth>
						<InputLabel htmlFor='equipment'>Equipment</InputLabel>
						<Select id='equipment' type='text' value={equipment} onChange={onEquipmentChange} aria-describedby='equipment-error-text'>
							{equipments.map((equipment: Equipment, index: number) => (
								<MenuItem id='equipment' key={index} value={equipment.name}>
									{equipment.name}
								</MenuItem>
							))}
						</Select>
						<FormHelperText id='equipment-error-text' error>{error.equipment}</FormHelperText>
					</FormControl>
					{/* Datamap input field */}
                    <FormControl className={classes.formControl} required fullWidth>
						<InputLabel htmlFor='datamap'>Datamap</InputLabel>
						<Select id='datamap' type='text' value={datamap} onChange={onDatamapChange} aria-describedby='datamap-error-text'>
							{datamaps.map((datamap: DataMap, index: number) => (
								<MenuItem id='datamap' key={index} value={datamap.name}>
									{datamap.name}
								</MenuItem>
							))}
						</Select>
						<FormHelperText id='datamap-error-text' error>{error.datamap}</FormHelperText>
					</FormControl>
					{/* Latitude input field */}
                    <FormControl className={classes.formControl} required fullWidth>
						<InputLabel htmlFor='latitude'>Latitude</InputLabel>
						<Input id='latitude' type='text' value={latitude} onChange={onChange} aria-describedby='latitude-error-text' />
						<FormHelperText id='latitude-error-text' error>{error.latitude}</FormHelperText>
					</FormControl>
					{/* Longitude input field */}
                    <FormControl className={classes.formControl} required fullWidth>
						<InputLabel htmlFor='longitude'>Longitude</InputLabel>
						<Input id='longitude' type='text' value={longitude} onChange={onChange} aria-describedby='longitude-error-text' />
						<FormHelperText id='longitude-error-text' error>{error.longitude}</FormHelperText>
					</FormControl>
					{/* Datetime input field */}
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            format="yyyy/MM/dd HH:mm:ss"
                            margin="normal"
                            id="datetime"
                            label="Date and time"
                            value={datetime}
                            onChange={date => onDateChange(date)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
					{/* Access input field */}
					<FormControl className={classes.formControl}>
						<Grid component='label' container alignItems='center' spacing={2}>
							<Grid item>Private</Grid>
							<Grid item><Switch id='access' checked={access} onChange={onChange} value={access} /></Grid>
							<Grid item>Public</Grid>
						</Grid>
					</FormControl>
					<div className={classes.flex}>
						<Button className={classes.textbutton} onClick={() => props.setInfo((prevState: any) => ({ ...prevState, drawer: 'info' }))}>Cancel</Button>
						<Button className={classes.submit} onClick={handleSubmit}>Import data</Button>
					</div>
				</form>
			)}
		</React.Fragment>
	);
};
export default ImportComponent;
