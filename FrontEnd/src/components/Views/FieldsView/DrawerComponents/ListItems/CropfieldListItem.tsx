/* External imports */
import React, { useState } from 'react';
import { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, IconButton, Menu, MenuItem } from '@material-ui/core';
import PictureInPictureIcon from '@material-ui/icons/PictureInPicture';
import MoreVertIcon from '@material-ui/icons/MoreVert';

/* Local imports */
import { deleteCropField } from '../../../../../utils/Controllers/CropFieldController';
import { getColor } from '../../RenderMap';

/*
	Renders the cropfield item for the overview list per field
*/
const CropfieldListItem = (props: any) => {
	/*
		field: contains the current field
		cropfield: contains the current cropfield
		anchorEl: contains the state that handles the anchor position for the popover menu
		open: contains the state of the menu
	*/
	const field = props.field;
	const cropfield = props.cropfield;
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
		handleCropFieldDelete(): handles the deletion of the current cropfield on click after accepting confirmation
	*/
	const handleCropfieldDelete = async () => {
		var confirmation = window.confirm('Are you sure you want to delete ' + cropfield.name + ' ?');
		if (confirmation === true) {
			if (await deleteCropField(props.info.farmId, cropfield.field_id, cropfield.id)) {
				alert(cropfield.name + ' has been deleted.');
				window.location.reload();
			} else {
				alert('Something went wrong when trying to delelete ' + cropfield.cropfield_name + '.');
			}
		}
	};

	/*
		Returns the cropfield item and its corresponding menu
	*/
	return (
		<ListItem button onClick={() => props.handleCenterChange(cropfield.coordinates)}>
			<ListItemIcon>
				<PictureInPictureIcon htmlColor={getColor(cropfield.crop_type.id)} />
			</ListItemIcon>
			<ListItemText primary={cropfield.name} secondary={cropfield.crop_type.name} />
			<ListItemSecondaryAction>
				<IconButton aria-controls='cropfield_menu' aria-haspopup='true' onClick={handleClick}>
					<MoreVertIcon />
				</IconButton>
				<Menu id='cropfield_menu' anchorEl={anchorEl} open={open} onClose={handleClose}>
					<MenuItem
						onClick={() => {
							props.setInfo((prevState: any) => ({ ...prevState, drawer: 'view_cropfield' }));
							props.setInfo((prevState: any) => ({ ...prevState, infoField: field }));
							props.setInfo((prevState: any) => ({ ...prevState, infoCropfield: cropfield }));
						}}
					>
						View information
					</MenuItem>
					<MenuItem
						onClick={() => {
							props.setInfo((prevState: any) => ({ ...prevState, drawer: 'import_cropfield' }));
							props.setInfo((prevState: any) => ({ ...prevState, infoField: field }));
							props.setInfo((prevState: any) => ({ ...prevState, infoCropfield: cropfield }));
						}}
					>
						Import data
					</MenuItem>
					<MenuItem onClick={handleCropfieldDelete}>Delete cropfield</MenuItem>
				</Menu>
			</ListItemSecondaryAction>
		</ListItem>
	);
};

export default CropfieldListItem;
