/* Utils for managing users
*/

import Request from "request-promise";
import { setCookie, deleteCookie, getCookie } from "../Cookies";
import User from "../../common/User";
import { getOptions } from "./ReqeustUtils";
import { apiUrl } from "../../settings";

/*
* Login with email and password.
* Return (number) options:
*   0 = error occured, 1 = succesful login, 2 = invalid username or password
*/
export async function login (email: string, password: string): Promise<0|1|2> {
    var responseCode: 0|1|2 = 0;
    var options = {
        method: 'POST',
        uri: apiUrl + '/auth/jwt_token',
        resolveWithFullResponse: true,
        body: {
            "email": email,
            "password": password
        },
        json: true
    };

    await Request.post(options)
    .then(async function (res){
        if (res.statusCode === 200) {
            // Login succesful
            setCookie('access_token', res.body.access_token, res.body.user_id);
            setCookie('refresh_token', res.body.refresh_token, res.body.user_id);
            setCookie('user_id', res.body.user_id, -2);
            responseCode = 1;
            return;
        }
        // No error received, but not the right statusCode
        return Promise.reject('Unexpected response received!')
    })
    .catch(function (err){
        if (err.statusCode){
            switch(err.statusCode) {
                case 401: {
                    // Invalid username or password
                    responseCode = 2
                    break;
                }
            }
        }
    });

    return responseCode;
}

/*
* Logout, removes user data from cookies and reload page
*/
export function logout (){
    deleteCookie('access_token', getUserId());
    deleteCookie('refresh_token', getUserId());
    deleteCookie('user_id', -2);
    window.location.reload();
}

/*
* Register with email, password, first name, last name.
* Return (number) options:
*   0 = error occured, 1 = succesful login, 2 = email already exists
*/
export async function register (email: string, password: string, firstName: string, lastName: string): Promise<0|1|2>{
    var responseCode: 0|1|2 = 0;
    var options = {
        method: 'POST',
        uri: apiUrl + '/users/register',
        resolveWithFullResponse: true,
        body: {
            "first_name": firstName,
            "last_name": lastName,
            "username": email,
            "email": email,
            "password": password
        },
        json: true
    };

    await Request.post(options)
    .then(function (res){
        if (res.statusCode === 201) {
            // Registration succesful
            setCookie('access_token', res.body.access_token, getUserId());
            setCookie('refresh_token', res.body.refresh_token, getUserId());
            setCookie('user_id', res.body.user_id, -2);
            responseCode = 1;
            return;
        }
        // No error received, but not the right statusCode
        return Promise.reject(new Error('Unexpected response received!'))
    })
    .catch(function (err){
        if (err.statusCode){
            switch(err.statusCode) {
                case 400: {
                    // Email already exists
                    responseCode = 2;
                    break;
                }
            }
        }
    });

    return responseCode;
}

/*
* Add farmId to favorite list
*/
export function addFavorite (farmId: number) {
    var favorites = getCookie('favorites', getUserId());
    if (favorites === 'undefined' || favorites === undefined){
        favorites = ':' + farmId + ':';
    } else {
        favorites = favorites + ':' + farmId + ':';
    }
    setCookie('favorites', favorites, getUserId());
}

/*
* Delete farmId from favorite list
*/
export function deleteFavorite (farmId: number){
    var favorites = getCookie('favorites', getUserId());
    if (!(favorites === 'undefined' || favorites === undefined)){
        favorites = favorites.replace((':'+farmId+':'), '');
        setCookie('favorites', favorites, getUserId());
    }
}

/*
* Return boolean whether farmId is in favorite list
*/
export function isFavorite(farmId: number): boolean{
    var favorites = getCookie('favorites', getUserId());
    if (favorites === 'undefined' || favorites === undefined){
        return false;
    } else {
        if (favorites.indexOf((':' + farmId.toString() + ':')) >= 0){
            return true;
        } else {
            return false;
        }
    }
}

