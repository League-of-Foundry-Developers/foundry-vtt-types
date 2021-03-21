/* -------------------------------------------- */
/*  Math Functions                              */
/* -------------------------------------------- */

declare interface Math {
  /**
   * {@inheritDoc clampNumber}
   */
  clamped: typeof clampNumber;

  /**
   * {@inheritDoc roundDecimals}
   */
  decimals: typeof roundDecimals;

  /**
   * {@inheritDoc toDegrees}
   */
  toDegrees: typeof toDegrees;

  /**
   * {@inheritDoc normalizeDegrees}
   */
  normalizeDegrees: typeof normalizeDegrees;

  /**
   * {@inheritDoc toRadians}
   */
  toRadians: typeof toRadians;

  /**
   * {@inheritDoc normalizeRadians}
   */
  normalizeRadians: typeof normalizeRadians;
}

/* -------------------------------------------- */
/* String Methods                               */
/* -------------------------------------------- */

declare interface String {
  capitalize<S extends string>(this: S): Capitalize<S>;

  titleCase<S extends string>(this: S): Titlecase<S>;

  /**
   * Strip any <script> tags which were included within a provided string
   */
  stripScripts(): string;

  /* -------------------------------------------- */

  /**
   * Transform any string into a url-viable slug string
   * @param replacement - The replacement character to separate terms
   *                      (default: `'-'`)
   * @param strict      - Replace all non-alphanumeric characters, or allow them?
   *                      (default: `false`)
   * @returns The cleaned slug string
   */
  slugify({ replacement, strict }?: { replacement?: string; strict?: boolean }): string;
}

/* -------------------------------------------- */
/* Number Methods                               */
/* -------------------------------------------- */

declare interface Number {
  ordinalString(): string;

  paddedString(digits: number): string;

  signedString(): string;

  between(a: number, b: number, inclusive?: boolean): boolean;

  /**
   * Round a number to the nearest number which is a multiple of a given interval
   * @param interval - The interval to round the number to the nearest multiple of
   *                   (default: `1`)
   * @returns The rounded number
   *
   * @example
   * ```typescript
   * let n = 17.18;
   * n.toNearest(5); // 15
   * n.toNearest(10); // 20
   * n.toNearest(0.25); // 17.25
   * ```
   */
  toNearest(interval?: number): number;
}

declare interface NumberConstructor {
  /**
   * A faster numeric between check which avoids type coercion to the Number object
   * Since this avoids coercion, if non-numbers are passed in unpredictable results will occur. Use with caution.
   * @param inclusive - (default: `true`)
   */
  between(num: number, a: number, b: number, inclusive?: boolean): boolean;

  /**
   * Test whether a value is numeric
   * This is the highest performing algorithm currently available
   * https://jsperf.com/isnan-vs-typeof/5
   * @param n - A value to test
   * @returns Is it a number?
   */
  isNumeric(n: unknown): n is number;
}

/* -------------------------------------------- */
/* Array Methods                                */
/* -------------------------------------------- */

declare interface ArrayConstructor {
  fromRange(n: number): number[];
}

declare interface Array<T> {
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

/* -------------------------------------------- */
/* Date Methods                                 */
/* -------------------------------------------- */

declare interface Date {
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

/* -------------------------------------------- */
/*  RegExp Helpers                              */
/* -------------------------------------------- */

declare interface RegExpConstructor {
  escape(string: string): string;
}

declare interface JQuery {
  shake(shakes: number, distance: number, duration: number): JQuery;
}
