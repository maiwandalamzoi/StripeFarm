/* This controller contains all the functionality of retrieving the crop field data from the data-
 * Sensing service.
 */

import Request from "request-promise";
import { CropField } from "../../common/CropField";
import { refreshToken } from "./UserController";
import { CropType } from "../../common/CropType";
import { getOptions } from "./ReqeustUtils";
import { apiUrl } from "../../settings";
import { AccessibilityType } from "../../common/AccessibilityType";

/**
 * getCropFields() return array of crop fields that exist on a field on a farm
 * @param farmId, the id of a farm
 * @param fieldId, the id of a field
 * @return array of crop fields
*/
export async function getCropFields (farmId: number, fieldId: number): Promise<Array<CropField>> {
    var cropFields: Array<CropField> = new Array(0); // Empty array of cropfields
    var options = getOptions('GET', apiUrl + '/farms/' + farmId + '/fields/' + fieldId + '/crop_fields');

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200) {
            let response = JSON.parse(res.body);

            // Map response to array with cropfields
            cropFields = response.map(CropField.fromJSON) as Array<CropField>;
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
                    cropFields = await getCropFields(farmId, fieldId);
                    break;
                }
            }
        }
    });

    return cropFields;
}

/**
 * getCropField() return crop field object from cropfield with specified id
 * @param farmId, the id of a farm
 * @param fieldId, the id of a field
 * @param cropFieldId, the id of a crop field
 * @throw err if cropfield not found or user is not allowed to view it
 * @return crop field object
*/
export async function getCropField (farmId: number, fieldId: number, cropFieldId: number): Promise<CropField> {
    var cropField: CropField = new CropField(undefined, undefined, undefined, '', new Date(), new Date(), [], new CropType(undefined, '', ''), AccessibilityType.public);
    var options = getOptions('GET', apiUrl + '/farms/' + farmId + '/fields/' + fieldId + '/crop_fields/' + cropFieldId);

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200) {
            let response = JSON.parse(res.body);

            // Map response to CropField object
            cropField = CropField.fromJSON(response);
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
                    cropField = await getCropField(farmId, fieldId, cropFieldId);
                    return;
                }
            }
        }
        throw err;
    });

    return cropField;
}

/**
 * addCropField() make an add crop field request and return boolean whether successful
 * @param farmId, the id of a farm
 * @param fieldId, the id of a field
 * @param cropField, a crop field object
 * @return true on success, false on error
*/
export async function addCropField(farmId: number, fieldId: number, cropField: CropField): Promise<boolean> {
    var successful: boolean = false;
    var options = getOptions('POST', apiUrl + '/farms/' + farmId + '/fields/' + fieldId + '/crop_fields', cropField.toJSON());

    await Request.post(options)
    .then(function (res){
        // Expect statusCode 201 on successful request
        console.log(res)
        if (res.statusCode === 201) {
            successful = true;
            return;
        }
        // No error received, but not the right statusCode
        return Promise.reject('Unexpected response received!');
    })
    .catch(async function (err){
        console.log(err)
        if (err.statusCode){
            switch(err.statusCode) {
                case 401: {
                    // Token expired, refresh the token and try again
                    await refreshToken();
                    successful = await addCropField(farmId, fieldId, cropField);
                    break;
                }
            }
        }
    });

    return successful;
}

/**
 * updateCropField() make an update crop field request and return boolean whether successful
 * @param farmId, the id of a farm
 * @param fieldId, the id of a field
 * @param cropField, a crop field object
 * @return true on success, false on error
*/
export async function updateCropField(farmId: number, fieldId: number, cropField: CropField): Promise<boolean> {
    var successful: boolean = false;

    var options = getOptions('PUT', apiUrl + '/farms/' + farmId + '/fields/' + fieldId + '/crop_fields/' + cropField.id, cropField.toJSON());

    await Request.put(options)
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
                    successful = await updateCropField(farmId, fieldId, cropField);
                    break;
                }
            }
        }
    });

    return successful;
}

/**
 * deleteCropField() make an delete crop field request and return boolean whether successful
 * @param farmId, the id of a farm
 * @param fieldId, the id of a field
 * @param cropFieldId, the id of a crop field
 * @return true on success, false on error
*/
export async function deleteCropField(farmId: number, fieldId: number, cropFieldId: number): Promise<boolean> {
    var successful: boolean = false;

    var options = getOptions('DELETE', apiUrl + '/farms/' + farmId + '/fields/' + fieldId + '/crop_fields/' + cropFieldId);

    await Request.delete(options)
    .then(function (res){
        // Expect statusCode 204 on successful request
        if (res.statusCode === 204) {
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
                    successful = await deleteCropField(farmId, fieldId, cropFieldId);
                    break;
                }
            }
        }
    });

    return successful;
}
