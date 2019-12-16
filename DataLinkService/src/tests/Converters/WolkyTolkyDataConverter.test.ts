/**
 * This test file contains all the test of the functionality of the WolkyTolkyDataConverter.
 */

import { DataColumn } from "../../utils/DataColumn";
import { WolkyTolkyDataConverter } from "../../utils/Converters/WolkyTolkyDataConverter";

// Create an instance of a DataConverter.
var dataConverter = new WolkyTolkyDataConverter();

/**
 * Tests whether a JSON formatted observation data gets transformed correctly to a list of DataValues.
 */
describe("transformLiveData()",
    () => {
        const liveData = `[["2019-10-17 10:01;2;0;12.3;98.3;0;0;0;13.7;;1009.3;13;13.1;12;12.3"],
                        ["2019-10-17 10:06;1.5;0;12.3;98.6;0;0;0;13.7;;1009.3;13;13.1;12.1;12.3"],
                        ["2019-10-17 10:11;1;0;12.4;98.5;0;0;0;13.7;;1009.3;13.1;13.1;12.2;12.4"],
                        ["2019-10-17 10:16;1.7;0;12.4;98;0;0;0;13.7;;1009.3;13.1;13.2;12.1;12.4"],[]]`;
        var dataColumns: DataColumn[] = [];
        dataColumns.push(new DataColumn("Date and time", ""));
        dataColumns.push(new DataColumn("Wind speed (10 min avg)", "km/h"));
        dataColumns.push(new DataColumn("Rain", "mm"));
        dataColumns.push(new DataColumn("Temperature 1.50m", "C"));
        dataColumns.push(new DataColumn("Humidity", "%"));
        dataColumns.push(new DataColumn("Moisture -10cm", "mg/l"));
        test("transform the data",
            async () => {
                let dataValueList = dataConverter.transformLiveData(liveData, dataColumns);
                expect(dataValueList[0].name).toBe("Date and time");
                expect(dataValueList[0].value).toBe("2019-10-17 10:16");
                expect(dataValueList[0].unit).toBe("");

                expect(dataValueList[1].name).toBe("Wind speed (10 min avg)");
                expect(dataValueList[1].value).toBe("1.7");
                expect(dataValueList[1].unit).toBe("km/h");
            });
    });

/**
 * Tests whether a JSON formatted location data gets transformed correctly to a list of LocationPoints.
 */
describe("transformLocationData()",
    () => {
        var locationData = `[["16;2019-01-17 11:18:00;5.1760400;51.3192000"],
                            ["16;2018-11-07 18:13:00;5.1759083;51.3191533"],
                            ["16;2018-06-12 17:27:00;5.1761100;51.3191333"],
                            ["16;2018-06-04 20:20:00;5.1759917;51.3191467"],
                            ["16;2018-06-01 15:51:00;5.1760267;51.319148"]]`;

        test("transform the location data",
            async () => {
                let locations = dataConverter.transformLocationData(locationData);
                expect(locations[0].latitude).toBe(51.3191533);
                expect(locations[0].longitude).toBe(5.1759083);
            });
    });