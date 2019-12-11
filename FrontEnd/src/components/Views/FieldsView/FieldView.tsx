/* External imports */
import React, { useEffect, useState } from 'react';

/* Libraries */
import GridLoader from 'react-spinners/GridLoader';

/* Local imports */
import RenderMap from './RenderMap';
import { getFarmFields } from '../../../utils/Controllers/FieldController';
import { getCropFields } from '../../../utils/Controllers/CropFieldController';
import { LocationPoint } from '../../../common/LocationPoint';
import { Field } from '../../../common/Field';
import { CropField } from '../../../common/CropField';
import { SoilType } from '../../../common/SoilType';
import { CropType } from '../../../common/CropType';
import { AccessibilityType } from '../../../common/AccessibilityType';

/*
    The initial state for the state constants of this view and its children
*/
const initialState = {
    farmId: 0,
    role: '',
    center: new LocationPoint(51.4413023, 5.4744481),
    coords: Array<any>(),
    fields: Array<Field>(),
    infoField: new Field(
        0,
        '',
        [],
        0,
        new SoilType(0, '', ''),
        AccessibilityType.private
    ),
    cropfields: Array<CropField>(),
    infoCropfield: new CropField(
        0,
        0,
        0,
        '',
        new Date(),
        new Date(),
        [],
        new CropType(0, '', ''),
        AccessibilityType.private
    ),
    editInfo: false,
    editable: false,
    drawType: null,
    drawerState: false,
    drawer: 'info',
    polygonSize: 0
};

/*
    FieldView displays the Google Map and allows the user to draw polygons and change field data
*/
const FieldView = (props: any) => {
    /*
        info: contains the decomposed state based on the initial state
        isLoading: this constant handles the state of the loading icon
    */
    const [info, setInfo] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);

    /*
        asyncForEach(): function that asynchronously parses an array
        @param array: array that has to be asynchronously run through
        @param cllback: callback object array
    */
    async function asyncForEach(array: Array<any>, callback: any) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    /*
        fetchFarmFields(): fetchFarmFields gets all fields of a farm by id that is stored in the database and returns it
    */
    async function fetchFarmFields() {
        try {
            let res = await getFarmFields(props.fID);
            return res;
        } catch (e) {
            console.log(e);
        }
    }

    /*
        useEffect(): useEffect refreshes the render after a state has been updated
    */
    useEffect(() => {
        setIsLoading(true);

        /*
            getFarmFields(): handle the loading icon state and call fetchFarmFields() to ensure the result is not empty
        */
        async function getFarmFields() {
            const res = await fetchFarmFields();
            if (res) {
                // Set farmId
                setInfo(prevState => ({ ...prevState, farmId: props.fID }));

                // Set role
                setInfo(prevState => ({ ...prevState, role: props.role }));

                // Get all the fields and set
                setInfo(prevState => ({ ...prevState, fields: res }));

                // Get all the cropfields
                var coordinates: LocationPoint[] = [];
                var farmCropfields = new Array(0);

                await asyncForEach(res, async (farmField: Field) => {
                    coordinates = coordinates.concat(farmField.coordinates);
                    try {
                        const cfs = await getCropFields(
                            props.fID,
                            farmField.id
                        );
                        farmCropfields = farmCropfields.concat(cfs);
                    } catch (e) {
                        console.log(e);
                    }
                });

                // Convert coordinates and set
                let convertedCoords = returnCenter(coordinates);
                setInfo(prevState => ({
                    ...prevState,
                    center: convertedCoords
                }));

                // Set cropfields
                setInfo(prevState => ({
                    ...prevState,
                    cropfields: farmCropfields
                }));
            }
            setIsLoading(false);
        }

        getFarmFields();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.fID]);

    /*
        Loading: this component creates a loading icon while fetching data until complete to give feedback to the user
    */
    const Loading = () => {
        return (
            <GridLoader
                css={'margin: 30vw auto 0'}
                sizeUnit={'px'}
                size={20}
                color={'#E07A5F'}
            />
        );
    };

    // returns center of all coordinates
    function returnCenter(coordinates: LocationPoint[]): LocationPoint {
        if (coordinates.length === 0) {
            return new LocationPoint(51.4413023, 5.4744481); // default Eindhoven
        }

        var x = 0;
        var y = 0;
        var z = 0;

        coordinates.forEach(function(locationPoint) {
            var latitude = (locationPoint.latitude * Math.PI) / 180;
            var longitude = (locationPoint.longitude * Math.PI) / 180;

            x += Math.cos(latitude) * Math.cos(longitude);
            y += Math.cos(latitude) * Math.sin(longitude);
            z += Math.sin(latitude);
        });

        var total = coordinates.length;

        x = x / total;
        y = y / total;
        z = z / total;

        var centralLongitude = Math.atan2(y, x);
        var centralSquareRoot = Math.sqrt(x * x + y * y);
        var centralLatitude = Math.atan2(z, centralSquareRoot);

        return new LocationPoint(
            (centralLatitude * 180) / Math.PI,
            (centralLongitude * 180) / Math.PI
        );
    }

    /*
        Return: return creates the view where the RenderMap Google Map is shown
        isLoading:
            true: show loading icon
            false: show RenderMap
    */
    return (
        <React.Fragment>
            {isLoading ? (
                <Loading />
            ) : (
                <RenderMap info={info} setInfo={setInfo} />
            )}
        </React.Fragment>
    );
};

export default FieldView;
