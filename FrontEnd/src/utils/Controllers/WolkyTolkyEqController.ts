/* This controller contains all the functionality of retrieving the WolkyTolky equipment data from the data-
 * Linking service.
 */

import Request from "request-promise";
import { refreshToken } from "./UserController";
import { getOptions } from "./ReqeustUtils";
import { WolkyTolkyEq } from "../../common/WolkyTolkyEq";
import { dataLinkUrl } from "../../settings";

/**
 * getWolkyTolkyEqsEquipments() return array of WolkyTolkyEquipments
 * @return array of WolkyTolkyEquipment objects
*/
export async function getWolkyTolkyEqs(): Promise<Array<WolkyTolkyEq>> {
    var equipments: Array<WolkyTolkyEq> = new Array(0);
    var options = getOptions('GET', dataLinkUrl + '/equipments_wt/');

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200) {
            let response = JSON.parse(res.body);
            equipments = response.map(WolkyTolkyEq.fromJSON) as Array<WolkyTolkyEq>;
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
                    equipments = await getWolkyTolkyEqs();
                    break;
                }
            }
        }
    });

    return equipments;
}

/**
 * addWolkyTolkyEq() Creates a Equipment in the database, boolean response whether creation is succesfull.
 * @return boolean whether successful
*/
export async function addWolkyTolkyEq(equipment: WolkyTolkyEq): Promise<boolean> {
    var successful: boolean = false;
    var options = getOptions('POST', dataLinkUrl + '/equipment_wt/', equipment.toJSON());

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
                    successful = await addWolkyTolkyEq(equipment);
                    break;
                }
            }
        }
    });

    return successful;
}

/**
 * getWolkyTolkyEq() Gets a equipment object given the id the Requested farm.
 * @param equipmentId, the id of the equipment
 * @return boolean whether successful
*/
export async function getWolkyTolkyEq(equipmentId: number): Promise<WolkyTolkyEq> {
    var equipment: WolkyTolkyEq = new WolkyTolkyEq(0,0,'');
    var options = getOptions('GET', dataLinkUrl + '/equipment_wt/?id=' + equipmentId);

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200) {
            let response = JSON.parse(res.body);
            equipment = WolkyTolkyEq.fromJSON(response);
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
                    equipment = await getWolkyTolkyEq(equipmentId);
                    return;
                }
            }
        }
        throw err;
    });

    return equipment;
}

/**
 * updateWolkyTolkyEq() Updates equipment info given the id of it.
 * @param equipment, the wolkyTolkyEquipment
 * @return boolean whether successful
*/
export async function updateWolkyTolkyEq(equipment: WolkyTolkyEq): Promise<boolean> {
    var successful: boolean = false;
    var options = getOptions('PUT', dataLinkUrl + '/equipment_wt/', equipment.toJSON());

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
                    successful = await updateWolkyTolkyEq(equipment);
                    break;
                }
            }
        }
    });

    return successful;
}

/**
 * deleteWolkyTolkyEq() Deletes the equipment given the id it.
 * @param equipmentId, the wolkyTolkyEquipment id
 * @return boolean whether successful
*/
export async function deleteWolkyTolkyEq(equipmentId: number): Promise<boolean> {
    var successful: boolean = false;
    var options = getOptions('DELETE', dataLinkUrl + '/equipment_wt/?id=' + equipmentId);

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
                    successful = await deleteWolkyTolkyEq(equipmentId);
                    break;
                }
            }
        }
    });

    return successful;
}
