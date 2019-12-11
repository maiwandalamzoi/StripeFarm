import { RequestPromise } from "request-promise";
import { apiUrl } from "../../settings";

/**
 * putOnUser() mocks PUT request on user
 * return 200 if userId = 15
 * return 404 if userId != 15
 */
export function putOnUser(options: any): RequestPromise{
    return new Promise((resolve, reject) => {
        let userId = options.uri.replace((apiUrl+'/users/'), '')
        if (userId === '15'){
            resolve({statusCode: 201,});
        } else {
            reject({statusCode: 404});
        }
    }) as unknown as RequestPromise;
}

/**
 * putOnFarm() mocks PUT request on farm
 * return 201 if userId = 15
 * return 404 if userId != 15
 */
export function putOnFarm(options: any): RequestPromise{
    return new Promise((resolve, reject) => {
        let farmId = options.uri.replace((apiUrl+'/farms/'), '')
        if (farmId === '15'){
            resolve({statusCode: 201});
        } else {
            reject({statusCode: 404});
        }
    }) as unknown as RequestPromise;
}
