interface Math {
  /**
   * Bound a number between some minimum and maximum value, inclusively
   * @param num - The current value
   * @param min - The minimum allowed value
   * @param max - The maximum allowed value
   * @returns The clamped number
   */
  clamped(num: number, min: number, max: number): number;

  /**
   * Transform an angle in degrees to be bounded within the domain [0, 360]
   * @param degrees - An angle in degrees
   * @returns The same angle on the range [0, 360]
   */
  normalizeDegrees(degrees: number): number;

  /**
   * Transform an angle in radians to be bounded within the domain [-PI, PI]
   * @param radians - An angle in degrees
   * @returns The same angle on the range [-PI, PI]
   */
  normalizeRadians(radians: number): number;

  /**
   * Round a floating point number to a certain number of decimal places
   * @param number - A floating point number
   * @param places - An integer number of decimal places
   */
  roundDecimals(number: number, places: number): number;

  /**
   * Transform an angle in radians to a number in degrees
   * @param angle - An angle in radians
   * @returns An angle in degrees
   */
  toDegrees(angle: number): number;

  /**
   * Transform an angle in degrees to an angle in radians
   * @param angle - An angle in degrees
   * @returns An angle in radians
   */
  toRadians(angle: number): number;
}

interface Set<T> {
  /**
   * Test whether this set is equal to some other set.
   * Sets are equal if they share the same members, independent of order
   * @param other - Some other set to compare against
   * @returns Are the sets equal?
   */
  equals(other: Set<T>): boolean;

  /**
   * Return the first value from the set.
   * @returns The first element in the set, or undefined
   */
  first(): T | undefined;

  /**
   * Return the intersection of two sets.
   * @param other - Some other set to compare against
   * @returns The intersection of both sets
   */
  intersection(other: Set<T>): Set<T>;

  /**
   * Test whether this set has an intersection with another set.
   * @param other - Another set to compare against
   * @returns Do the sets intersect?
   */
  intersects(other: Set<T>): boolean;

  /**
   * Test whether this set is a subset of some other set.
   * A set is a subset if all its members are also present in the other set.
   * @param other - Some other set that may be a subset of this one
   * @returns Is the other set a subset of this one?
   */
  isSubset(other: Set<T>): boolean;
}

interface String {
  /**
   * Capitalize a string, transforming it's first character to a capital letter
   */
  capitalize<S extends string>(this: S): Capitalize<S>;

  /**
   * Convert a string to Title Case where the first letter of each word is capitalized
   */
  titleCase<S extends string>(this: S): Titlecase<S>;

  /**
   * Strip any <script> tags which were included within a provided string
   */
  stripScripts(): string;

  /**
   * Transform any string into a url-viable slug string
   * @param options - Optional arguments which customize how the slugify operation is performed
   * @returns The cleaned slug string
   */
  slugify(options?: String.SlugifyOptions): string;
}

declare namespace String {
  interface SlugifyOptions {
    /**
     * The replacement character to separate terms
     * @defaultValue `'-'`
     */
    replacement?: string;

    /**
     * Replace all non-alphanumeric characters, or allow them?
     * @defaultValue `false`
     */
    strict?: boolean;
  }
}

interface Number {
  /**
   * Test for near-equivalence of two numbers within some permitted epsilon
   * @param n - Some other number
   * @param e - Some permitted epsilon, by default 1e-8
                (default: `1e-8`)
   * @returns Are the numbers almost equal?
   */
  almostEqual(n: number, e?: number): boolean;

  /**
   * Transform a number to an ordinal string representation. i.e.
   * ```
   * 1 => 1st
   * 2 => 2nd
   * 3 => 3rd
   * ```
   */
  ordinalString(): string;

  /**
   * Return a string front-padded by zeroes to reach a certain number of numeral characters
   * @param digits - The number of characters desired
   * @returns The zero-padded number
   */
  paddedString(digits: number): string;

  /**
   * Return a string prefaced by the sign of the number (+) or (-)
   * @returns The signed number as a string
   */
  signedString(): string;

