import { DataColumn } from "../../../utils/DataColumn";
import Request from 'request-promise';

const apiUrl = "http://proeftuin.win.tue.nl/api/v1";

/**
 * Get the datamap id for a certain equipment model.
 * @param equipmentModelId The equipment model for which to retrieve the datamap.
 * @param accessToken The accessToken to authorize the request.
 */
export async function getDataMapIdByEquipmentModelId(equipmentModelId: number, accessToken: string):
    Promise<number> {

    const response = await getDataMaps(accessToken);
    const dataMapJson = JSON.parse(response) as Array<any>;

    // Find the datamap corresponding with the equipment model id.
    var dataMap = dataMapJson.find(x => x.model_id === equipmentModelId);

    if (dataMap)
        return dataMap.id;

    throw new Error("No datamap found for this equipment");
};

/**
 * Get the datacolumn info for a provided equipment model.
 * @param equipmentModelId The id of the equipment model for which the datacolumn info should be retrieved.
 * @param accessToken The accessToken to authorize the request.
 */
export async function getDataColumnsByEquipmentModelId(equipmentModelId: number, accessToken: string):
    Promise<DataColumn[]> {
    const response = await getDataMaps(accessToken);

    // Get all the available datamaps.
    const dataMapJson = JSON.parse(response) as Array<any>;

    var dataColumns: DataColumn[] = [];

    // Find the datamap corresponding with the equipment model id.
    const dataMap = dataMapJson.find(x => x.model_id === equipmentModelId);

    if (dataMap == undefined) {
        console.log("No datamap that corresponds with this equipment.");
        return [];
    }

    for (var x of dataMap.maps) {
        dataColumns.push(new DataColumn(x.column, x.observation.unit));
    }


    return dataColumns;
};


/**
 * Get the equipment model of a certain equipment.
 * @param equipmentId The id of the equipment.
 * @param accessToken The access token to authorize the request.
 */
export async function getEquipmentModelId(equipmentId: number, accessToken: string, farmId: number): Promise<number> {
    const options = {
        method: "get",
        uri: apiUrl + "/equipments/" + equipmentId + "?farm_id=" + farmId,
        resolveWithFullResponse: true,
        auth: {
            bearer: accessToken
        },
        json: true
    };

    return await Request.get(options)
        .then(function(res) {
            if (res.statusCode === 200) {
                // Successful
                let response = JSON.parse(res.body);
                return response.model_id;
            }
            return Promise.reject('Unexpected response received!');
        })
        .catch((err: { statusCode: any; }) => {
            console.log("No equipment model found related to the equipement");
            return -1;
        });
}

/**
 * Get the available datamaps from the mapping service
 * @param accessToken The access token to authorize the request.
 */
export async function getDataMaps(accessToken: string): Promise<string> {
    const options = {
        method: "get",
        uri: apiUrl + "/datamaps",
        resolveWithFullResponse: true,
        auth: {
            bearer: accessToken
        },
        json: true
    };

    return await Request.get(options)
        .then(function(res) {
            if (res.statusCode === 200) {
                // Successful
                return res.body;
            } else {
                // Unexpected response
                throw Error("Unexpected response received!");
            }
        })
        .catch(async function(err) {
            if (err.statusCode) {
                switch (err.statusCode) {
                case 403:
                {
                    // User does not have permission
                    console.error("User does not have permission!");
                    break;
                }
                case 404:
                {
                    // No farms found -> return empty array
                    break;
                }
                default:
                {
                    // Error
                    console.error(err.message);
                    throw Error("Could not fetch!");
                }
                }
            } else {
                // Error
                console.error(err.message);
                throw Error("Unexpected response received!");
            }
        });
}