/* External imports */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

/* Libraries */
import { GoogleMapProvider, MapBox, Polygon, DrawingManager } from '@googlemap-react/core';

/* Local imports */
import MapControl from './MapControl';
import DrawerContainer from './DrawerContainer';
import { LocationPoint } from '../../../common/LocationPoint';

/*
    Styles for the view
*/
const useStyles = makeStyles(theme => ({
	root: {
		height: '100%',
		width: '100%',
        display: 'flex',
        overflow: 'hidden'
	},
	map: {
		height: 'calc(100vh - 70px) !important'
	}
}));

/*
	transformCoordinates(): function to transform the LocationPoint arrays from the database into usable coordinates
	@param coordinates: LocationPoint array that has to be converted to an array of coordinates
*/
export function transformCoordinates(coordinates: LocationPoint[]) {
	var coords: Array<any> = [];
	coordinates.forEach(function(x) {
		// We check if the long or lat is not empty, then we add it to the array we will return
		if (isNaN(x.longitude) || isNaN(x.latitude)) {
			console.log('coordinate is not a number');
		} else {
			coords.push({ lat: x.latitude, lng: x.longitude });
		}
	});
	return coords;
}

/*
	transformCoordinates(): function to map each croptype id to a distinct color
	@param id: id with type of number to be converted to hexadecimal value
*/
export const getColor = (id: number) => {
	var color = '#' + Math.floor(Math.abs(Math.sin(id) * 16777215) % 16777215).toString(16);
	return color;
};


/*
	RenderMap that takes as an argument the properties of the farm currently selected
*/
const RenderMap = (props: any) => {
	const classes = useStyles();

	/*
        cancel: this constant handles the state of the escape key event
        center: this constant handles the state of the center of the map
    */
    const [cancel, setCancel] = useState(false);
    const [center, setCenter] = useState({
		lat: props.info.center.latitude,
		lng: props.info.center.longitude,
		key: 0
	});

	if (center.lat !== props.info.center.latitude || center.lng !== props.info.center.longitude){
		setCenter({ lat: props.info.center.latitude, lng: props.info.center.longitude, key: center.key + 1 });
	}

    // Handle keypress
	const keyPressHandler = (e: any) => {

        // Check if key is "Escape"
		if (e.key === 'Escape') {
			setCancel(true);
			props.setInfo((prevState: any) => ({...prevState, drawType: null}));
		}
	};

    /*
        useEffect(): useEffect refreshes the render after a state has been updated and checks for keypress
    */
	useEffect(() => {
		window.addEventListener('keydown', keyPressHandler);
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

	/*
        handleCenterChange(): function that handles the center of the map change
        @param coordinates: LocationPoint array that has to be converted to coordinates and used as map center
    */
	const handleCenterChange = (coordinates: LocationPoint[]) => {
        var temp: Array<any> = [];
        temp = transformCoordinates(coordinates);
        setCenter({ lat: temp[0].lat, lng: temp[0].lng, key: center.key + 1 });
    };

	/*
        handlePolyComplete(): function that handles the completion of a polygon
        @param poly: polygon of type google.maps.Polygon that is the finished polygon
    */
	const handlePolyComplete = (poly: google.maps.Polygon) => {

        // On "Escape" keypress, cancel drawing and remove polygon
		if (cancel) {
			poly.setMap(null);
			setCancel(false);
			return;
        }

        // Calculate area of polygon
		var area = google.maps.geometry.spherical.computeArea(poly.getPath());
        props.setInfo((prevState: any) => ({ ...prevState, polygonSize: area / 10000 }));

        // Create LocationPoint based on polygon coordinates
		var newcoords = new Array<any>();
		for (var i = 0; i < poly.getPath().getLength(); i++) {
			var temp = poly
				.getPath()
				.getAt(i)
				.toUrlValue();
			var res = temp.split(',', 2);
			newcoords.push(new LocationPoint(Number(res[0]), Number(res[1])));
        }

        // Clear map
        poly.setMap(null);

        // Set all corresponding states
		props.setInfo((prevState: any) => ({ ...prevState, drawType: null, coords: newcoords, drawerState: true, drawer: 'create' }));
	};

	/*
        Return: return creates the view where the map is shown
    */
	return (
		<div className={classes.root}>
			<GoogleMapProvider>

                {/* Map is drawn here */}
				<MapBox
					className={classes.map}
					apiKey='AIzaSyCjSR2yWo_S6JU2xh1qAfuZtRwMwz_zc48'
					opts={{
						center: center,
						zoom: 14,
						disableDefaultUI: true,
						zoomControl: false,
						scaleControl: true,
						rotateControl: true,
						fullscreenControl: false,
						mapTypeControl: true,
						mapTypeId: 'satellite',
						streetViewControl: false
					}}
					useDrawing
				/>

				{/* The drawingmanager allows for the creation of polygons on the map */}
				<DrawingManager
					opts={{
						drawingControl: false,
						drawingMode: props.info.drawType,
						polygonOptions: {
							fillColor: 'blue',
							strokeColor: 'blue',
							fillOpacity: 0.35,
							clickable: false,
							editable: true
						}
					}}
					// When done creating a new polygon get its coordinates and store it in the coords state for use with the add field dialog
					onPolygonComplete={poly => handlePolyComplete(poly)}
				/>

				{/* Loop over all fields and draw them */}
				{props.info.fields.map((field: any, index: number) => (
					<Polygon
                        key={index}
						id={'field' + field.id.toString()}
						opts={{
							paths: transformCoordinates(field.coordinates),
							strokeColor: 'green',
							fillOpacity: 0,
							editable: props.info.editable
						}}
						onClick={() => {
                            if (props.info.editInfo) {
                                props.setInfo((prevState: any) => ({ ...prevState, drawer: 'edit_field', infoField: field, drawerState: true}));
                            } else {
                                props.setInfo((prevState: any) => ({ ...prevState, drawer: 'view_field', infoField: field, drawerState: true}));
                            }
						}}
					/>
				))}

				{/* Loop over all cropfields per field and draw them */}
				{props.info.cropfields.map((cropfield: any, index: number) => (
					<Polygon
                        key={index}
						id={'cropfield' + cropfield.id.toString()}
						opts={{
							paths: transformCoordinates(cropfield.coordinates),
							strokeColor: getColor(cropfield.crop_type.id),
							fillColor: getColor(cropfield.crop_type.id),
							fillOpacity: 0.35,
							editable: props.info.editable
						}}
						onClick={() => {
                            if (props.info.editInfo) {
                                props.setInfo((prevState: any) => ({ ...prevState, drawer: 'edit_cropfield', infoCropfield: cropfield, drawerState: true}));
                            } else {
                                props.setInfo((prevState: any) => ({ ...prevState, drawer: 'view_cropfield', infoCropfield: cropfield, drawerState: true}));
                            }
						}}
					/>
				))}

				{/* Controls for the map */}
				<MapControl info={props.info} setInfo={props.setInfo} />
			</GoogleMapProvider>

			{/* Drawer for the map related information and functionality */}
			<DrawerContainer info={props.info} setInfo={props.setInfo} handleCenterChange={handleCenterChange} />
		</div>
	);
};

export default RenderMap;
