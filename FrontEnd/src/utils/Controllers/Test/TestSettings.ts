/* This module set up jest (used for testing) to use the mock API instead of the real api.
 * It also makes sure that window.location.reload() is not executed.
 */
import requestPromise, { RequestPromise } from "request-promise";
import { postFake, putFake, getFake, delFake } from "../../MockAPI/MockAPI";

/* loadSettings() set up jest to use the mock api and to not execute reload function */
export function loadSettings() {
    jest.spyOn(requestPromise, 'post').mockImplementation((options: any): RequestPromise => { return postFake(options);});
    jest.spyOn(requestPromise, 'get').mockImplementation((options: any): RequestPromise => {return getFake(options);});
    jest.spyOn(requestPromise, 'put').mockImplementation((options: any): RequestPromise => {return putFake(options);});
    jest.spyOn(requestPromise, 'delete').mockImplementation((options: any): RequestPromise => {return delFake(options);});
    jest.spyOn(window.location, 'reload').mockImplementation(() => {return;});
}
