import type { InexactPartial } from "fvtt-types/utils";

declare global {
  namespace SmoothNoise {
    interface ConstructorOptions {
      /**
       * The generated noise will be on the range [0, amplitude].
       * @defaultValue `1`
       */
      amplitude: number;

      /**
       * An adjustment factor for the input x values which place them on an appropriate range.
       * @defaultValue `1`
       */
      scale: number;

      /**
       * The number of pre-generated random numbers to generate.
       * @defaultValue `256`
       */
      maxReferences: number;
    }
  }

  /**
   * A smooth noise generator for one-dimensional values.
   */
  class SmoothNoise {
    /**
     * @param options - Configuration options for the noise process.
     */
    constructor({ amplitude, scale, maxReferences }?: InexactPartial<SmoothNoise.ConstructorOptions>);

    _maxReferences: number;

    _references: number[];

    /**
     * Amplitude of the generated noise output
     * The noise output is multiplied by this value
     */
    get amplitude(): number;

    set amplitude(amplitude);

    _amplitude: number;

    /**
     * Scale factor of the random indices
     */
    get scale(): number;

    set scale(scale);

    _scale: number;

    /**
     * Generate the noise value corresponding to a provided numeric x value.
     * @param x - Any finite number
     * @returns The corresponding smoothed noise value
     */
    generate(x: number): number;
  }
}
