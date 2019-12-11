/**
 * This test file contains all the tests of the EnumConverter class
*/

import { stringToAccessibilityType, accessibilityTypeToString } from "../../utils/Converters/EnumConverter";
import { AccessibilityType } from "../../utils/AccessibilityType";

/**
 * Tests whether all the string get converted to the correct AccessibilityType.
 */
describe("stringToAccessibilityType()",
    () => {

        test("string: public",
            async () => {
                let enumValue = stringToAccessibilityType("public");
                expect(enumValue).toBe(AccessibilityType.Public);
            });

        test("string: private",
            async () => {
                let enumValue = stringToAccessibilityType("private");
                expect(enumValue).toBe(AccessibilityType.Private);
            });

        test("string: restricted",
            async () => {
                let enumValue = stringToAccessibilityType("restricted");
                expect(enumValue).toBe(AccessibilityType.Restricted);
            });
    });

/**
 * Tests whether all the AccessibilityType get converted to the correct string.
 */
describe("stringToAccessibilityType()", () => {

    test("enumValue: public",
        async () => {
            let stringValue = accessibilityTypeToString(AccessibilityType.Public);
            expect(stringValue).toBe("public");
        });

    test("enumValue: private",
        async () => {
            let stringValue = accessibilityTypeToString(AccessibilityType.Private);
            expect(stringValue).toBe("private");
        });

    test("enumValue: restricted",
        async () => {
            let stringValue = accessibilityTypeToString(AccessibilityType.Restricted);
            expect(stringValue).toBe("restricted");
        });
});