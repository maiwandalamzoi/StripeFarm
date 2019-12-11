import { AccessibilityType } from "../AccessibilityType";

/**
 * Convert a string value to an [[AccessibilityType]].
 * @param stringValue The string value to convert.
 * @throws Error when an invalid string is provided.
 */
export const stringToAccessibilityType = (stringValue: string) => {
    switch (stringValue) {
    case "public":
        return AccessibilityType.Public;
    case "private":
        return AccessibilityType.Private;
    case "restricted":
        return AccessibilityType.Restricted;
    }

    throw new Error(`Invalid string to convert to AccessibilityType: ${stringValue}`);
};

/**
 * Convert an [[AccessibilityType]] to a string value.
 * @param enumValue The value to convert to a string.
 * @throws Error when an unknown [[AccessibilityType]] is provided.
 */
export const accessibilityTypeToString = (enumValue: AccessibilityType) => {
    switch (enumValue) {
    case AccessibilityType.Public:
        return "public";
    case AccessibilityType.Private:
        return "private";
    case AccessibilityType.Restricted:
        return "restricted";
    }

    throw new Error(`Invalid value to convert to string: ${enumValue}`);
};