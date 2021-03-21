/* -------------------------------------------- */
/*  Math Functions                              */
/* -------------------------------------------- */

/**
 * Bound a number between some minimum and maximum value, inclusively
 * @param num - The current value
 * @param min - The minimum allowed value
 * @param max - The maximum allowed value
 * @returns The clamped number
 */
declare function clampNumber(num: number, min: number, max: number): number;

/**
 * Round a floating point number to a certain number of decimal places
 * @param number - A floating point number
 * @param places - An integer number of decimal places
 */
declare function roundDecimals(number: number, places: number): number;

/**
 * Transform an angle in radians to a number in degrees
 * @param angle - An angle in radians
 * @returns An angle in degrees
 */
declare function toDegrees(angle: number): number;

/**
 * Transform an angle in degrees to be bounded within the domain [0, 360]
 * @param degrees - An angle in degrees
 * @returns The same angle on the range [0, 360]
 */
declare function normalizeDegrees(degrees: number): number;

/**
 * Transform an angle in degrees to an angle in radians
 * @param angle - An angle in degrees
 * @returns An angle in radians
 */
declare function toRadians(angle: number): number;

/**
 * Transform an angle in radians to be bounded within the domain [-PI, PI]
 * @param radians - An angle in degrees
 * @returns The same angle on the range [-PI, PI]
 */
declare function normalizeRadians(radians: number): number;

/* -------------------------------------------- */
/* Object Methods                               */
/* -------------------------------------------- */

/**
 * Obtain references to the parent classes of a certain class.
 * @param cls - An ES6 Class definition
 * @returns An array of parent Classes which the provided class extends
 */
declare function getParentClasses(cls: ConstructorOf<any>): Array<ConstructorOf<any>>;

/* -------------------------------------------- */

/**
 * A cheap data duplication trick, surprisingly relatively performant
 * @param original - Some sort of data
 * @typeParam T - Type of the original data.
 * @typeParam S - A flag to indicate whether or not to handle conversion of `NaN`, `Infinity`, and `-Infinity` to `null`
 *                strictly. If set to `'strict'`, `number` will be converted to `number | null`, if set to `'lenient'`,
 *                `number` will simply stay `number`.
 *                (default: `'strict'`)
 */
declare function duplicate<T, S extends 'strict' | 'lenient' = 'strict'>(original: T): Duplicated<T, S>;

/**
 * Internal Helper for {@link Duplicated}. A union type of all primitive types that do not have a JSON representation.
 *
 * @internal
 */
type NonStringifiable = undefined | Function | symbol;

/**
 * Internal helper for {@link InnerDuplicated}. Maps the properties of `T` to their duplicated types.
 *
 * @typeParam T - The object type that should have its properties mapped.
 * @typeParam S - A flag to indicate whether or not to handle conversion of `NaN`, `Infinity`, and `-Infinity` to `null`
 *                strictly. If set to `'strict'`, `number` will be converted to `number | null`, if set to `'lenient'`,
 *                `number` will simply stay `number`.
 *                (default: `'strict'`)
 * @internal
 */
type MapToInnerDuplicated<T extends object, S extends 'strict' | 'lenient' = 'strict'> = {
  [k in keyof T]: InnerDuplicated<T[k], S>;
};

/**
 * Internal helper type for {@link Duplicated}. It is the main part of the implementation, which does the recursion.
 *
 * @typeParam T - Type currently being converted.
 * @typeParam S - A flag to indicate whether or not to handle conversion of `NaN`, `Infinity`, and `-Infinity` to `null`
 *                strictly. If set to `'strict'`, `number` will be converted to `number | null`, if set to `'lenient'`,
 *                `number` will simply stay `number`.
 *                (default: `'strict'`)
 * @internal
 */
// prettier-ignore
type InnerDuplicated<T, S extends 'strict' | 'lenient' = 'strict'> = T extends { toJSON(): infer U }
  ? U extends Array<unknown>
    ? InnerDuplicated<U, S>
    : U extends object
      ? InnerDuplicated<Omit<U, 'toJSON'>, S>
      : InnerDuplicated<U, S>
  : T extends NonStringifiable
    ? undefined
    : T extends number
      ? S extends 'strict'
        ? T | null
        : T
      : T extends Array<unknown>
        ? MapToInnerDuplicated<MapTypeToType<T, NonStringifiable, null>, S>
        : T extends object
          ? MapToInnerDuplicated<
            OmitAssignableFromType<MapTypeToType<T, NonStringifiable, undefined>, undefined> &
              Partial<OmitOfType<OmitNotAssignableFromType<MapTypeToType<T, NonStringifiable, undefined>, undefined>, undefined>>,
            S>
          : T;

