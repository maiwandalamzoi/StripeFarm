/* This controller contains all the functionality of retrieving the extra equipment info data from the data-
 * Linking service.
 */

import Request from "request-promise";
import { refreshToken } from "./UserController";
import { getOptions } from "./ReqeustUtils";
import { EquipmentInformation } from "../../common/EquipmentInformation";
import { dataLinkUrl } from "../../settings";

/**
 * getEquipmentInfo() return equipment information
 * @param equipmentId, the id of an equipment
 * @return equipment information
*/
export async function getEquipmentInfo(equipmentId: number): Promise<EquipmentInformation>{
    var equipmentInfo: EquipmentInformation = new EquipmentInformation(0,0,undefined,0,false);
    var options = getOptions('GET', dataLinkUrl + '/location_information/' + equipmentId);

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200 && res.body) {
            equipmentInfo = EquipmentInformation.fromJSON(res.body);
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
                    equipmentInfo = await getEquipmentInfo(equipmentId);
                    return;
                }
            }
        }
        throw err;
    });

    return equipmentInfo;
}

/**
 * addEquipmentInfo() Creates an equipment information object in the database,
 * boolean response whether creation is succesfull.
 * @param farmId, the id of a farm
 * @return array of equipment objects
*/
export async function addEquipmentInfo(equipmentInfo: EquipmentInformation): Promise<boolean> {
    var successful: boolean = false;
    var options = getOptions('POST', dataLinkUrl + '/location_information', equipmentInfo.toJSON());

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
                    successful = await addEquipmentInfo(equipmentInfo);
                    break;
                }
            }
        }
    });

    return successful;
}

/**
 * updateEquipmentInfo() Updates equipment info given the id of it.
 * @param equipmentInfo, equipmentInformation
 * @return boolean whether successful
*/
export async function updateEquipmentInfo(equipmentInfo: EquipmentInformation): Promise<boolean> {
    var successful: boolean = false;
    var options = getOptions('PUT', dataLinkUrl + '/location_information/' + equipmentInfo.equipmentId, equipmentInfo.toJSON());

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
                    successful = await updateEquipmentInfo(equipmentInfo);
                    break;
                }
            }
        }
    });

    return successful;
}

/**
 * deleteEquipmentInfo() Delete equipment info given the id
 * @param equipmentId, the id of the equipment
 * @return boolean whether successful
*/
export async function deleteEquipmentInfo(equipmentId: number): Promise<boolean> {
    var successful: boolean = false;
    var options = getOptions('DELETE', dataLinkUrl + '/location_information/' + equipmentId);

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
                    successful = await deleteEquipmentInfo(equipmentId);
                    break;
                }
            }
        }
    });

    return successful;
}
