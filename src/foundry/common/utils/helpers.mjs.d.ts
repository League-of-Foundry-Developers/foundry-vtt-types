import type { TypeOfTag } from "typescript/lib/typescript";

/**
 * Benchmark the performance of a function, calling it a requested number of iterations.
 * @param func       - The function to benchmark
 * @param iterations - The number of iterations to test
 * @param args       - Additional arguments passed to the benchmarked function
 */
export declare function benchmark<F extends (...args: any[]) => unknown>(
  func: F,
  iterations: number,
  ...args: Parameters<F>
): Promise<void>;

/**
 * A debugging function to test latency or timeouts by forcibly locking the thread for an amount of time.
 * @param ms - A number of milliseconds to lock
 * @param debug - (default: `false`)
 * @returns
 */
export function threadLock(ms: number, debug?: boolean): Promise<void>;

/**
 * Wrap a callback in a debounced timeout.
 * Delay execution of the callback function until the function has not been called for delay milliseconds
 * @param callback - A function to execute once the debounced threshold has been passed
 * @param delay    - An amount of time in milliseconds to delay
 * @returns A wrapped function which can be called to debounce execution
 */
export declare function debounce<T extends (...args: any[]) => unknown>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void;

/**
 * A utility function to reload the page with a debounce.
 */
export const debouncedReload: VoidFunction;

/**
 * Quickly clone a simple piece of data, returning a copy which can be mutated safely.
 * This method DOES support recursive data structures containing inner objects or arrays.
 * This method DOES NOT support advanced object types like Set, Map, or other specialized classes.
 * @param original - Some sort of data
 * @param options  - Options to configure the behaviour of deepClone
 * @returns The clone of that data
 */
export declare function deepClone<T>(original: T, options?: DeepCloneOptions): T;

interface DeepCloneOptions {
  /**
   * Throw an Error if deepClone is unable to clone something instead of returning the original
   * @defaultValue `false`
   */
  strict?: boolean;
}

/**
 * Deeply difference an object against some other, returning the update keys and values
 * @param original - An object comparing data against which to compare.
 * @param other    - An object containing potentially different data.
 * @param options  - Additional options which configure the diff operation
 * @returns An object of the data in other which differs from that in original.
 */
export declare function diffObject(original: object, other: object, options?: DiffObjectOptions): object;

interface DiffObjectOptions {
  /**
   * Only recognize differences in other for keys which also exist in original
   * @defaultValue `false`
   */
  inner?: boolean;

  /**
   * Apply special logic to deletion keys. They will only be kept if the original object has a
   * corresponding key that could be deleted.
   * @defaultValue `false`
   */
  deletionKeys?: boolean;
}

/**
 * Test if two objects contain the same enumerable keys and values.
 * @param a - The first object.
 * @param b - The second object.
 */
export function objectsEqual(a: object, b: object): boolean;

/**
 * A cheap data duplication trick which is relatively robust.
 * For a subset of cases the deepClone function will offer better performance.
 * @param original - Some sort of data
 * @typeParam T    - Type of the original data.
 *
 * @remarks This function will actually convert any occurrences of `NaN` and `Infinity` to `null`. For ease of use, this
 * is _not_ reflected in the type. Be careful if your types might contain `NaN` or `Infinity`!
 */
export declare function duplicate<T>(original: T): Duplicated<T>;

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
 * @internal
 */
type MapToInnerDuplicated<T extends object> = { [k in keyof T]: InnerDuplicated<T[k]> };

/**
 * Internal helper type for {@link Duplicated}. It is the main part of the implementation, which does the recursion.
 *
 * @typeParam T - Type currently being converted.
 * @internal
 */
// prettier-ignore
type InnerDuplicated<T> = T extends { toJSON(): infer U }
   ? U extends Array<unknown>
     ? InnerDuplicated<U>
     : U extends object
       ? InnerDuplicated<Omit<U, "toJSON">>
       : InnerDuplicated<U>
   : T extends NonStringifiable
     ? undefined
     : T extends Array<unknown>
       ? MapToInnerDuplicated<MapTypeToType<T, NonStringifiable, null>>
       : T extends object
         ? MapToInnerDuplicated<
           OmitAssignableFromType<MapTypeToType<T, NonStringifiable, undefined>, undefined> &
             Partial<OmitOfType<OmitNotAssignableFromType<MapTypeToType<T, NonStringifiable, undefined>, undefined>, undefined>>
           >
         : T;

