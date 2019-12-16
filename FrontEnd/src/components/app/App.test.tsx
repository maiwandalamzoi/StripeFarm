import React from 'react';
import { create } from "react-test-renderer";

import App from './App';
import { shallow, mount } from 'enzyme';
import { Redirect } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import UserController from '../../utils/Controllers/UserController';
/**
 * this test checks wether the app renders
 * It then checks wether it matches the snapshot
 * This is to check that nothing has changed
 */
test('App page renders and matches snapshot', () => {
    const view = create(<Router><App /></Router>)

    expect(view.toJSON()).toMatchSnapshot();
});
/**
 * This test checks wether the user is redirected to the login page
 * when he or she is not logged in
 * This is important, since the application should only be use when
 * a user is logged in.
 */
test('When loggedIn() is false redirect to /login', () => {
    const wrapper = mount(<Router><App /></Router>);

    UserController.loggedIn = jest.fn(() => false)
    expect(wrapper.find(Redirect)).toHaveLength(1);
});