  /**
   * Round a number to the nearest number which is a multiple of a given interval
   * @param interval - The interval to round the number to the nearest multiple of
   *                   (default: `1`)
   * @param method   - The rounding method in: round, ceil, floor
   *                   (default: `'round'`)
   * @returns The rounded number
   *
   * @example
   * ```typescript
   * let n = 17.18;
   * n.toNearest(5); // 15
   * n.toNearest(10); // 20
   * n.toNearest(10, "floor"); // 10
   * n.toNearest(10, "ceil"); // 20
   * n.toNearest(0.25); // 17.25
   * ```
   */
  toNearest(interval?: number, method?: 'round' | 'ceil' | 'floor'): number;

  /**
   * A faster numeric between check which avoids type coercion to the Number object
   * Since this avoids coercion, if non-numbers are passed in unpredictable results will occur. Use with caution.
   * @param inclusive - (default: `true`)
   */
  between(a: number, b: number, inclusive?: boolean): boolean;
}

interface NumberConstructor {
  /**
   * A faster numeric between check which avoids type coercion to the Number object
   * Since this avoids coercion, if non-numbers are passed in unpredictable results will occur. Use with caution.
   * @param inclusive - (default: `true`)
   */
  between(num: number, a: number, b: number, inclusive?: boolean): boolean;

  /**
   * Test whether a value is numeric
   * This is the highest performing algorithm currently available, per https://jsperf.com/isnan-vs-typeof/5
   * @param n - A value to test
   * @returns Is it a number?
   */
  isNumeric(n: unknown): boolean;

  /**
   * Attempt to create a number from a user-provided string.
   * @param n - The value to convert; typically a string, but may already be a number.
   * @returns The number that the string represents, or NaN if no number could be determined.
   */
  fromString(str: string | number): number;
}

interface ArrayConstructor {
  /**
   * Create and initialize an array of length n with integers from 0 to n-1
   * @param n - The desired array length
   * @returns An array of integers from 0 to n
   */
  fromRange(n: number): number[];
}

interface Array<T> {
  /**
   * Flatten nested arrays by concatenating their contents
   * @returns An array containing the concatenated inner values
   */
  deepFlatten(): Array<Array.Flattened<T>>;

  /**
   * Test equality of the values of this array against the values of some other Array
   */
  equals(other: T[]): boolean;

  /**
   * Partition an original array into two children array based on a logical test
   * Elements which test as false go into the first result while elements testing as true appear in the second
   * @param rule - The rule to partition by
   * @returns An Array of length two whose elements are the partitioned pieces of the original
   */
  partition(rule: (val: T) => boolean): [T[], T[]];

  /**
   * Join an Array using a string separator, first filtering out any parts which return a false-y value
   * @param sep - The separator string
   * @returns The joined string, filtered of any false values
   */
  filterJoin(sep: string): string;

  /**
   * Find an element within the Array and remove it from the array
   * @param find - A function to use as input to findIndex
   * @param replace - A replacement for the spliced element
   * @returns The replacement element, the removed element, or null if no element was found.
   */
  findSplice(find: (value: T, index: number, obj: T[]) => boolean, replace?: T): T | null;
}

declare namespace Array {
  type Flattened<T> = T extends Array<infer U> ? Flattened<U> : T;
}

interface Date {
  /**
   * Test whether a Date instance is valid.
   * A valid date returns a number for its timestamp, and NaN otherwise.
   * NaN is never equal to itself.
   */
  isValid(): boolean;

  /**
   * Return a standard YYYY-MM-DD string for the Date instance.
   * @returns The date in YYYY-MM-DD format
   */
  toDateInputString(): string;

  /**
   * Return a standard H:M:S.Z string for the Date instance.
   * @returns The time in H:M:S format
   */
  toTimeInputString(): string;
}

interface RegExpConstructor {
  /**
   * Escape a given input string, prefacing special characters with backslashes for use in a regular expression
   * @param string - The un-escaped input string
   * @returns  The escaped string, suitable for use in regular expression
   */
  escape(string: string): string;
}
