import type { Identity } from "#utils";
import type { AbstractBaseShader, AdaptiveVisionShader } from "../_module.mjs";

/**
 * The default illumination shader used for vision sources
 */
declare class IlluminationVisionShader extends AdaptiveVisionShader {
  static override FRAGMENT_END: string;

  /**
   * Transition between bright and dim colors, if requested
   */
  static VISION_COLOR: string;

  static get ADJUSTMENTS(): string;

  /**
   * Memory allocations for the Adaptive Illumination Shader
   */
  static SHADER_HEADER: string;

  static override fragmentShader: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   technique: LightData.cleanData().initial,
   *   attenuation: 0,
   *   exposure: 0,
   *   saturation: 0,
   *   darknessLevel: 0,
   *   colorVision: [1, 1, 1],
   *   colorTint: [1, 1, 1],
   *   colorBackground: [1, 1, 1],
   *   screenDimensions: [1, 1],
   *   time: 0,
   *   useSampler: false,
   *   linkedToDarknessLevel: true,
   *   primaryTexture: null,
   *   depthTexture: null,
   *   darknessLevelTexture: null,
   *   depthElevation: 1,
   *   ambientBrightest: [1, 1, 1],
   *   ambientDarkness: [0, 0, 0],
   *   ambientDaylight: [1, 1, 1],
   *   weights: [0, 0, 0, 0],
   *   dimLevelCorrection: 1,
   *   brightLevelCorrection: 2,
   *   globalLight: false,
   *   globalLightThresholds: [0, 0]
   * }
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms;
}

declare namespace IlluminationVisionShader {
  interface Any extends AnyIlluminationVisionShader {}
  interface AnyConstructor extends Identity<typeof AnyIlluminationVisionShader> {}
}

export default IlluminationVisionShader;

declare abstract class AnyIlluminationVisionShader extends IlluminationVisionShader {
  constructor(...args: never);
}
