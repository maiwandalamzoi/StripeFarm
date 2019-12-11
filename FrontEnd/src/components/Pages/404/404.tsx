/** This module shows the 404 view, when a user tries to access a page that does not exist
*/

import React from 'react';
import { Link } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ImageCloudia from '../../../assets/CloudiaDead.png';

const useStyles = makeStyles(theme => ({
  '@global': { body: { backgroundColor: theme.palette.common.white}},
  paper: { marginTop: theme.spacing(8), display: 'flex', flexDirection: 'column', alignItems: 'center'},
}));

/**
 * pageNotFound()
 * returns an interface telling the user that the requested page is
 * not found.
 * A button is presented to return to the login page of the application.
 */
export default function PageNotFound() {
  const classes = useStyles();
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
          <Box mt={5}></Box>
          <img style={{width: 250, height: 250}}src={ImageCloudia} alt="ImageCloudia" />
          <Typography variant="h1">404</Typography>
          <Box mt={2}></Box>
        <Typography variant="h5">Page not found</Typography>
        <Box mt={2}></Box>
        <Link to="/login">Back to login</Link>
      </div>
    </Container>
  );
}
