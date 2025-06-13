import type { Identity, InexactPartial } from "#utils";

/**
 * A smooth noise generator for one-dimensional values.
 */
declare class SmoothNoise {
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

declare namespace SmoothNoise {
  interface Any extends AnySmoothNoise {}
  interface AnyConstructor extends Identity<typeof AnySmoothNoise> {}

  /** @internal */
  type _ConstructorOptions = InexactPartial<{
    /**
     * The generated noise will be on the range [0, amplitude].
     * @defaultValue `1`
     * @remarks Can't be null because it only has a signature-provided default
     */
    amplitude: number;

    /**
     * An adjustment factor for the input x values which place them on an appropriate range.
     * @defaultValue `1`
     * @remarks Can't be null because it only has a signature-provided default
     */
    scale: number;

    /**
     * The number of pre-generated random numbers to generate.
     * @defaultValue `256`
     * @remarks Must be a power of 2 or construction throws.
     * Can't be null because it only has a signature-provided default
     */
    maxReferences: number;
  }>;

  /** Options for the {@link SmoothNoise} constructor */
  interface ConstructorOptions extends _ConstructorOptions {}
}

export default SmoothNoise;

declare abstract class AnySmoothNoise extends SmoothNoise {
  constructor(...args: never);
}
