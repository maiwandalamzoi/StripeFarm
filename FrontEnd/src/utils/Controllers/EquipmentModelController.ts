/* This controller contains all the functionality of retrieving the equipment model data from the data-
 * Sensing service.
 */

import Request from "request-promise";
import { EquipmentModel } from "../../common/EquipmentModel";
import { refreshToken } from "./UserController";
import { getOptions } from "./ReqeustUtils";
import { apiUrl } from "../../settings";

/**
 * getEquipmentModels() return array of equipmentModel objects
 * @return array of equipmentModel objects
*/
export async function getEquipmentModels(): Promise<Array<EquipmentModel>> {
    var equipmentModels: Array<EquipmentModel> = new Array(0);
    var options = getOptions('GET', apiUrl + '/datamaps/models');

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200) {
            let response = JSON.parse(res.body);

            // Map response to array with equipmentModels
            equipmentModels = response.map(EquipmentModel.fromJSON) as Array<EquipmentModel>;
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
                    equipmentModels = await getEquipmentModels();
                    break;
                }
            }
        }
    });

    return equipmentModels;
}

/**
 * addEquipmentModel() make an add equipmentModel request and return boolean whether successful
 * @param equipmentModel, a equipmentModel object
 * @return true on success, false on error
*/
export async function addEquipmentModel(equipmentModel: EquipmentModel): Promise<boolean> {
    var successful: boolean = false;

    var options = getOptions('POST', apiUrl + '/datamaps/models', equipmentModel.toJSON());

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
                    successful = await addEquipmentModel(equipmentModel);
                    break;
                }
            }
        }
    });

    return successful;
}

/**
 * getEquipmentModel() return EquipmentModel object with specified slug
 * @param slug, the slug of a equipmentModel
 * @throw err if EquipmentModel not found or user is not allowed to view it
 * @return EqupimentModel object
*/
export async function getEquipmentModel(slug: string): Promise<EquipmentModel> {
    var equipmentModel: EquipmentModel = new EquipmentModel('', '', undefined, undefined, undefined, undefined, undefined, undefined);
    var options = getOptions('GET', apiUrl + '/datamaps/models/' + slug);

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200) {
            let response = JSON.parse(res.body);

            // Map response to equipmentModel object
            equipmentModel = EquipmentModel.fromJSON(response);
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
                    equipmentModel = await getEquipmentModel(slug);
                    return;
                }
            }
        }
        throw err;
    });

    return equipmentModel;
}
