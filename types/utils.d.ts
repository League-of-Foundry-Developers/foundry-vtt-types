/**
 * Export data content to be saved to a local file
 * @param data		Data content converted to a string
 * @param type		The type of
 * @param filename	The filename of the resulting download
 */
declare function saveDataToFile(
	data: string,
	type: string,
	filename: string
): void;

/**
 * Read text data from a user provided File object
 * @param file	A File object
 * @return		A Promise which resolves to the loaded text data
 */
declare function readTextFromFile(file: File): Promise<string>;

/**
 * Obtain references to the parent classes of a certain class.
 * @param cls      An ES6 Class definition
 * @return An array of parent Classes which the provided class extends
 */
declare function getParentClasses(cls: () => {}): Array<() => {}>;

/**
 * A cheap data duplication trick, surprisingly relatively performant
 * @param original	Some sort of data
 */
declare function duplicate<T>(original: T): T;

/**
 * Learn the named type of a token - extending the functionality of typeof to recognize some core Object types
 * @param token	Some passed token
 * @return		The named type of the token
 */
declare function getType(token: any): string;

/**
 * Update a source object by replacing its keys and values with those from a target object.
 *
 * @param original		The initial object which should be updated with values from the target
 * @param other			A new object whose values should replace those in the source
 * @param insert		Control whether to insert new parent objects in the structure which did not previously
 *						exist in the source object.
 * @param overwrite		Control whether to replace existing values in the source, or only merge values which
 *						do not exist in the source.
 * @param inplace		Update the values of original inplace? Otherwise duplicate the original and return a
 *						safe copy.
 * @param enforceTypes	Enforce that the type of an inner value in the source object match the type of the
 *                              new value. Default is false for now (for BC), but should be true in the future.
 * @param _d			A privately used parameter to track recursion depth
 *
 * @returns				The original source object including updated, inserted, or overwritten records
 */
declare function mergeObject<T>(
	original: T,
	other?: T,
	{
		insertKeys,
		insertValues,
		overwrite,
		inplace,
		enforceTypes,
	}?: {
		insertKeys?: boolean;
		insertValues?: boolean;
		overwrite?: boolean;
		inplace?: boolean;
		enforceTypes?: boolean;
	},
	_d?: number
): T;

/**
 * A temporary shim to invert an object, flipping keys and values
 * @param obj    Some object where the values are unique
 * @return       An inverted object where the values of the original object are the keys of the new object
 */
declare function invertObject(obj: object): any;

/**
 * Filter the contents of some source object using the structure of a template object.
 * Only keys which exist in the template are preserved in the source object.
 *
 * @param source           An object which contains the data you wish to filter
 * @param template         An object which contains the structure you wish to preserve
 * @param keepSpecial      Whether to keep special tokens like deletion keys
 * @param templateValues   Instead of keeping values from the source, instead draw values from the template
 *
 * @example
 * const source = {foo: {number: 1, name: "Tim", topping: "olives"}, bar: "baz"};
 * const template = {foo: {number: 0, name: "Mit", style: "bold"}, other: 72};
 * filterObject(source, template); // {foo: {number: 1, name: "Tim"}};
 * filterObject(source, template, {templateValues: true}); // {foo: {number: 0, name: "Mit"}};
 */
declare function filterObject(
	source: object,
	template: object,
	keepSpecial?: boolean,
	templateValues?: boolean
): any;

/**
 * Flatten a possibly multi-dimensional object to a one-dimensional one by converting all nested keys to dot notation
 * @param obj  The object to flatten
 * @param _d   Recursion depth, to prevent overflow
 * @return     A flattened object
 */
declare function flattenObject(obj: object, _d?: number): any;

/**
 * Expand a flattened object to be a standard multi-dimensional nested Object by converting all dot-notation keys to
 * inner objects.
 *
 * @param obj  The object to expand
 * @param _d   Recursion depth, to prevent overflow
 * @return     An expanded object
 */
declare function expandObject(obj: object, _d?: number): any;

/**
 * A simple function to test whether or not an Object is empty
 * @param obj    The object to test
 * @return       Is the object empty?
 */
declare function isObjectEmpty(obj: object): boolean;

/**
 * Deeply difference an object against some other, returning the update keys and values
 * @param original
 * @param other
 * @return
 */
declare function diffObject(original: object, other: object): any;

/**
 * A helper function which tests whether an object has a property or nested property given a string key.
 * The string key supports the notation a.b.c which would return true if object[a][b][c] exists
 * @param object   The object to traverse
 * @param key      An object property with notation a.b.c
 *
 * @return         An indicator for whether the property exists
 */
declare function hasProperty(object: object, key: string): boolean;

/**
 * A helper function which searches through an object to retrieve a value by a string key.
 * The string key supports the notation a.b.c which would return object[a][b][c]
 * @param object   The object to traverse
 * @param key      An object property with notation a.b.c
 *
 * @return         The value of the found property
 */
