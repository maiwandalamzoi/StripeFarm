/* This test file contains all the tests of the functionality of retrieving the mapping data from the data-
 * Sensing service.
 */
import { loadSettings } from "./TestSettings";
import { login, getUserId } from "../UserController";
import { deleteCookie } from "../../Cookies";
import { importData, getDataMaps, addDataMap } from "../MappingController";
import { DataMap } from "../../../common/DataMap";
import { AccessibilityType } from "../../../common/AccessibilityType";
import { DataColumn } from "../../../common/DataColumn";
import { Observation } from "../../../common/Observation";
import { ObservationVariable } from "../../../common/ObservationVariable";
import { ObservationObjectType } from "../../../common/ObservationObjectType";


/*
 * Loads all the test settings necessary for testing with a mock api.
 */
loadSettings()


describe("getDataMaps()", () => {
    /*
     * Test whether the statusCode 200 and good data map objects are received
     * when executing getDataMaps.
     */
    test("statusCode: 200, returns list of datamaps", async() => {
        await login('test@test.nl', 'testPassword');   // Mock login before doing request

        let dataMaps = await getDataMaps();
        expect(dataMaps).toBeDefined();

        for (let i = 0; i < dataMaps.length; i++){
            expect(dataMaps[i]).toBeInstanceOf(DataMap);
            expect(dataMaps[i].id).toBe(1);
            expect(dataMaps[i].name).toBe('Data map sensor X');
            expect(dataMaps[i].description).toBe('Data map for sensor X from company ABC');
            expect(dataMaps[i].has_header).toBeInstanceOf(Boolean);
            expect(dataMaps[i].has_coordinate).toBeInstanceOf(Boolean);
            expect(dataMaps[i].has_date).toBeInstanceOf(Boolean);
            expect(dataMaps[i].has_time).toBeInstanceOf(Boolean);
            expect(dataMaps[i].model_id).toBe(1);
            expect(dataMaps[i].accessibility).toBe(AccessibilityType.public);
            let maps = dataMaps[i].maps;
            for (let j = 0; j < maps.length; j++){
                expect(maps[j]).toBeInstanceOf(Array)
                expect(maps[j].column).toBe('Moisture -10cm');

                let observation = maps[j].observation;
                expect(observation.type).toBe(ObservationObjectType.environment);
                expect(observation.context).toBe('Soil');
                expect(observation.parameter).toBe('Moisture');
                expect(observation.description).toBe('Soil Moisture -10cm');
                expect(observation.unit).toBe('mg/L');

                let conditions = observation.conditions;
                expect(conditions).toBeInstanceOf(Array);
                for (let k = 0; k < conditions.length; k++) {
                    expect(conditions[k].parameter).toBe('height');
                    expect(conditions[k].value).toBe(-10);
                    expect(conditions[k].unit).toBe('cm');
                }
            }
        }
    })

    /*
     * Test whether the statusCode 200 and good data map objects are received
     * when executing getDataMaps after refreshing the access token
     */
    test("statusCode: 200, returns list of datamaps after refreshToken", async() => {
        await login('test@test.nl', 'testPassword');   // Mock login before doing request
        deleteCookie('access_token', getUserId());    // Mock that the access_token must be refreshed

        let dataMaps = await getDataMaps();
        expect(dataMaps).toBeDefined();
        // expect(dataMaps.length).toBeGreaterThan(0);

        for (let i = 0; i < dataMaps.length; i++){
            expect(dataMaps[i]).toBeInstanceOf(DataMap);
            expect(dataMaps[i].id).toBe(1);
            expect(dataMaps[i].name).toBe('Data map sensor X');
            expect(dataMaps[i].description).toBe('Data map for sensor X from company ABC');
            expect(dataMaps[i].has_header).toBeInstanceOf(Boolean);
            expect(dataMaps[i].has_coordinate).toBeInstanceOf(Boolean);
            expect(dataMaps[i].has_date).toBeInstanceOf(Boolean);
            expect(dataMaps[i].has_time).toBeInstanceOf(Boolean);
            expect(dataMaps[i].model_id).toBe(1);
            expect(dataMaps[i].accessibility).toBe(AccessibilityType.public);
            let maps = dataMaps[i].maps;
            for (let j = 0; j < maps.length; j++){
                expect(maps[j]).toBeInstanceOf(Array)
                expect(maps[j].column).toBe('Moisture -10cm');

                let observation = maps[j].observation;
                expect(observation.type).toBe(ObservationObjectType.environment);
                expect(observation.context).toBe('Soil');
                expect(observation.parameter).toBe('Moisture');
                expect(observation.description).toBe('Soil Moisture -10cm');
                expect(observation.unit).toBe('mg/L');

                let conditions = observation.conditions;
                expect(conditions).toBeInstanceOf(Array);
                for (let k = 0; k < conditions.length; k++) {
                    expect(conditions[k].parameter).toBe('height');
                    expect(conditions[k].value).toBe(-10);
                    expect(conditions[k].unit).toBe('cm');
                }
            }
        }
    })
})


describe("addDataMap()", () => {
    /*
     * Test whether the statusCode 201 is received
     * when executing addDataMaps.
     */
    test("statusCode: 201, succesfull add datamap", async() => {
        await login('test@test.nl', 'testPassword');   // Mock login before doing request
        let dataColumn = new DataColumn('test', new Observation(ObservationObjectType.environment, 'test', 'test', 'test', 'test', [new ObservationVariable('test', 0, 'test')]));
        expect(await addDataMap(new DataMap('Data map sensor X', 'test', false, false, false, false, 0, AccessibilityType.public, [dataColumn]))).toBe(true);
    })
    /*
     * Test whether the statusCode 201 is received
     * when executing addDataMaps after refreshing the access token
     */
    test("statusCode: 201, succesfull add datamap after refreshToken", async() => {
        await login('test@test.nl', 'testPassword');    // Mock login before doing request
        deleteCookie('access_token', getUserId());      // Mock that the access_token must be refreshed
        let dataColumn = new DataColumn('test', new Observation(ObservationObjectType.environment, 'test', 'test', 'test', 'test', [new ObservationVariable('test', 0, 'test')]));
        expect(await addDataMap(new DataMap('Data map sensor X', 'test', false, false, false, false, 0, AccessibilityType.public, [dataColumn]))).toBe(true);
    })

});
