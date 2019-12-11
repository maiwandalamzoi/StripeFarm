/**
 * This file contains tests of the functionality of the MappingController
 */

import { loadSettings } from "../TestSettings";
import { getAccessToken } from "../../services/datalinking/Controllers/UserController";
import { DataColumn } from "../../utils/DataColumn";
import { getDataMapIdByEquipmentModelId, getDataColumnsByEquipmentModelId, getDataMaps, getEquipmentModelId } from "../../services/datalinking/Controllers/MappingController";

/*
 * Loads all the test settings necessary for testing with a mock api.
 */

loadSettings();

/**
 * Test the functionality of teh getDataMapIdByEquipmentModelId function.
 */
describe("getDataMapIdByEquipmentModelId()",
    () => {

        test("returns a datamap id of an equipment model",
            async () => {
                var token = await getAccessToken('test@test.nl', 'testPassword');

                let dataMapId = await getDataMapIdByEquipmentModelId(1, token);
                expect(dataMapId).toBeDefined();
                expect(dataMapId).toBe(1);
            });
    });
/**
 * Test the functionality of teh getDataColumnsByEquipmentModelId function.
 */
describe("getDataColumnsByEquipmentModelId()", () => {

    test("get all the data columns of an equipment model",
        async () => {
            var token = await getAccessToken('test@test.nl', 'testPassword');
            var dataColumns = await getDataColumnsByEquipmentModelId(1, token);
            expect(dataColumns).toBeDefined();
            expect(dataColumns.length).toBeGreaterThan(0);

            for (var column of dataColumns) {
                expect(column.column).toBe("Moisture -10cm");
                expect(column.unit).toBe("mg/L");
            }
        });
});

/**
 * Test the functionality of teh getDataMaps function.
 */
describe("getDataMaps()", () => {

    test("get the json string containing a list of datamaps",
        async () => {
            var token = await getAccessToken('test@test.nl', 'testPassword');
            var dataMaps = await getDataMaps(token);
            expect(dataMaps).toBeDefined();
        });
});

/**
 * Test the functionality of teh getEquipmentModelId function.
 */
describe("getEquipmentModelId()", () => {

    test("get the equipment model id of an equipment",
        async () => {
            var token = await getAccessToken('test@test.nl', 'testPassword');
            var equipmentModelId = await getEquipmentModelId(10, token, 15);
            expect(equipmentModelId).toBeDefined();
            expect(equipmentModelId).toBe(1);
        });
});
