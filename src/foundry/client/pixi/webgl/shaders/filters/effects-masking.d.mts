import type { ConstructorOf, ValueOf } from "../../../../../../types/utils.d.mts";
export {};

declare global {
  namespace VisualEffectsMaskingFilter {
    type PostProcessModes = Array<keyof (typeof VisualEffectsMaskingFilter)["POST_PROCESS_TECHNIQUES"]>;

    type FilterMode = ValueOf<(typeof VisualEffectsMaskingFilter)["FILTER_MODES"]>;

    /**
     * @privateRemarks Implementation taken from https://stackoverflow.com/a/61434547
     */
    // TODO: Replace when https://github.com/microsoft/TypeScript/issues/17867 is resolved
    type CreateOptionsIntersection = {
      filterMode?: FilterMode;
      postProcessModes?: PostProcessModes;
    } & AbstractBaseShader.Uniforms;

    type CreateOptions<T> = {
      filterMode?: FilterMode;
      postProcessModes?: PostProcessModes;
    } & {
      [K in keyof T]: K extends "filterMode" | "postProcessModes" ? unknown : AbstractBaseShader.UniformValue;
    };
  }

  /**
   * This filter handles masking and post-processing for visual effects.
   */
  class VisualEffectsMaskingFilter extends AbstractBaseMaskFilter {
    constructor(
      vertex: string,
      fragment: string,
      uniforms: AbstractBaseShader.Uniforms,
      filterMode: VisualEffectsMaskingFilter.FilterMode,
    );

    /**
     * @remarks This method has been overloaded to accurately type the object input.
     * The input cannot be separately typed, it must be fed directly into this method
     */
    // TODO: Replace when https://github.com/microsoft/TypeScript/issues/17867 is resolved
    static create<T1 extends VisualEffectsMaskingFilter, T2 extends VisualEffectsMaskingFilter.CreateOptions<T2>>(
      this: ConstructorOf<T1>,
      { filterMode, postProcessModes, ...uniforms }?: T2,
    ): T1;
    static create<T extends VisualEffectsMaskingFilter>(
      this: ConstructorOf<T>,
      { filterMode, postProcessModes, ...uniforms }?: VisualEffectsMaskingFilter.CreateOptionsIntersection,
    ): T;

    /**
     * The filter mode.
     */
    filterMode: VisualEffectsMaskingFilter.FilterMode;

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

    /**
     * Masking modes.
     */
    static readonly FILTER_MODES: {
      BACKGROUND: "background";
      ILLUMINATION: "illumination";
      COLORATION: "coloration";
    };

    /**
     * @defaultValue
     * ```js
     * {
     *    replacementColor: [0, 0, 0],
     *    tint: [1, 1, 1],
     *    screenDimensions: [1, 1],
     *    enableVisionMasking: true,
     *    uVisionSampler: null,
     *    exposure: 0,
     *    contrast: 0,
     *    saturation: 0
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Filter post-process techniques.
     */
    static readonly POST_PROCESS_TECHNIQUES: {
      EXPOSURE: { id: "EXPOSURE"; glsl: string };
      CONTRAST: { id: "CONTRAST"; glsl: string };
      SATURATION: { id: "SATURATION"; glsl: string };
    };

    /**
     * Assign the replacement color according to the filter mode.
     * @param filterMode - Filter mode.
     * @returns The replacement color.
     */
    static replacementColor(filterMode: VisualEffectsMaskingFilter.FilterMode): string;

    /**
     * Memory allocations and headers for the VisualEffectsMaskingFilter
     * @param filterMode - Filter mode.
     * @returns The filter header according to the filter mode.
     */
    static fragmentHeader(filterMode: VisualEffectsMaskingFilter.FilterMode): string;

    static fragmentCore: string;

    /**
     * Construct filter post-processing code according to provided value.
     * @param postProcessModes - Post-process modes to construct techniques.
     * @returns The constructed shader code for post-process techniques.
     */
    static fragmentPostProcess(postProcessModes?: VisualEffectsMaskingFilter.PostProcessModes): string;

    /**
     * Specify the fragment shader to use according to mode
     * @param filterMode - (default: this.FILTER_MODES.BACKGROUND)
     * @param postProcessModes - (default: [])
     * @override
     */
    static fragmentShader(
      filterMode?: VisualEffectsMaskingFilter.FilterMode,
      postProcessModes?: VisualEffectsMaskingFilter.PostProcessModes,
    ): string;
  }
}
