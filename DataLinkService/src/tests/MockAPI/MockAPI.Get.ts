import { RequestPromise } from "request-promise";

/**
 * getOnWolkyTolkyData() mocks GET request on user
 * return 200 with the station data
 */
export function getOnWolkyTolkyData(options: any): RequestPromise {
    return new Promise((resolve, reject) => {
        let response = {
            statusCode: 200,
            body: `Date and time;Wind speed (10 min avg);Rain;Temperature 1.50m;Humidity;Moisture -10cm;Moisture -20cm;Moisture -30cm;Temperature -10cm;Temperature -20cm;Barometer;Solar Panel Voltage;Battery Voltage;Dew point Temperature;WindChill
2019-11-04 00:04;1.4;0;9.1;97.4;0;0;0;11.1;;985.4;0;12.9;8.7;9.1
2019-11-04 00:09;1.4;0;9.2;97.5;0;0;0;11.1;;985.4;0;12.9;8.8;9.2
2019-11-04 00:14;1.4;0;9.3;97.6;0;0;0;11.1;;985.4;0;12.9;8.9;9.3
2019-11-04 00:19;1.1;0;9.3;97.4;0;0;0;11.1;;985.4;0;12.9;8.9;9.3
2019-11-04 00:24;1.1;0;9.4;97.4;0;0;0;11.1;;985.5;0;12.9;9;9.4
2019-11-04 00:29;1.2;0;9.4;97.6;0;0;0;11.1;;985.6;0;12.9;9;9.4
2019-11-04 00:34;1.1;0;9.4;97.5;0;0;0;11.1;;985.6;0;12.9;9;9.4
2019-11-04 00:39;1.8;0;9.4;97.5;0;0;0;11.1;;985.6;0;12.9;9;9.4
2019-11-04 00:44;2.3;0;9.6;97.5;0;0;0;11;;985.6;0;12.9;9.2;9.6
2019-11-04 00:49;1.6;0;9.5;97.6;0;0;0;11;;985.6;0;12.8;9.1;9.5
2019-11-04 00:54;1.2;0;9.5;97.4;0;0;0;11;;985.7;0;12.8;9.1;9.5
2019-11-04 00:59;1.3;0;9.6;97.4;0;0;0;11;;985.6;0;12.9;9.2;9.6
2019-11-04 01:04;1.7;0;9.6;97.4;0;0;0;11;;985.8;0;12.8;9.2;9.6
2019-11-04 01:09;2.1;0;9.7;97.4;0;0;0;11;;985.8;0;12.9;9.3;9.7
2019-11-04 01:14;2.3;0;9.7;97.4;0;0;0;11;;985.8;0;12.8;9.3;9.7
2019-11-04 01:19;2.3;0;9.6;97.4;0;0;0;11;;985.8;0;12.8;9.2;9.6
2019-11-04 01:24;1.8;0;9.7;97.3;0;0;0;11;;985.8;0;12.9;9.3;9.7`
    };
            resolve(response);
    }) as unknown as RequestPromise;
}

/**
 * getOnWolkyTolkyJsonData() mocks GET request on WolkyTolky data.
 * return 200 with the station data
 */