/**
 * The resulting type when using {@link duplicate} on some data of type `T`.
 *
 * @typeParam T - Original type.
 * @typeParam S - A flag to indicate whether or not to handle conversion of `NaN`, `Infinity`, and `-Infinity` to `null`
 *                strictly. If set to `'strict'`, `number` will be converted to `number | null`, if set to `'lenient'`,
 *                `number` will simply stay `number`.
 *                (default: `'strict'`)
 * @internal
 */
type Duplicated<T, S extends 'strict' | 'lenient' = 'strict'> = T extends NonStringifiable
  ? never
  : InnerDuplicated<T, S>;

/* -------------------------------------------- */

/**
 * Learn the named type of a token - extending the functionality of typeof to recognize some core Object types
 * @param token - Some passed token
 * @returns The named type of the token
 */
declare function getType(token: any): string;

/* -------------------------------------------- */

/**
 * Filter the contents of some source object using the structure of a template object.
 * Only keys which exist in the template are preserved in the source object.
 *
 * @param source         - An object which contains the data you wish to filter
 * @param template       - An object which contains the structure you wish to preserve
 * @param keepSpecial    - Whether to keep special tokens like deletion keys
 *                         (default: `false`)
 * @param templateValues - Instead of keeping values from the source, instead draw values from the template
 *                         (default: `false`)
 *
 * @example
 * ```typescript
 * const source = {foo: {number: 1, name: "Tim", topping: "olives"}, bar: "baz"};
 * const template = {foo: {number: 0, name: "Mit", style: "bold"}, other: 72};
 * filterObject(source, template); // {foo: {number: 1, name: "Tim"}};
 * filterObject(source, template, {templateValues: true}); // {foo: {number: 0, name: "Mit"}};
 * ```
 */
declare function filterObject(
  source: object,
  template: object,
  {
    keepSpecial,
    templateValues
  }?: {
    /**
     * Whether to keep special tokens like deletion keys
     * @defaultValue `false`
     */
    keepSpecial?: boolean;

    /**
     * Instead of keeping values from the source, instead draw values from the template
     * @defaultValue `false`
     */
    templateValues?: boolean;
  }
): any;

/* -------------------------------------------- */

/**
 * Flatten a possibly multi-dimensional object to a one-dimensional one by converting all nested keys to dot notation
 * @param obj - The object to flatten
 * @param _d  - Recursion depth, to prevent overflow
 *              (default: `0`)
 * @returns A flattened object
 */
declare function flattenObject(obj: object, _d?: number): any;

/* -------------------------------------------- */

/**
 * Expand a flattened object to be a standard multi-dimensional nested Object by converting all dot-notation keys to
 * inner objects.
 *
 * @param obj - The object to expand
 * @param _d  - Recursion depth, to prevent overflow
 *              (default: `0`)
 * @returns An expanded object
 */
declare function expandObject(obj: object, _d?: number): any;

/* -------------------------------------------- */

/**
 * A simple function to test whether or not an Object is empty
 * @param obj - The object to test
 * @returns Is the object empty?
 */
declare function isObjectEmpty(obj: object): boolean;

/* -------------------------------------------- */

/**
 * Invert an object by assigning its values as keys and its keys as values.
 * @param obj - The original object to invert
 * @returns The inverted object with keys and values swapped
 */
declare function invertObject(obj: object): object;

/* -------------------------------------------- */

/**
 * Update a source object by replacing its keys and values with those from a target object.
 *
 * @param original - The initial object which should be updated with values from
 *                   the target
 * @param other    - A new object whose values should replace those in the source
 *                   (default: `{}`)
 *
 * @param insertKeys   - Control whether to insert new top-level objects into the resulting structure
 *                       which do not previously exist in the original object.
 *                       (default: `true`)
 * @param insertValues - Control whether to insert new nested values into child objects in the resulting
 *                       structure which did not previously exist in the original object.
 *                       (default: `true`)
 * @param overwrite    - Control whether to replace existing values in the source, or only merge values
 *                       which do not already exist in the original object.
 *                       (default: `true`)
 * @param recursive    - Control whether to merge inner-objects recursively (if true), or whether to
 *                       simply replace inner objects with a provided new value.
 *                       (default: `true`)
 * @param inplace      - Control whether to apply updates to the original object in-place (if true),
 *                       otherwise the original object is duplicated and the copy is merged.
 *                       (default: `true`)
 * @param enforceTypes - Control whether strict type checking requires that the value of a key in the
 *                       other object must match the data type in the original data to be merged.
 *                       (default: `false`)
 * @param _d           - A privately used parameter to track recursion depth.
 *                       (default: `0`)
 *
 * @returns The original source object including updated, inserted, or
 *          overwritten records.
 *
 * @example <caption>Control how new keys and values are added</caption>
 * ```typescript
 * mergeObject({k1: "v1"}, {k2: "v2"}, {insertKeys: false}); // {k1: "v1"}
 * mergeObject({k1: "v1"}, {k2: "v2"}, {insertKeys: true});  // {k1: "v1", k2: "v2"}
 * mergeObject({k1: {i1: "v1"}}, {k1: {i2: "v2"}}, {insertValues: false}); // {k1: {i1: "v1"}}
 * mergeObject({k1: {i1: "v1"}}, {k1: {i2: "v2"}}, {insertValues: true}); // {k1: {i1: "v1", i2: "v2"}}
 * ```
 *
 * @example <caption>Control how existing data is overwritten</caption>
 * ```typescript
 * mergeObject({k1: "v1"}, {k1: "v2"}, {overwrite: true}); // {k1: "v2"}
 * mergeObject({k1: "v1"}, {k1: "v2"}, {overwrite: false}); // {k1: "v1"}
 * ```
 *
 * @example <caption>Control whether merges are performed recursively</caption>
 * ```typescript
 * mergeObject({k1: {i1: "v1"}}, {k1: {i2: "v2"}}, {recursive: false}); // {k1: {i1: "v2"}}
 * mergeObject({k1: {i1: "v1"}}, {k1: {i2: "v2"}}, {recursive: true}); // {k1: {i1: "v1", i2: "v2"}}
 * ```
 *
 * @example <caption>Deleting an existing object key</caption>
 * ```typescript
 * mergeObject({k1: "v1", k2: "v2"}, {"-=k1": null});   // {k2: "v2"}
 * ```
 */
