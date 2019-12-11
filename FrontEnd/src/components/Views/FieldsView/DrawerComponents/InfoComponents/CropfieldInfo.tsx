/* External imports */
import React from 'react';
import { List, ListItem, ListItemText, Divider, ListSubheader, Typography, IconButton, makeStyles } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';

/* Internal imports */
import { LocationPoint } from '../../../../../common/LocationPoint';
import { CropField } from '../../../../../common/CropField';

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
const CropfieldInfo = (props: any) => {
	const classes = useStyles();

	/*
        cropfield: contains the current active cropfield
    */
	const cropfield: CropField = props.info.infoCropfield;

	/*
        Returns the information of the current active cropfield and displays the navigation buttons if @CropField{cropfield}
    */
	return (
		<React.Fragment>
			{cropfield ? (
				<React.Fragment>
					<div className={classes.header}>
						<Typography>Cropfield information</Typography>
						<div>
                            {/* Role of farm admin or farmer */}
							{props.info.role === 'farm_admin' || props.info.role === 'farmer' ? (
								<IconButton
									onClick={() => {
										props.setInfo((prevState: any) => ({
											...prevState,
											drawer: 'edit_cropfield',
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
                        {/*  Cropfield name */}
						<ListItem>
							<ListItemText primary={'Cropfield name: ' + cropfield.name} />
						</ListItem>
                        {/* Croptype */}
						<ListItem>
							<ListItemText primary={'Croptype: ' + cropfield.crop_type.name} />
						</ListItem>
                        {/* Start date */}
						<ListItem>
							<ListItemText primary={'Period start: ' + cropfield.period_start} secondary={'Date cropfield was planted'} />
						</ListItem>
                        {/* End date */}
						<ListItem>
							<ListItemText primary={'Period end: ' + cropfield.period_end} secondary={'Date cropfield was harvested'} />
						</ListItem>
                        {/* Accessibility */}
						<ListItem>
							<ListItemText primary={'Accessibility: ' + cropfield.accessibility} />
						</ListItem>
						<Divider />
                        {/* Coordinates */}
						<ListSubheader>GPS coordinates of cropfield:</ListSubheader>
						{cropfield.coordinates.map((element: LocationPoint, index: number) => (
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

export default CropfieldInfo;
