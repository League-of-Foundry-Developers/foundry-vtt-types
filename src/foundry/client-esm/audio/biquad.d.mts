import type { InexactPartial } from "fvtt-types/utils";

/**
 * A sound effect which applies a biquad filter.
 */
declare class BiquadFilterEffect extends BiquadFilterNode {
  /**
   * A ConvolverEffect is constructed by passing the following parameters.
   * @param context - The audio context required by the BiquadFilterNode
   * @param options - Additional options which modify the BiquadFilterEffect behavior
   */
  constructor(
    context: AudioContext,
    options?: InexactPartial<{
      /**
       * The filter type to apply
       * @defaultValue `"lowpass"`
       */
      type: BiquadFilterType;

      /**
       * The initial intensity of the effect
       * @defaultValue `5`
       */
      intensity: number;
    }>,
  );

  /**
   * Adjust the intensity of the effect on a scale of 0 to 10
   */
  get intensity(): number;

  set intensity(value);

  /**
   * Update the state of the effect node given the active flag and numeric intensity.
   * @param options - Options which are updated
   */
  update(
    options?: InexactPartial<{
      /** A new effect intensity */
      intensity: number;

      /** A new filter type */
      type: BiquadFilterType;
    }>,
  ): void;
}

export default BiquadFilterEffect;