/**
 * The resulting type when using {@link duplicate} on some data of type `T`.
 *
 * @typeParam T - Original type.
 * @internal
 */
export type Duplicated<T> = T extends NonStringifiable ? never : InnerDuplicated<T>;

/**
 * Test whether some class is a subclass of a parent.
 * Returns true if the classes are identical.
 * @param cls    - The class to test
 * @param parent - Some other class which may be a parent
 * @returns Is the class a subclass of the parent?
 */
export declare function isSubclass(
  cls: new (...args: any[]) => unknown,
  parent: new (...args: any[]) => unknown
): boolean;

/**
 * Encode a url-like string by replacing any characters which need encoding
 * @param path - A fully-qualified URL or url component (like a relative path)
 * @returns An encoded URL string
 */
export declare function encodeURL(path: string): string;

/**
 * Expand a flattened object to be a standard multi-dimensional nested Object by converting all dot-notation keys to
 * inner objects.
 *
 * @param obj - The object to expand
 * @param _d  - Track the recursion depth to prevent overflow
 *              (default: `0`)
 * @returns An expanded object
 */
export declare function expandObject(obj: object, _d?: number): any;

/**
 * Filter the contents of some source object using the structure of a template object.
 * Only keys which exist in the template are preserved in the source object.
 *
 * @param source   - An object which contains the data you wish to filter
 * @param template - An object which contains the structure you wish to preserve
 * @param options  - Additional options which customize the filtration
 *                   (default: `{}`)
 *
 * @example Filter an object
 * ```typescript
 * const source = {foo: {number: 1, name: "Tim", topping: "olives"}, bar: "baz"};
 * const template = {foo: {number: 0, name: "Mit", style: "bold"}, other: 72};
 * filterObject(source, template); // {foo: {number: 1, name: "Tim"}};
 * filterObject(source, template, {templateValues: true}); // {foo: {number: 0, name: "Mit"}};
 * ```
 */
export declare function filterObject(source: object, template: object, options?: FilterObjectOptions): any;

interface FilterObjectOptions {
  /**
   * Whether to keep deletion keys
   * @defaultValue `false`
   */
  deletionKeys?: boolean;

  /**
   * Instead of keeping values from the source, instead draw values from the template
   * @defaultValue `false`
   */
  templateValues?: boolean;
}

/**
 * Flatten a possibly multi-dimensional object to a one-dimensional one by converting all nested keys to dot notation
 * @param obj - The object to flatten
 * @param d   - Track the recursion depth to prevent overflow
 * @returns A flattened object
 */
export declare function flattenObject(obj: object, _d?: number): any;

/**
 * Obtain references to the parent classes of a certain class.
 * @param cls - An ES6 Class definition
 * @returns An array of parent Classes which the provided class extends
 */
export declare function getParentClasses(cls: ConstructorOf<any>): Array<ConstructorOf<any>>;

/**
 * Get the URL route for a certain path which includes a path prefix, if one is set
 * @param path   - The Foundry URL path
 * @param prefix - A path prefix to apply
 *                 (default: `null`)
 * @returns The absolute URL path
 */
export declare function getRoute(
  path: string,
  {
    prefix
  }?: {
    prefix?: string | null;
  }
): string;

/**
 * Learn the underlying data type of some variable. Supported identifiable types include:
 * undefined, null, number, string, boolean, function, Array, Set, Map, Promise, Error,
 * HTMLElement (client side only), Object (catchall for other object types)
 * @param variable - A provided variable
 * @returns The named type of the token
 */
export function getType(
  variable: unknown
): Exclude<TypeOfTag, "object"> | "null" | "Object" | "Array" | "Set" | "Map" | "Promise" | "Error" | "HTMLElement";

