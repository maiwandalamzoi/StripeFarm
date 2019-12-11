/* This test file contains all the tests of the functionality of retrieving the wolkyTolky equipment data from the data-
 * Linking service.
 */

import { login, getUserId } from "../UserController";
import { loadSettings } from "./TestSettings";
import { deleteCookie } from "../../Cookies";
import { WolkyTolkyEq } from "../../../common/WolkyTolkyEq";
import { getWolkyTolkyEqs, getWolkyTolkyEq, addWolkyTolkyEq, updateWolkyTolkyEq, deleteWolkyTolkyEq } from "../WolkyTolkyEqController";

/*
 * Loads all the test settings necessary for testing with a mock api.
 */
loadSettings()

describe("getWolkyTolkyEqs()", () => {
    /*
     * Test whether the statusCode 200 and good WolkyTolky objects are received
     * when executing getWolkyTolkyEqs.
     */
    test("statusCode: 200, returns list of WolkyTolky equipments", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        let equipments = await getWolkyTolkyEqs();
        expect(equipments).toBeDefined();
        expect(equipments.length).toBeGreaterThan(0);

        for (let i = 0; i < equipments.length; i++){
            expect(equipments[i]).toBeInstanceOf(WolkyTolkyEq);
            expect(equipments[i].equipmentId).toBe(1);
            expect(equipments[i].stationId).toBe(1);
            expect(equipments[i].apiKey).toBe('1111');
        }
    })
    /*
     * Test whether the statusCode 200 and good WolkyTolky objects are received
     * when executing getWolkyTolkyEqs after refreshing the access_token.
     */
    test("statusCode: 200, returns list of WolkyTolky equipments after refreshToken", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        deleteCookie('access_token', getUserId()); // Mock that the access_token must be refreshed

        let equipments = await getWolkyTolkyEqs();
        expect(equipments).toBeDefined();
        expect(equipments.length).toBeGreaterThan(0);
    })
})

describe("getWolkyTolkyEq()", () => {
    /*
     * Test whether the statusCode 200 and good WolkyTolky object are received
     * when executing getWolkyTolkyEq.
     */
    test("statusCode: 200, returns equipment", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        let equipment = await getWolkyTolkyEq(10);

        expect(equipment).toBeDefined();
        expect(equipment).toBeInstanceOf(WolkyTolkyEq);
        expect(equipment.equipmentId).toBe(1);
        expect(equipment.stationId).toBe(1);
        expect(equipment.apiKey).toBe('1111');
    })
    /*
     * Test whether the statusCode 200 and good WolkyTolky object are received
     * when executing getWolkyTolkyEq after refreshing the access_token.
     */
    test("statusCode: 200, returns equipment after refreshToken", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        deleteCookie('access_token', getUserId()); // Mock that the access_token must be refreshed

        let equipment = await getWolkyTolkyEq(10);
        expect(equipment).toBeDefined();
    })
})

describe("addWolkyTolkyEq()", () => {
    /*
     * Test whether the statusCode 200 is received
     * when executing addWolkyTolkyEq.
     */
    test("statusCode: 200, succesfull add equipment", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        let equipment = new WolkyTolkyEq(1, 1, '1111');
        expect(await addWolkyTolkyEq(equipment)).toBe(true);
    })
    /*
     * Test whether the statusCode 200 is received
     * when executing addWolkyTolkyEq after refreshing the access_token.
     */
    test("statusCode: 200, succesfull add equipment after refreshToken", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        deleteCookie('access_token', getUserId()); // Mock that the access_token must be refreshed
        let equipment = new WolkyTolkyEq(1, 1, '1111');
        expect(await addWolkyTolkyEq(equipment)).toBe(true);
    })

});

describe("updateWolkyTolkyEq()", () => {
    /*
     * Test whether the statusCode 200 is received
     * when executing updateWolkyTolkyEq.
     */
    test("statusCode: 200, succesfull update equipment", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        let equipment = new WolkyTolkyEq(1, 1, '1111');
        expect(await updateWolkyTolkyEq(equipment)).toBe(true);
    })
    /*
     * Test whether the statusCode 200 is received
     * when executing updateWolkyTolkyEq after refreshing the access_token.
     */
    test("statusCode: 200, succesfull update equipment after refreshToken", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        deleteCookie('access_token', getUserId()); // Mock that the access_token must be refreshed
        let equipment = new WolkyTolkyEq(1, 1, '1111');
        expect(await updateWolkyTolkyEq(equipment)).toBe(true);
    })

});

describe("deleteEquipment()", () => {
    /*
     * Test whether the statusCode 204 is received
     * when executing deleteWolkyTolkyEq.
     */
    test("statusCode: 204, succesfull delete equipment cropfield", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        expect(await deleteWolkyTolkyEq(15)).toBe(true);
    })
    /*
     * Test whether the statusCode 204 is received
     * when executing deleteWolkyTolkyEq after refreshing the access_token.
     */
    test("statusCode: 204, succesfull delete equipment after refreshToken", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        deleteCookie('access_token', getUserId()); // Mock that the access_token must be refreshed
        expect(await deleteWolkyTolkyEq(15)).toBe(true);
    })
});
