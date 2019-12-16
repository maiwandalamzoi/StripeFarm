import { RequestPromise } from "request-promise";
import { getOnUser, getOnRefreshToken, getOnFarms, getOnFarm, getOnFields, getOnCropFields, getOnField, getOnCropField, getOnEquipments, getOnEquipment, getOnEquipmentModels, getOnEquipmentModel, getOnUserRole, getOnUserRoles, getOnRoles, getOnCountries, getOnSoilTypes, getOnCropTypes, getOnWolkyTolkyEqs, getOnWolkyTolkyEq } from "./MockAPI.Get";
import { postOnRegister, postOnJwtToken } from "./MockAPI.Post";
import { putOnUser, putOnFarm } from "./MockAPI.Put";
import { delOnUser, delOnFarm } from "./MockAPI.Del";
import { apiUrl, dataLinkUrl } from "../../settings";

/**
 * postFake(): Mocks a response on a POST request (for testing)
 */
export function postFake(options: any): RequestPromise{
    var returnPromise: RequestPromise; // Promise object to return as response

    // Mock api request on jwt_token
    if (options.uri === apiUrl + '/auth/jwt_token'){
        returnPromise = postOnJwtToken(options);

    // Mock api request on register
    } else if (options.uri === apiUrl + '/users/register'){
        returnPromise = postOnRegister(options);

    // Ruturn mock response with statuscode 401 if there is no authentication code included
    } else if (options.auth.bearer === '') {
        returnPromise = returnStatusCode(401, true);

    // Default response on post request with statuscode 201
    } else {
        returnPromise = returnStatusCode(201, false);
    }

    return returnPromise; // Return RequestPromise
}

/**
 * getFake(): Mocks a response on a GET request (for testing)
 */
export function getFake(options: any): RequestPromise{
    var returnPromise: RequestPromise; // Promise object to return as response

    // Ruturn mock response with statuscode 401 if there is no authentication code included
    if (options.auth.bearer === '') {
        returnPromise = returnStatusCode(401, true);

    // Mock api request on users
    } else if (options.uri.indexOf(apiUrl + '/users/') != -1){
        returnPromise = getOnUser(options);

    // Mock api request on refresh token
    } else if (options.uri === (apiUrl + '/auth/refresh_token')) {
        returnPromise = getOnRefreshToken(options);

    // Mock api request on equipment
    } else if (options.uri === apiUrl + '/equipments/10?farm_id=15'){
        returnPromise = getOnEquipment(options);

    // Mock api request on equipments
    } else if (options.uri.indexOf(apiUrl + '/equipments?farm_id=') != -1){
        returnPromise = getOnEquipments(options);

    // Mock api request on crop fields
    } else if (options.uri === (apiUrl + '/farms/10/fields/15/crop_fields')) {
        returnPromise = getOnCropFields(options);

    // Mock api request on crop field
    } else if (options.uri.indexOf(apiUrl + '/farms/10/fields/15/crop_fields/') != -1) {
        returnPromise = getOnCropField(options);

    // Mock api request on fields
    } else if (options.uri === (apiUrl + '/farms/10/fields')) {
        returnPromise = getOnFields(options);

    // Mock api request on crop field
    } else if (options.uri.indexOf(apiUrl + '/farms/10/fields/') != -1) {
        returnPromise = getOnField(options);

    // Mock api request on farms
    } else if (options.uri === (apiUrl + '/farms')) {
        returnPromise = getOnFarms(options);

    // Mock api request on farm
    } else if (options.uri.indexOf(apiUrl + '/farms/') != -1) {
        returnPromise = getOnFarm(options);

    // Mock api request on EquipmentModels
    } else if (options.uri === (apiUrl + '/datamaps/models')) {
        returnPromise = getOnEquipmentModels(options);

    // Mock api request on EquipmentModel
    } else if (options.uri.indexOf(apiUrl + '/datamaps/models/') !== -1) {
        returnPromise = getOnEquipmentModel(options);

    // Mock api request on farm_users
    } else if (options.uri.indexOf(apiUrl + '/farm_users/15/users/') !== -1) {
        returnPromise = getOnUserRole(options);

    // Mock api request on farm_user
    } else if (options.uri === (apiUrl + '/farm_users/10')) {
        returnPromise = getOnUserRoles(options);

    // Mock api request on roles
    } else if (options.uri === (apiUrl + '/roles')) {
        returnPromise = getOnRoles(options);

    // Mock api request on country_list
    } else if (options.uri === (apiUrl + '/country_list')) {
        returnPromise = getOnCountries(options);

    // Mock api request on soil_types
    } else if (options.uri === (apiUrl + '/soil_types')) {
        returnPromise = getOnSoilTypes(options);

    // Mock api request on crop_types
    } else if (options.uri === (apiUrl + '/crop_types')) {
        returnPromise = getOnCropTypes(options);

    // Mock api request on WolkyTolky equipments
    } else if (options.uri === (dataLinkUrl + '/equipments_wt/')) {
        returnPromise = getOnWolkyTolkyEqs(options);

    // Mock api request on WolkyTolky equipment
    } else if (options.uri === (dataLinkUrl + '/equipment_wt/?id=10')) {
        console.log('test');
        returnPromise = getOnWolkyTolkyEq(options);

    // Default response on get function
    } else {
        returnPromise = new Promise((_resolve, reject) => {reject({})}) as unknown as RequestPromise;
    }

    return returnPromise; // return RequestPromise
}

