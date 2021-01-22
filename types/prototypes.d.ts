/* -------------------------------------------- */
/*  Math Functions                              */
/* -------------------------------------------- */

declare interface Math {
  /**
   * {@inheritDoc clampNumber}
   */
  clamped: typeof clampNumber

  /**
   * {@inheritDoc roundDecimals}
   */
  decimals: typeof roundDecimals

  /**
   * {@inheritDoc toDegrees}
   */
  toDegrees: typeof toDegrees

  /**
   * {@inheritDoc normalizeDegrees}
   */
  normalizeDegrees: typeof normalizeDegrees

  /**
   * {@inheritDoc toRadians}
   */
  toRadians: typeof toRadians

  /**
   * {@inheritDoc normalizeRadians}
   */
  normalizeRadians: typeof normalizeRadians
}

/* -------------------------------------------- */
/* String Methods                               */
/* -------------------------------------------- */

interface String {
  capitalize: () => string

  titleCase: () => string

  /**
   * Strip any <script> tags which were included within a provided string
   */
  stripScripts: () => string

  /* -------------------------------------------- */

  /**
   * Transform any string into a url-viable slug string
   * @param options     - (default: `{}`)
   * @param replacement - The replacement character to separate terms
   *                      (default: `'-'`)
   * @param strict      - Replace all non-alphanumeric characters, or allow them?
   *                      (default: `false`)
   * @returns The cleaned slug string
   */
  slugify: (options?: {
    /**
     * The replacement character to separate terms
     * @defaultValue `'-'`
     */
    replacement?: string

    /**
     * Replace all non-alphanumeric characters, or allow them?
     * @defaultValue `false`
     */
    strict?: boolean
  }) => string
}

/* -------------------------------------------- */
/* Number Methods                               */
/* -------------------------------------------- */

interface Number {
  ordinalString: () => string

  paddedString: (digits: number) => string

  signedString: () => string

  /**
   * @param inclusive - (default `true`)
   */
  between: (a: number, b: number, inclusive?: boolean) => boolean

  /**
   * Round a number to the nearest number which is a multiple of a given interval
   * @param interval - The interval to round the number to the nearest
   *                   multiple of
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
  toNearest: (interval?: number) => number
}

interface NumberConstructor {
  /**
   * A faster numeric between check which avoids type coercion to the Number object
   * Since this avoids coercion, if non-numbers are passed in unpredictable results will occur. Use with caution.
   * @param inclusive - (default: `true`)
   */
  between: (num: number, a: number, b: number, inclusive?: boolean) => boolean

  /**
   * Test whether a value is numeric
   * This is the highest performing algorithm currently available
   * https://jsperf.com/isnan-vs-typeof/5
   * @param n - A value to test
   * @returns Is it a number?
   */
  isNumeric: (n: any) => boolean
}

/* -------------------------------------------- */
/* Array Methods                                */
/* -------------------------------------------- */

interface ArrayConstructor {
  fromRange: (n: number) => number[]
}

interface Array<T> {
  deepFlatten: () => T[]

  /**
   * Test equality of the values of this array against the values of some other Array
   */
  equals: (other: T[]) => boolean

  /**
   * Partition an original array into two children array based on a logical test
   * Elements which test as false go into the first result while elements testing as true appear in the second
   * @returns An Array of length two whose elements are the partitioned pieces of the original
   */
  partition: (rule: (val: T) => boolean) => [T[], T[]]

  /**
   * Join an Array using a string separator, first filtering out any parts which return a false-y value
   * @param sep - The separator string
   * @returns The joined string, filtered of any false values
   */
  filterJoin: (sep: string) => string

  /**
   * Find an element within the Array and remove it from the array
   * @param find - A function to use as input to findIndex
   * @param replace - A replacement for the spliced element
   * @returns The removed item or null if none was found
   */
  findSplice: (find: (value: any, index: number, obj: any[]) => boolean, replace?: T) => T | null
}

/* -------------------------------------------- */
/* Date Methods                                 */
/* -------------------------------------------- */

interface Date {
  /**
   * Test whether a Date instance is valid.
   * A valid date returns a number for its timestamp, and NaN otherwise.
   * NaN is never equal to itself.
   */
  isValid: () => boolean

  /**
   * Return a standard YYYY-MM-DD string for the Date instance.
   * @returns The date in YYYY-MM-DD format
   */
  toDateInputString: () => string

  /**
   * Return a standard H:M:S.Z string for the Date instance.
   * @returns The time in H:M:S format
   */
  toTimeInputString: () => string
}

/* -------------------------------------------- */
/*  RegExp Helpers                              */
/* -------------------------------------------- */

interface RegExpConstructor {
  escape: (string: string) => string
}
