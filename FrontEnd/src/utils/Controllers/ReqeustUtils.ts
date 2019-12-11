/* This module is used for creating headers for API requests with the authorization header
 */

import { getToken } from "./UserController";

/**
 * getOptions() returns a header with the specified paramaeters
 * @param method, the request method
 * @param uri, the url to make the request on
 * @param body, the body of the request (optional)
 * @return header format
*/
export function getOptions(method: 'GET'|'POST'|'PUT'|'DELETE', uri: string, body?: any): any{
    // If body is undefined, create empty body
    if (body === undefined){
        body = {};
    }

    // Return request header
    return {
        method: method,                 // Method
        uri: uri,                       // Url
        resolveWithFullResponse: true,  // Return full response
        auth: {'bearer': getToken()},    // Authentication token
        body: body,                     // Body
        json: true                      // Request JSON object
    }
}
