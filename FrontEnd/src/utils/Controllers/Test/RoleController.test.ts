/* This test file contains all the tests of the functionality of retrieving the role data from the data-
 * Sensing service.
 */

import { loadSettings } from "./TestSettings";
import { login, getUserId } from "../UserController";
import { getUserRoleOnFarm, changeUserRoleOnFarm, createUserRoleOnFarm, getAllUsersOnFarm, getUserRoles } from "../RoleController";
import { Role } from "../../../common/Role";
import { deleteCookie } from "../../Cookies";

/*
 * Loads all the test settings necessary for testing with a mock api.
 */
loadSettings()

describe("getUserRoleOnFarm()", () => {
    /*
     * Test whether the statusCode 200 and good role object are received
     * when executing getUserRoleOnFarm.
     */
    test("statusCode: 200, returns role", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request

        let role = await getUserRoleOnFarm(15, getUserId());
        expect(role).toBeInstanceOf(Role);
    })
    /*
     * Test whether the statusCode 200 and good role object are received
     * when executing getUserRoleOnFarm after refreshing access_token.
     */
    test("statusCode: 200, returns role after refreshToken", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        deleteCookie('access_token', getUserId()); // Mock that the access_token must be refreshed

        let role = await getUserRoleOnFarm(15, getUserId());
        expect(role).toBeInstanceOf(Role);
    })
})

describe("changeUserRoleOnFarm()", () => {
    /*
     * Test whether the statusCode 201 is received
     * when executing changeUserRoleOnFarm.
     */
    test("statusCode: 201, returns true", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        expect(await changeUserRoleOnFarm(10, getUserId(), new Role('researcher'))).toBe(true);
    })
    /*
     * Test whether the statusCode 201 is received
     * when executing changeUserRoleOnFarm after refreshing access_token.
     */
    test("statusCode: 201, returns true after refreshToken", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        deleteCookie('access_token', getUserId()); // Mock that the access_token must be refreshed
        expect(await changeUserRoleOnFarm(10, getUserId(), new Role('researcher'))).toBe(true);
    })
})

describe("createUserRoleOnFarm()", () => {
    /*
     * Test whether the statusCode 201 is received
     * when executing createUserRoleOnFarm.
     */
    test("statusCode: 200, returns true", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        expect(await createUserRoleOnFarm(10, '', new Role('researcher'))).toBe(true);
    })
    /*
     * Test whether the statusCode 201 is received
     * when executing createUserRoleOnFarm after refreshing access_token.
     */
    test("statusCode: 201, returns true after refreshToken", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        deleteCookie('access_token', getUserId()); // Mock that the access_token must be refreshed
        expect(await createUserRoleOnFarm(10, '', new Role('researcher'))).toBe(true);
    })
})

describe("getAllUsersOnFarm()", () => {
    /*
     * Test whether the statusCode 200 is received
     * when executing getAllUsersOnFarm.
     */
    test("statusCode: 200, returns users with roles", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        let response = await getAllUsersOnFarm(10);
        expect(response).toBeDefined();

        for (let i = 0; i < response.length; i++){
            expect(response[i].user_id).toBe(1);
            expect(response[i].email).toBe('test@email.com');
            var role = response[i].role;
            expect(role.id).toBe(1);
            expect(role.name).toBe('researcher');
        }
    })
    /*
     * Test whether the statusCode 200 is received
     * when executing getAllUsersOnFarm after refreshing access_token.
     */
    test("statusCode: 200, returns users with roles after refreshToken", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        deleteCookie('access_token', getUserId()); // Mock that the access_token must be refreshed
        let response = await getAllUsersOnFarm(10);
        expect(response).toBeDefined();
    })
})

describe("getUserRoles()", () => {
    /*
     * Test whether the statusCode 200 is received and good role objects
     * when executing getUserRoles.
     */
    test("statusCode: 200, returns roles", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        let response = await getUserRoles();
        expect(response).toBeDefined();

        expect(response[0].name).toBe('farm_admin');
        expect(response[1].name).toBe('farmer');
        expect(response[2].name).toBe('researcher');
        expect(response[3].name).toBe('user');
    })
    /*
     * Test whether the statusCode 200 is received and good role objects
     * when executing getUserRoles after refreshing access_token.
     */
    test("statusCode: 200, returns roles after refreshToken", async() => {
        await login('test@test.nl', 'testPassword'); // Mock login before doing request
        deleteCookie('access_token', getUserId()); // Mock that the access_token must be refreshed
        let response = await getUserRoles();;
        expect(response).toBeDefined();
    })
})
