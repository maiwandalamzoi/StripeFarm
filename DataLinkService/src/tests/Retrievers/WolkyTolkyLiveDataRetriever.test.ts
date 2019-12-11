/**
 * This test file contains all the tests of the functionaility of the WolkyTolkyLiveDataRetriever.
 */

import { loadSettings } from "../TestSettings";
import { WolkyTolkyLiveDataRetriever } from "../../services/Retrievers/WolkyTolkyLiveDataRetriever";
import { EquipmentInformationEntity } from "../../utils/EquipmentInformationEntity";
import { DataColumn } from "../../utils/DataColumn";
import * as equipmentInformationProvider from '../../services/datalinking/providers/EquipmentInformationDataProvider';


/*
 * Loads all the test settings necessary for testing with a mock api.
 */
loadSettings();

/**
 * Tests whether the correct latest observation data is retrieved from a WolkyTolky equipment.
 */
describe("getLatestData()",
    () => {
        test("get the latest observation data from the WolkyTolky sensor",
            async () => {
                var mockLocationInformation = new EquipmentInformationEntity(1, 1, 1, 1, true);
;

                const spy = jest.spyOn(equipmentInformationProvider, 'getLocationInformationByEquipmentId');
                spy.mockReturnValue(Promise.resolve(mockLocationInformation));


                var retriever = new WolkyTolkyLiveDataRetriever(16, "test", 1);

                var latestData = await retriever.getLatestData();
                expect(latestData).toBe([]);
            });
    });