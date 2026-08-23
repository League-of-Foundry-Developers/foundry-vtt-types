import type * as primitives from "./primitives/_module.d.mts";

// The prototype and constructor extensions installed by the `primitives/` modules. Each member points at the
// export that provides it -- see the module for its documentation -- except the two noted inline.
declare global {
  namespace Array {
    type Flattened<T> = T extends Array<infer U> ? Flattened<U> : T;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Array<T> {
    deepFlatten: typeof primitives.Array.deepFlatten;
    equals: typeof primitives.Array.equals;
    partition: typeof primitives.Array.partition;
    filterJoin: typeof primitives.Array.filterJoin;
    findSplice: typeof primitives.Array.findSplice;
  }

  interface ArrayConstructor {
    fromRange: typeof primitives.Array.fromRange;
  }

  interface Date {
    isValid: typeof primitives.Date.isValid;
    toDateInputString: typeof primitives.Date.toDateInputString;
    toTimeInputString: typeof primitives.Date.toTimeInputString;
  }

  interface Math {
    readonly SQRT3: typeof primitives.Math.SQRT3;
    readonly SQRT1_3: typeof primitives.Math.SQRT1_3;
    clamp: typeof primitives.Math.clamp;

    // See `primitives/math.d.mts` for why this is commented out.
    // clamped: typeof primitives.Math.clamped;

    mix: typeof primitives.Math.mix;
    nextAfter: typeof primitives.Math.nextAfter;
    nextDown: typeof primitives.Math.nextDown;
    nextUp: typeof primitives.Math.nextUp;
    normalizeDegrees: typeof primitives.Math.normalizeDegrees;
    normalizeRadians: typeof primitives.Math.normalizeRadians;

    // See `primitives/math.d.mts` for why this is commented out.
    // roundDecimals: typeof primitives.Math.roundDecimals;

    toDegrees: typeof primitives.Math.toDegrees;
    toRadians: typeof primitives.Math.toRadians;
    oscillation: typeof primitives.Math.oscillation;
  }

  interface Number {
    almostEqual: typeof primitives.Number.almostEqual;
    ordinalString: typeof primitives.Number.ordinalString;
    paddedString: typeof primitives.Number.paddedString;
    signedString: typeof primitives.Number.signedString;
    toNearest: typeof primitives.Number.toNearest;
    between: typeof primitives.Number.between;
  }

  interface NumberConstructor {
    /**
     * @see {@linkcode Number#between}
     *
     * @privateRemarks A separate four-argument function (`Number.between = function(num, a, b, inclusive)`), not
     * the module's three-argument `between` export. Foundry's own `@ignore` leaves it undeclared; we don't.
     */
    between(num: number, a: number, b: number, inclusive?: boolean): boolean;

    isNumeric: typeof primitives.Number.isNumeric;
    fromString: typeof primitives.Number.fromString;
  }

  // `primitives.RegExp` no longer exists: v14 deleted `common/primitives/regexp.mjs`. `RegExp.escape` is
  // native as of ES2025, so it already resolves from the standard library on this package's `ESNext` target.
  // interface RegExpConstructor {
  //   escape: typeof primitives.RegExp.escape;
  // }

  interface Set<T> {
    equals: typeof primitives.Set.equals;
    first: typeof primitives.Set.first;
    intersects: typeof primitives.Set.intersects;

    // eslint-disable-next-line @typescript-eslint/no-deprecated
    isSubset: typeof primitives.Set.isSubset;

    toObject: typeof primitives.Set.toObject;

    /**
     * @privateRemarks Spelled out rather than pointed at the export because the narrowing overload returns a
     * `this`-based type predicate, which is only expressible on a method signature.
     */
    every<S extends T>(/** @immediate */ test: (value: T, index: number, set: Set<T>) => value is S): this is Set<S>;
    every(/** @immediate */ test: (value: T, index: number, set: Set<T>) => boolean): boolean;

    filter: typeof primitives.Set.filter;
    find: typeof primitives.Set.find;
    map: typeof primitives.Set.map;

    /**
     * @privateRemarks Spelled out because the export's own `T` type parameter would force
     * `set.reduce<Accumulator>(...)` to supply it explicitly instead of inferring it from `this`.
     */
    reduce<V>(/** @immediate */ reducer: (accumulator: V, value: T, index: number, set: Set<T>) => V, initial: V): V;

    some: typeof primitives.Set.some;
  }

  interface String {
    capitalize: typeof primitives.String.capitalize;
    compare: typeof primitives.String.compare;
    titleCase: typeof primitives.String.titleCase;
    stripDiacritics: typeof primitives.String.stripDiacritics;
    stripScripts: typeof primitives.String.stripScripts;
    slugify: typeof primitives.String.slugify;
  }

  // Non-functional due to upstream
  // https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1379
  // Foundry deprecated its override in v14 in favour of the native `URL.parse`
  // (https://developer.mozilla.org/en-US/docs/Web/API/URL/parse_static), which is a drop-in replacement
  // const URL: {
  //   prototype: URL;
  //   new (url: string | URL, base?: string | URL): URL;
  //   createObjectURL(obj: Blob | MediaSource): string;
  //   revokeObjectURL(url: string): void;
  //   canParse(url: string | URL, base?: string | URL): boolean;
  //   parse(url: string | URL, base?: string | URL): URL | null;
  //   parseSafe: typeof primitives.URL.parseSafe;
  // };

  interface ObjectConstructor {
    /**
     * Prevents the modification of existing property attributes and values, and prevents the addition of new properties.
     * @param o - Object on which to lock the attributes.
     */
    freeze<const T>(o: T): Readonly<T>;
  }
}
