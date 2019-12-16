/* This test file contains all the tests of the functionality of retrieving the equipment data from the data-
 * Sensing service.
 */

import { login, getUserId } from "../UserController";
import { loadSettings } from "./TestSettings";
import { getEquipments, getEquipment, addEquipment, updateEquipment, deleteEquipment } from "../EquipmentController";
import { Equipment } from "../../../common/Equipment";
import { AccessibilityType } from "../../../common/AccessibilityType";
import { deleteCookie } from "../../Cookies";

/*
 * Loads all the test settings necessary for testing with a mock api.
 */
loadSettings()

describe("getEquipments()", () => {
    /*
     * Test whether the statusCode 200 and good equipment objects are received
     * when executing getEquipments.
     */
    test("statusCode: 200, returns list of equipments", async() => {
        await login('test@test.nl', 'testPassword');  // Mock login before doing request

        let equipments = await getEquipments(10);
        expect(equipments).toBeDefined();
        expect(equipments.length).toBeGreaterThan(0);

        for (let i = 0; i < equipments.length; i++){
            expect(equipments[i]).toBeInstanceOf(Equipment);
            expect(equipments[i].id).toBe(1);
            expect(equipments[i].name).toBe('equipmentName');
            expect(equipments[i].description).toBe('description');
            expect(equipments[i].model_id).toBe(1);
            expect(equipments[i].manufacturing_date).toBe('2018-01-22');
            expect(equipments[i].serial_number).toBe('ABC12345');
            expect(equipments[i].accessibility).toBe(AccessibilityType.public);
        }
    })

    /*
     * Test whether the statusCode 200 and a good equipment object are received
     *  when executing getEquipments after refreshing the access_token.
     */
    test("statusCode: 200, returns list of equipments after refreshToken", async() => {
        await login('test@test.nl', 'testPassword');
        deleteCookie('access_token', getUserId());

        let equipments = await getEquipments(10);
        expect(equipments).toBeDefined();
        expect(equipments.length).toBeGreaterThan(0);
    })
})

describe("getEqupiment()", () => {
    /*
     * Test whether the statusCode 200 and a good equipment object are received
     *  when executing getEquipment.
     */
    test("statusCode: 200, returns equipment", async() => {
        await login('test@test.nl', 'testPassword');
        let equipment = await getEquipment(10, 15);

        expect(equipment).toBeDefined();
        expect(equipment).toBeInstanceOf(Equipment);
        expect(equipment.id).toBe(1);
        expect(equipment.name).toBe('equipmentName');
        expect(equipment.description).toBe('description');
        expect(equipment.model_id).toBe(1);
        expect(equipment.manufacturing_date).toBe('2018-01-22');
        expect(equipment.serial_number).toBe('ABC12345');
        expect(equipment.accessibility).toBe(AccessibilityType.public);
    })  
    /*
     * Test whether the statusCode 200 and a good equipment object are received
     *  when executing getEquipment after refreshing the access_token.
     */
    test("statusCode: 200, returns equipment after refreshToken", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        deleteCookie('access_token', getUserId());   // Mock that the access_token must be refreshed

        let equipment = await getEquipment(10, 15);
        expect(equipment).toBeDefined();
    })
})


describe("addEquipment()", () => {
    /*
     * Test whether the statusCode 200 is received
     * when executing addEquipment.
     */
    test("statusCode: 200, succesfull add equipment", async() => {
        await login('test@test.nl', 'testPassword');
        let equipment = new Equipment('testName', 'description', undefined, undefined, undefined, AccessibilityType.public, undefined);
        expect(await addEquipment(equipment, 15)).toBe(true);
    })
    /*
     * Test whether the statusCode 200 is received
     * when executing addEquipment after refreshing the access_token.
     */
    test("statusCode: 200, succesfull add equipment after refreshToken", async() => {
        await login('test@test.nl', 'testPassword');
        deleteCookie('access_token', getUserId());
        let equipment = new Equipment('testName', 'description', undefined, undefined, undefined, AccessibilityType.public, undefined);
        expect(await addEquipment(equipment, 15)).toBe(true);
    })

});

describe("updateEquipment()", () => {
    /*
     * Test whether the statusCode 200 is received
     * when executing updateEquipment.
     */
    test("statusCode: 200, succesfull update equipment", async() => {
        await login('test@test.nl', 'testPassword');
        let equipment = new Equipment('testName', 'description', undefined, undefined, undefined, AccessibilityType.public, undefined);
        expect(await updateEquipment(equipment, 15)).toBe(true);
    })
    /*
     * Test whether the statusCode 200 is received
     * when executing updateEquipment after refreshing the access_token.
     */
    test("statusCode: 200, succesfull update equipment after refreshToken", async() => {
        await login('test@test.nl', 'testPassword');
        deleteCookie('access_token', getUserId());
        let equipment = new Equipment('testName', 'description', undefined, undefined, undefined, AccessibilityType.public, undefined);
        expect(await updateEquipment(equipment, 15)).toBe(true);
    })

});

describe("deleteEquipment()", () => {
    /*
     * Test whether the statusCode 200 is received
     * when executing deleteEquipment.
     */
    test("statusCode: 204, succesfull delete equipment cropfield", async() => {
        await login('test@test.nl', 'testPassword');
        expect(await deleteEquipment(15, 10)).toBe(true);
    })
    /*
     * Test whether the statusCode 200 is received
     * when executing deleteEquipment after refreshing the access_token.
     */
    test("statusCode: 204, succesfull delete equipment after refreshToken", async() => {
        await login('test@test.nl', 'testPassword');
        deleteCookie('access_token', getUserId());
        expect(await deleteEquipment(15, 10)).toBe(true);
    })

});
