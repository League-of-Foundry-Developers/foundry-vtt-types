import type { Identity } from "#utils";
import type AdaptiveLightingShader from "./base-lighting.mjs";
import type AbstractBaseShader from "../base-shader.mjs";

/**
 * The default coloration shader used by standard rendering and animations
 * A fragment shader which creates a solid light source.
 */
declare class AdaptiveIlluminationShader extends AdaptiveLightingShader {
  static override FRAGMENT_END: string;

  /**
   * The adjustments made into fragment shaders
   */
  static get ADJUSTMENTS(): string;

  static override EXPOSURE: string;

  /**
   * Memory allocations for the Adaptive Illumination Shader
   */
  static SHADER_HEADER: string;

  static override fragmentShader: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   technique: 1,     // overwritten by LightData.cleanData().coloration in a subsequent static init block
   *   shadows: 0,       // overwritten by LightData.cleanData().shadows in a subsequent static init block
   *   saturation: 0,    // overwritten by LightData.cleanData().saturation in a subsequent static init block
   *   intensity: 5,     // overwritten by LightData.cleanData().intensity in a subsequent static init block
   *   attenuation: 0.5, // overwritten by LightData.cleanData().attenuation in a subsequent static init block
   *   contrast: 0,      // overwritten by LightData.cleanData().contrast in a subsequent static init block
   *   exposure: 0,
   *   ratio: 0.5,
   *   darknessLevel: 0,
   *   color: [1, 1, 1],
   *   colorBackground: [1, 1, 1],
   *   colorDim: [1, 1, 1],
   *   colorBright: [1, 1, 1],
   *   screenDimensions: [1, 1],
   *   time: 0,
   *   useSampler: false,
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
   *   computeIllumination: false,
   *   globalLight: false,
   *   globalLightThresholds: [0, 0]
   * }
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms;

  /**
   * Flag whether the illumination shader is currently required.
   */
  get isRequired(): boolean;
}

declare namespace AdaptiveIlluminationShader {
  interface Any extends AnyAdaptiveIlluminationShader {}
  interface AnyConstructor extends Identity<typeof AnyAdaptiveIlluminationShader> {}
}

export default AdaptiveIlluminationShader;

declare abstract class AnyAdaptiveIlluminationShader extends AdaptiveIlluminationShader {
  constructor(...args: never);
}
