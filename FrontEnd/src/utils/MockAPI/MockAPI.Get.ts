import { RequestPromise } from "request-promise";
import { apiUrl } from "../../settings";

/**
 * getOnUser() mocks GET request on user
 * return 200 if userId = 15
 * return 404 if userId != 15
 */
export function getOnUser(options: any): RequestPromise{
    return new Promise((resolve, reject) => {
        let userId = options.uri.replace((apiUrl+'/users/'), '')
        if (userId === '15'){
            let response = {
                statusCode: 200,
                body: {
                        "id": 15,"first_name": "testFirstName","last_name": "testLastName",
                        "email": "test@test.nl","created_date": "2011-01-01"
                      }
            };
            resolve(response);
        } else {
            reject({statusCode: 404});
        }
    }) as unknown as RequestPromise;
}

/**
 * getOnRefreshToken() mocks GET request on refresh_token
 * return 200 with refreshtoken
 */
export function getOnRefreshToken(_options: any): RequestPromise{
    return new Promise((resolve, _reject) => {
        let response = {
            statusCode: 200,
            body: {"access_token": "eyJpc3MiOiJ0b3B0YWwuY29tIiwiZXhwIjoxNDI2NDIwODAwLCJodHRwOi8vdG9wdGFsLmNvbS9qd3RfY2xhaW1zL2lzX2FkbWluIjp0cnVlLCJjb21wYW55IjoiVG9wdGFsIiwiYXdlc29tZSI6dHJ1ZX0"}
        };
        resolve(response);
    }) as unknown as RequestPromise;
}

/**
 * getOnFarms() mocks GET request on farms
 * return 200 with list of Farms
 */
export function getOnFarms(_options: any): RequestPromise{
    return new Promise((resolve, _reject) => {
        let listOfFarms = [];
        for (let i = 0; i < 10; i++){
            listOfFarms.push({
                "id": 1,"name": "testName","address": "testAddress","postal_code": "1234AB","email": "test@test.nl",
                "phone": "1234567890","webpage": "test.com","accessibility": "public","country": { "id": 1,"name": "Netherlands", "code": "NL"}
            });
        }
        resolve({statusCode: 200, body: JSON.stringify(listOfFarms)});
    }) as unknown as RequestPromise;
}

/**
 * getOnFarm() mocks GET request on farm
 * return 200 with farm object
 */
export function getOnFarm(_options: any): RequestPromise{
    return new Promise((resolve, _reject) => {
        let response = {
            statusCode: 200,
            body: JSON.stringify({
                "id": 1,"name": "testName","address": "testAddress","postal_code": "1234AB","email": "test@test.nl",
                "phone": "1234567890","webpage": "test.com","accessibility": "public","country": { "id": 1,"name": "Netherlands", "code": "NL"}
            })
        };
        resolve(response);
    }) as unknown as RequestPromise;
}

/**
 * getOnFields() mocks GET request on fields
 * return 200 with list of fields
 */
export function getOnFields(_options: any): RequestPromise{
    return new Promise((resolve, _reject) => {
        let listOfFields = [];
        for (let i = 0; i < 10; i++){
            listOfFields.push({
                "id": 1,"soil_type": {"id": 1,"name": "sandy","description": "Sandy Soil is light, warm, dry and tend to be acidic and low in nutrients."},
                "field_name": "testFieldName","coordinates": [{"latitude": 51.44687,"longitude": 5.486914},{"latitude": 51.44687,"longitude": 5.486914},
                {"latitude": 51.44687,"longitude": 5.486914},{"latitude": 51.44687,"longitude": 5.486914}],"size_in_hectare": 5,"accessibility": "public"
            });
        }
        resolve({statusCode: 200, body: JSON.stringify(listOfFields)});
    }) as unknown as RequestPromise;
}

/**
 * getOnField() mocks GET request on fields
 * return 200 with field object
 */
export function getOnField(_options: any): RequestPromise{
    return new Promise((resolve, _reject) => {
        let response = {
            statusCode: 200,
            body: JSON.stringify({
                "id": 1,"soil_type": {"id": 1,"name": "sandy","description": "Sandy Soil is light, warm, dry and tend to be acidic and low in nutrients."},
                "field_name": "testFieldName","coordinates": [{"latitude": 51.44687,"longitude": 5.486914},{"latitude": 51.44687,"longitude": 5.486914},
                {"latitude": 51.44687,"longitude": 5.486914},{"latitude": 51.44687,"longitude": 5.486914}],"size_in_hectare": 5,"accessibility": "public"
            })
        };
        resolve(response);
    }) as unknown as RequestPromise;
}

/**
 * getOnCropFields() mocks GET request on crop crop_fields
 * return 200 with list of crop crop fields
 */
