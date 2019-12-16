/* External imports */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MenuItem, FormControl, InputLabel, Input, FormHelperText, Select, Grid, Switch, Button } from '@material-ui/core';

/* Libraries */
import GridLoader from 'react-spinners/GridLoader';
import DateFnsUtils from '@date-io/date-fns';

/* Local imports */
import { getCropTypes } from '../../../../../utils/Controllers/TypesController';
import { AccessibilityType } from '../../../../../common/AccessibilityType';
import { CropType } from '../../../../../common/CropType';
import { CropField } from '../../../../../common/CropField';
import { addCropField, updateCropField } from '../../../../../utils/Controllers/CropFieldController';
import { Field } from '../../../../../common/Field';
import { getFarmFields } from '../../../../../utils/Controllers/FieldController';

/*
	Styles for the view
*/
const useStyles = makeStyles(theme => ({
    form: {
        width: '80%',
        margin: '20px auto'
    },
    formControl: {
        marginTop: theme.spacing(1)
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
    cropfieldName: '',
    fieldName: '',
    startDate: new Date(),
    endDate: new Date(),
    coordinates: Array<any>(),
    cropType: '',
    access: false
};

/*
    Renders the add/edit cropfield component and retrieves cropfield data if @boolean{props.info.editInfo}
*/
const AddCropfieldComponent = (props: any) => {
    const classes = useStyles();

    /*
		cropfield: contains the cropfield that is currently selected
        state: contains the decomposed state based on the initial state
        error: contains the error messages based on the initial state
		cropTypeList: contains the list of croptypes retrieved from the database
		fieldList: contains the list of fields retrieved from the database
        isLoading: this constant handles the state of the loading icon
    */
    const cropfield = props.info.infoCropfield;
    const [{ cropfieldName, fieldName, startDate, endDate, coordinates, cropType, access }, setInfo] = useState(initialState);
    const [error, setError] = useState(initialState);
    const [cropTypeList, setCropTypeList] = useState(Array<CropType>());
    const [fieldList, setFieldList] = useState(Array<Field>());
    const [isLoading, setIsLoading] = useState(false);

    /*
    	fetchCropTypes(): retrieves all crop types stored in the database
    */
    async function fetchCropTypes() {
        try {
            const res = await getCropTypes();
            return res;
        } catch (e) {
            console.error(e.message);
        }
    }

    /*
    	fetchFields(): retrieves all fields stored in the database by id of the current active farm
    */
    async function fetchFields() {
        try {
            const res = await getFarmFields(props.info.farmId);
            return res;
        } catch (e) {
            console.error(e.message);
        }
    }

    /*
        useEffect(): useEffect refreshes the render after a state has been updated
    */
    useEffect(() => {
        // getCropTypes(): handle the loading icon state and call fetchCropTypes() to ensure the result is not empty
        async function getCropTypes() {
            setIsLoading(true);
            const res = await fetchCropTypes();
            if (res) {
                setCropTypeList(res);
            }
            setIsLoading(false);
        }

        //getFields(): handle the loading icon state and call fetchFields() to ensure the result is not empty
        async function getFields() {
            setIsLoading(true);
            const res = await fetchFields();
            if (res) {
                setFieldList(res);
                if (props.info.editInfo) {
                    const fieldObj: Field | undefined = res.find((item: any) => item.id === cropfield.field_id);
                    if (fieldObj) {
                        setInfo(prevState => ({ ...prevState, fieldName: fieldObj.field_name }));
                    }
                }
            }
            setIsLoading(false);
        }
        //setData(): handle the loading icon state and sets the current data to a reference local state
        async function setData() {
            onDateChange('startDate', cropfield.period_start);
            onDateChange('endDate', cropfield.period_end);
            setInfo(prevState => ({ ...prevState, cropfieldName: cropfield.name, coordinates: cropfield.coordinates, cropType: cropfield.crop_type.name }));
            if (cropfield.accessibility === 'public') {
                setInfo(prevState => ({ ...prevState, access: true }));
            }
            setIsLoading(false);
        }
        getCropTypes();
        getFields();
        if (props.info.editInfo) {
            setData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cropfield]);

    // Loading: this component creates a loading icon while fetching data until complete to give feedback to the user
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
        onFieldChange(): function that handles the model input
        @param e: event that triggered the onFieldChange function
    */
    const onFieldChange = (e: any) => {
        const { value } = e.target;
        setInfo(prevState => ({ ...prevState, fieldName: value }));
    };

    /*
        onDateChange(): function that handles the model input
        @param e: event that triggered the onDateChange function
    */
    const onDateChange = (id: string, date: Date | null) => {
        console.log(date);
        if (date) {
            setInfo(prevState => ({ ...prevState, [id]: date }));
        }
    };

    /*
        onCropTypeChange(): function that handles the model input
        @param e: event that triggered the onCropTypeChange function
    */
    const onCropTypeChange = (e: any) => {
        const { value } = e.target;
        setInfo(prevState => ({ ...prevState, cropType: value }));
    };

    /*
        handleSubmit(): handles the submit of the form
    */
    const handleSubmit = () => {
        // Reset errors
        setError(initialState);

        // Stop drawing
        props.setInfo((prevState: any) => ({ ...prevState, editable: false }));

        // Cropfield name field empty
        if (!cropfieldName) {
            setError(error => ({ ...error, cropfieldName: 'Please fill in your cropfield name' }));
            return;
        }

        // Create a crop type object based on its name
        const croptypeObj: CropType | undefined = cropTypeList.find((item: any) => item.name === cropType);

        // Check if valid
        if (croptypeObj === undefined) {
            throw new Error('not a crop type');
        }

        // Create a field object based on its name
        const fieldObj: Field | undefined = fieldList.find((item: any) => item.field_name === fieldName);

        // Check if valid
        if (fieldObj === undefined) {
            throw new Error('not a field');
        }

        // Creates a accessibility type object based on @Boolean(access)
        const accessType = access ? AccessibilityType.public : AccessibilityType.private;

        // Check if field is new or if it is editable
        if (props.info.editInfo) {
            // Create a cropfield object based on the form
            let cropfieldObj: CropField = new CropField(cropfield.id, props.info.farmId, fieldObj.id, cropfieldName, startDate, endDate, coordinates, croptypeObj, accessType);

            /*
                updateCropField(): tries to update the current cropfield
				@param farmId: id of the current active farm
				@param fieldId: id of the current parent field
				@param cropfieldObj: cropfield object that contains the updated values
            */
            updateCropField(props.info.farmId, fieldObj.id, cropfieldObj).then(res => {
                if (res) {
                    // Adding farm succesfull
                    window.location.reload();
                } else {
                    setError(error => ({ ...error, fieldName: 'Something went wrong, please try again' }));
                    console.error('Something went wrong');
                }
            });
        } else {
            // Create a cropfield object based on the form
            let cropfieldObj: CropField = new CropField(undefined, props.info.farmId, fieldObj.id, cropfieldName, startDate, endDate, props.info.coords, croptypeObj, accessType);

            /*
                addCropField(): tries to create a new cropfield
				@param farmId: id of the current active farm
				@param fieldId: id of the current parent field
				@param cropfieldObj: cropfield object that contains the new values
            */
            addCropField(props.info.farmId, fieldObj.id, cropfieldObj).then(res => {
                if (res) {
                    // Adding farm succesfull
                    window.location.reload();
                } else {
                    setError(error => ({ ...error, fieldName: 'Something went wrong, please try again' }));
                    console.error('Something went wrong');
                }
            });
        }
    };

    /*
        Return: return creates the view where the create/edit cropfield form is shown if @state{isLoading} is false
		isLoading:
			true: show loading icon
			false: show create/edit cropfield form
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
                    {/* Cropfield name input field */}
                    <FormControl className={classes.formControl} required fullWidth>
                        <InputLabel htmlFor='cropfieldName'>Cropfield name</InputLabel>
                        <Input id='cropfieldName' type='text' value={cropfieldName} onChange={onChange} aria-describedby='cropfieldName-error-text' />
                        <FormHelperText id='cropfieldName-error-text' error>
                            {error.cropfieldName}
                        </FormHelperText>
                    </FormControl>
                    {/* Field input field */}
                    <FormControl className={classes.formControl} required fullWidth>
                        <InputLabel htmlFor='fieldName'>Field</InputLabel>
                        <Select id='fieldName' type='text' value={fieldName} onChange={onFieldChange} aria-describedby='fieldName-error-text'>
                            {fieldList.map((field: Field, index: number) => (
                                <MenuItem id='fieldName' key={index} value={field.field_name}>
                                    {field.field_name}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText id='fieldName-error-text' error>
                            {error.fieldName}
                        </FormHelperText>
                    </FormControl>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        {/* Start date input field */}
                        <KeyboardDatePicker
                            format='yyyy/MM/dd'
                            margin='normal'
                            id='startDate'
                            label='Start date'
                            value={startDate}
                            onChange={date => onDateChange('startDate', date)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date'
                            }}
                        />
                        {/* End date input field */}
                        <KeyboardDatePicker
                            format='yyyy/MM/dd'
                            margin='normal'
                            id='endDate'
                            label='End date'
                            value={endDate}
                            onChange={date => onDateChange('endDate', date)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date'
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    {/* Crop type input field */}
                    <FormControl className={classes.formControl} required fullWidth>
                        <InputLabel htmlFor='cropType'>Crop type</InputLabel>
                        <Select id='cropType' type='text' value={cropType} onChange={onCropTypeChange} aria-describedby='cropType-error-text'>
                            {cropTypeList.map((cropType: CropType, index: number) => (
                                <MenuItem id='cropType' key={index} value={cropType.name}>
                                    {cropType.name}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText id='cropType-error-text' error>
                            {error.cropType}
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
                        <Button
                            className={classes.textbutton}
                            onClick={() => {
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
export default AddCropfieldComponent;
