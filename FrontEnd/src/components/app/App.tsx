import React from 'react';
import Navigation from '../Navigation/Navigation';
import { loggedIn } from '../../utils/Controllers/UserController';
import { Redirect } from 'react-router-dom';
/**
 * The home function calls the navigation Page
 * and wraps it inside a react fragment
 */
export default function Home() {
  /**
   * Only if a user is logged in should they be able to use the application
   * So if they are not logged in then they get redirected
   * which is why this if statement is here. 
   */
  if (!loggedIn()){
      return <Redirect to='/login'  />;
  }

  return (
    <React.Fragment>
      <Navigation />
    </React.Fragment>
  );
}
