export {};

declare abstract class AnyColorAdjustmentsSamplerShader extends ColorAdjustmentsSamplerShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyAmplificationSamplerShader extends AmplificationSamplerShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace ColorAdjustmentsSamplerShader {
    type AnyConstructor = typeof AnyColorAdjustmentsSamplerShader;
  }

  namespace AmplificationSamplerShader {
    type AnyConstructor = typeof AnyAmplificationSamplerShader;
  }

  /**
   * A color adjustment shader.
   */
  class ColorAdjustmentsSamplerShader extends BaseSamplerShader {
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

    set linkedToDarknessLevel(link: AbstractBaseShader.UniformValue);

    get contrast(): AbstractBaseShader.UniformValue;

    set contrast(contrast: AbstractBaseShader.UniformValue);

    get exposure(): AbstractBaseShader.UniformValue;

    set exposure(exposure: AbstractBaseShader.UniformValue);

    get saturation(): AbstractBaseShader.UniformValue;

    set saturation(saturation: AbstractBaseShader.UniformValue);
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

    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *   tintAlpha: [1, 1, 1, 1],
     *   tint: [0.38, 0.8, 0.38],
     *   brightness: 0,
     *   darknessLevelTexture: null,
     *   screenDimensions: [1, 1],
     *   enable: true
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Brightness controls the luminosity.
     */
    get brightness(): number;

    set brightness(brightness: AbstractBaseShader.UniformValue);

    /**
     * Tint color applied to Light Amplification.
     * Light Amplification tint
     * @defaultValue `[0.48, 1.0, 0.48]`
     */
    get colorTint(): number[];

    set colorTint(color: AbstractBaseShader.UniformValue);
  }
}
