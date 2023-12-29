export {};

declare global {
  /**
   * A shader that alters the source to adopt a translucent color to simulate invisibility.
   */
  class TokenInvisibilitySamplerShader extends BaseSamplerShader {
    /**
     * @defaultValue `null`
     */
    static classPluginName: string | null;

    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *    tintAlpha: [1, 1, 1, 1],
     *    sampler: null,
     *    color: [0.25, 0.35, 1.0],
     *    alpha: 0.8
     *  }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;
  }
}