/**
 * A helper function which tests whether an object has a property or nested property given a string key.
 * The string key supports the notation a.b.c which would return true if object[a][b][c] exists
 * @param object - The object to traverse
 * @param key    - An object property with notation a.b.c
 * @returns An indicator for whether the property exists
 */
export declare function hasProperty(object: object, key: string): boolean;

/**
 * A helper function which searches through an object to retrieve a value by a string key.
 * The string key supports the notation a.b.c which would return object[a][b][c]
 * @param object - The object to traverse
 * @param key    - An object property with notation a.b.c
 * @returns The value of the found property
 */
export declare function getProperty(object: object, key: string): any;

/**
 * A helper function which searches through an object to assign a value using a string key
 * This string key supports the notation a.b.c which would target object[a][b][c]
 * @param object - The object to update
 * @param key    - The string key
 * @param value  - The value to be assigned
 * @returns Whether the value was changed from its previous value
 */
export declare function setProperty(object: object, key: string, value: any): boolean;

/**
 * Invert an object by assigning its values as keys and its keys as values.
 * @param obj - The original object to invert
 * @returns The inverted object with keys and values swapped
 */
export declare function invertObject<T extends Record<string | number | symbol, string | number | symbol>>(
  obj: T
): { [Key in keyof T as T[Key]]: Key };

/**
 * Return whether a target version (v1) is more advanced than some other reference version (v0).
 * Supports either numeric or string version comparison with version parts separated by periods.
 * @param v1 - The target version
 * @param v0 - The reference version
 * @returns Is v1 a more advanced version than v0?
 */
export declare function isNewerVersion(v1: number | string, v0: number | string): boolean;

/**
 * A simple function to test whether an Object is empty
 * @param obj - The object to test
 * @returns Is the object empty?
 * @deprecated since v10, will be removed in v11 - Use isEmpty instead.
 */
export declare function isObjectEmpty(obj: object): boolean;

/**
 * Test whether a value is empty-like; either undefined or a content-less object.
 * @param value - The value to test
 * @returns Is the value empty-like?
 */
export function isEmpty(value: undefined | null | unknown[] | object | Set<unknown> | Map<unknown, unknown>): boolean;

type OmitByValue<T, ValueType> = { [Key in keyof T as T[Key] extends ValueType ? never : Key]: T[Key] };
type RemoveNever<T> = OmitByValue<T, never>;
type PropWithMinus<K> = K extends string ? `-=${K}` : never;
type DeleteByObjectKeys<T, U, M extends MergeObjectOptions> = M["performDeletions"] extends true
  ? RemoveNever<{
      [K in keyof T]: PropWithMinus<K> extends keyof U ? (U[PropWithMinus<K>] extends null ? never : T[K]) : T[K];
    }>
  : T;
type RemoveDeletingObjectKeys<T, M extends MergeObjectOptions> = M["performDeletions"] extends true
  ? RemoveNever<{
      [K in keyof T]: K extends string ? (Capitalize<K> extends K ? (T[K] extends null ? never : T[K]) : T[K]) : T[K];
    }>
  : T;

type MergeObjectProperty<T, U, M extends MergeObjectOptions> = T extends Array<any>
  ? U
  : T extends Record<string, any>
  ? U extends Record<string, any>
    ? M extends { recursive: false }
      ? U
      : Result<
          T,
          U,
          Omit<M, "insertKeys" | "performDeletions"> & {
            insertKeys: M["insertValues"];
            performDeletions: M["performDeletions"] extends true ? true : false;
          }
        >
    : U
  : U;
type UpdateKeys<T, U, M extends MergeObjectOptions> = M extends { overwrite: false }
  ? T
  : { [K in keyof T]: K extends keyof U ? MergeObjectProperty<T[K], U[K], M> : T[K] };
type InsertKeys<T, U> = T & Omit<U, keyof T>;
type UpdateInsert<T, U, M extends MergeObjectOptions> = M extends { insertKeys: false }
  ? UpdateKeys<T, U, M>
  : InsertKeys<UpdateKeys<T, U, M>, U>;
type Result<T, U, M extends MergeObjectOptions> = UpdateInsert<
  DeleteByObjectKeys<T, U, M>,
  RemoveDeletingObjectKeys<U, M>,
  M
