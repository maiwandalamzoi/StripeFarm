/* This controller contains all the functionality of retrieving the roles data from the data-
 * Sensing service.
 */

import { Role } from "../../common/Role";
import { refreshToken} from "../Controllers/UserController";
import Request from "request-promise";
import { getOptions } from "./ReqeustUtils";
import { apiUrl } from "../../settings";

/**
 * getUserRoleOnFarm() return role object from userId on farm
 * @param farmId, the id of a farm
 * @param userId, the id of a user
 * @return user object (default on err: user)
*/
export async function getUserRoleOnFarm (farmId: number, userId: number): Promise<Role> {
    var userRole: Role = new Role('user'); // Default role is 'user'
    var options = getOptions('GET', apiUrl + '/farm_users/' + farmId + '/users/' + userId);

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200) {
            // Map response to role object
            userRole = Role.fromJSON(res.body.role);
            return;
        }
        // No error received, but not the right statusCode
        return Promise.reject('Unexpected response received!');
    })
    .catch(async function (err){
        if (err.statusCode){
            switch(err.statusCode) {
                case 401: {
                    // Token expired, refresh the token and try again
                    await refreshToken();
                    userRole = await getUserRoleOnFarm(farmId, userId);
                    break;
                }
            }
        }
    });

    return userRole;
}

/**
 * changeUserRoleOnFarm() make an change user role request and return boolean whether successful
 * @param farmId, the id of a farm
 * @param userId, the id of a user
 * @param role, role object
 * @return true on success, false on error
*/
export async function changeUserRoleOnFarm (farmId: number, userId: number, role: Role): Promise<boolean> {
    var successful: boolean = false;
    var options = getOptions('PUT', apiUrl + '/farm_users/' + farmId + '/users/' + userId, {
        "user_id": userId,
        "role": role.name
    });

    await Request.put(options)
    .then(async function (res){
        // Expect statusCode 201 on successful request
        if (res.statusCode === 201) {
            successful = true;
            return;
        }
        // No error received, but not the right statusCode
        return Promise.reject('Unexpected response received!');
    })
    .catch(async function (err){
        if (err.statusCode){
            switch(err.statusCode) {
                case 401: {
                    // Token expired, refresh the token and try again
                    await refreshToken();
                    successful = await changeUserRoleOnFarm(farmId, userId, role);
                    break;
                }
            }
        }
    });

    return successful;
}

/**
 * createUserRoleOnFarm() make an create user role request and return boolean whether successful
 * @param farmId, the id of a farm
 * @param email, the email of a user
 * @param role, role object
 * @return true on success, false on error
*/
export async function createUserRoleOnFarm (farmId: number, email: string, role: Role): Promise<boolean> {
    var successful: boolean = false;
    var options = getOptions('POST', apiUrl + '/farm_users/' + farmId + '?use_email=true', {
        "user_id": null,
        "email": email,
        "role": role.name
    });

    await Request.post(options)
    .then(async function (res){
        // Expect statusCode 201 on successful request
        if (res.statusCode === 201) {
            successful = true;
            return;
        }
        // No error received, but not the right statusCode
        return Promise.reject('Unexpected response received!');
    })
    .catch(async function (err){
        if (err.statusCode){
            switch(err.statusCode) {
                case 401: {
                    // Token expired, refresh the token and try again
                    await refreshToken();
                    successful = await createUserRoleOnFarm(farmId, email, role);
                    break;
                }
            }
        }
    });

    return successful;
}

/**
 * getAllUsersOnFarm() returns array of all users with role on farm
 * @param farmId, the id of a farm
 * @return array with users and their roles
*/
export async function getAllUsersOnFarm(farmId: number): Promise<Array<any>> {
    var users: any = [];
    var options = getOptions('GET', apiUrl + '/farm_users/' + farmId);

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200) {
            users = JSON.parse(res.body);
            return;
        }
        // No error received, but not the right statusCode
        return Promise.reject('Unexpected response received!');
    })
    .catch(async function (err){
        if (err.statusCode){
            switch(err.statusCode) {
                case 401: {
                    // Token expired, refresh the token and try again
                    await refreshToken();
                    users = getAllUsersOnFarm(farmId);
                    break;
                }
            }
        }
    });

    return users;
}


/**
 * getUserRoles() returns array of all possible user roles
 * @return array with user roles
*/
export async function getUserRoles(): Promise<Array<any>> {
    var userRoles: any = [];
    var options = getOptions('GET', apiUrl + '/roles');

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200) {
            // Map response to array
            userRoles = JSON.parse(res.body) as Array<any>;
            return;
        }
        // No error received, but not the right statusCode
        return Promise.reject('Unexpected response received!');
    })
    .catch(async function (err){
        if (err.statusCode){
            switch(err.statusCode) {
                case 401: {
                    // Token expired, refresh the token and try again
                    await refreshToken();
                    userRoles = getUserRoles();
                    break;
                }
            }
        }
    });

    return userRoles;
}
