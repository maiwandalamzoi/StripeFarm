/* External imports */
import React, { useContext } from 'react';
import { Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardIos';
import CancelIcon from '@material-ui/icons/Cancel';

/* Libraries */
import { GoogleMapContext, CustomControl } from '@googlemap-react/core';

/* Local imports */
import { Field } from '../../../common/Field';
import { LocationPoint } from '../../../common/LocationPoint';
import { CropField } from '../../../common/CropField';
import { updateFarmField } from '../../../utils/Controllers/FieldController';
import { updateCropField } from '../../../utils/Controllers/CropFieldController';

/*
    Styles for the view
*/
const useStyles = makeStyles(theme => ({
    fab: {
        margin: theme.spacing(1),
        background: 'white'
    },
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
    },
    nested: {
        paddingLeft: theme.spacing(4)
    },
    container: {
        display: 'flex',
        flexDirection: 'column'
    },
    drawerButton: {
        height: 60,
        width: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'white',
        borderRadius: '0 0 0 3px',
        boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 4px -1px',
        transition: 'all 0.2s ease',
        '&:hover': {
            cursor: 'pointer',
            background: 'white',
            color: theme.palette.primary.main
        }
    }
}));

/*
    Renders all the control buttons on the map
*/
const MapControl = (props: any) => {
    const classes = useStyles();

    /*
        state: this const handles the context for the Google Maps wrapper
    */
    const { state } = useContext(GoogleMapContext);

    /*
        savePolygon(): gathers all polygon points on the map, converts them to coordinates, and updates the fields and cropfields
    */
    const savePolygon = () => {
        // Set map state to non-editable
        props.setInfo((prevState: any) => ({ ...prevState, editable: false }));

        /*
            convertCoordinates(): returns the coordinates of the newly created polygon
            @param poly: Google Maps Polygon that needs to be converted to coordinates based on each polygon point
        */
        const convertCoordinates = (poly: google.maps.Polygon) => {
            /*
                newCoordinates: contains a list of all new point coordinates of the polygon field
            */
            let newCoordinates = new Array<any>();

            // Loop through all polygon points and create coordinates
            for (let i = 0; i < poly.getPath().getLength(); i++) {
                let temp = poly
                    .getPath()
                    .getAt(i)
                    .toUrlValue();
                var res = temp.split(',', 2);
                newCoordinates.push(
                    new LocationPoint(Number(res[0]), Number(res[1]))
                );
            }
            return newCoordinates;
        };

        // Loop through all fields
        props.info.fields.forEach((field: Field) => {
            /*
                poly: contains the polygon of the field with current id

            */
            let poly: google.maps.Polygon = state.objects.get(
                'field' + field.id.toString()
            ) as google.maps.Polygon;

            // Calculate area of polygon
            var area = google.maps.geometry.spherical.computeArea(
                poly.getPath()
            );
            // Update polygon size, rounds to 2 decimals, and drops extra zeros
            let polygonSize = +(area / 10000).toFixed(2);

            /*
                newField: contains the old field values except for the coordinates, which will update based on the polygon points
            */
            let newField: Field = new Field(
                field.id,
                field.field_name,
                [],
                polygonSize,
                field.soil_type,
                field.accessibility
            );

            // Convert polygon to coordinate list and update current coordinates
            newField.coordinates = convertCoordinates(poly);
            updateFarmField(props.info.farmId, newField);

            // Loop through all the cropfields
            props.info.cropfields.forEach((cropfield: CropField) => {
                // Check if field matches the cropfield field
                if (field.id === cropfield.field_id) {
                    /*
                        newField: contains the old field values except for the coordinates, which will update based on the polygon points
                        poly: contains the polygon of the field with current id

                    */
                    let newCropField: CropField = new CropField(
                        cropfield.id,
                        cropfield.farm_id,
                        cropfield.field_id,
                        cropfield.name,
                        cropfield.period_start,
                        cropfield.period_end,
                        [],
                        cropfield.crop_type,
                        cropfield.accessibility
                    );
                    let poly: google.maps.Polygon = state.objects.get(
                        'cropfield' + cropfield.id.toString()
                    ) as google.maps.Polygon;

                    // Convert polygon to coordinate list and update current coordinates
                    newCropField.coordinates = convertCoordinates(poly);
                    updateCropField(props.info.farmId, field.id, newCropField);
                }

                // Field does not have this cropfield als child
                else {
                    console.log('skipped since not right field');
                }
            });
        });

        // Finished
        window.location.reload();
    };

    /*
        Return: return creates the view where the buttons are mapped relative to the map borders
    */
    return (
        <React.Fragment>
            {/* Controls for the top left (Drawer state controller) */}
            <CustomControl bindingPosition={'RIGHT_TOP'}>
                <div
                    className={classes.drawerButton}
                    aria-label='open'
                    onClick={() =>
                        props.setInfo((prevState: any) => ({
                            ...prevState,
                            drawerState: !props.info.drawerState
                        }))
                    }
                >
                    {props.info.drawerState ? (
                        <ArrowForwardIcon />
                    ) : (
                        <ArrowBackIcon />
                    )}
                </div>
            </CustomControl>

            {/* Controls for the bottom right (Add and edit) */}
            <CustomControl bindingPosition={'RIGHT_BOTTOM'}>
                <div className={classes.container}>
                    {props.info.role === 'farm_admin' ||
                    props.info.role === 'farmer' ? (
                        <React.Fragment>
                            {props.info.editable ? (
                                <React.Fragment>
                                    <Fab
                                        className={classes.fab}
                                        aria-label='save'
                                        onClick={savePolygon}
                                    >
                                        <SaveIcon />
                                    </Fab>
                                    <Fab
                                        className={classes.fab}
                                        aria-label='cancel'
                                        onClick={() =>
                                            props.setInfo((prevState: any) => ({
                                                ...prevState,
                                                editable: false
                                            }))
                                        }
                                    >
                                        <CancelIcon />
                                    </Fab>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <Fab
                                        className={classes.fab}
                                        aria-label='add'
                                        onClick={() =>
                                            props.setInfo((prevState: any) => ({
                                                ...prevState,
                                                drawType:
                                                    google.maps.drawing
                                                        .OverlayType.POLYGON
                                            }))
                                        }
                                    >
                                        <AddIcon />
                                    </Fab>
                                    <Fab
                                        className={classes.fab}
                                        aria-label='edit'
                                        onClick={() =>
                                            props.setInfo((prevState: any) => ({
                                                ...prevState,
                                                editable: true
                                            }))
                                        }
                                    >
                                        <EditIcon />
                                    </Fab>
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    ) : null}
                </div>
            </CustomControl>
        </React.Fragment>
    );
};

export default MapControl;
