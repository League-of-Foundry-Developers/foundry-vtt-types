export {};

declare global {
  /**
   * A monochromatic shader
   */
  class MonochromaticSamplerShader extends BaseSamplerShader {
    /**
     * @defaultValue `"monochromatic"`
     */
    static classPluginName: string;

    static override batchVertexShader: string;

    static override batchFragmentShader: string;

    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *    tintAlpha: [1, 1, 1, 1],
     *    sampler: 0,
     *  }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;
  }
}
