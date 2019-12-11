/* External imports */
import React from 'react';
import { List, ListItem, ListItemText, Divider, ListSubheader, Typography, IconButton, makeStyles } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';

/* Internal imports */
import { LocationPoint } from '../../../../../common/LocationPoint';
import { Field } from '../../../../../common/Field';

/*
    Styles for the view
*/
const useStyles = makeStyles(theme => ({
	header: {
		height: 60,
		margin: theme.spacing(0, 2),
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
}));

/*
    Renders the info component for the current field
*/
const FieldInfo = (props: any) => {
	const classes = useStyles();

	/*
        field: contains the current active field
    */
	const field: Field = props.info.infoField;

	/*
        Returns the information of the current active field and displays the navigation buttons if @Field{field}
    */
	return (
		<React.Fragment>
			{field ? (
				<React.Fragment>
					<div className={classes.header}>
						<Typography>Field information</Typography>
						<div>
                            {/* Role of farm admin or farmer */}
							{props.info.role === 'farm_admin' || props.info.role === 'farmer' ? (
								<IconButton
									onClick={() => {
										props.setInfo((prevState: any) => ({
											...prevState,
											drawer: 'edit_field',
											editInfo: true
										}));
									}}
								>
									<EditIcon />
								</IconButton>
							) : null}
							<IconButton
								onClick={() => {
									props.setInfo((prevState: any) => ({
										...prevState,
										drawer: 'info'
									}));
								}}
							>
								<ClearIcon />
							</IconButton>
						</div>
					</div>
					<Divider />
					<List>
                        {/* Field name */}
						<ListItem>
							<ListItemText primary={'Field name: ' + field.field_name} />
						</ListItem>
                        {/* Size in hectares */}
						<ListItem>
							<ListItemText primary={'Size (in hectares): ' + field.size_in_hectare} />
						</ListItem>
                        {/* Soiltype */}
						<ListItem>
							<ListItemText primary={'Soiltype: ' + field.soil_type.name} secondary={'Description: ' + field.soil_type.description} />
						</ListItem>
                        {/* Accessibility */}
						<ListItem>
							<ListItemText primary={'Accessibility: ' + field.accessibility} />
						</ListItem>
						<Divider />
                        {/* Coordinates */}
						<ListSubheader>GPS coordinates of field:</ListSubheader>
						{field.coordinates.map((element: LocationPoint, index: number) => (
							<ListItem key={index}>
								<ListItemText primary={element.latitude + ', ' + element.longitude} />
							</ListItem>
						))}
					</List>
				</React.Fragment>
			) : null}
		</React.Fragment>
	);
};

export default FieldInfo;
