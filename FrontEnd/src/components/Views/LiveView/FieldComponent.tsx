/* External imports */
import React, { useEffect, useState } from 'react';

/* Libraries */
import GridLoader from 'react-spinners/GridLoader';

/* Local imports */
import { getCropFields } from '../../../utils/Controllers/CropFieldController';
import { CropField } from '../../../common/CropField';
import CardComponent from './CardComponent';

/*
    FieldComponent returns a list of CardComponents exising of live cropfield data
*/
const FieldComponent = (props: any) => {
	/*
        farmId: this variable contains the ID of the farm that is currently active
        fieldId: this variable contains the ID of the field that is currently being created
        cropfields: this constant handles the state of the cropfields array that contains all the cropfields connected to the active farm
        isLoading: this constant handles the state of the loading icon
    */
	const farmId = props.farmId;
	const fieldId = props.fieldId;
	const [cropFields, setCropFields] = useState(Array<CropField>());
	const [isLoading, setIsLoading] = useState(false);

	/*
        fetchCropFields(): fetchCropFields gets the cropfields belonging to the current fields and returns them
        @returns: the cropfields belonging to a field of a farm
    */
	async function fetchCropFields() {
		try {
			const res = await getCropFields(farmId, fieldId);
			return res;
		} catch (error) {
			console.error('This is the error: ' + error.message);
		}
	}

	/*
        useEffect(): useEffect refreshes the render after a state has been updated
    */
	useEffect(() => {
		setIsLoading(true);

		/*
            getCropFields(): handle the loading icon state and call fetchCropFields() to ensure the result is not empty
        */
		async function getCropFields() {
			const res = await fetchCropFields();
			if (res) {
				setCropFields(res);
			}
			setIsLoading(false);
		}
		getCropFields();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/*
        Loading: this component creates a loading icon while fetching data until complete to give feedback to the user
    */
	const Loading = () => {
		return <GridLoader css={'margin: 30% auto 0'} sizeUnit={'px'} size={15} color={'#E07A5F'} />;
	};

    /*
        Return: return creates the view where the cropfield cards are shown if @state{isLoading} is false
        isLoading:
            true: show loading icon
            false: show cropfield cards
    */
	return (
		<React.Fragment>
			{isLoading ? (
				<Loading />
			) : (
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        margin: '0 40px'
                    }}
                >
					{cropFields.map((cropfield: CropField, index: number) => (
						<CardComponent key={index} cropfield={cropfield} />
					))}
				</div>
			)}
		</React.Fragment>
	);
};

export default FieldComponent;
