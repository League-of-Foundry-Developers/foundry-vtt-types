export {};

declare global {
  interface Math {
    /**
     * √3
     * @remarks Created with `defineProperties` with no options other than `value` specified, making it
     * `writeable: false, enumerable: false, configurable: false` by default
     */
    readonly SQRT3: 1.7320508075688772;

    /**
     * √⅓
     * @remarks Created with `defineProperties` with no options other than `value` specified, making it
     * `writeable: false, enumerable: false, configurable: false` by default
     */
    readonly SQRT1_3: 0.5773502691896257;

    /**
     * Bound a number between some minimum and maximum value, inclusively.
     * @param num - The current value
     * @param min - The minimum allowed value
     * @param max - The maximum allowed value
     * @returns The clamped number
     */
    clamp(num: number, min: number, max: number): number;

    /**
     * Bound a number between some minimum and maximum value, inclusively
     * @param num - The current value
     * @param min - The minimum allowed value
     * @param max - The maximum allowed value
     * @returns The clamped number
     * @deprecated "Math.clamped is deprecated in favor of {@linkcode Math.clamp}." (since v12, until v14)
     */
    clamped(num: number, min: number, max: number): number;

    /**
     * Linear interpolation function
     * @param a - An initial value when weight is 0.
     * @param b - A terminal value when weight is 1.
     * @param w - A weight between 0 and 1.
     * @returns The interpolated value between a and b with weight w.
     */
    mix(a: number, b: number, w: number): number;

    /**
     * Transform an angle in degrees to be bounded within the domain [0, 360)
     * @param degrees - An angle in degrees
     * @returns The same angle on the range [0, 360)
     */
    normalizeDegrees(degrees: number): number;

    /**
     * Transform an angle in degrees to be bounded within the domain [0, 360]
     * @param degrees - An angle in degrees
     * @param base    - The base angle to normalize to, either 0 for [0, 360) or 360 for (0, 360]
     * @returns The same angle on the range [0, 360) or (0, 360]
     * @deprecated "`Math.normalizeDegrees(degrees, base)` is deprecated." (since v12, until v14)
     * @remarks Despite the parameter description, passing *any* non-`undefined` value for `base` changes behaviour.
     * This is accurate to the behaviour in v11 and earlier, it's unclear why this wasn't originally a boolean.
     */
    normalizeDegrees(degrees: number, base: number): number;

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
     * @deprecated "`Math.roundDecimals` is deprecated." (since v12, until v14)
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

    /**
     * Get an oscillation between lVal and hVal according to t
     * @param  minVal - The minimal value of the oscillation.
     * @param  maxVal - The maximum value of the oscillation.
     * @param  t      - The time value.
     * @param  p      - The period (must be nonzero). (default: `1`)
     * @param  fn     - The optional math function to use for oscillation.  Its period must be 2π (default: `Math.cos`)
     * @returns The oscillation according to t. `((maxVal - minVal) * (fn(2π * t / p) + 1) / 2) + minVal`
     */
    oscillation(
      minVal: number,
      maxVal: number,
      t: number,
      p?: number,

      /** @immediate */
      fn?: (radians: number) => number,
    ): number;
  }
}
