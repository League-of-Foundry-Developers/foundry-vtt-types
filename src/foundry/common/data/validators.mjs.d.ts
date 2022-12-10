/**
 * Test whether a string is a valid 16 character UID
 */
export declare function isValidId(id: string | null): boolean;

/**
 * Test whether a file path has an extension in a list of provided extensions
 */
export declare function hasFileExtension(path: string | null, extensions: string[]): boolean;

/**
 * Test whether a string data blob contains base64 data, optionally of a specific type or types
 * @param data  - The candidate string data
 * @param types - An array of allowed mime types to test
 */
export function isBase64Data(data: string, types?: string[]): boolean;

/**
 * Test whether an input represents a valid 6-character color string
 * @param color - The input string to test
 * @returns Is the string a valid color?
 */
export declare function isColorString(color: string): boolean;

/**
 * Assert that the given value parses as a valid JSON string
 * @param val - The value to test
 * @returns Is the String valid JSON?
 */
export declare function isJSON(val: string): boolean;
