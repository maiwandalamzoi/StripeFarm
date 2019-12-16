/* This test file contains all the tests of the functionality of retrieving the farms from the data-
 * Sensing service.
 */

import { loadSettings } from "./TestSettings";
import { getFarms, addFarm, getFarm, updateFarm, deleteFarm } from "../FarmController";
import { Farm } from "../../../common/Farm";
import { Country } from "../../../common/Country";
import { login, getUserId } from "../UserController";
import { deleteCookie } from "../../Cookies";
import { AccessibilityType } from "../../../common/AccessibilityType";

/*
 * Loads all the test settings necessary for testing with a mock api.
 */
loadSettings()

describe("getFarms()", () => {
    /*
     * Test whether the statusCode 200 and good farm objects are received
     * when executing getFarms.
     */
    test("statusCode: 200, returns list of farms", async() => {
        await login('test@test.nl', 'testPassword');  // Mock login before doing request

        let farms = await getFarms();
        expect(farms.length).toBeGreaterThan(0);

        for (let i = 0; i < farms.length; i++){
            expect(farms[i]).toBeInstanceOf(Farm);
            expect(farms[i].name).toBe('testName');
            expect(farms[i].address).toBe('testAddress');
            expect(farms[i].postal_code).toBe('1234AB');
            expect(farms[i].email).toBe('test@test.nl');
            expect(farms[i].phone).toBe('1234567890');
            expect(farms[i].webpage).toBe('test.com');
            expect(farms[i].accessibility).toBe(AccessibilityType.public);
            expect(farms[i].country.id).toBe(1);
            expect(farms[i].country.name).toBe('Netherlands');
            expect(farms[i].country.code).toBe('NL');
        }
    })
    /*
     * Test whether the statusCode 200 and good farm objects are received
     * when executing getFarms after refreshing the access token
     */
    test("statusCode: 200, returns list of farms after refreshToken", async() => {
        await login('test@test.nl', 'testPassword');  // Mock login before doing request
        deleteCookie('access_token', getUserId());    // Mock that the access_token must be refreshed

        let farms = await getFarms();
        expect(farms.length).toBeGreaterThan(0);

        for (let i = 0; i < farms.length; i++){
            expect(farms[i]).toBeInstanceOf(Farm);
            expect(farms[i].name).toBe('testName');
        }
    })

});

describe("addFarm()", () => {
    /*
     * Test whether the statusCode 201 is received
     * when executing addFarms.
     */
    test("statusCode: 201, succesfull add farm", async() => {
        await login('test@test.nl', 'testPassword');  // Mock login before doing request
        let farm = new Farm(undefined, 'testName', '', '', '', '', '', new Country(undefined, '', ''), AccessibilityType.public);
        expect(await addFarm(farm)).toBe(true);
    })
    /*
     * Test whether the statusCode 201 is received
     * when executing addFarms after refreshing the access token
     */
    test("statusCode: 201, succesfull add farm after refreshToken", async() => {
        await login('test@test.nl', 'testPassword');  // Mock login before doing request
        deleteCookie('access_token', getUserId());   // Mock that the access_token must be refreshed
        let farm = new Farm(undefined, 'testName', '', '', '', '', '', new Country(undefined, '', ''), AccessibilityType.public);
        expect(await addFarm(farm)).toBe(true);
    })

});

describe("getFarm()", () => {
    /*
     * Test whether the statusCode 200 and a good farm object are received
     * when executing getFarm
     */
    test("statusCode: 200, succesfull", async() => {
        await login('test@test.nl', 'testPassword');  // Mock login before doing request
        let farm = await getFarm(15);
        expect(farm).toBeInstanceOf(Farm);
        expect(farm.name).toBe('testName');
        expect(farm.address).toBe('testAddress');
        expect(farm.postal_code).toBe('1234AB');
        expect(farm.email).toBe('test@test.nl');
        expect(farm.phone).toBe('1234567890');
        expect(farm.webpage).toBe('test.com');
        expect(farm.accessibility).toBe(AccessibilityType.public);
        expect(farm.country.id).toBe(1);
        expect(farm.country.name).toBe('Netherlands');
        expect(farm.country.code).toBe('NL');
    })
    /*
     * Test whether the statusCode 200 and a good farm object are received
     * when executing getFarm after refreshing the access token
     */
    test("statusCode: 200, succesfull after refreshToken", async() => {
        await login('test@test.nl', 'testPassword');  // Mock login before doing request
        deleteCookie('access_token', getUserId());   // Mock that the access_token must be refreshed
        let farm = await getFarm(15);
        expect(farm).toBeInstanceOf(Farm);
        expect(farm.name).toBe('testName');
    })

});

describe("updateFarm()", () => {
    /*
     * Test whether the statusCode 201 is received
     * when executing updateFarm 
     */
    test("statusCode: 201, return true", async() => {
        await login('test@test.nl', 'testPassword');  // Mock login before doing request
        let farm = new Farm(15, 'testName', '', '', '', '', '', new Country(undefined, '', ''), AccessibilityType.public);
        expect(await updateFarm(farm)).toBe(true);
    })
    /*
     * Test whether the statusCode 201 is received
     * when executing updateFarm after refreshing the access token
     */
    test("statusCode: 201, return true after refreshToken", async() => {
        await login('test@test.nl', 'testPassword');  // Mock login before doing request
        deleteCookie('access_token', getUserId());    // Mock that the access_token must be refreshed
        let farm = new Farm(15, 'testName', '', '', '', '', '', new Country(undefined, '', ''), AccessibilityType.public);
        expect(await updateFarm(farm)).toBe(true);
    })

     /*
     * Test whether the statusCode 404 is received
     * when passing a non-existing farm as a parameter to updateFarm 
     */
    test("statusCode: 404, return false", async() => {
        await login('test@test.nl', 'testPassword');   // Mock login before doing request
        let farm = new Farm(10, 'testName', '', '', '', '', '', new Country(undefined, '', ''), AccessibilityType.public);
        expect(await updateFarm(farm)).toBe(false);
    })

});

describe("deleteFarm()", () => {
    /*
     * Test whether the statusCode 204 is received
     * when executing deleteFarm on an existing farm
     */
    test("statusCode: 204, return true", async() => {
        await login('test@test.nl', 'testPassword');  // Mock login before doing request
        expect(await deleteFarm(15)).toBe(true);
    })
    /*
     * Test whether the statusCode 204 is received
     * when executing deleteFarm on an existing farm after refreshing the access token
     */
    test("statusCode: 204, return true after refreshToken", async() => {
        await login('test@test.nl', 'testPassword');  // Mock login before doing request
        deleteCookie('access_token', getUserId());   // Mock that the access_token must be refreshed
        expect(await deleteFarm(15)).toBe(true);
    })
    /*
     * Test whether the statusCode 404 is received
     * when executing deleteFarm on a non existing farm after refreshing the access token
     */
    test("statusCode: 404, return false", async() => {
        await login('test@test.nl', 'testPassword');   // Mock login before doing request
        expect(await deleteFarm(10)).toBe(false);
    })

});
