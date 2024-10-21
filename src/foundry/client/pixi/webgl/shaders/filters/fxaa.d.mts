import type { ConstructorOf } from "../../../../../../types/utils.d.mts";

declare global {
  /**
   * A FXAA filter based on PIXI.FXAA and slightly improved.
   * In brief: The FXAA filter is computing the luma of neighbour pixels and apply correction according to the
   * difference. A high luma reduction is reducing correction while a low luma reduction is reinforcing it.
   */
  class AdaptiveFXAAFilter extends AbstractBaseFilter {
    /**
     * @param vertex   - Optional vertex shader
     *                   (default: `AdaptiveFXAAFilter.vertexShader`)
     * @param fragment - Optional fragment shader
     *                   (default: `AdaptiveFXAAFilter.fragmentShader`)
     * @param uniforms - Optional uniforms
     *                   (default: `AdaptiveFXAAFilter.defaultUniforms`)
     * @param options  - Additional options (token knockout, ...)
     *                   (default: `{}`)
     */
    constructor(
      vertex: string,
      fragment: string,
      uniforms: AbstractBaseShader.Uniforms,
      options: AdaptiveFXAAFilterOptions,
    );

    /**
     * @defaultValue
     * ```js
     * {
     *    lumaMinimum: 0.0078125,   // The minimum luma reduction applied
     *    lumaReduction: 0.125,     // The luma reduction applied. High value, less blur
     *    spanMax: 8,               // Maximum distance at which luma comparisons are made
     *    tokenKnockout: true,      // If tokens should be excluded from the FXAA
     *    tokenTexture: null,       // Inverse occlusion token texture (if token exclusion is activated)
     *    screenDimensions: [1, 1]  // Necessary if token exclusion is activated
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    static override vertexShader: string;

    static override fragmentShader: string;

    override apply(
      filterManager: PIXI.FilterSystem,
      input: PIXI.RenderTexture,
      output: PIXI.RenderTexture,
      clear: PIXI.CLEAR_MODES,
    ): void;

    /**
     * Compute the luma reduction according to the stage zoom level (worldTransform.d)
     * The zoom level is converted to a range [0.xxx =\> max zoom out , 1 =\> max zoom in]
     * With zoom out, the reduction tends to high value, the antialias is discrete to avoid blurring side effect.
     * With zoom in, the reduction tends to low value, the antialias is important.
     * FXAA checks local contrast to avoid processing non-edges (high contrast difference === edge):
     * 0.6 and 0.02 are factors applied to the "contrast range", to apply or not a contrast blend.
     * With small values, the contrast blend is applied more often than with high values.
     * @returns The luma reduction
     */
    protected _computeLumaReduction(): number;

    static create<T extends AdaptiveFXAAFilter>(
      this: ConstructorOf<T>,
      uniforms?: AbstractBaseShader.Uniforms,
    ): AdaptiveFXAAFilter;
  }

  // TODO: This needs to be filled in.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AdaptiveFXAAFilterOptions {}
}
