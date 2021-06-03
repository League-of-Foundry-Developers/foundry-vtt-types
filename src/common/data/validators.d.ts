/**
 * Test whether a string is a valid 16 character UID
 */
export declare function isValidId(id: string | null): boolean;

/**
 * Test whether a file path has an extension in a list of provided extensions
 */
export declare function _hasFileExtension(path: string | null, extensions: string[]): boolean;

/**
 * Test whether a file path has a valid image file extension or is base64 PNG data
 * @param path - The image path to test
 * @returns Is the path valid?
 */
export function hasImageExtension(path: string | null): boolean;
/**
 * Test whether a data blob represents a base64 image
 * @param data - A base64 data string
 * @returns Is it a base64 image?
 */
export declare function isBase64Image(data: string): boolean;

/**
 * Test whether an input represents a valid 6-character color string
 * @param color - The input string to test
 * @returns Is the string a valid color?
 */
export declare function isColorString(color: string): boolean;
/**
 * Test whether a file path has a valid audio file extension
 * @param path - The image path to test
 * @returns Is the path valid?
 */
export declare function hasVideoExtension(path: string | null): boolean;

/**
 * Test whether a file path has a valid video file extension
 * @param path - The image path to test
 * @returns Is the path valid?
 */
export declare function hasAudioExtension(path: string | null): boolean;
/**
 * Assert that the given value is in an array of allowed options
 * @param val   - The value to test
 * @param array - The set of allowed options
 * @returns Is the valid included?
 */
export declare function valueInArray<T>(val: T, array: T[]): boolean;

/**
 * Assert that the given value parses as a valid JSON string
 * @param val - The value to test
 * @returns Is the String valid JSON?
 */
export declare function isJSON(val: string): boolean;
