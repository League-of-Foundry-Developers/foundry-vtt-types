import type { Identity } from "#utils";

declare global {
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

    protected override _preRender: AbstractBaseShader.PreRenderFunction;
  }

  namespace BaselineIlluminationSamplerShader {
    interface Any extends AnyBaselineIlluminationSamplerShader {}
    interface AnyConstructor extends Identity<typeof AnyBaselineIlluminationSamplerShader> {}
  }
}

declare abstract class AnyBaselineIlluminationSamplerShader extends BaselineIlluminationSamplerShader {
  constructor(...args: never);
}