export function getOnCropFields(_options: any): RequestPromise{
    return new Promise((resolve, _reject) => {
        let listOfCropFields = [];
        for (let i = 0; i < 10; i++){
            listOfCropFields.push({
                "id": 1,"farm_id": 1,"field_id": 1,"name": "testCropFieldName","period_start": "2018-01-22","period_end": "2018-09-17",
                "coordinates": [{"latitude": 51.44687,"longitude": 5.486914},{"latitude": 51.44687,"longitude": 5.486914},
                {"latitude": 51.44687,"longitude": 5.486914},{"latitude": 51.44687,"longitude": 5.486914}],
                "accessibility": "public","crop_type": [{"id": 1,"name": "Potato","variety": "Fontane"}]
            });
        }
        resolve({statusCode: 200, body: JSON.stringify(listOfCropFields)});
    }) as unknown as RequestPromise;
}

/**
 * getOnCropField() mocks GET request on crop_field
 * return 200 with a crop fields object
 */
export function getOnCropField(_options: any): RequestPromise{
    return new Promise((resolve, _reject) => {
        let response = {
            statusCode: 200,
            body: JSON.stringify({
                "id": 1,"farm_id": 1,"field_id": 1,"name": "testCropFieldName","period_start": "2018-01-22","period_end": "2018-09-17",
                "coordinates": [{"latitude": 51.44687,"longitude": 5.486914},{"latitude": 51.44687,"longitude": 5.486914},
                {"latitude": 51.44687,"longitude": 5.486914},{"latitude": 51.44687,"longitude": 5.486914}],
                "accessibility": "public","crop_type": [{"id": 1,"name": "Potato","variety": "Fontane"}]
            })
        };
        resolve(response);
    }) as unknown as RequestPromise;
}

export function getOnDataMaps(_options: any): RequestPromise{
    return new Promise((resolve, _reject) => {
        let listOfDataMaps = [];
        for (let i = 0; i < 10; i++){
            listOfDataMaps.push({
                "id": 1,
                "owner": {
                  "owned_by": "farm",
                  "owner_id": 1
                },
                "name": "Data map sensor X",
                "description": "Data map for sensor X from company ABC",
                "has_header": true,
                "has_coordinate": true,
                "has_date": true,
                "has_time": true,
                "model_id": 1,
                "accessibility": "public",
                "maps": [
                  {
                    "column": "Moisture -10cm",
                    "observation": {
                      "type": "environment",
                      "context": "Soil",
                      "parameter": "Moisture",
                      "description": "Soil Moisture -10cm",
                      "unit": "mg/L",
                      "conditions": [
                        {
                          "parameter": "height",
                          "value": -10,
                          "unit": "cm"
                        }
                      ]
                    }
                  }
                ]
              });
        }
        let response = {
            statusCode: 200,
            body: JSON.stringify(listOfDataMaps)
        };
        resolve(response);

    }) as unknown as RequestPromise;
}

export function getOnEquipments(options: any): RequestPromise{
    return new Promise((resolve, _reject) => {
        let listOfEquipments = [];
        for (let i = 0; i < 10; i++){
            listOfEquipments.push({
                "id": 1,"owner": { "owned_by": "farm", "owner_id": 1},"name": "equipmentName","description": "description","model_id": 1,
                "manufacturing_date": "2018-01-22","serial_number": "ABC12345","accessibility": "public"
            });
        }
        resolve({statusCode: 200, body: JSON.stringify(listOfEquipments)});
    }) as unknown as RequestPromise;
}

/**
 * getOnEquipment() mocks GET request on equipment
 * return 200 with equipment object
 */
export function getOnEquipment(_options: any): RequestPromise{
    return new Promise((resolve, _reject) => {
        let response = {
            statusCode: 200,
            body: JSON.stringify({
                "id": 1,"owner": { "owned_by": "farm", "owner_id": 1},"name": "equipmentName","description": "description","model_id": 1,
                "manufacturing_date": "2018-01-22","serial_number": "ABC12345","accessibility": "public"
            })
        };
        resolve(response);
    }) as unknown as RequestPromise;
}

/**
 * getOnEquipmentModels() mocks GET request on equipmentModels
 * return 200 with list of equipmentModels
 */
export function getOnEquipmentModels(_options: any): RequestPromise{
    return new Promise((resolve, _reject) => {
        let listOfEquipments = [];
        for (let i = 0; i < 10; i++){
            listOfEquipments.push({
                "id": 1,"brand_name": "brandName","model": "A0","model_year": 2019,"series": "B0",
                "software_version": "5.1","description": "testDescription","slug": "testSlug"
            });
        }
        resolve({statusCode: 200, body: JSON.stringify(listOfEquipments)});
    }) as unknown as RequestPromise;
}

