import type { Identity } from "#utils";
import type { AbstractBaseShader, AdaptiveVisionShader } from "../_module.mjs";

/**
 * The default coloration shader used for vision sources.
 */
declare class ColorationVisionShader extends AdaptiveVisionShader {
  /** @defaultValue `""` */
  static override EXPOSURE: string;

  /** @defaultValue `""` */
  static override CONTRAST: string;

  /**
   * Memory allocations for the Adaptive Coloration Shader
   */
  static SHADER_HEADER: string;

  static override fragmentShader: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   technique: 0,
   *   saturation: 0,
   *   attenuation: 0,
   *   colorEffect: [0, 0, 0],
   *   colorBackground: [0, 0, 0],
   *   colorTint: [1, 1, 1],
   *   time: 0,
   *   screenDimensions: [1, 1],
   *   useSampler: true,
   *   primaryTexture: null,
   *   linkedToDarknessLevel: true,
   *   depthTexture: null,
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
   * Flag whether the coloration shader is currently required.
   * If key uniforms are at their default values, we don't need to render the coloration container.
   */
  get isRequired(): boolean;
}

declare namespace ColorationVisionShader {
  interface Any extends AnyColorationVisionShader {}
  interface AnyConstructor extends Identity<typeof AnyColorationVisionShader> {}
}

export default ColorationVisionShader;

declare abstract class AnyColorationVisionShader extends ColorationVisionShader {
  constructor(...args: never);
}
