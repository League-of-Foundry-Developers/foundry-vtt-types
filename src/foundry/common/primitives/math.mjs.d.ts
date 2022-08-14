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
