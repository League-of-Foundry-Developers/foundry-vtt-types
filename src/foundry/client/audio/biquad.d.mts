import type { Identity, InexactPartial } from "#utils";

/**
 * A sound effect which applies a biquad filter.
 */
declare class BiquadFilterEffect extends BiquadFilterNode {
  /**
   * A ConvolverEffect is constructed by passing the following parameters.
   * @param context - The audio context required by the BiquadFilterNode
   * @param options - Additional options which modify the BiquadFilterEffect behavior
   */
  constructor(context: AudioContext, options?: BiquadFilterEffect.ConstructorOptions);

  /**
   * Adjust the intensity of the effect on a scale of 0 to 10
   */
  get intensity(): number;

  set intensity(value);

  /**
   * Update the state of the effect node given the active flag and numeric intensity.
   * @param options - Options which are updated
   * @remarks
   * @throws If `type` is set to any value in {@linkcode BiquadFilterEffect.AllowedFilterType} other than `"highpass"` or `"lowpass"`
   */
  update(options?: BiquadFilterEffect.UpdateOptions): void;

  #BiquadFilterEffect: true;
}

declare namespace BiquadFilterEffect {
  interface Any extends AnyBiquadFilterEffect {}
  interface AnyConstructor extends Identity<typeof AnyBiquadFilterEffect> {}

  /**
   * Foundry keeps this specific list in a private static property of {@linkcode BiquadFilterEffect}.
   * It is typed as it is to make obvious where it comes from.
   *
   * @privateRemarks An `Exclude` would have been shorter but for all we know the lib type might change, this is reliable
   *
   * @internal
   */
  type AspirationalAllowedFilterType = Extract<
    "lowpass" | "highpass" | "bandpass" | "lowshelf" | "highshelf" | "peaking" | "notch",
    BiquadFilterType
  >;

  /**
   * @remarks Despite `BiquadFilterEffect.#ALLOWED_TYPES` containing everything in the Aspirational
   * type, the runtime logic will throw on anything but these two values
   */
  type AllowedFilterType = Extract<"highpass" | "lowpass", AspirationalAllowedFilterType>;

  /** @internal */
  type _ConstructorOptions = InexactPartial<{
    /**
     * The initial intensity of the effect
     * @defaultValue `5`
     */
    intensity: number;

    /**
     * The filter type to apply
     * @defaultValue `"lowpass"`
     * @remarks Only allows a subset of {@linkcode BiquadFilterType}s
     */
    type: AllowedFilterType;
  }>;

  /**
   * @privateRemarks The {@linkcode BiquadFilterEffect} constructor only adds the one
   * new property (`intensity`) to the parent interface. `type` is omitted and reimplemented to allow
   * explicit `undefined`, as there's a parameter default available, and limit to Foundry's allowed values
   */
  interface ConstructorOptions extends _ConstructorOptions, Omit<BiquadFilterOptions, "type"> {}

  type _UpdateOptions = InexactPartial<{
    /**
     * A new effect intensity
     * @remarks This is ignored if it fails a `Number.isFinite` check
     */
    intensity: number;

    /**
     * A new filter type
     * @see {@linkcode BiquadFilterEffect.AllowedFilterType}
     * @see {@linkcode BiquadFilterEffect.AspirationalAllowedFilterType}
     */
    type: AllowedFilterType;
  }>;

  interface UpdateOptions extends _UpdateOptions {}
}

export default BiquadFilterEffect;

declare abstract class AnyBiquadFilterEffect extends BiquadFilterEffect {
  constructor(...args: never);
}
