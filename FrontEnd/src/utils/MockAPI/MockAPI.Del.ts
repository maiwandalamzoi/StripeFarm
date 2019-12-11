import { RequestPromise } from "request-promise";
import { apiUrl } from "../../settings";

/**
 * delOnUser() mocks DELETE api request on user
 * return 204 if userId = 15
 * return 404 if userId != 15
 */
export function delOnUser(options: any): RequestPromise{
    return new Promise((resolve, reject) => {
        let userId = options.uri.replace((apiUrl+'/users/'), '') // get UserId from url
        if (userId === '15'){
            resolve({statusCode: 204});
        } else {
            reject({statusCode: 404});
        }
    }) as unknown as RequestPromise;
}

/**
 * delOnFarm() mocks DELETE api request on farm
 * return 204 if userId = 15
 * return 404 if userId != 15
 */
export function delOnFarm(options: any): RequestPromise{
    return new Promise((resolve, reject) => {
        let farmId = options.uri.replace((apiUrl+'/farms/'), '')  // get FarmId from url
        if (farmId === '15'){
            resolve({statusCode: 204});
        } else {
            reject({statusCode: 404});
        }
    }) as unknown as RequestPromise;
}
