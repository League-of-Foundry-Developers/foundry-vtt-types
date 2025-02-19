import type { AnyObject, Brand, FixedInstanceType, ShapeWithIndexSignature } from "fvtt-types/utils";

declare global {
  /**
   * This filter handles masking and post-processing for visual effects.
   */
  class VisualEffectsMaskingFilter extends AbstractBaseMaskFilter {
    static override create<ThisType extends AbstractBaseFilter.AnyConstructor, T extends AnyObject>(
      this: ThisType,
      {
        postProcessModes,
        ...initialUniforms
      }?: ShapeWithIndexSignature<
        T,
        VisualEffectsMaskingFilter.ConcreteCreateOptions,
        string,
        AbstractBaseShader.UniformValue
      >,
    ): FixedInstanceType<ThisType>;

    /**
     * Masking modes.
     * @remarks Object is frozen
     */
    static FILTER_MODES: {
      readonly BACKGROUND: 0 & VisualEffectsMaskingFilter.FILTER_MODES;
      readonly ILLUMINATION: 1 & VisualEffectsMaskingFilter.FILTER_MODES;
      readonly COLORATION: 2 & VisualEffectsMaskingFilter.FILTER_MODES;
    };

    /**
     * @defaultValue
     * ```js
     * {
     *    tint: [1, 1, 1],
     *    screenDimensions: [1, 1],
     *    enableVisionMasking: true,
     *    visionTexture: null,
     *    darknessLevelTexture: null,
     *    exposure: 0,
     *    contrast: 0,
     *    saturation: 0,
     *    mode: 0,
     *    ambientDarkness: [0, 0, 0],
     *    ambientDaylight: [1, 1, 1],
     *    replacementColor: [0, 0, 0]
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Update the filter shader with new post-process modes.
     * @param postProcessModes - New modes to apply.
     * @param uniforms         - Uniforms value to update.
     */
    updatePostprocessModes(
      postProcessModes?: VisualEffectsMaskingFilter.PostProcessModes,
      uniforms?: AbstractBaseShader.Uniforms,
    ): void;

    /**
     * Remove all post-processing modes and reset some key uniforms.
     */
    reset(): void;

    override apply(
      filterManager: PIXI.FilterSystem,
      input: PIXI.RenderTexture,
      output: PIXI.RenderTexture,
      clear: PIXI.CLEAR_MODES,
      currentState?: PIXI.FilterState,
    ): void;

    /**
     * Filter post-process techniques.
     */
    static POST_PROCESS_TECHNIQUES: {
      EXPOSURE: { id: "EXPOSURE" & VisualEffectsMaskingFilter.POST_PROCESS_TECHNIQUES_ID; glsl: string };
      CONTRAST: { id: "CONTRAST" & VisualEffectsMaskingFilter.POST_PROCESS_TECHNIQUES_ID; glsl: string };
      SATURATION: { id: "SATURATION" & VisualEffectsMaskingFilter.POST_PROCESS_TECHNIQUES_ID; glsl: string };
    };
    /**
     * Memory allocations and headers for the VisualEffectsMaskingFilter
     */
    static fragmentHeader: string;

    static fragmentCore: string;

    /**
     * Construct filter post-processing code according to provided value.
     * @param postProcessModes - Post-process modes to construct techniques.
     * @returns The constructed shader code for post-process techniques.
     */
    static fragmentPostProcess(postProcessModes?: VisualEffectsMaskingFilter.PostProcessModes): string;

    /**
     * Specify the fragment shader to use according to mode
     * @param postProcessModes - (default: [])
     */
    static override fragmentShader(postProcessModes?: VisualEffectsMaskingFilter.PostProcessModes): string;
  }

  namespace VisualEffectsMaskingFilter {
    interface Any extends AnyVisualEffectsMaskingFilter {}
    type AnyConstructor = typeof AnyVisualEffectsMaskingFilter;

    type PostProcessModes = Array<keyof typeof VisualEffectsMaskingFilter.POST_PROCESS_TECHNIQUES>;

    interface ConcreteCreateOptions {
      postProcessModes?: PostProcessModes | undefined;
    }

    type FILTER_MODES = Brand<number, "VisualEffectsMaskingFilter.FILTER_MODES">;

    type POST_PROCESS_TECHNIQUES_ID = Brand<string, "VisualEffectsMaskingFilter.POST_PROCESS_TECHNIQUES.ID">;
  }
}

declare abstract class AnyVisualEffectsMaskingFilter extends VisualEffectsMaskingFilter {
  constructor(arg0: never, ...args: never[]);
}
