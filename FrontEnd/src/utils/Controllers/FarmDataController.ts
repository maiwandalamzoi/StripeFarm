/* This controller contains all the functionality of retrieving the farm observation data from the data-
 * linking service.
 */

import { DataValue } from "../../common/DataValue";
import Request from "request-promise";
import { refreshToken } from '../../utils/Controllers/UserController';
import { Observation } from "../../common/Observation";
import { apiUrl, dataLinkUrl } from "../../settings";
import { getOptions } from "./ReqeustUtils";

/**
 * getLiveData() return live data from a specific crop field
 * @param farmId, the id of a farm
 * @param fieldId, the id of a field
 * @param cropFieldId, the id of a crop field
 * @throw err if cropfield not found or user is not allowed to view it
 * @return live data string
*/
export async function getLiveData(farmId: string, fieldId: string, cropFieldId: string):Promise<DataValue[]> {
    var liveData: Array<DataValue> = new Array(0);
    var options = getOptions('GET', dataLinkUrl + `/live?farmId=${farmId}&fieldId=${fieldId}&cropfieldId=${cropFieldId}`);

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200) {
            liveData = res.body;
            return;
        }
        // No error received, but not the right statusCode
        throw Error("Unexpected response received!");
    })
    .catch(async function (err){
        if (err.statusCode){
            switch(err.statusCode) {
                case 401: {
                    // Token expired, refresh the token and try again
                    await refreshToken();
                    liveData = await getLiveData(farmId, fieldId, cropFieldId);
                    return;
                }
            }
        }
        throw err;
    });

    return liveData;
}

/**
 * getLiveData() return observation data from a specific crop field
 * @param farmId, the id of a farm
 * @param fieldId, the id of a field
 * @param cropFieldId, the id of a crop field
 * @throw err if server responds with an error
 * @return array of observation objects
*/
export async function getObservation (type: "environment"|"crop"|"harvest", farmId: number, fieldId: number, cropFieldId: number, equipmentId?: number): Promise<Array<Observation>> {
    // Create equipment string for request url if equpiment is specified
    var optionalEqu = '';
    if (equipmentId){
        optionalEqu = '&equipment_id=' + equipmentId;
    }

    var observations: Array<Observation> = new Array(0);
    var options = getOptions('GET', apiUrl + '/observations?type=' + type + '&farm_id=' + farmId + '&field_id=' + farmId + '&crop_field_id=' + cropFieldId + optionalEqu);

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200) {
            let response = JSON.parse(res.body);

            // Map response to array with observations
            observations = response.map(Observation.fromJSON) as Array<Observation>;
            return;
        }
        // No error received, but not the right statusCode
        throw Error("Unexpected response received!");
    })
    .catch(async function (err){
        if (err.statusCode){
            switch(err.statusCode) {
                case 401: {
                    // Token expired, refresh the token and try again
                    await refreshToken();
                    observations = await getObservation(type, farmId, fieldId, cropFieldId, equipmentId);
                    break;
                }
            }
        }
        throw err;
    });

    return observations;
}
