export {};

declare abstract class AnyBaselineIlluminationSamplerShader extends BaselineIlluminationSamplerShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace BaselineIlluminationSamplerShader {
    type AnyConstructor = typeof AnyBaselineIlluminationSamplerShader;
  }

  /**
   * Compute baseline illumination according to darkness level encoded texture.
   */
  class BaselineIlluminationSamplerShader extends BaseSamplerShader {
    /**
     * @defaultValue `null`
     */
    static override classPluginName: string | null;

    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *   tintAlpha: [1, 1, 1, 1],
     *   ambientDarkness: [0, 0, 0],
     *   ambientDaylight: [1, 1, 1],
     *   sampler: null
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    override _preRender: AbstractBaseShader.PreRenderFunction;
  }
}
