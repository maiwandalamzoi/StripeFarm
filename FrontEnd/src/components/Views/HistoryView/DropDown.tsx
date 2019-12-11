/* External imports */
import React from 'react';
import { makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import { Input, InputLabel, MenuItem, FormControl, Select, Grid } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';

/* Libraries */
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

/*
    Styles for the view
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

// Static data field name
const field_name = ['Happy field', 'Joyful field', 'Battle field', 'Rose field'];

// Static data cropfield name
const cropfield_name = ['Blue CF', 'Green CF', 'Red CF'];

// Static data field type
const type = ['Type A', 'Type B'];

// Static data cropfield type
const cropfield_type = ['Potatoe CF', 'Tomatoe CF', 'Apple CF'];

// Static data equipment
const sensor = ['Sensor 1', 'Sensor 2', 'Sensor 3', 'Sensor 4', 'Sensor 5'];

// Static data soil type
const soil_type = ['Clay', 'Sandy', 'Silty', 'Chalky'];

/*
    getStyles(): retrieves the styles belonging to a person
*/
function getStyles(name: string, personName: string[], theme: Theme) {
	return {
		fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
	};
}

/*
    Renders the multiple selection dropdown
*/
export default function MultipleSelect() {
	const classes = useStyles();
	const theme = useTheme();
	const [personName, setPersonName] = React.useState<string[]>([]);

    /*
        handleChange(): function that handles the inputs of the form
        @param e: event that triggered the handleChange function
    */
	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setPersonName(event.target.value as string[]);
	};

    /*
        handleChangeMultiple(): function that handles the inputs of the dropdown menu
        @param e: event that triggered the handleChangeMultiple function
    */
	const handleChangeMultiple = (event: React.ChangeEvent<{ value: unknown }>) => {
		const { options } = event.target as HTMLSelectElement;
		const value: string[] = [];
		for (let i = 0, l = options.length; i < l; i += 1) {
			if (options[i].selected) {
				value.push(options[i].value);
			}
		}
		setPersonName(value);
	};

    // Selected date of the data
	const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date('2014-08-18T21:11:54'));

    /*
        handleDateChange(): function that handles the change of the date
        @param date: date to be set to
    */
	const handleDateChange = (date: Date | null) => {
		setSelectedDate(date);
	};

    /*
        Return render of this component
    */
	return (
		<div className={classes.root}>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<Grid>
					<div>
                        {/* start date form field */}
						<KeyboardDatePicker
							disableToolbar
							variant='inline'
							format='MM/dd/yyyy'
							margin='normal'
							id='date-picker-inline'
							label='Start Date'
							value={selectedDate}
							onChange={handleDateChange}
							KeyboardButtonProps={{
								'aria-label': 'change date'
							}}
						/>
					</div>

					<div>
                        {/* Start time form field */}
						<KeyboardTimePicker
							margin='normal'
							id='time-picker'
							label='Start Time'
							value={selectedDate}
							onChange={handleDateChange}
							KeyboardButtonProps={{
								'aria-label': 'change time'
							}}
						/>
					</div>

					<div>
                        {/* End date form field */}
						<KeyboardDatePicker
							margin='normal'
							id='date-picker-dialog'
							label='End Date'
							format='MM/dd/yyyy'
							value={selectedDate}
							onChange={handleDateChange}
							KeyboardButtonProps={{
								'aria-label': 'change date'
							}}
						/>
					</div>
					<div>
                        {/* End time form field */}
						<KeyboardTimePicker
							margin='normal'
							id='time-picker'
							label='End Time'
							value={selectedDate}
							onChange={handleDateChange}
							KeyboardButtonProps={{
								'aria-label': 'change time'
							}}
						/>
					</div>
				</Grid>
			</MuiPickersUtilsProvider>

            {/* Field form field */}
			<FormControl className={classes.formControl}>
				<InputLabel htmlFor='select-multiple'>Field</InputLabel>
				<Select multiple value={personName} onChange={handleChange} input={<Input id='select-multiple' />} MenuProps={MenuProps}>
					{field_name.map(name => (
						<MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
							{name}
						</MenuItem>
					))}
				</Select>
			</FormControl>

            {/* Cropfield form field */}
			<FormControl className={classes.formControl}>
				<InputLabel htmlFor='select-multiple-chip'>Crop Field</InputLabel>
				<Select multiple value={personName} onChange={handleChange} input={<Input id='select-multiple-chip' />}>
					{cropfield_name.map(name => (
						<MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
							{name}
						</MenuItem>
					))}
				</Select>
			</FormControl>

            {/* Farm type form field */}
			<FormControl className={classes.formControl}>
				<InputLabel htmlFor='select-multiple-chip'>Type</InputLabel>
				<Select multiple value={personName} onChange={handleChange} input={<Input id='select-multiple-chip' />}>
					{type.map(name => (
						<MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
							{name}
						</MenuItem>
					))}
				</Select>
			</FormControl>

            {/* Crop type form field */}
			<FormControl className={classes.formControl}>
				<InputLabel htmlFor='select-multiple-chip'>Crop Type</InputLabel>
				<Select multiple value={personName} onChange={handleChange} input={<Input id='select-multiple-chip' />}>
					{cropfield_type.map(name => (
						<MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
							{name}
						</MenuItem>
					))}
				</Select>
			</FormControl>

            {/* Equipment form field */}
			<FormControl className={classes.formControl}>
				<InputLabel htmlFor='select-multiple-chip'>Sensor</InputLabel>
				<Select multiple value={personName} onChange={handleChange} input={<Input id='select-multiple-chip' />}>
					{sensor.map(name => (
						<MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
							{name}
						</MenuItem>
					))}
				</Select>
			</FormControl>

            {/* Soil type form field */}
			<FormControl className={classes.formControl}>
				<InputLabel htmlFor='select-multiple-chip'>Soil Type</InputLabel>
				<Select multiple value={personName} onChange={handleChange} input={<Input id='select-multiple-chip' />}>
					{soil_type.map(name => (
						<MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
							{name}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	);
}
