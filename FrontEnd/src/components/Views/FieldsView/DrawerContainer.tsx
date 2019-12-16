/* External imports */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

/* Libraries */
import clsx from 'clsx';

/* Local imports */
import FieldInfo from './DrawerComponents/InfoComponents/FieldInfo';
import CropfieldInfo from './DrawerComponents/InfoComponents/CropfieldInfo';
import OverviewInfo from './DrawerComponents/OverviewInfo';
import CreateField from './DrawerComponents/CreateField';
import ImportComponent from './DrawerComponents/ImportComponent';
import AddFieldComponent from './DrawerComponents/CreateComponents/CreateFieldComponent';
import AddCropfieldComponent from './DrawerComponents/CreateComponents/CreateCropFieldComponent';

// Constants for the drawer size
const drawerWidthOpen = 600;
const drawerWidthClose = 0;

/*
    Styles for the view
*/
const useStyles = makeStyles(theme => ({
    drawer: {
        height: 'calc(100vh - 70px)',
        overflowX: 'hidden',
        background: 'white'
    },
    drawerOpen: {
        width: drawerWidthClose,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerClose: {
        overflowX: 'hidden',
        width: drawerWidthOpen,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
}));

/*
    Renders the drawer and its specified content based on the value of @string{viewType}
*/
const DrawerContainer = (props: any) => {
    const classes = useStyles();

    // Import type (field or cropfield)
    let importType = ''

    /*
        switchView(): renders the correct component based on the value of @string{viewType}
    */
    const switchView = (viewType: string) => {
        switch(viewType) {
            // Render overview list for fields and cropfields component
            case 'info':
                return <OverviewInfo info={props.info} setInfo={props.setInfo} handleCenterChange={props.handleCenterChange} />
            // Render create field component (switch functionality for field and cropfield in lower state)
            case 'create':
                return <CreateField info={props.info} setInfo={props.setInfo} />
            // Render import component for field
            case 'import_field':
                importType = 'field'
                return <ImportComponent info={props.info} setInfo={props.setInfo} importType={importType} />
            // Render import component for cropfield
            case 'import_cropfield':
                importType = 'cropfield'
                return <ImportComponent info={props.info} setInfo={props.setInfo} importType={importType} />
            // Render information component for field
            case 'view_field':
                return <FieldInfo info={props.info} setInfo={props.setInfo} />
            // Render information component for cropfield
            case 'view_cropfield':
                return <CropfieldInfo info={props.info} setInfo={props.setInfo} />
            // Render add and delete component for field
            case 'edit_field':
                return <AddFieldComponent info={props.info} setInfo={props.setInfo}/>
            // Render add and delete component for cropfield
            case 'edit_cropfield':
                return <AddCropfieldComponent info={props.info} setInfo={props.setInfo}/>
            // Render overview list for fields and cropfields component as default
            default:
                return <OverviewInfo info={props.info} setInfo={props.setInfo} handleCenterChange={props.handleCenterChange} />
        }
    }

    /*
        Renders the drawer based on its @boolean{drawerState} and @function{switchView}
    */
    return (
        <div
            className={clsx(classes.drawer, {
                [classes.drawerClose]: props.info.drawerState,
                [classes.drawerOpen]: !props.info.drawerState
            })}
        >

            {switchView(props.info.drawer)}
        </div>
    )
}
export default DrawerContainer;
