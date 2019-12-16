/* This test file contains all the tests of the functionality of retrieving the equipment model data from the data-
 * Sensing service.
 */

import { getEquipmentModels, getEquipmentModel, addEquipmentModel } from "../EquipmentModelController";
import { loadSettings } from "./TestSettings";
import { login, getUserId } from "../UserController";
import { EquipmentModel } from "../../../common/EquipmentModel";
import { deleteCookie } from "../../Cookies";

/*
 * Loads all the test settings necessary for testing with a mock api.
 */
loadSettings()

describe("getEquipmentModels()", () => {
    /*
     * Test whether the statusCode 200 and good equipment model objects are received
     * when executing getEquipmentModels.
     */
    test("statusCode: 200, returns list of equipmentModels", async() => {
        await login('test@test.nl', 'testPassword');   // Mock login before doing request

        let equipmentModels = await getEquipmentModels();
        expect(equipmentModels).toBeDefined();
        expect(equipmentModels.length).toBeGreaterThan(0);

        for (let i = 0; i < equipmentModels.length; i++){
            expect(equipmentModels[i]).toBeInstanceOf(EquipmentModel);
            expect(equipmentModels[i].id).toBe(1);
            expect(equipmentModels[i].brand_name).toBe('brandName');
            expect(equipmentModels[i].model).toBe('A0');
            expect(equipmentModels[i].model_year).toBe(2019);
            expect(equipmentModels[i].series).toBe('B0');
            expect(equipmentModels[i].software_version).toBe('5.1');
            expect(equipmentModels[i].description).toBe('testDescription');
            expect(equipmentModels[i].slug).toBe('testSlug');
        }
    })

    /*
     * Test whether the statusCode 200 and a good equipment model object are received
     *  when executing getEquipmentModels after refreshing the access_token
     */
    test("statusCode: 200, returns list of equipments after refreshToken", async() => {
        await login('test@test.nl', 'testPassword');  // Mock login before doing request
        deleteCookie('access_token', getUserId());  // Mock that the access_token must be refreshed

        let equipmentModels = await getEquipmentModels();
        expect(equipmentModels).toBeDefined();
        expect(equipmentModels.length).toBeGreaterThan(0);

        for (let i = 0; i < equipmentModels.length; i++){
            expect(equipmentModels[i]).toBeInstanceOf(EquipmentModel);
        }
    })
})

describe("getEquipmentModel()", () => {
    /*
     * Test whether the statusCode 200 and a good equipment model object are received
     *  when executing getEquipmentModel
     */
    test("statusCode: 200, returns equipmentModel", async() => {
        await login('test@test.nl', 'testPassword');  // Mock login before doing request
        let equipmentModel = await getEquipmentModel('slug');
        expect(equipmentModel).toBeDefined();
        expect(equipmentModel).toBeInstanceOf(EquipmentModel);
        expect(equipmentModel.id).toBe(1);
        expect(equipmentModel.brand_name).toBe('brandName');
        expect(equipmentModel.model).toBe('A0');
        expect(equipmentModel.model_year).toBe(2019);
        expect(equipmentModel.series).toBe('B0');
        expect(equipmentModel.software_version).toBe('5.1');
        expect(equipmentModel.description).toBe('testDescription');
        expect(equipmentModel.slug).toBe('testSlug');
    })
    /*
     * Test whether the statusCode 200 and a good equipment model object are received
     *  when executing getEquipmentModel after refreshing the access_token.
     */
    test("statusCode: 200, returns equipment after refreshToken", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        deleteCookie('access_token', getUserId());   // Mock that the access_token must be refreshed
        let equipmentModel = await getEquipmentModel('slug');
        expect(equipmentModel).toBeDefined();
        expect(equipmentModel).toBeInstanceOf(EquipmentModel);
    })
})

describe("addEquipmentModel()", () => {
    /*
     * Test whether the statusCode 200 is received
     * when executing addEquipmentModel
     */
    test("statusCode: 200, succesfull add equipmentModel", async() => {
        await login('test@test.nl', 'testPassword');  // Mock login before doing request
        let equipmentModel = new EquipmentModel('brandName', 'model', 2019, 'A0', '2', 'description', 'slug', undefined);
        expect(await addEquipmentModel(equipmentModel)).toBe(true);
    })
    /*
     * Test whether the statusCode 200 is received
     * when executing addEquipmentModel after refreshing the access_token.
     */
    test("statusCode: 200, succesfull add equipmentModel after refreshToken", async() => {
        await login('test@test.nl', 'testPassword');  // Mock login before doing request
        deleteCookie('access_token', getUserId());  // Mock that the access_token must be refreshed
        let equipmentModel = new EquipmentModel('brandName', 'model', 2019, 'A0', '2', 'description', 'slug', undefined);
        expect(await addEquipmentModel(equipmentModel)).toBe(true);
    })

});
