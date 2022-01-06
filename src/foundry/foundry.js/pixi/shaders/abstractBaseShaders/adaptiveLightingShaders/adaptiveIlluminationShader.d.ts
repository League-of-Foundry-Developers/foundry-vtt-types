/**
 * The default coloration shader used by standard rendering and animations
 * A fragment shader which creates a solid light source.
 */
declare class AdaptiveIlluminationShader extends AdaptiveLightingShader {
  /**
   * Constrain light to LOS
   */
  static CONSTRAIN_TO_LOS: string;

  /**
   * Incorporate falloff if a gradual uniform is requested
   */
  static FALLOFF: string;

  /**
   * Color adjustments : exposure, contrast and shadows
   */
  static ADJUSTMENTS: string;

  /**
   * Memory allocations for the Adaptive Illumination Shader
   */
  static SHADER_HEADER: string;

  /** @override */
  static fragmentShader: string;

  /**
   * @override
   * @defaultValue
   * ```javascript
   * {
   *   alpha: 1.0,
   *   ratio: 0.5,
   *   color: [0.9333333333333333, 0.9333333333333333, 0.9333333333333333],
   *   colorDim: [0.5, 0.5, 0.5],
   *   colorBright: [1.0, 1.0, 1.0],
   *   colorBackground: [1.0, 1.0, 1.0],
   *   darkness: false,
   *   exposure: 0.0,
   *   fovTexture: 0,
   *   gradual: false,
   *   intensity: 5,
   *   saturation: 0.0,
   *   screenDimensions: [1, 1],
   *   shadows: 0.0,
   *   time: 0,
   *   uBkgSampler: 0,
   *   useFov: true
   * }
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;

  /**
   * Determine the correct illumination penalty to apply for a given darkness level and luminosity
   * @param darknessLevel - The current darkness level on [0,1]
   * @param luminosity    - The light source luminosity on [-1,1]
   * @returns The amount of penalty to apply on [0,1]
   */
  getDarknessPenalty(darknessLevel: number, luminosity: number): number;
}