declare function mergeObject<T>(
  original: T,
  other?: T,
  {
    insertKeys,
    insertValues,
    overwrite,
    recursive,
    inplace,
    enforceTypes
  }?: {
    /**
     * Control whether to insert new top-level objects into the resulting structure
     * which do not previously exist in the original object.
     * @defaultValue `true`
     */
    insertKeys?: boolean;

    /**
     * Control whether to insert new nested values into child objects in the resulting
     * structure which did not previously exist in the original object.
     * @defaultValue `true`
     */
    insertValues?: boolean;

    /**
     * Control whether to replace existing values in the source, or only merge values
     * which do not already exist in the original object.
     * @defaultValue `true`
     */
    overwrite?: boolean;

    /**
     * Control whether to merge inner-objects recursively (if true), or whether to
     * simply replace inner objects with a provided new value.
     * @defaultValue `true`
     */
    recursive?: boolean;

    /**
     * Control whether to apply updates to the original object in-place (if true),
     * otherwise the original object is duplicated and the copy is merged.
     * @defaultValue `true`
     */
    inplace?: boolean;

    /**
     * Control whether strict type checking requires that the value of a key in the
     * other object must match the data type in the original data to be merged.
     * @defaultValue `false`
     */
    enforceTypes?: boolean;
  },
  _d?: number
): T;

/* -------------------------------------------- */

/**
 * Deeply difference an object against some other, returning the update keys and values
 * @param original - An object comparing data against which to compare.
 * @param other    - An object containing potentially different data.
 * @param inner    - Only recognize differences in other for keys which also exist in original.
 *                   (default: `false`)
 * @returns An object of the data in other which differs from that in original.
 */
declare function diffObject(
  original: object,
  other: object,
  {
    inner
  }?: {
    /**
     * Only recognize differences in other for keys which also exist in original.
     * @defaultValue `false`
     */
    inner: boolean;
  }
): object;

/* -------------------------------------------- */

/**
 * A helper function which tests whether an object has a property or nested property given a string key.
 * The string key supports the notation a.b.c which would return true if object[a][b][c] exists
 * @param object - The object to traverse
 * @param key    - An object property with notation a.b.c
 *
 * @returns An indicator for whether the property exists
 */
declare function hasProperty(object: object, key: string): boolean;

/* -------------------------------------------- */

/**
 * A helper function which searches through an object to retrieve a value by a string key.
 * The string key supports the notation a.b.c which would return object[a][b][c]
 * @param object - The object to traverse
 * @param key    - An object property with notation a.b.c
 *
 * @returns The value of the found property
 */
declare function getProperty(object: object, key: string): any;

/* -------------------------------------------- */

/**
 * A helper function which searches through an object to assign a value using a string key
 * This string key supports the notation a.b.c which would target object[a][b][c]
 *
 * @param object - The object to update
 * @param key    - The string key
 * @param value  - The value to be assigned
 *
 * @returns A flag for whether or not the object was updated
 */
declare function setProperty(object: object, key: string, value: any): boolean;

/* -------------------------------------------- */
/*  URL Manipulation                            */
/* -------------------------------------------- */

/**
 * Encode a url-like string by replacing any characters which need encoding
 * @param path - A fully-qualified URL or url component (like a relative path)
 * @returns An encoded URL string
 */
declare function encodeURL(path: string): string;

