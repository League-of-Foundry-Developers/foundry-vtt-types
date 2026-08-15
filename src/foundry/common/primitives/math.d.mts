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
     * Linear interpolation function
     * @param a - An initial value when weight is 0.
     * @param b - A terminal value when weight is 1.
     * @param w - A weight between 0 and 1.
     * @returns The interpolated value between a and b with weight w.
     */
    mix(a: number, b: number, w: number): number;

    /**
     * Returns the number adjacent to `x` in the direction of `y`.
     */
    nextAfter(x: number, y: number): number;

    /**
     * Returns the number adjacent to `x` in the direction of -Infinity.
     */
    nextDown(x: number): number;

    /**
     * Returns the number adjacent to `x` in the direction of +Infinity.
     */
    nextUp(x: number): number;

    /**
     * Transform an angle in degrees to be bounded within the domain [0, 360)
     * @param degrees - An angle in degrees
     * @returns The same angle on the range [0, 360)
     */
    normalizeDegrees(degrees: number): number;

    /**
     * Transform an angle in radians to be bounded within the domain [-PI, PI]
     * @param radians - An angle in degrees
     * @returns The same angle on the range [-PI, PI]
     */
    normalizeRadians(radians: number): number;

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
     * Returns the value of the oscillation between `a` and `b` at time `t`.
     * @param a - The minimum value of the oscillation
     * @param b - The maximum value of the oscillation
     * @param t - The time
     * @param p - The period (must be nonzero) (default: `1`)
     * @param f - The periodic function (its period must be 2π) (default: `Math.cos`)
     * @returns `((b - a) * (f(2π * t / p) + 1) / 2) + a`
     */
    oscillation(
      a: number,
      b: number,
      t: number,
      p?: number,

      /** @immediate */
      f?: (x: number) => number,
    ): number;
  }
}
