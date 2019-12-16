/* This test file contains tests for the 404 page, login page, sign up page
 * and the forgot password page.
 */

import React from 'react';
import { create } from "react-test-renderer";
import Notfound from './404/404';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginView from './LoginView/LoginView';
import SignUp from './LoginView/Components/Signup';
import ForgotPassword from './LoginView/Components/ForgotPassword';

const mockFunction = () => {
    return;
};
/**
 * This is a test case for the 404 page
 */
test('404 page renders and matches snapshot', () => {
    const view = create(<Router><Notfound /></Router>)
    expect(view.toJSON()).toMatchSnapshot();
});
/**
 * This is a test case for the login page
 */
test('login page renders with login view and matches snapshot', () => {
    const view = create(<LoginView />);
    expect(view.toJSON()).toMatchSnapshot();
});
/**
 * This is a test case for the signup view
 */
test('sign up view renders and matches snapshot', () => {
    const view = create(<SignUp cancel={mockFunction} doFarmRegister={mockFunction}/>);
    expect(view.toJSON()).toMatchSnapshot();
});
/**
 * This is a test case for the forgotpassword view
 */
test('Forgotpassword view renders and matches snapshot', () => {
    const view = create(<ForgotPassword cancel={mockFunction} />);
    expect(view.toJSON()).toMatchSnapshot();
});