/* -------------------------------------------- */
/*  Datetime Manipulation
/* -------------------------------------------- */

/**
 * Express a timestamp as a relative string
 */
declare function timeSince(timeStamp: Date): string;

/**
 * Wrap a callback in a debounced timeout.
 * Delay execution of the callback function until the function has not been called for delay milliseconds
 * @param callback - A function to execute once the debounced threshold has been passed
 * @param delay    - An amount of time in milliseconds to delay
 */
declare function debounce(callback: (this: Function, ...args: any[]) => void, delay: number): (...args: any[]) => void;

/* -------------------------------------------- */
/*  Colors
/* -------------------------------------------- */

/**
 * Converts an RGB color value to HSV. Conversion formula adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 1] and returns h, s, and v in the set [0, 1].
 * @param r - The red color value
 * @param g - The green color value
 * @param b - The blue color value
 * @returns The HSV representation
 */
declare function rgbToHsv(r: number, g: number, b: number): number[];

/* -------------------------------------------- */

/**
 * Converts an HSV color value to RGB. Conversion formula adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and returns r, g, and b in the set [0, 1].
 * @param h - The hue
 * @param s - The saturation
 * @param v - The value
 * @returns The RGB representation
 */
declare function hsvToRgb(h: number, s: number, v: number): number[];

/**
 * Converts a color as an [R, G, B] array of normalized floats to a hexadecimal number.
 * @param rgb - Array of numbers where all values are normalized floats from 0.0 to 1.0.
 * @returns Number in hexadecimal.
 */
declare function rgbToHex(rgb: number[]): number;

/* -------------------------------------------- */

/**
 * Convert a hex color code to an RGB array
 * @param hex - A hex color number
 * @returns An array of [r,g,b] colors normalized on the range of [0,1]
 */
declare function hexToRGB(hex: number): number[];

/* -------------------------------------------- */

/**
 * Convert a hex color code to an RGBA color string which can be used for CSS styling
 * @param hex - A hex color number
 * @param alpha - A level of transparency
 *                (default: `1.0`)
 * @returns An rgba style string
 */
declare function hexToRGBAString(hex: number, alpha?: number): string;

/* -------------------------------------------- */

/**
 * Convert a string color to a hex integer
 * @param color - The string color
 * @returns The hexidecimal color code
 */
declare function colorStringToHex(color: string): number;

/* -------------------------------------------- */
/*  Version Checking
/* -------------------------------------------- */

/**
 * Return whether or not a target version (v1) is more advanced than some other reference version (v0).
 * Supports either numeric or string version comparison with version parts separated by periods.
 * @param v1 - The target version
 * @param v0 - The reference version
 * @returns Is v1 a more advanced version than v0?
 */
declare function isNewerVersion(v1: number | string, v0: number | string): boolean;

/* -------------------------------------------- */

/**
 * Generate a random ID
 * Generate random number and convert it to base 36 and remove the '0.' at the beginning
 * As long as the string is not long enough, generate more random data into it
 * Use substring in case we generated a string with a length higher than the requested length
 *
 * @param length - The length of the random ID to generate
 *                 (default: `10`)
 * @returns Return a string containing random letters and numbers
 */
declare function randomID(length?: number): string;

/* -------------------------------------------- */

declare function benchmark(func: Function, iterations: number): void;

/* -------------------------------------------- */
/*  URL Routing                                 */
/* -------------------------------------------- */

/**
 * Get the URL route for a certain path which includes a path prefix, if one is set
 * @param path   - The Foundry VTT URL path
 * @param prefix - A path prefix to apply
 *                 (default: `null`)
 * @returns The absolute URL path
 */
declare function getRoute(
  path: string,
  {
    prefix
  }?: {
    /**
     * A path prefix to apply
     * @defaultValue `null`
     */
    prefix?: string | null;
  }
): string;

/* -------------------------------------------- */

/**
 * Export data content to be saved to a local file
 * @param data     - Data content converted to a string
 * @param type     - The type of
 * @param filename - The filename of the resulting download
 */
declare function saveDataToFile(data: string, type: string, filename: string): void;

/* -------------------------------------------- */

/**
 * Read text data from a user provided File object
 * @param file - A File object
 * @returns A Promise which resolves to the loaded text data
 */
declare function readTextFromFile(file: File): Promise<string>;

/* -------------------------------------------- */

/**
 * Retrieve an Entity or Embedded Entity by its Universally Unique Identifier (uuid).
 * @param uuid - The uuid of the Entity or Embedded Entity to retrieve
 */
declare function fromUuid(uuid: string): Promise<Entity | object | null>;

/**
 * Support mousewheel control for range type input elements
 * @param event - A Mouse Wheel scroll event
 */
declare function _handleMouseWheelInputChange(event: WheelEvent): void;
