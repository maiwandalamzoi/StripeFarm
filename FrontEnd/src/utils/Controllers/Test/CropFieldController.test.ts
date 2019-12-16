/* This test file contains all the tests of the functionality of retrieving the crop field data from the data-
 * Sensing service.
 */

import { loadSettings } from "./TestSettings";
import { login, getUserId } from "../UserController";
import { LocationPoint } from "../../../common/LocationPoint";
import { deleteCookie } from "../../Cookies";
import { getCropFields, getCropField, addCropField, updateCropField, deleteCropField } from "../CropFieldController";
import { CropField } from "../../../common/CropField";
import { CropType } from "../../../common/CropType";
import { AccessibilityType } from "../../../common/AccessibilityType";

/*
 * Loads all the test settings necessary for testing with a mock api.
 */
loadSettings()

describe("getCropFields()", () => {
    /*
     * Test whether the statusCode 200 and good crop field objects are received
     * when executing getCropFields.
     */
    test("statusCode: 200, returns list of fields", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request

        let cropFields = await getCropFields(10, 15);
        expect(cropFields).toBeDefined();
        expect(cropFields.length).toBeGreaterThan(0);

        for (let i = 0; i < cropFields.length; i++){
            expect(cropFields[i]).toBeInstanceOf(CropField);
            expect(cropFields[i].id).toBe(1);
            expect(cropFields[i].farm_id).toBe(1);
            expect(cropFields[i].field_id).toBe(1);
            expect(cropFields[i].name).toBe('testCropFieldName');
            expect(cropFields[i].period_start).toBeInstanceOf(Date);
            expect(cropFields[i].period_end).toBeInstanceOf(Date);
            expect(cropFields[i].accessibility).toBe(AccessibilityType.public);
            expect(cropFields[i].crop_type).toBeInstanceOf(CropType);
            let coordinates = cropFields[i].coordinates;
            for (let j = 0; j < coordinates.length; j++){
                expect(coordinates[j]).toBeInstanceOf(LocationPoint)
                expect(coordinates[j].latitude).toBe(51.44687);
                expect(coordinates[j].longitude).toBe(5.486914);
            }
        }
    })
    /*
     * Test whether the statusCode 200 and a good crop field object are received
     *  when executing getCropFields after refreshing the access_token.
     */
    test("statusCode: 200, returns list of fields after refreshToken", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        deleteCookie('access_token', getUserId()); // Mock that the access_token must be refreshed

        let cropFields = await getCropFields(10, 15);
        expect(cropFields).toBeDefined();
        expect(cropFields.length).toBeGreaterThan(0);

        for (let i = 0; i < cropFields.length; i++){
            expect(cropFields[i]).toBeInstanceOf(CropField);
        }
    })
})

describe("getCropField()", () => {
    /*
     * Test whether the statusCode 200 and a good crop field object are received
     *  when executing getCropFields.
     */
    test("statusCode: 200, returns cropfield", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request

        let cropField = await getCropField(10, 15, 5);
        expect(cropField).toBeDefined();

        expect(cropField).toBeInstanceOf(CropField);
        expect(cropField.id).toBe(1);
        expect(cropField.farm_id).toBe(1);
        expect(cropField.field_id).toBe(1);
        expect(cropField.name).toBe('testCropFieldName');
        expect(cropField.period_start).toBeInstanceOf(Date);
        expect(cropField.period_end).toBeInstanceOf(Date);
        expect(cropField.accessibility).toBe(AccessibilityType.public);
        expect(cropField.crop_type).toBeInstanceOf(CropType);

        let coordinates = cropField.coordinates;
        for (let j = 0; j < coordinates.length; j++){
            expect(coordinates[j]).toBeInstanceOf(LocationPoint)
            expect(coordinates[j].latitude).toBe(51.44687);
            expect(coordinates[j].longitude).toBe(5.486914);
        }
    })
    /*
     * Test whether the statusCode 200 and a good crop field object are received
     *  when executing getCropFields after refreshing the access_token.
     */
    test("statusCode: 200, returns cropfield after refreshToken", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        deleteCookie('access_token', getUserId()); // Mock that the access_token must be refreshed

        let cropField = await getCropField(10, 15, 5);
        expect(cropField).toBeDefined();
        expect(cropField).toBeInstanceOf(CropField);
    })
})

describe("addCropField()", () => {
    /*
     * Test whether the statusCode 200 is received
     * when executing addCropFields.
     */
    test("statusCode: 200, succesfull add cropfield", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        let cropField = new CropField(undefined, 15, 10, 'testCropFieldName', new Date(), new Date(), [], new CropType(undefined, 'test', 'test'), AccessibilityType.public);
        expect(await addCropField(15, 10, cropField)).toBe(true);
    })
    /*
     * Test whether the statusCode 200 is received
     * when executing addCropFields after refreshing the access_token.
     */
    test("statusCode: 200, succesfull add cropfield after refreshToken", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        deleteCookie('access_token', getUserId()); // Mock that the access_token must be refreshed
        let cropField = new CropField(undefined, 15, 10, 'testCropFieldName', new Date(), new Date(), [], new CropType(undefined, 'test', 'test'), AccessibilityType.public);
        expect(await addCropField(15, 10, cropField)).toBe(true);
    })
});

describe("updateCropField()", () => {
    /*
     * Test whether the statusCode 200 is received
     * when executing updateCropField.
     */
    test("statusCode: 200, succesfull update cropfield", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        let cropField = new CropField(10, 15, 10, 'testCropFieldName', new Date(), new Date(), [], new CropType(undefined, 'test', 'test'), AccessibilityType.public);
        expect(await updateCropField(15, 10, cropField)).toBe(true);
    })
    /*
     * Test whether the statusCode 200 is received
     * when executing updateCropField after refreshing the access_token.
     */
    test("statusCode: 200, succesfull update cropfield after refreshToken", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        deleteCookie('access_token', getUserId());  // Mock that the access_token must be refreshed
        let cropField = new CropField(10, 15, 10, 'testCropFieldName', new Date(), new Date(), [], new CropType(undefined, 'test', 'test'), AccessibilityType.public);
        expect(await updateCropField(15, 10, cropField)).toBe(true);
    })
});

describe("deleteCropField()", () => {
    /*
     * Test whether the statusCode 200 is received
     * when executing deleteCropField.
     */
    test("statusCode: 204, succesfull add cropfield", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        expect(await deleteCropField(15, 10, 10)).toBe(true);
    })
    /*
     * Test whether the statusCode 200 is received
     * when executing deleteCropField after refreshing the access_token.
     */
    test("statusCode: 204, succesfull delete cropfield after refreshToken", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        deleteCookie('access_token', getUserId()); // Mock that the access_token must be refreshed
        expect(await deleteCropField(15, 10, 10)).toBe(true);
    })
});
