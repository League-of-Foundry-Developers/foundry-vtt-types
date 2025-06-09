import type { Identity } from "#utils";
import type { AbstractBaseShader, AdaptiveVisionShader } from "../_module.mjs";

/**
 * The default background shader used for vision sources
 */
declare class BackgroundVisionShader extends AdaptiveVisionShader {
  static override FRAGMENT_END: string;

  /**
   * Memory allocations for the Adaptive Background Shader
   */
  static SHADER_HEADER: string;

  static override fragmentShader: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   technique: 0,
   *   saturation: 0,
   *   contrast: 0,
   *   attenuation: 0.10,
   *   exposure: 0,
   *   darknessLevel: 0,
   *   colorVision: [1, 1, 1],
   *   colorTint: [1, 1, 1],
   *   colorBackground: [1, 1, 1],
   *   screenDimensions: [1, 1],
   *   time: 0,
   *   useSampler: true,
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

  /**
   * Flag whether the background shader is currently required.
   * If key uniforms are at their default values, we don't need to render the background container.
   */
  get isRequired(): boolean;
}

declare namespace BackgroundVisionShader {
  interface Any extends AnyBackgroundVisionShader {}
  interface AnyConstructor extends Identity<typeof AnyBackgroundVisionShader> {}
}

export default BackgroundVisionShader;

declare abstract class AnyBackgroundVisionShader extends BackgroundVisionShader {
  constructor(...args: never);
}
