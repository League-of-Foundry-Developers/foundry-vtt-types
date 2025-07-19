import type { Identity, InexactPartial } from "#utils";

/**
 * A smooth noise generator for one-dimensional values.
 */
declare class SmoothNoise {
  /**
   * @param options - Configuration options for the noise process.
   */
  constructor(options?: SmoothNoise.ConstructorOptions);

  /**
   * @remarks Stores the value passed in construction options, or `1` if that's falsey.
   *
   * `defineProperty`'d in construction with `writable: false`
   */
  protected readonly _maxReferences: number;

  /**
   * @remarks Stores {@linkcode _maxReferences} number of `Math.random()` calls
   *
   * `defineProperty`'d in construction with `writable: false`
   */
  protected readonly _references: number[];

  /**
   * Amplitude of the generated noise output
   * The noise output is multiplied by this value
   *
   * @remarks
   * @throws If passed `NaN` or `+`/`-Infinity`
   */
  get amplitude(): number;

  set amplitude(amplitude);

  protected _amplitude: number;

  /**
   * Scale factor of the random indices
   *
   * @remarks
   * @throws If passed a negative number, `NaN`, or `+`/`-Infinity`
   */
  get scale(): number;

  set scale(scale);

  protected _scale: number;

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
     * @remarks Must be finite
     */
    amplitude: number;

    /**
     * An adjustment factor for the input x values which place them on an appropriate range.
     * @defaultValue `1`
     * @remarks Must be finite and non-negative
     */
    scale: number;

    /**
     * The number of pre-generated random numbers to generate.
     * @defaultValue `256`
     * @remarks Must be a power of 2 or construction throws.
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