>;

type WithWidenedArrayTypes<T> = T extends Array<any>
  ? Array<any>
  : T extends Record<string, any>
  ? { [K in keyof T]: WithWidenedArrayTypes<T[K]> }
  : T;

/**
 * Update a source object by replacing its keys and values with those from a target object.
 *
 * @param original - The initial object which should be updated with values from the target
 * @param other    - A new object whose values should replace those in the source
 *                   (default: `{}`)
 * @param options  - Additional options which configure the merge
 *                   (default: `{}`)
 * @param _d       - A privately used parameter to track recursion depth.
 *                   (default: `0`)
 * @returns The original source object including updated, inserted, or overwritten records.
 *
 * @example Control how new keys and values are added
 * ```typescript
 * mergeObject({k1: "v1"}, {k2: "v2"}, {insertKeys: false}); // {k1: "v1"}
 * mergeObject({k1: "v1"}, {k2: "v2"}, {insertKeys: true});  // {k1: "v1", k2: "v2"}
 * mergeObject({k1: {i1: "v1"}}, {k1: {i2: "v2"}}, {insertValues: false}); // {k1: {i1: "v1"}}
 * mergeObject({k1: {i1: "v1"}}, {k1: {i2: "v2"}}, {insertValues: true}); // {k1: {i1: "v1", i2: "v2"}}
 * ```
 *
 * @example Control how existing data is overwritten
 * ```typescript
 * mergeObject({k1: "v1"}, {k1: "v2"}, {overwrite: true}); // {k1: "v2"}
 * mergeObject({k1: "v1"}, {k1: "v2"}, {overwrite: false}); // {k1: "v1"}
 * ```
 *
 * @example Control whether merges are performed recursively
 * ```typescript
 * mergeObject({k1: {i1: "v1"}}, {k1: {i2: "v2"}}, {recursive: false}); // {k1: {i1: "v2"}}
 * mergeObject({k1: {i1: "v1"}}, {k1: {i2: "v2"}}, {recursive: true}); // {k1: {i1: "v1", i2: "v2"}}
 * ```
 *
 * @example Deleting an existing object key
 * ```typescript
 * mergeObject({k1: "v1", k2: "v2"}, {"-=k1": null});   // {k2: "v2"}
 * ```
 */
export declare function mergeObject<
  T extends object,
  U extends DeepPartial<WithWidenedArrayTypes<T>>,
  M extends MergeObjectOptions & { enforceTypes: true }
>(original: T, other?: U, options?: M, _d?: number): Result<T, U, M>;
export declare function mergeObject<
  T extends object,
  U extends DeepPartial<Record<keyof T, never>> & object,
  M extends MergeObjectOptions & { enforceTypes: true }
>(original: T, other?: U, options?: M, _d?: number): Result<T, U, M>;
export declare function mergeObject<
  T extends object,
  U extends object,
  M extends MergeObjectOptions & { enforceTypes: true }
>(original: T, other?: U, options?: M, _d?: number): never;
export declare function mergeObject<T extends object, U extends object, M extends MergeObjectOptions>(
  original: T,
  other?: U,
  options?: M,
  _d?: number
): Result<T, U, M>;

interface MergeObjectOptions {
  /**
   * Control whether to insert new top-level objects into the resulting structure which do not previously exist in the original object.
   * @defaultValue `true`
   */
  insertKeys?: boolean | undefined;

  /**
   * Control whether to insert new nested values into child objects in the resulting structure which did not previously exist in the original object.
   * @defaultValue `true`
   */
  insertValues?: boolean | undefined;

  /**
   * Control whether to replace existing values in the source, or only merge values which do not already exist in the original object.
   * @defaultValue `true`
   */
  overwrite?: boolean | undefined;

  /**
   * Control whether to merge inner-objects recursively (if true), or whether to simply replace inner objects with a provided new value.
   * @defaultValue `true`
   */
  recursive?: boolean | undefined;

  /**
   * Control whether to apply updates to the original object in-place (if true), otherwise the original object is duplicated and the copy is merged.
   * @defaultValue `true`
   */
  inplace?: boolean | undefined;