/*
* Refresh authorisationToken
* logout on error received
*/
export async function refreshToken (){
    let token = getCookie('refresh_token', getUserId());
    var options = {
        method: 'GET',
        uri: apiUrl + '/auth/refresh_token',
        resolveWithFullResponse: true,
        auth: {
            'bearer': token
        },
        json: true
    };

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200) {
            setCookie('access_token', res.body.access_token, getUserId());
            return;
        }
        // No error received, but not the right statusCode
        return Promise.reject(new Error('Unexpected response received!'))
    })
    .catch(function (){
        logout();
    });
}

/*
* Return boolean whether there is an access_token in the cookies
*/
export function loggedIn(): boolean {
    let token = getCookie('access_token', getUserId());
    if (token === undefined){
        return false;
    } else {
        return true;
    }
}

/*
* Return access token from cookies or return '' when it does not exist
*/
export function getToken(): string {
    let token = getCookie('access_token', getUserId());
    if (token !== undefined){
        return token;
    } else {
        return '';
    }
}

/*
* Return refresh token from cookies or return '' when it does not exist
*/
export function getRefreshToken(): string {
    let token = getCookie('refresh_token', getUserId());
    if (token !== undefined){
        return token;
    } else {
        return '';
    }
}

/*
* Return userId from cookies or return 0 when it does not exist
*/
export function getUserId(): number {
    let userId = getCookie('user_id', -2);
    if (userId !== undefined && userId !== 'undefined'){
        return parseInt(userId, 10);
    } else {
        return 0;
    }
}

/*
* Return user with userID or throw error when user can not be found
*/
export async function getUser (userId: number): Promise<User> {
    var user: User = new User(0, '', '', '', '');
    var options = getOptions('GET', apiUrl + '/users/' + userId);

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200) {
            user = User.fromJSON(res.body);
            return;
        }
        // No error received, but not the right statusCode
        return Promise.reject(new Error('Unexpected response received!'))
    })
    .catch(async function (err){
        if (err.statusCode){
            switch(err.statusCode) {
                case 401: {
                    // Token expired, refresh the token and try again
                    await refreshToken();
                    user = await getUser(userId);
                    return;
                }
            }
        }
        throw err;
    });

    return user;
}

/*
* Update user in database from userObject
* Return boolean whether successful
*/
export async function updateUser (user: User): Promise<boolean> {
    var successful: boolean = false;
    var options = getOptions('PUT', apiUrl + '/users/' + user.id, user.toJSON());

    await Request.put(options)
    .then(function (res){
        // Expect statusCode 201 on successful request
        if (res.statusCode === 201) {
            successful = true;
            return;
        }
        // No error received, but not the right statusCode
        return Promise.reject(new Error('Unexpected response received!'))
    })
    .catch(async function (err){
        if (err.statusCode){
            switch(err.statusCode) {
                case 401: {
                    // Token expired, refresh the token and try again
                    await refreshToken();
                    successful = await updateUser(user);
                    break;
                }
            }
        }
    });

    return successful;
}

/*
* Delete user in database with userId
* Return boolean whether successful
*/
export async function deleteUser (userId: number): Promise<boolean> {
    var successful: boolean = false;
    var options = getOptions('DELETE', apiUrl + '/users/' + userId);

    await Request.delete(options)
    .then(function (res){
        // Expect statusCode 204 on successful request
        if (res.statusCode === 204) {
            successful = true;
            return;
        }
        // No error received, but not the right statusCode
        return Promise.reject(new Error('Unexpected response received!'))
    })
    .catch(async function (err){
        if (err.statusCode){
            switch(err.statusCode) {
                case 401: {
                    // Token expired, refresh the token and try again
                    await refreshToken();
                    successful = await deleteUser(userId);
                    break;
                }
            }
        }
    });

    return successful;
}

export default {
    loggedIn
}
