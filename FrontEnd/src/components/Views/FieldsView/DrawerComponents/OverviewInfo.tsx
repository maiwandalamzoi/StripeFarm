/* External imports */
import React from 'react';
import { List, ListSubheader } from '@material-ui/core';

/* Local imports */
import FieldListItem from './ListItems/FieldListItem';
import { Field } from '../../../../common/Field';

/*
    Renders the overview container for the fields and cropfields
*/
const OverviewInfo = (props: any) => {

	/*
		Renders the overview list and all of its fields and corresponding cropfields
	*/
	return (
		<List
			component='nav'
			aria-labelledby='list-subheader'
			subheader={
                <ListSubheader
                    component='div'
                    id='list-subheader'
                    style={{
                        height: 60,
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center'
                        }}
                >
					Fields
				</ListSubheader>
			}
		>
			{/* // Here we create all the buttons for the fields */}
			{props.info.fields.map((field: Field, index: number) => (
                <FieldListItem key={index} info={props.info} setInfo={props.setInfo} field={field} handleCenterChange={props.handleCenterChange} />
        ))}
		</List>
	);
};
export default OverviewInfo;
