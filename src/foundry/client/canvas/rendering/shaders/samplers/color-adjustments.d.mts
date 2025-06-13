import type { Identity } from "#utils";
import type { AbstractBaseShader, BaseSamplerShader } from "../_module.mjs";

/**
 * A color adjustment shader.
 */
declare class ColorAdjustmentsSamplerShader extends BaseSamplerShader {
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

declare namespace ColorAdjustmentsSamplerShader {
  interface Any extends AnyColorAdjustmentsSamplerShader {}
  interface AnyConstructor extends Identity<typeof AnyColorAdjustmentsSamplerShader> {}
}

export default ColorAdjustmentsSamplerShader;

declare abstract class AnyColorAdjustmentsSamplerShader extends ColorAdjustmentsSamplerShader {
  constructor(...args: never);
}
