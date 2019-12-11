/* External imports */
import React, { useState } from 'react';
import { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, IconButton, Menu, MenuItem, List } from '@material-ui/core';
import ExploreIcon from '@material-ui/icons/Explore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

/* Local imports */
import { deleteFarmField } from '../../../../../utils/Controllers/FieldController';
import CropfieldListItem from './CropfieldListItem';

/*
	Renders the field item for the overview list and creates all corresponding cropfields
*/
const FieldListItem = (props: any) => {
	/*
		field: contains the current field
		anchorEl: contains the state that handles the anchor position for the popover menu
		open: contains the state of the menu
	*/
	const field = props.field;
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/*
		handleClick(): handles the click on the menu icon to open the corresponding menu
		@param event: the event of the clicked menu icon
	*/
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	/*
		handleClose(): handles the closing of the menu by an outside click
	*/
	const handleClose = () => {
		setAnchorEl(null);
	};

	/*
		handleFieldDelete(): handles the deletion of the current field on click after accepting confirmation
	*/
	const handleFieldDelete = async () => {
		var confirmation = window.confirm('Are you sure you want to delete ' + field.field_name + ' and all of its cropfields?');
		if (confirmation === true) {
			if (await deleteFarmField(props.info.farmId, field.id)) {
				alert(field.field_name + ' has been deleted.');
				window.location.reload();
			} else {
				alert('Something went wrong when trying to delelete ' + field.field_name + '.');
			}
		}
	};

	/*
		Returns the field item and its corresponding cropfields and menu
	*/
	return (
		<React.Fragment>
			<ListItem button onClick={() => props.handleCenterChange(field.coordinates)}>
				<ListItemIcon>
					<ExploreIcon />
				</ListItemIcon>
				<ListItemText primary={field.field_name} />
				<ListItemSecondaryAction>
					<IconButton aria-controls='field_menu' aria-haspopup='true' onClick={handleClick}>
						<MoreVertIcon />
					</IconButton>
					<Menu id='field_menu' anchorEl={anchorEl} open={open} onClose={handleClose}>
						<MenuItem
							onClick={() => {
								props.setInfo((prevState: any) => ({ ...prevState, drawer: 'view_field' }));
								props.setInfo((prevState: any) => ({ ...prevState, infoField: field }));
							}}
						>
							View information
						</MenuItem>
						<MenuItem
							onClick={() => {
								props.setInfo((prevState: any) => ({ ...prevState, drawer: 'import_field' }));
								props.setInfo((prevState: any) => ({ ...prevState, infoField: field }));
							}}
						>
							Import data
						</MenuItem>
						<MenuItem onClick={handleFieldDelete}>Delete field</MenuItem>
					</Menu>
				</ListItemSecondaryAction>
			</ListItem>
			<List style={{ paddingLeft: 20 }}>
				{/* Create all cropfields belonging to the current field */}
				{/* eslint-disable-next-line */}
				{props.info.cropfields.map((cropfield: any, index: number) => {
					if (field.id === cropfield.field_id) {
						// eslint-disable-next-line
						return <CropfieldListItem key={index} info={props.info} setInfo={props.setInfo} field={field} cropfield={cropfield} handleCenterChange={props.handleCenterChange} />;
					}
				})}
			</List>
		</React.Fragment>
	);
};

export default FieldListItem;
