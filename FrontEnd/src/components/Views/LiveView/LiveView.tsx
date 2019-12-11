/* External imports */
import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';

/* Libraries */
import GridLoader from 'react-spinners/GridLoader';

/* Local imports */
import { getFarmFields } from '../../../utils/Controllers/FieldController';
import { Field } from '../../../common/Field';
import FieldComponent from './FieldComponent';

/*
    The live view is the view that shows the latests observed data from all crop fields, ordered by the field these crop fields belong to.
*/
const LiveView = (props: any) => {
    /*
        farmId: this variable contains the ID of the farm that is currently active
        fields: this constant handles the state of the fields array that contains all the fields connected to the active farm
        isLoading: this constant handles the state of the loading icon
     */
    const farmId = props.fID;
    const [fields, setFields] = useState(Array<Field>());
    const [isLoading, setIsLoading] = useState(false);

    /*
        fetchFields(): fetchFields gets all the fields that are connected to the current active farm from the api
    */
    async function fetchFields() {
        try {
            const res = await getFarmFields(farmId);
            return res;
        } catch (error) {
            console.error(error.message);
        }
    }

    /*
        useEffect(): useEffect refreshes the render after a state has been updated
    */
    useEffect(() => {
        setIsLoading(true);

        /*
            getFields(): handle the loading icon state and call fetchFields() to ensure the result is not empty
        */
		async function getFields() {
			const res = await fetchFields();
			if (res) {
                setFields(res);
			}
			setIsLoading(false);
        }
        getFields();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.fID]);

    /*
        Loading: this component creates a loading icon while fetching data until complete to give feedback to the user
    */
    const Loading = () => {
		return <GridLoader css={'margin: 30vw auto 0'} sizeUnit={'px'} size={20} color={'#E07A5F'} />;
	};

    /*
        Return: return creates the view where the farm name and cropfield cards are shown if @state{isLoading} is false
        isLoading:
            true: show loading icon
            false: show field name and cropfield cards
    */
    return (
        <React.Fragment>
            {isLoading ?
                <Loading />
                :
                <React.Fragment>
                    {fields.map((field: Field, index: number) => (
                        <React.Fragment key={index}>
                            <Typography
                                style={{
                                    fontSize: 18,
                                    margin: '30px 40px 10px'
                                }}
                            >
                                {field.field_name}
                            </Typography>
                            <FieldComponent farmId={farmId} fieldId={field.id} />
                        </React.Fragment>
                    ))}
                </React.Fragment>
            }
        </React.Fragment>
    );
}

export default LiveView;
