/* External imports */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, Grid, Switch, FormLabel, Typography, IconButton, Divider } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

/* Internal imports */
import CreateCropFieldComponent from './CreateComponents/CreateCropFieldComponent';
import CreateFieldComponent from './CreateComponents/CreateFieldComponent';

/*
    Styles for the view
*/
const useStyles = makeStyles(theme => ({
    header: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		margin: theme.spacing(2)
	},
	formControl: {
		margin: theme.spacing(2)
	}
}));

/*
    Renders the create field or cropfield view with corresponding component
*/
const CreateField = (props: any) => {
	const classes = useStyles();

	/*
		@param isField: contains the state that handles if the drawn polygon is to be a field or cropfield
	*/
	const [isField, setIsField] = useState(false);

	/*
		Renders the name and button of the component, the (crop)field switch, and its child components
	*/
	return (
		<React.Fragment>
            <div className={classes.header}>
                <Typography>Cropfield information</Typography>
                <IconButton
                    onClick={() => {
                        props.setInfo((prevState: any) => ({ ...prevState, drawer: 'info' }));
                    }}
                >
                    <ClearIcon />
                </IconButton>
            </div>
            <Divider />
			{/* (Crop)field input field */}
			<FormControl className={classes.formControl} fullWidth>
                <FormLabel>Choose what kind of field you want to create</FormLabel>
				<Grid component='label' container alignItems='center' spacing={2}>
					<Grid item>Cropfield</Grid>
					<Grid item>
						<Switch id='fieldSwitch' checked={isField} onChange={e => setIsField(e.target.checked)} value={isField} />
					</Grid>
					<Grid item>Field</Grid>
				</Grid>
			</FormControl>

			{isField ?
                <CreateFieldComponent info={props.info} setInfo={props.setInfo} edit={false}/>
                :
                <CreateCropFieldComponent info={props.info} setInfo={props.setInfo} edit={false}/>
            }
		</React.Fragment>
	);
}

export default CreateField;