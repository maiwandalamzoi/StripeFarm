/* This test file contains all the tests of the functionality regarding users and authentication.
 */

import { login, getUserId, logout, register, addFavorite, isFavorite, deleteFavorite, loggedIn, getToken, getRefreshToken, getUser, updateUser, deleteUser } from "../UserController";
import { getCookie, deleteCookie } from "../../Cookies";
import User from "../../../common/User";
import { loadSettings } from "./TestSettings";

/*
 * Loads all the test settings necessary for testing with a mock api.
 */
loadSettings()

describe("Test login functionality", () => {
    /*
     * Test whether statusCode 2 is returned when logging in with wrong credentials
     */
    test("return statusCode 2", async() => {
        let responseCode = await login('wrongtest@test.nl', 'testPassword');
        expect(responseCode).toBe(2);
    })
    /*
     * Test whether statusCode 1 is returned when logging in with correct credentials
     */
    test("return statusCode 1", async() => {
        let responseCode = await login('test@test.nl', 'testPassword');
        expect(responseCode).toBe(1);
    })
    /*
     * Test whether the right user Id is stored in cookies when logging in
     */
    test("userId stored in cookies", async () => {
        await login('test@test.nl', 'testPassword');
        expect(Number(getUserId())).toBe(15);
    })
    /*
     * Test whether the right accessToken is stored in cookies when logging in
     */
    test("accessToken stored in cookies", async () => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        let accessToken = getCookie('access_token', 15);
        expect(accessToken).toBe('eyJpc3MiOiJ0b3B0YWwuY29tIiwiZXhwIjoxNDI2NDIwODAwLCJodHRwOi8vdG9wdGFsLmNvbS9qd3RfY2xhaW1zL2lzX2FkbWluIjp0cnVlLCJjb21wYW55IjoiVG9wdGFsIiwiYXdlc29tZSI6dHJ1ZX0');
        expect(getToken()).toBe('eyJpc3MiOiJ0b3B0YWwuY29tIiwiZXhwIjoxNDI2NDIwODAwLCJodHRwOi8vdG9wdGFsLmNvbS9qd3RfY2xhaW1zL2lzX2FkbWluIjp0cnVlLCJjb21wYW55IjoiVG9wdGFsIiwiYXdlc29tZSI6dHJ1ZX0');
    })
    /*
     * Test whether the right refreshToken is stored in cookies when logging in
     */
    test("refreshToken stored in cookies", async () => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        let refreshToken = getCookie('refresh_token', 15);
        expect(refreshToken).toBe('eyJpc3MiOiJ0b3B0YWwuY29tIiwiZXhwIjoxNDI2NDIwODAwLCJodHRwOivdG9wdGFsLmNvbS9qd3RfY2xhaW1zL2lzX2FkbWluIjp0cnVlLJjb21wYW55IjoiVG9wdGFsIiwiYXdlc29tZSI6dHJ1ZX08y');
        expect(getRefreshToken()).toBe('eyJpc3MiOiJ0b3B0YWwuY29tIiwiZXhwIjoxNDI2NDIwODAwLCJodHRwOivdG9wdGFsLmNvbS9qd3RfY2xhaW1zL2lzX2FkbWluIjp0cnVlLJjb21wYW55IjoiVG9wdGFsIiwiYXdlc29tZSI6dHJ1ZX08y');
    })
    /*
     * Test whether the loggedIn() returns true if user is logged in
     */
    test("loggedIn() = true", async () => {
        await login('test@test.nl', 'testPassword');
        expect(loggedIn()).toBe(true);
    })
});

describe("Test logout functionality", () => {
    /*
     * Test whether the accessToken is deleted from cookies after logout
     */
    test("accessToken deleted from cookies", () => {
        logout();
        const accessToken = getCookie('access_token', 15);
        expect(accessToken).toBeUndefined();
    })
    /*
     * Test whether the refreshToken is deleted from cookies after logout
     */
    test("refreshToken deleted from cookies", () => {
        logout();
        const refreshToken = getCookie('refresh_token', 15);
        expect(refreshToken).toBeUndefined();
    })
    /*
     * Test whether the userId is deleted from cookies after logout
     */
    test("UserId deleted from cookies", () => {
        logout();
        expect(getUserId()).toBe(0);
    })
    /*
     * Test whether loggedIn() returns false after logout
     */
    test("loggedIn() = false", () => {
        logout();
        expect(loggedIn()).toBe(false);
    })
});