/**
 * putFake(): Mocks a response on a PUT request (for testing)
 */
export function putFake(options: any): RequestPromise{
    var returnPromise: RequestPromise; // Promise object to return as response

    // Ruturn mock response with statuscode 401 if there is no authentication code included
    if (options.auth.bearer === '') {
        returnPromise = returnStatusCode(401, true);

    // Mock api request on users
    } else if (options.uri.indexOf(apiUrl + '/users/') != -1){
        returnPromise = putOnUser(options);

    // Mock api request on crop fields
    } else if (options.uri.indexOf(apiUrl + '/farms/15/fields/10/crop_fields') != -1) {
        returnPromise = returnStatusCode(201, false);

    // Mock api request on fields
    } else if (options.uri.indexOf(apiUrl + '/farms/15/fields/') != -1) {
        returnPromise = returnStatusCode(201, false);

    // Mock api request on farms
    } else if (options.uri.indexOf(apiUrl + '/farms/') != -1) {
        returnPromise = putOnFarm(options);

    // Default response on put request with statuscode 201
    } else {
        returnPromise = returnStatusCode(201, false);
    }

    return returnPromise; // return RequestPromise
}

/**
 * delFake(): Mocks a response on a DELETE request (for testing)
 */
export function delFake(options: any): RequestPromise{
    var returnPromise: RequestPromise; // Promise object to return as response

    // Ruturn mock response with statuscode 401 if there is no authentication code included
    if (options.auth.bearer === '') {
        returnPromise = returnStatusCode(401, true);

    // Mock api request on users
    } else if (options.uri.indexOf(apiUrl + '/users/') != -1){
        returnPromise = delOnUser(options);

    // Mock api request on crop fields
    } else if (options.uri.indexOf(apiUrl + '/farms/15/fields/10/crop_fields') != -1) {
        returnPromise = returnStatusCode(204, false);

    // Mock api request on fields
    } else if (options.uri.indexOf(apiUrl + '/farms/15/fields/') != -1) {
        returnPromise = returnStatusCode(204, false);

    // Mock api request on farms
    } else if (options.uri.indexOf(apiUrl + '/farms/') != -1){
        returnPromise = delOnFarm(options);

    // Default response on delete request with statuscode 204
    } else {
        returnPromise = returnStatusCode(204, false);
    }

    return returnPromise; // return RequestPromise
}

/**
 * returnStatusCode(): Mocks an empty body response with a given statuscode
 */
export function returnStatusCode(statusCode: number, rejectProm: boolean): RequestPromise {
    return new Promise((resolve, reject) => {
        if (rejectProm){
            reject({statusCode: statusCode});
        } else {
            resolve({statusCode: statusCode});
        }
    }) as unknown as RequestPromise;
}
