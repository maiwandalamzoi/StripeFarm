/**
 * This test file contains all the tests of the functionaility of the WolkyTolkyDataRetriever.
 */

import { WolkyTolkyDataRetriever } from "../../services/Retrievers/WolkyTolkyDataRetriever";
import { DataRetriever } from "../../services/Retrievers/DataRetriever";
import { loadSettings } from "../TestSettings";
import { AccessibilityType } from "../../utils/AccessibilityType";
import { LocationPoint } from "../../utils/LocationPoint";
import { EquipmentInformationEntity } from "../../utils/EquipmentInformationEntity";
import * as equipmentInformationProvider from '../../services/datalinking/providers/EquipmentInformationDataProvider';

/*
 * Loads all the test settings necessary for testing with a mock api.
 */
loadSettings();

/**
 * Tests whether the correct observation data of a WolkyTolky station is retrieved.
 */
describe("getData()",
    () => {
        test("get data from a WolkyTolky station",
            async () => {
                var dataRetrievers: DataRetriever[] = [];

                const mockData = `Date and time;Wind speed (10 min avg);Rain;Temperature 1.50m;Humidity;Moisture -10cm;Moisture -20cm;Moisture -30cm;Temperature -10cm;Temperature -20cm;Barometer;Solar Panel Voltage;Battery Voltage;Dew point Temperature;WindChill
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
2019-11-04 01:24;1.8;0;9.7;97.3;0;0;0;11;;985.8;0;12.9;9.3;9.7`;

                dataRetrievers.push(new WolkyTolkyDataRetriever(16, "test", 1, "testRetriever"));
                for (var retriever of dataRetrievers) {
                    var data = await retriever.getData();
                    expect(data).toBe(mockData);
                }
            });

        test("get data from a WolkyTolky station after a certain date",
            async () => {
                var dataRetrievers: DataRetriever[] = [];

                const mockData = `Date and time;Wind speed (10 min avg);Rain;Temperature 1.50m;Humidity;Moisture -10cm;Moisture -20cm;Moisture -30cm;Temperature -10cm;Temperature -20cm;Barometer;Solar Panel Voltage;Battery Voltage;Dew point Temperature;WindChill
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
2019-11-04 01:24;1.8;0;9.7;97.3;0;0;0;11;;985.8;0;12.9;9.3;9.7`;

                dataRetrievers.push(new WolkyTolkyDataRetriever(16, "test", 1, "testRetriever"));
                for (var retriever of dataRetrievers) {
                    var data = await retriever.getData("2019-11-04 00:00");
                    expect(data).toBe(mockData);
                }
            });
    });

/**
 * Tests whether the correct date from which the data is retrieved from a WolkyTolky equipment.
 */
describe("getLatestDataDate()", 
    () => {
        test("get the latest date of the observation data from WolkyTolky ",
            async () => {
                var retriever = new WolkyTolkyDataRetriever(16, "test", 1, "testRetriever");
                var date = await retriever.getLatestDataDate();
                expect(date).toBe("2019-11-04 01:44:01");
            });
    });

/**
 * Tests whether the correct date from which the data is retrieved from a WolkyTolky equipment.
 */
describe("getLastSaved()",
    () => {
        test("tests whether a date is retrieved when the retriever last ran",
            async () => {
                var retriever = new WolkyTolkyDataRetriever(16, "test", 1, "testRetriever");
                var date = await retriever.getLastSaved();
                expect(date).toBe(undefined);
            });
    });

/**
 * Tests whether the correct date from which the data is retrieved from a WolkyTolky equipment.
 */
describe("run()",
    () => {
        test("test the run function of the WolkyTolky  ",
            async () => {
                var mockLocationInformation = new EquipmentInformationEntity(1, 1, 1, 1, true);
                const spy = jest.spyOn(equipmentInformationProvider, 'getLocationInformationByEquipmentId');
                spy.mockReturnValue(Promise.resolve(mockLocationInformation));

                var dataRetrievers: DataRetriever[] = [];
                dataRetrievers.push(new WolkyTolkyDataRetriever(16, "test", 1, "testRetriever"));
                for (var retriever of dataRetrievers) {
                    retriever.run();
                }
            });
    });

/**
 * Tests whether the correct observation data of a WolkyTolky station is retrieved.
 */
describe("saveData()",
    () => {
        test("save the retrieved observation data to the database",
            async () => {
                var dataRetriever = new WolkyTolkyDataRetriever(16, "test", 1, "testRetriever");

                const mockData = `Date and time;Wind speed (10 min avg);Rain;Temperature 1.50m;Humidity;Moisture -10cm;Moisture -20cm;Moisture -30cm;Temperature -10cm;Temperature -20cm;Barometer;Solar Panel Voltage;Battery Voltage;Dew point Temperature;WindChill
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
2019-11-04 01:24;1.8;0;9.7;97.3;0;0;0;11;;985.8;0;12.9;9.3;9.7`;

                var response =
                    await dataRetriever.saveData(mockData, 1, 1, 1, 1, 1, AccessibilityType.Public, "");

                expect(response).toBe(undefined);

                response =
                    await dataRetriever.saveData(mockData, 1, 1, 1, 1, 1, AccessibilityType.Public, "", new LocationPoint(1, 1));

                expect(response).toBe(undefined);

                response =
                    await dataRetriever.saveData(mockData, 1, 1, 1, 1, 1, AccessibilityType.Public, "", undefined, new Date());

                expect(response).toBe(undefined);
            });
    });