declare function getProperty(object: object, key: string): any;

/**
 * A helper function which searches through an object to assign a value using a string key
 * This string key supports the notation a.b.c which would target object[a][b][c]
 *
 * @param object   The object to update
 * @param key      The string key
 * @param value    The value to be assigned
 *
 * @return {Boolean}        A flag for whether or not the object was updated
 */
declare function setProperty(object: object, key: string, value: any): boolean;

/**
 * Bound a number between some minimum and maximum value, inclusively
 * @param num    The current value
 * @param min    The minimum allowed value
 * @param max    The maximum allowed value
 * @return The clamped number
 */
declare function clampNumber(num: number, min: number, max: number): number;

/**
 * Round a floating point number to a certain number of decimal places
 * @param number  A floating point number
 * @param places  An integer number of decimal places
 */
declare function roundDecimals(number: number, places: number): number;

/**
 * Transform an angle in radians to a number in degrees
 * @param angle    An angle in radians
 * @return An angle in degrees
 */
declare function toDegrees(angle: number): number;

/**
 * Transform an angle in degrees to be bounded within the domain [0, 360]
 * @param degrees  An angle in degrees
 * @return The same angle on the range [0, 360]
 */
declare function normalizeDegrees(degrees: number): number;

/**
 * Transform an angle in degrees to an angle in radians
 * @param angle    An angle in degrees
 * @return An angle in radians
 */
declare function toRadians(degree: number): number;

/**
 * Transform an angle in radians to be bounded within the domain [-PI, PI]
 * @param radians  An angle in degrees
 * @return The same angle on the range [-PI, PI]
 */
declare function normalizeRadians(rad: number): number;

declare function validateForm(formElement: HTMLElement): any;

/**
 * Encode a url-like string by replacing any characters which need encoding
 * @param path     A fully-qualified URL or url component (like a relative path)
 * @return         An encoded URL string
 */
declare function encodeURL(path: string): string;

/**
 * Express a timestamp as a relative string
 * @param timeStamp
 * @return
 */
declare function timeSince(timeStamp: Date): string;

/**
 * Wrap a callback in a debounced timeout.
 * Delay execution of the callback function until the function has not been called for delay milliseconds
 * @param callback       A function to execute once the debounced threshold has been passed
 * @param delay            An amount of time in milliseconds to delay
 */
declare function debounce(
	callback: (this: Function, ...args: any) => void,
	delay: number
): (...args: any) => void;

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 1] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param  r       The red color value
 * @param  g       The green color value
 * @param  b       The blue color value
 * @return         The HSV representation
 */
declare function rgbToHsv(r: number, g: number, b: number): Array<number>;

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 1].
 *
 * @param  h       The hue
 * @param  s       The saturation
 * @param  v       The value
 * @return         The RGB representation
 */
declare function hsvToRgb(h: number, s: number, v: number): Array<number>;

/**
 * Converts a color as an [R, G, B] array of normalized floats to a hexadecimal number.
 * @param rgb - Array of numbers where all values are normalized floats from 0.0 to 1.0.
 * @return      Number in hexadecimal.
 */
declare function rgbToHex(rgb: Array<number>): number;

/**
 * Convert a hex color code to an RGB array
 * @param hex    A hex color number
 * @return       An array of [r,g,b] colors normalized on the range of [0,1]
 */
declare function hexToRGB(hex: number): Array<number>;

/**
 * Convert a hex color code to an RGBA color string which can be used for CSS styling
 * @param hex    A hex color number
 * @param alpha  A level of transparency
 * @return       An rgba style string
 */
declare function hexToRGBAString(hex: number, alpha?: number): string;

/**
 * Convert a string color to a hex integer
 * @param color    The string color
 * @return         The hexidecimal color code
 */
declare function colorStringToHex(color: string): number;

/**
 * Return whether or not a version (v1) is more advanced than some other version (v0)
 * Supports numeric or string version numbers
 * @param v0
 * @param v1
 * @return
 */
declare function isNewerVersion(
	v1: number | string,
	v0: number | string
): boolean;

/**
 * Generate a random ID
 * Generate random number and convert it to base 36 and remove the '0.' at the beginning
 * As long as the string is not long enough, generate more random data into it
 * Use substring in case we generated a string with a length higher than the requested length
 *
 * @param length    The length of the random ID to generate
 * @return          Return a string containing random letters and numbers
 */
declare function randomID(length?: number): string;

declare function benchmark(func: Function, iterations: number): void;

/**
 * Load a single texture and return a Promise which resolves once the texture is ready to use
 * @param src 		The requested texture source
 * @param fallback 	A fallback texture to use if the requested source is unavailable or invalid
 */
declare function loadTexture(
	src: string,
	fallback?: string
): Promise<PIXI.Texture>;
