/* This controller contains all the functionality of retrieving the countries, cropTypes and
 * soilTypes from the data-Sensing service.
 */

import Request from "request-promise";
import { Country } from "../../common/Country";
import { refreshToken } from "./UserController";
import { CropType } from "../../common/CropType";
import { SoilType } from "../../common/SoilType";
import { getOptions } from "./ReqeustUtils";
import { apiUrl } from "../../settings";

/**
 * getCountries() returns array of all countries
 * @return array with Country objects
*/
export async function getCountries(): Promise<Array<Country>> {
    var countries: Array<Country> = new Array(0);
    var options = getOptions('GET', apiUrl + '/country_list');

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200) {
            let response = JSON.parse(res.body);
            countries = response.map(Country.fromJSON) as Array<Country>;
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
                    countries = await getCountries();
                    break;
                }
            }
        }
    });

    return countries;
}

/**
 * getCropTypes() returns array of all crop types
 * @return array with CropType objects
*/
export async function getCropTypes(): Promise<Array<CropType>> {
    var cropTypes: Array<CropType> = new Array(0);
    var options = getOptions('GET', apiUrl + '/crop_types');

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200) {
            let response = JSON.parse(res.body);
            cropTypes = response.map(CropType.fromJSON) as Array<CropType>;
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
                    cropTypes = await getCropTypes();
                    break;
                }
            }
        }
    });

    return cropTypes;
}

/**
 * getSoilTypes() returns array of all soil types
 * @return array with SoilType objects
*/
export async function getSoilTypes(): Promise<Array<SoilType>> {
    var soilTypes: Array<SoilType> = new Array(0);
    var options = getOptions('GET', apiUrl + '/soil_types');

    await Request.get(options)
    .then(function (res){
        // Expect statusCode 200 on successful request
        if (res.statusCode === 200) {
            let response = JSON.parse(res.body);
            soilTypes = response.map(SoilType.fromJSON) as Array<SoilType>;
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
                    soilTypes = await getSoilTypes();
                    break;
                }
            }
        }
    });

    return soilTypes;
}