describe("Test register functionality", () => {
    /*
     * Test whether responseCode is 2 when registering with already existing email
     */
    test("return statusCode 2", async() => {
        let responseCode = await register('test@test.nl', 'testPassword', 'testFirstName', 'testLastName');
        expect(responseCode).toBe(2);
    })
    /*
     * Test whether responseCode is 1 when correctly registering
     */
    test("return statusCode 1", async() => {
        let responseCode = await register('newtest@test.nl', 'testPassword', 'testFirstName', 'testLastName');
        expect(responseCode).toBe(1);
    })
    /*
     * Test whether correct userId is stored in cookies after registering
     */
    test("userId stored in cookies", async () => {
        await register('newtest@test.nl', 'testPassword', 'testFirstName', 'testLastName');
        expect(Number(getUserId())).toBe(16);
    })
    /*
     * Test whether correct accessToken is stored in cookies after registering
     */
    test("accessToken stored in cookies", async () => {
        await register('newtest@test.nl', 'testPassword', 'testFirstName', 'testLastName');
        let accessToken = getCookie('access_token', 16);
        expect(accessToken).toBe('eyJpc3MiOiJ0b3B0YWwuY29tIiwiZXhwIjoxNDI2NDIwODAwLCJodHRwOi8vdG9wdGFsLmNvbS9qd3RfY2xhaW1zL2lzX2FkbWluIjp0cnVlLCJjb21wYW55IjoiVG9wdGFsIiwiYXdlc29tZSI6dHJ1ZX0');
    })
    /*
     * Test whether correct refreshToken is stored in cookies after registering
     */
    test("refreshToken stored in cookies", async () => {
        await register('newtest@test.nl', 'testPassword', 'testFirstName', 'testLastName');
        let refreshToken = getCookie('refresh_token', 16);
        expect(refreshToken).toBe('eyJpc3MiOiJ0b3B0YWwuY29tIiwiZXhwIjoxNDI2NDIwODAwLCJodHRwOivdG9wdGFsLmNvbS9qd3RfY2xhaW1zL2lzX2FkbWluIjp0cnVlLJjb21wYW55IjoiVG9wdGFsIiwiYXdlc29tZSI6dHJ1ZX08y');
    })
});

describe("Test favorite list functionality", () => {
    /*
     * Test whether cookies are updated correctly when adding favorite and removing it again
     */
    test("add one favorite farm and delete it", () => {
        deleteFavorite(20);
        expect(isFavorite(20)).toBe(false);
        addFavorite(20);
        expect(isFavorite(20)).toBe(true);
        deleteFavorite(20);
        expect(isFavorite(20)).toBe(false);
    })
    /*
     * Test whether cookies are updated correctly when adding multiple favorite and removing them again
     */
    test("add multiple favorite farms and delete them", () => {
        for (var i = 0; i < 20; i++){
            deleteFavorite(i);
        }
        for (var i = 0; i < 20; i++){
            expect(isFavorite(i)).toBe(false);
        }
        for (var i = 0; i < 20; i++){
            addFavorite(i);
        }
        for (var i = 0; i < 20; i++){
            expect(isFavorite(i)).toBe(true);
        }
        for (var i = 0; i < 50; i++){
            deleteFavorite(i);
        }
        for (var i = 0; i < 20; i++){
            expect(isFavorite(i)).toBe(false);
        }
    })
});

describe("test getUser()", () => {
    /*
     * Test whether user not found error works
     */
    test("user not found error", () => {
        expect(getUser(10)).rejects.toEqual(new Error('User not found!'))
    })
    /*
     * Test whether good user object is returned
     */
    test("return good user object", async() => {
        let user = await getUser(15);
        expect(user).toBeInstanceOf(User);
        expect(user.first_name).toBe('testFirstName');
        expect(user.last_name).toBe('testLastName');
        expect(user.email).toBe('test@test.nl');
        expect(user.created_date).toBe('2011-01-01');
    })
    /*
     * Test whether good user object is returned after refreshing the access_token
     */
    test("return good user object after refreshToken", async() => {
        deleteCookie('access_token', getUserId()); // Mock that the access_token must be refreshed
        let user = await getUser(15);
        expect(user).toBeInstanceOf(User);
        expect(user.first_name).toBe('testFirstName');
        expect(user.last_name).toBe('testLastName');
        expect(user.email).toBe('test@test.nl');
        expect(user.created_date).toBe('2011-01-01');
    })
});

describe("test updateUser()", () => {
    /*
     * Test whether false is returned when trying to update a non existing user
     */
    test("return false", async () => {
        let user = new User(10, 'test@test.nl', 'testFirstName', 'testLastName', 'testPassword');
        expect(await updateUser(user)).toBe(false);
    })
    /*
     * Test whether true is returned when trying to update a user
     */
    test("return true", async() => {
        let user = new User(15, 'test@test.nl', 'testFirstName', 'testLastName', 'testPassword');
        expect(await updateUser(user)).toBe(true);
    })
    /*
     * Test whether true is returned when trying to update a user after refreshing the access_token
     */
    test("return true after refreshToken", async () => {
        deleteCookie('access_token', getUserId()); // Mock that the access_token must be refreshed
        let user = new User(15, 'test@test.nl', 'testFirstName', 'testLastName', 'testPassword');
        expect(await updateUser(user)).toBe(true);
    })

});

describe("test deleteUser()", () => {
    /*
     * Test whether false is returned when trying to delete a  non existing user
     */
    test("return false", async () => {
        expect(await deleteUser(10)).toBe(false);
    })
    /*
     * Test whether true is returned when trying to delete a user
     */
    test("return true", async() => {
        expect(await deleteUser(15)).toBe(true);
    })
    /*
     * Test whether true is returned when trying to delete a user after refreshing the access_token
     */
    test("return true after refreshToken", async () => {
        deleteCookie('access_token', getUserId()); // Mock that the access_token must be refreshed
        expect(await deleteUser(15)).toBe(true);
    })
});
