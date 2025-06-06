import type { Identity } from "#utils";
import type { AbstractBaseShader, ColorAdjustmentsSamplerShader } from "../_module.mjs";

/**
 * A light amplification shader.
 */
declare class AmplificationSamplerShader extends ColorAdjustmentsSamplerShader {
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

declare namespace AmplificationSamplerShader {
  interface Any extends AnyAmplificationSamplerShader {}
  interface AnyConstructor extends Identity<typeof AnyAmplificationSamplerShader> {}
}

export default AmplificationSamplerShader;

declare abstract class AnyAmplificationSamplerShader extends AmplificationSamplerShader {
  constructor(...args: never);
}