export function getOnWolkyTolkyJsonData(options: any): RequestPromise {
    // The mock data of observation data from WolkyTolky equipment.
    var mockData = `[["Date and time;Wind speed (10 min avg);Rain;Temperature 1.50m;Humidity;Moisture -10cm;Moisture -20cm;Moisture -30cm;Temperature -10cm;Temperature -20cm;Barometer;Solar Panel Voltage;Battery Voltage;Dew point Temperature;WindChill"],
["2019-11-04 00:04;1.4;0;9.1;97.4;0;0;0;11.1;;985.4;0;12.9;8.7;9.1"],
["2019-11-04 00:09;1.4;0;9.2;97.5;0;0;0;11.1;;985.4;0;12.9;8.8;9.2"],["2019-11-04 00:14;1.4;0;9.3;97.6;0;0;0;11.1;;985.4;0;12.9;8.9;9.3"],["2019-11-04 00:19;1.1;0;9.3;97.4;0;0;0;11.1;;985.4;0;12.9;8.9;9.3"],
["2019-11-04 00:24;1.1;0;9.4;97.4;0;0;0;11.1;;985.5;0;12.9;9;9.4"],["2019-11-04 00:29;1.2;0;9.4;97.6;0;0;0;11.1;;985.6;0;12.9;9;9.4"],["2019-11-04 00:34;1.1;0;9.4;97.5;0;0;0;11.1;;985.6;0;12.9;9;9.4"],
["2019-11-04 00:39;1.8;0;9.4;97.5;0;0;0;11.1;;985.6;0;12.9;9;9.4"],["2019-11-04 00:44;2.3;0;9.6;97.5;0;0;0;11;;985.6;0;12.9;9.2;9.6"],["2019-11-04 00:49;1.6;0;9.5;97.6;0;0;0;11;;985.6;0;12.8;9.1;9.5"],
["2019-11-04 00:54;1.2;0;9.5;97.4;0;0;0;11;;985.7;0;12.8;9.1;9.5"],["2019-11-04 00:59;1.3;0;9.6;97.4;0;0;0;11;;985.6;0;12.9;9.2;9.6"],["2019-11-04 01:04;1.7;0;9.6;97.4;0;0;0;11;;985.8;0;12.8;9.2;9.6"],
["2019-11-04 01:09;2.1;0;9.7;97.4;0;0;0;11;;985.8;0;12.9;9.3;9.7"],["2019-11-04 01:14;2.3;0;9.7;97.4;0;0;0;11;;985.8;0;12.8;9.3;9.7"],["2019-11-04 01:19;2.3;0;9.6;97.4;0;0;0;11;;985.8;0;12.8;9.2;9.6"],
["2019-11-04 01:24;1.8;0;9.7;97.3;0;0;0;11;;985.8;0;12.9;9.3;9.7"],["2019-11-04 01:29;1.6;0;9.7;97.2;0;0;0;11;;985.8;0;12.8;9.3;9.7"],["2019-11-04 01:34;1.5;0;9.7;97.1;0;0;0;11;;985.8;0;12.9;9.3;9.7"],
["2019-11-04 01:39;1.2;0;9.7;97.3;0;0;0;11;;985.8;0;12.8;9.3;9.7"],["2019-11-04 01:44;0.7;0;9.7;97.3;0;0;0;10.9;;985.8;0;12.8;9.3;9.7"],[]]`;

    // Return Promise with the mock data.
    return new Promise((resolve, reject) => {
        let response = {
            statusCode: 200,
            body: mockData
        };
        resolve(response);
    }) as unknown as RequestPromise;
}

/**
 * getOnRefreshToken() mocks GET request on refresh_token
 * return 200 with refreshtoken
 */
export function getOnRefreshToken(_options: any): RequestPromise{
    // Return Promise with the mock data.
    return new Promise((resolve, _reject) => {
        let response = {
            statusCode: 200,
            body: {"access_token": "eyJpc3MiOiJ0b3B0YWwuY29tIiwiZXhwIjoxNDI2NDIwODAwLCJodHRwOi8vdG9wdGFsLmNvbS9qd3RfY2xhaW1zL2lzX2FkbWluIjp0cnVlLCJjb21wYW55IjoiVG9wdGFsIiwiYXdlc29tZSI6dHJ1ZX0"}
        };
        resolve(response);
    }) as unknown as RequestPromise;
}

/**
 * getOnDataMaps() mocks GET request on datamaps.
 * return 200 with datamap object
 */
export function getOnDataMaps(_options: any): RequestPromise{
    // Return Promise with the data of mock datamaps.
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

/**
 * getOnEquipments() mocks GET request on equipment
 * return 200 with equipment object
 */
export function getOnEquipments(options: any): RequestPromise{
    // Return Promise with the data of mocked equipments.
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
    // Return Promise with the mock data of an equipment.
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

