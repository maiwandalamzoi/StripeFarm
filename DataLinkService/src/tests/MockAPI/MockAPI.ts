import { RequestPromise } from "request-promise";
import { getOnWolkyTolkyData,
    getOnWolkyTolkyJsonData,
    getOnDataMaps,
    getOnEquipment
} from "./MockAPI.Get";
import { postOnJwtToken } from "./MockAPI.Post";
import { apiUrl} from "../../settings";

/**
 * postFake(): Mocks a response on a POST request (for testing)
 */
export function postFake(options: any): RequestPromise{
    // Mock api request on jwt_token
    if (options.uri === apiUrl + '/auth/jwt_token') {
        return postOnJwtToken(options);
    }

    return new Promise((_resolve, reject) => { reject({}) }) as unknown as RequestPromise;
}

/**
 * getFake(): Mocks a response on a GET request (for testing)
 */
export function getFake(options: any): RequestPromise{
    // Mock api request WolkyTolky data
    if (options.uri.indexOf("csv") != -1) {
        return getOnWolkyTolkyData(options);
    // Mock api request on WolkyTolky data as JSON
    } else if (options.uri.indexOf("json") != -1) {
        return getOnWolkyTolkyJsonData(options);
    // Mock api request on equipment
    } else if (options.uri === apiUrl + '/equipments/10?farm_id=15'){
        return getOnEquipment(options);
    // Mock api request on DataMaps
    } else if (options.uri === (apiUrl + '/datamaps')) {
        return getOnDataMaps(options);
    }

    return new Promise((_resolve, reject) => { reject({}) }) as unknown as RequestPromise;
}