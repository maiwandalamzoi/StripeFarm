/* This controller contains all the functionality of retrieving the equipment data from the data-
 * Sensing service.
 */

import Request from "request-promise";
import { refreshToken } from "./UserController";
import { Equipment } from "../../common/Equipment";
import { AccessibilityType } from "../../common/AccessibilityType";
import { getOptions } from "./ReqeustUtils";
import { apiUrl } from "../../settings";

/**
 * getEquipments() return array of equipment objects from a farm
 * @param farmId, the id of a farm
 * @return array of equipment objects
*/
export async function getEquipments(farmId: number): Promise<Array<Equipment>> {
    var equipments: Array<Equipment> = new Array(0);
    var options = getOptions('GET', apiUrl + '/equipments?farm_id=' + farmId);

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200) {
            let response = JSON.parse(res.body);

            // Map response to array with equipments
            equipments = response.map(Equipment.fromJSON) as Array<Equipment>;
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
                    equipments = await getEquipments(farmId);
                    break;
                }
            }
        }
    });

    return equipments;
}

/**
 * addEquipment() make an add equipment request and return boolean whether successful
 * @param farmId, the id of a farm
 * @param equipment, a equipment object
 * @return true on success, false on error
*/
export async function addEquipment(equipment: Equipment, farmId: number): Promise<boolean> {
    var successful: boolean = false;
    var options = getOptions('POST', apiUrl + '/equipments?farm_id=' + farmId, equipment.toJSON());

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
                    successful = await addEquipment(equipment, farmId);
                    break;
                }
            }
        }
    });

    return successful;
}

/**
 * getEquipment() return equipment object with specified id
 * @param farmId, the id of a farm
 * @param equipmentId, the id of an equipment
 * @throw err if equipment not found or user is not allowed to view it
 * @return equipment object
*/
export async function getEquipment(equipmentId: number, farmId: number): Promise<Equipment> {
    var equipment: Equipment = new Equipment('',undefined, undefined, undefined, undefined, AccessibilityType.private, undefined);
    var options = getOptions('GET', apiUrl + '/equipments/' + equipmentId + '?farm_id=' + farmId);

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200) {
            let response = JSON.parse(res.body);
            equipment = Equipment.fromJSON(response);
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
                    equipment = await getEquipment(equipmentId, farmId);
                    return;
                }
            }
        }
        throw err;
    });

    return equipment;
}

/**
 * updateEquipment() make an update equipment request and return boolean whether successful
 * @param farmId, the id of a farm
 * @param equipment, a equipment object
 * @return true on success, false on error
*/
export async function updateEquipment(equipment: Equipment, farmId: number): Promise<boolean> {
    var successful: boolean = false;
    var options = getOptions('PUT', apiUrl + '/equipments/' + equipment.id + '?farm_id=' + farmId, equipment.toJSON());

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
                    successful = await updateEquipment(equipment, farmId);
                    break;
                }
            }
        }
    });

    return successful;
}

/**
 * deleteEquipment() make an delete equipment request and return boolean whether successful
 * @param farmId, the id of a farm
 * @param equipmentId, the id of an equpiment
 * @return true on success, false on error
*/
export async function deleteEquipment(equipmentId: number, farmId: number): Promise<boolean> {
    var successful: boolean = false;
    var options = getOptions('DELETE', apiUrl + '/equipments/' + equipmentId + '?farm_id=' + farmId);

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
                    successful = await deleteEquipment(equipmentId, farmId);
                    break;
                }
            }
        }
    });

    return successful;
}
