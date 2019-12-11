/* This test file contains all the tests of the functionality of retrieving the farm fields from the data-
 * Sensing service.
 */

import { loadSettings } from "./TestSettings";
import { login, getUserId } from "../UserController";
import { getFarmFields, getFarmField, addFarmField, updateFarmField, deleteFarmField } from "../FieldController";
import { Field } from "../../../common/Field";
import { LocationPoint } from "../../../common/LocationPoint";
import { SoilType } from "../../../common/SoilType";
import { deleteCookie } from "../../Cookies";
import { AccessibilityType } from "../../../common/AccessibilityType";

/*
 * Loads all the test settings necessary for testing with a mock api.
 */
loadSettings()

describe("getFarmFields()", () => {
    /*
     * Test whether the statusCode 200 and good farm field objects are received
     * when executing getFarmFields.
     */
    test("statusCode: 200, returns list of fields", async() => {
        await login('test@test.nl', 'testPassword');  // Mock login before doing request

        let fields = await getFarmFields(10);
        expect(fields).toBeDefined();
        expect(fields.length).toBeGreaterThan(0);

        for (let i = 0; i < fields.length; i++){
            expect(fields[i]).toBeInstanceOf(Field);
            expect(fields[i].id).toBe(1);
            expect(fields[i].field_name).toBe('testFieldName');
            expect(fields[i].size_in_hectare).toBe(5);
            expect(fields[i].accessibility).toBe(AccessibilityType.public);
            expect(fields[i].soil_type).toBeInstanceOf(SoilType);
            let coordinates = fields[i].coordinates;
            for (let j = 0; j < coordinates.length; j++){
                expect(coordinates[j]).toBeInstanceOf(LocationPoint)
                expect(coordinates[j].latitude).toBe(51.44687);
                expect(coordinates[j].longitude).toBe(5.486914);
            }
        }
    })
    /*
     * Test whether the statusCode 200 and good farm field objects are received
     * when executing getFarmFields after refreshing the access token
     */
    test("statusCode: 200, returns list of fields after refreshToken", async() => {
        await login('test@test.nl', 'testPassword');  // Mock login before doing request
        deleteCookie('access_token', getUserId());   // Mock that the access_token must be refreshed

        let fields = await getFarmFields(10);
        expect(fields).toBeDefined();
        expect(fields.length).toBeGreaterThan(0);

        for (let i = 0; i < fields.length; i++){
            expect(fields[i]).toBeInstanceOf(Field);
        }
    })

});

describe("getFarmField()", () => {
    /*
     * Test whether the statusCode 200 and a good farm field object are received
     * when executing getFarmField.
     */
    test("statusCode: 200, return field", async() => {
        await login('test@test.nl', 'testPassword');  // Mock login before doing request

        let field: Field = await getFarmField(10, 15);

        expect(field).toBeInstanceOf(Field);
        expect(field.id).toBe(1);
        expect(field.field_name).toBe('testFieldName');
        expect(field.size_in_hectare).toBe(5);
        expect(field.accessibility).toBe(AccessibilityType.public);
        expect(field.soil_type).toBeInstanceOf(SoilType);

        let coordinates = field.coordinates;
        for (let j = 0; j < coordinates.length; j++){
            expect(coordinates[j]).toBeInstanceOf(LocationPoint)
            expect(coordinates[j].latitude).toBe(51.44687);
            expect(coordinates[j].longitude).toBe(5.486914);
        }
    })
    /*
     * Test whether the statusCode 200 and a good farm field object are received
     * when executing getFarmField after refreshing the access token
     */
    test("statusCode: 200, return field after refreshToken", async() => {
        await login('test@test.nl', 'testPassword');   // Mock login before doing request
        deleteCookie('access_token', getUserId());   // Mock that the access_token must be refreshed

        let field: Field = await getFarmField(10, 15);
        expect(field).toBeInstanceOf(Field);
    })

});

describe("addFarmField()", () => {
    /*
     * Test whether the statusCode 201 is received
     * when executing addFarmField
     */
    test("statusCode: 201, succesfull add field", async() => {
        await login('test@test.nl', 'testPassword');   // Mock login before doing request
        let field = new Field(undefined, 'testFieldName', [], 5, new SoilType(undefined, 'test', 'test'), AccessibilityType.public);
        expect(await addFarmField(15, field)).toBe(true);
    })
    /*
     * Test whether the statusCode 201 is received
     * when executing addFarmField after refreshing the access token
     */
    test("statusCode: 201, succesfull add field after refreshToken", async() => {
        await login('test@test.nl', 'testPassword');   // Mock login before doing request
        deleteCookie('access_token', getUserId());    // Mock that the access_token must be refreshed
        let field = new Field(undefined, 'testFieldName', [], 5, new SoilType(undefined, 'test', 'test'), AccessibilityType.public);
        expect(await addFarmField(15, field)).toBe(true);
    })

});

describe("updateFarmField()", () => {
    /*
     * Test whether the statusCode 201 is received
     * when executing updateFarmField
     */
    test("statusCode: 201, succesfull update field", async() => {
        await login('test@test.nl', 'testPassword');    // Mock login before doing request
        let field = new Field(10, 'testFieldName', [], 5, new SoilType(undefined, 'test', 'test'), AccessibilityType.public);
        expect(await updateFarmField(15, field)).toBe(true);
    })
    /*
     * Test whether the statusCode 201 is received
     * when executing updateFarmField after the token is refreshed
     */
    test("statusCode: 201, succesfull update field", async() => {
        await login('test@test.nl', 'testPassword');   // Mock login before doing request
        deleteCookie('access_token', getUserId());    // Mock that the access_token must be refreshed
        let field = new Field(10, 'testFieldName', [], 5, new SoilType(undefined, 'test', 'test'), AccessibilityType.public);
        expect(await updateFarmField(15, field)).toBe(true);
    })

});

describe("deleteFarmField()", () => {
    /*
     * Test whether the statusCode 201 is received
     * when executing deleteFarmField on an existing farm 
     */
    test("statusCode: 201, succesfull delete field", async() => {
        await login('test@test.nl', 'testPassword');     // Mock login before doing request
        expect(await deleteFarmField(15, 10)).toBe(true);
    })
     /*
     * Test whether the statusCode 201 is received
     * when executing deleteFarmField on an existing farm after the token is refreshed
     */
    test("statusCode: 201, succesfull delete field", async() => {
        await login('test@test.nl', 'testPassword');   // Mock login before doing request
        deleteCookie('access_token', getUserId());    // Mock that the access_token must be refreshed
        expect(await deleteFarmField(15, 10)).toBe(true);
    })

});
