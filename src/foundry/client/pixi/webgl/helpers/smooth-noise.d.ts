export {};

declare global {
  /**
   * A smooth noise generator for one-dimensional values.
   */
  class SmoothNoise {
    /**
     * @param options - Configuration options for the noise process.
     */
    constructor(options: SmoothNoise.ConstructorOptions);
  }
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
}