  /**
   * Control whether strict type checking requires that the value of a key in the other object must match the data type in the original data to be merged.
   * @defaultValue `false`
   */
  enforceTypes?: boolean | undefined;

  /**
   * Control whether to perform deletions on the original object if deletion keys are present in the other object.
   * @defaultValue `false`
   */
  performDeletions?: boolean; //TODO: implement this in the mergeObject return type
}

/**
 * A helper function for merging objects when the target key does not exist in the original
 * @internal
 */
declare function _mergeInsert(
  original: object,
  k: string,
  v: unknown,
  options: Pick<MergeObjectOptions, "insertKeys" | "insertValues" | "performDeletions"> | undefined,
  _d: number
): void;

/**
 * A helper function for merging objects when the target key exists in the original
 * @internal
 */
declare function _mergeUpdate(
  original: object,
  k: string,
  v: unknown,
  options: MergeObjectOptions | undefined,
  _d: number
): void;

/**
 * Parse an S3 key to learn the bucket and the key prefix used for the request.
 * @param key - A fully qualified key name or prefix path.
 */
export function parseS3URL(key: string): { bucket: string | null; keyPrefix: string };

/**
 * Generate a random string ID of a given requested length.
 * @param length - The length of the random ID to generate
 *                 (default: `16`)
 * @returns Return a string containing random letters and numbers
 */
export declare function randomID(length?: number): string;

/**
 * Express a timestamp as a relative string
 * @param timeStamp - A timestamp string or Date object to be formatted as a relative time
 * @returns A string expression for the relative time
 */
export declare function timeSince(timeStamp: Date | string): string;

/**
 * Converts an RGB color value to HSV. Conversion formula adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 1] and returns h, s, and v in the set [0, 1].
 * @param r - The red color value
 * @param g - The green color value
 * @param b - The blue color value
 * @returns The HSV representation
 * @deprecated since v10, rgbToHsv is deprecated in favor of {@link foundry.utils.Color#hsv}
 */
export declare function rgbToHsv(r: number, g: number, b: number): [h: number, s: number, v: number];

/**
 * Converts an HSV color value to RGB. Conversion formula adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and returns r, g, and b in the set [0, 1].
 * @param h - The hue
 * @param s - The saturation
 * @param v - The value
 * @returns The RGB representation
 * @deprecated since v10, hsvToRgb is deprecated in favor of {@link foundry.utils.Color.fromHSV}
 */
export declare function hsvToRgb(h: number, s: number, v: number): [r: number, g: number, b: number];

/**
 * Converts a color as an [R, G, B] array of normalized floats to a hexadecimal number.
 * @param rgb - Array of numbers where all values are normalized floats from 0.0 to 1.0.
 * @returns The numeric color as hexadecimal
 * @deprecated since v10, rgbToHex is deprecated in favor of {@link foundry.utils.Color.fromRGB}
 */
export declare function rgbToHex(rgb: [r: number, g: number, b: number]): number;

/**
 * Convert a hex color code to an RGB array
 * @param hex - A hex color number
 * @returns An array of [r,g,b] colors normalized on the range of [0,1]
 * @deprecated since v10, hexToRGB is deprecated in favor of {@link foundry.utils.Color#rgb}
 */
export declare function hexToRGB(hex: number): [r: number, g: number, b: number];

/**
 * Convert a hex color code to an RGBA color string which can be used for CSS styling
 * @param hex   - A hex color number
 * @param alpha - An optional level of transparency
 *                (default: `1.0`)
 * @returns An rgba style string
 * @deprecated since v10, hexToRGBAString is deprecated in favor of {@link foundry.utils.Color#toRGBA}
 */
export declare function hexToRGBAString(hex: number, alpha?: number): `rgba(${number}, ${number}, ${number})`;

/**
 * Convert a string color to a hex integer
 * @param color - The string color
 * @returns The hexadecimal color code
 * @deprecated since v10, colorStringToHex is deprecated in favor of {@link foundry.utils.Color.from}
 */
export declare function colorStringToHex(color: string): number | null;
