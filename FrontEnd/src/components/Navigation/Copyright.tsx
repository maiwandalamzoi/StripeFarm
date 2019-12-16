/* External imports */
import React from 'react';
import { makeStyles, Typography, Link } from '@material-ui/core';

/*
  Styles for the view
*/
const useStyles = makeStyles(theme => ({
  footer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    color: 'white'
  }
}));
/**
 * The copyright constance sets the copyright
 * for our application, the applicatoin is licensed
 * under our name as well as the MIT license
 * @param classes this contains the styles for this file
 * @param date this is the year to which the copyright is valid.
 */
const Copyright = () => {
  const classes = useStyles();

  /*
    date: contains the current year
  */
  const date = new Date().getFullYear();
  
  /**
   * The return function returns the UI elements for this function
   * it sets the classes of each object so they get the correct style
   * and it specifies the text
   */
  return (
    <footer className={classes.footer}>
      <Typography
        variant="body2"
      >
        {"Copyright ©StripeFarmers " + date}
      </Typography>
      <Typography
        variant="body2"
      >
        Copyright ©
        <Link color="inherit" href="https://opensource.org/licenses/MIT">
          MIT LICENSE
        </Link>
        {" " + date}
      </Typography>
    </footer>
  );
}

export default Copyright;
