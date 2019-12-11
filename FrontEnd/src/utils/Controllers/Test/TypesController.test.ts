/* This test file contains all the tests of the functionality of retrieving the type data from the data-
 * Sensing service.
 */

import { loadSettings } from "./TestSettings";
import { login, getUserId } from "../UserController";
import { getCountries, getCropTypes, getSoilTypes } from "../TypesController";
import { Country } from "../../../common/Country";
import { deleteCookie } from "../../Cookies";
import { SoilType } from "../../../common/SoilType";
import { CropType } from "../../../common/CropType";

/*
 * Loads all the test settings necessary for testing with a mock api.
 */
loadSettings()

describe("getCountries()", () => {
    /*
     * Test whether the statusCode 200 and good list of countries are received
     * when executing getCountries.
     */
    test("statusCode: 200, returns list of countries", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request

        let countries = await getCountries();
        expect(countries).toBeDefined();
        expect(countries.length).toBeGreaterThan(0);

        for (let i = 0; i < countries.length; i++){
            expect(countries[i]).toBeInstanceOf(Country);
        }
    })
    /*
     * Test whether the statusCode 200 and good list of countries are received
     * when executing getCountries after refresh_token.
     */
    test("statusCode: 200, returns list of countries after refreshToken", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        deleteCookie('access_token', getUserId());  // Mock that the access_token must be refreshed

        let countries = await getCountries();
        expect(countries).toBeDefined();
    })

})

describe("getCropTypes()", () => {
    /*
     * Test whether the statusCode 200 and good list of croptypes are received
     * when executing getCropFields.
     */
    test("statusCode: 200, returns list of cropTypes", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request

        let cropTypes = await getCropTypes();
        expect(cropTypes).toBeDefined();

        for (let i = 0; i < cropTypes.length; i++){
            expect(cropTypes[i]).toBeInstanceOf(CropType);
        }
    })
    /*
     * Test whether the statusCode 200 and good list of croptypes are received
     * when executing getCropFields after refreshing access_token.
     */
    test("statusCode: 200, returns list of cropTypes after refreshToken", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        deleteCookie('access_token', getUserId());  // Mock that the access_token must be refreshed

        let cropTypes = await getCropTypes();
        expect(cropTypes).toBeDefined();
    })

})

describe("getSoilTypes()", () => {
    /*
     * Test whether the statusCode 200 and good list of soiltypes are received
     * when executing getSoilTypes.
     */
    test("statusCode: 200, returns list of soilTypes", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request

        let soilTypes = await getSoilTypes();
        expect(soilTypes).toBeDefined();

        for (let i = 0; i < soilTypes.length; i++){
            expect(soilTypes[i]).toBeInstanceOf(SoilType);
        }
    })
    /*
     * Test whether the statusCode 200 and good list of soiltypes are received
     * when executing getSoilTypes after refreshing access_token.
     */
    test("statusCode: 200, returns list of soilTypes after refreshToken", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        deleteCookie('access_token', getUserId());  // Mock that the access_token must be refreshed

        let soilTypes = await getSoilTypes();
        expect(soilTypes).toBeDefined();
    })

})
