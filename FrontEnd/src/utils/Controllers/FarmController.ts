/* This controller contains all the functionality of retrieving the farm data from the data-
 * Sensing service.
 */

import { Farm } from "../../common/Farm";
import Request from "request-promise";
import { refreshToken } from '../../utils/Controllers/UserController';
import { getOptions } from "./ReqeustUtils";
import { apiUrl } from "../../settings";

/**
 * getFarms() return array of farm objects
 * @return array of farm objects
*/
export async function getFarms(): Promise<Array<Farm>> {
    var farms: Array<Farm> = new Array(0);
    var options = getOptions('GET', apiUrl + '/farms');

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200) {
            let response = JSON.parse(res.body);
            farms = response.map(Farm.fromJSON) as Array<Farm>;
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
                    farms = await getFarms();
                    break;
                }
            }
            return;
        }
    });

    return farms;
}

/**
 * addFarm() make an add farm request and return boolean whether successful
 * @param farm, a farm object
 * @return true on success, false on error
*/
export async function addFarm (farm: Farm): Promise<boolean> {
    var successful: boolean = false;
    var options = getOptions('POST', apiUrl + '/farms', farm.toJSON());

    await Request.post(options)
    .then(function (res){
        // Expect statusCode 201 on successful request
        if (res.statusCode === 201) {
            successful = true;
            return;
        }
        // No error received, but not the right statusCode
        return Promise.reject('Unexpected response received!')
    })
    .catch(async function (err){
        if (err.statusCode){
            switch(err.statusCode) {
                case 401: {
                    // Token expired, refresh the token and try again
                    await refreshToken();
                    successful = await addFarm(farm);
                    break;
                }
            }
        }
    });

    return successful;
}

/**
 * getFarm() return farm object from farm with specified id
 * @param farmId, the id of a farm
 * @throw err if farm not found or user is not allowed to view it
 * @return farm object
*/
export async function getFarm (farmId: number): Promise<Farm> {
    var farms: Array<Farm> = new Array(0);
    var options = getOptions('GET', apiUrl + '/farms/' + farmId);

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200) {
            farms.push(Farm.fromJSON(JSON.parse(res.body)));
            return;
        }
        // No error received, but not the right statusCode
        return Promise.reject('Unexpected response received!')
    })
    .catch(async function (err){
        if (err.statusCode){
            switch(err.statusCode) {
                case 401: {
                    // Token expired, refresh the token and try again
                    await refreshToken();
                    farms.push(await getFarm(farmId));
                    return;
                }
            }
        }
        throw err;
    });

    return farms[0] as Farm;
}

/**
 * addFarm() make an add farm request and return boolean whether successful
 * @param farm, a farm object
 * @return true on success, false on error
*/
export async function updateFarm (farm: Farm): Promise<boolean> {
    var successful: boolean = false;
    var options = getOptions('PUT', apiUrl + '/farms/' + farm.id, farm.toJSON());

    await Request.put(options)
    .then(function (res){
        // Expect statusCode 201 on successful request
        if (res.statusCode === 201) {
            successful = true;
            return;
        }
        // No error received, but not the right statusCode
        return Promise.reject('Unexpected response received!')
    })
    .catch(async function (err){
        if (err.statusCode){
            switch(err.statusCode) {
                case 401: {
                    // Token expired, refresh the token and try again
                    await refreshToken();
                    successful = await updateFarm(farm);
                    break;
                }
            }
        }
    });

    return successful;
}

/**
 * deleteFarm() make an delete farm request and return boolean whether successful
 * @param farmId, a farm id
 * @return true on success, false on error
*/
export async function deleteFarm (farmId: number): Promise<boolean> {
    var successful: boolean = false;
    var options = getOptions('DELETE', apiUrl + '/farms/' + farmId);

    await Request.delete(options)
    .then(function (res){
        // Expect statusCode 204 on successful request
        if (res.statusCode === 204) {
            successful = true;
            return;
        }
        // No error received, but not the right statusCode
        return Promise.reject('Unexpected response received!')
    })
    .catch(async function (err){
        if (err.statusCode){
            switch(err.statusCode) {
                case 401: {
                    // Token expired, refresh the token and try again
                    await refreshToken();
                    successful = await deleteFarm(farmId);
                    break;
                }
            }
        }
    });

    return successful;
}
