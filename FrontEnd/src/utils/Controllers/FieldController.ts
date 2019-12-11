/* This controller contains all the functionality of retrieving the field data from the data-
 * Sensing service.
 */

import { refreshToken} from "./UserController";
import Request from "request-promise";
import { Field } from "../../common/Field";
import { SoilType } from "../../common/SoilType";
import { getOptions } from "./ReqeustUtils";
import { apiUrl } from "../../settings";
import { AccessibilityType } from "../../common/AccessibilityType";

/**
 * getFarmFields() return array of field object on farms
 * @param farmId, a farm id
 * @return array of field objects
*/
export async function getFarmFields (farmId: number): Promise<Array<Field>> {
    var fields: Array<Field> = new Array(0);
    var options = getOptions('GET', apiUrl + '/farms/' + farmId + '/fields');

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200) {
            let response = JSON.parse(res.body);

            // Map response to array with field objects
            fields = response.map(Field.fromJSON) as Array<Field>;
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
                    fields = await getFarmFields(farmId);
                    break;
                }
            }
        }
    });

    return fields;
}

/**
 * getFarmField() return field object from field with specified id
 * @param farmId, the id of a farm
 * @param fieldId, the id of a field
 * @throw err if field not found or user is not allowed to view it
 * @return field object
*/
export async function getFarmField (farmId: number, fieldId: number): Promise<Field> {
    var field: Field = new Field(undefined, '', [], 0 , new SoilType(undefined, '', ''), AccessibilityType.public);
    var options = getOptions('GET', apiUrl + '/farms/' + farmId + '/fields/' + fieldId);

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200) {
            let response = JSON.parse(res.body);

            // Map response to field object
            field = Field.fromJSON(response);
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
                    field = await getFarmField(farmId, fieldId);
                    return;
                }
            }
        }
        throw err;
    });

    return field;
}

/**
 * addFarmField() make an add field request and return boolean whether successful
 * @param farmId, the id of a farm
 * @param field, a field object
 * @return true on success, false on error
*/
export async function addFarmField (farmId: number, field: Field): Promise<boolean> {
    var successful: boolean = false;
    var options = getOptions('POST', apiUrl + '/farms/' + farmId + '/fields', field.toJSON());

    await Request.post(options)
    .then(function (res){
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
                    successful = await addFarmField(farmId, field);
                    break;
                }
            }
        }
    });

    return successful;
}

/**
 * updateFarmField() make an update field request and return boolean whether successful
 * @param farmId, the id of a farm
 * @param field, a field object
 * @return true on success, false on error
*/
export async function updateFarmField (farmId: number, field: Field): Promise<boolean> {
    var successful: boolean = false;
    var options = getOptions('PUT', apiUrl + '/farms/' + farmId + '/fields/' + field.id, field.toJSON());

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
                    successful = await updateFarmField(farmId, field);
                    break;
                }
            }
        }
    });

    return successful;
}

/**
 * deleteFarmField() make an delete field request and return boolean whether successful
 * @param farmId, the id of a farm
 * @param fieldId, the id of a field
 * @return true on success, false on error
*/
export async function deleteFarmField (farmId: number, fieldId: number): Promise<boolean> {
    var successful: boolean = false;
    var options = getOptions('DELETE', apiUrl + '/farms/' + farmId + '/fields/' + fieldId);

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
                    successful = await deleteFarmField(farmId, fieldId);
                    break;
                }
            }
        }
    });

    return successful;
}
