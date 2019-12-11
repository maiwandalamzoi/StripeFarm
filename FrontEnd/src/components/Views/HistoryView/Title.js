/* External imports */
import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

/*
    Renders the title of each propType
*/
export default function Title(props) {
	/*
        Returns the title
    */
	return (
		<Typography component='h2' variant='h6' color='primary' gutterBottom>
			{props.children}
		</Typography>
	);
}

// Links the title to the proptype
Title.propTypes = {
	children: PropTypes.node
};