/**
 * getOnEquipmentModel() mocks GET request on equipmentModel
 * return 200 with equipmentModel object
 */
export function getOnEquipmentModel(_options: any): RequestPromise{
    return new Promise((resolve, _reject) => {
        let response = {
            statusCode: 200,
            body: JSON.stringify({
                "id": 1,"brand_name": "brandName","model": "A0","model_year": 2019,"series": "B0",
                "software_version": "5.1","description": "testDescription","slug": "testSlug"
            })
        };
        resolve(response);
    }) as unknown as RequestPromise;
}

/**
 * getOnUserRole() mocks GET request on user role
 * return 200 with role object
 */
export function getOnUserRole(_options: any): RequestPromise{
    return new Promise((resolve, _reject) => {
        resolve({statusCode: 200, body: JSON.stringify({"user_id": 1,"role": {"id": 1,"name": "researcher"}})});
    }) as unknown as RequestPromise;
}

/**
 * getOnUserRoles() mocks GET request on user roles
 * return 200 with list of users with their role
 */
export function getOnUserRoles(_options: any): RequestPromise{
    return new Promise((resolve, _reject) => {
        let listOfUsers = [];
        for (let i = 0; i < 10; i++){
            listOfUsers.push({"user_id": 1, "email": "test@email.com", "role": { "id": 1, "name": "researcher"} });
        }
        resolve({statusCode: 200, body: JSON.stringify(listOfUsers)});
    }) as unknown as RequestPromise;
}

/**
 * getOnRoles() mocks GET request on roles
 * return 200 with list of roles
 */
export function getOnRoles(_options: any): RequestPromise{
    return new Promise((resolve, _reject) => {
        resolve({statusCode: 200, body: JSON.stringify([{id: 15, name: "farm_admin"}, {id: 16, name: "farmer"}, {id: 17, name: "researcher"}, {id: 18, name: "user"}])});
    }) as unknown as RequestPromise;
}

/**
 * getOnCountries() mocks GET request on countries
 * return 200 with list of countries
 */
export function getOnCountries(_options: any): RequestPromise{
    return new Promise((resolve, _reject) => {
        let listOfCountries = [];
        for (let i = 0; i < 10; i++){
            listOfCountries.push({"id": 1, "name": "Netherlands", "code": "NL"});
        }
        resolve({statusCode: 200, body: JSON.stringify(listOfCountries)});
    }) as unknown as RequestPromise;
}

/**
 * getOnCropTypes() mocks GET request on crop types
 * return 200 with list of crop types
 */
export function getOnCropTypes(_options: any): RequestPromise{
    return new Promise((resolve, _reject) => {
        let listOfCropTypes = [];
        for (let i = 0; i < 10; i++){
            listOfCropTypes.push({ "id": 1, "name": "testName", "variety": "testVariety"});
        }
        resolve({statusCode: 200, body: JSON.stringify(listOfCropTypes)});
    }) as unknown as RequestPromise;
}

/**
 * getOnSoilTypes() mocks GET request on soil types
 * return 200 with list of soil types
 */
export function getOnSoilTypes(_options: any): RequestPromise{
    return new Promise((resolve, _reject) => {
        let listOfSoilTypes = [];
        for (let i = 0; i < 10; i++){
            listOfSoilTypes.push({ "id": 1, "name": "testName", "description": "testDescription" });
        }
        resolve({statusCode: 200,body: JSON.stringify(listOfSoilTypes)});
    }) as unknown as RequestPromise;
}

/**
 * getOnWolkyTolkyEqs() mocks GET request on WolkyTolky equipments
 * return 200 with list of WolkyTolky equipments
 */
export function getOnWolkyTolkyEqs(options: any): RequestPromise{
    return new Promise((resolve, _reject) => {
        let listOfEquipments = [];
        for (let i = 0; i < 10; i++){
            listOfEquipments.push({
                "apiKey": "1111",
                "stationId": 1,
                "id": 1,
                "equipmentId": 1
            });
        }
        let response = {
            statusCode: 200,
            body: JSON.stringify(listOfEquipments)
        };
        resolve(response);

    }) as unknown as RequestPromise;
}

/**
 * getOnWolkyTolkyEq() mocks GET request on WolkyTolky equipment
 * return 200 with WolkyTolky equipment object
 */
export function getOnWolkyTolkyEq(options: any): RequestPromise{
    return new Promise((resolve, _reject) => {
        let response = {
            statusCode: 200,
            body: JSON.stringify({
                "apiKey": "1111",
                "stationId": 1,
                "id": 1,
                "equipmentId": 1
            })
        };
        resolve(response);

    }) as unknown as RequestPromise;
}