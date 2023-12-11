export {};

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
      uniforms: Record<string, unknown>,
      options: AdaptiveFXAAFilterOptions,
    );
  }

  interface AdaptiveFXAAFilterOptions {}
}
