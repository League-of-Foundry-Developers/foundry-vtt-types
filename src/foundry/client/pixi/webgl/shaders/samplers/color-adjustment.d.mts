export {};

declare abstract class AnyColorAdjustmentsSamplerShader extends ColorAdjustmentsSamplerShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace ColorAdjustmentsSamplerShader {
    type AnyConstructor = typeof AnyColorAdjustmentsSamplerShader;
  }

  /**
   * A color adjustment shader.
   */
  class ColorAdjustmentsSamplerShader extends BaseSamplerShader {
    /**
     * @defaultValue `null`
     */
    static override classPluginName: string | null;

    static override fragmentShader: AbstractBaseShader.FragmentShader;

    /**
     * @defaultValue
     * ```js
     * {
     *   tintAlpha: [1, 1, 1, 1],
     *   tint: [1, 1, 1],  contrast: 0,
     *   saturation: 0,
     *   exposure: 0,
     *   sampler: null,
     *   linkedToDarknessLevel: false,
     *   darknessLevelTexture: null,
     *   screenDimensions: [1, 1]
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    get linkedToDarknessLevel(): AbstractBaseShader.UniformValue;

    set linkedToDarknessLevel(link);

    get darknessLevel(): AbstractBaseShader.UniformValue;

    set darknessLevel(darknessLevel);

    get contrast(): AbstractBaseShader.UniformValue;

    set contrast(contrast);

    get exposure(): AbstractBaseShader.UniformValue;

    set exposure(exposure);

    get saturation(): AbstractBaseShader.UniformValue;

    set saturation(saturation);
  }

  /**
   * A light amplification shader.
   */
  class AmplificationSamplerShader extends ColorAdjustmentsSamplerShader {
    /**
     * @defaultValue `null`
     */
    static override classPluginName: string | null;

    static override vertexShader: string;

    static override fragmentShader: AbstractBaseShader.FragmentShader;

    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Brightness controls the luminosity.
     */
    get brightness(): number;

    set brightness(brightness);

    /**
     * Tint color applied to Light Amplification.
     * Light Amplification tint
     * @defaultValue `[0.48, 1.0, 0.48]`
     */
    get colorTint(): number[];

    set colorTint(color);
  }
}
