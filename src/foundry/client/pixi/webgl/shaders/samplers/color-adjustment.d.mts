import type { Identity } from "../../../../../../utils/index.d.mts";

declare global {
  /**
   * A color adjustment shader.
   */
  class ColorAdjustmentsSamplerShader extends BaseSamplerShader {
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
     *   tint: [1, 1, 1],
     *   contrast: 0,
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

    /** @privateRemarks Inferred from defaultUniforms */
    get linkedToDarknessLevel(): boolean;

    set linkedToDarknessLevel(link);

    /** @privateRemarks Inferred from defaultUniforms */
    get contrast(): number;

    set contrast(contrast);

    /** @privateRemarks Inferred from defaultUniforms */
    get exposure(): number;

    set exposure(exposure);

    /** @privateRemarks Inferred from defaultUniforms */
    get saturation(): number;

    set saturation(saturation);
  }

  namespace ColorAdjustmentsSamplerShader {
    interface Any extends AnyColorAdjustmentsSamplerShader {}
    interface AnyConstructor extends Identity<typeof AnyColorAdjustmentsSamplerShader> {}
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

    set brightness(brightness);

    /**
     * Tint color applied to Light Amplification.
     * Light Amplification tint
     * @defaultValue `[0.48, 1.0, 0.48]`
     */
    get colorTint(): Color.RGBColorVector;

    set colorTint(color);
  }

  namespace AmplificationSamplerShader {
    interface Any extends AnyAmplificationSamplerShader {}
    interface AnyConstructor extends Identity<typeof AnyAmplificationSamplerShader> {}
  }
}

declare abstract class AnyColorAdjustmentsSamplerShader extends ColorAdjustmentsSamplerShader {
  constructor(...args: never);
}

declare abstract class AnyAmplificationSamplerShader extends AmplificationSamplerShader {
  constructor(...args: never);
}
