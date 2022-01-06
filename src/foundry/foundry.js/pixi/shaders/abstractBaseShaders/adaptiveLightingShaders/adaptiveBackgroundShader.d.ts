/**
 * The default coloration shader used by standard rendering and animations
 * A fragment shader which creates a solid light source.
 */
declare class AdaptiveBackgroundShader extends AdaptiveLightingShader {
  /**
   * Constrain light to LOS
   */
  static CONSTRAIN_TO_LOS: string;

  /**
   * Color adjustments : exposure, contrast and shadows
   */
  static ADJUSTMENTS: string;

  /**
   * Incorporate falloff if a gradual uniform is requested
   */
  static FALLOFF: string;

  /**
   * Memory allocations for the Adaptive Background Shader
   */
  static SHADER_HEADER: string;

  /** @override */
  static fragmentShader: string;

  /**
   * @override
   * @defaultValue
   * ```javascript
   * {
   *   shadows: 0.0,
   *   contrast: 0.0,
   *   exposure: 0.0,
   *   saturation: 0.0,
   *   alpha: 1.0,
   *   ratio: 0.5,
   *   time: 0,
   *   screenDimensions: [1, 1],
   *   uBkgSampler: 0,
   *   fovTexture: 0,
   *   darkness: false,
   *   gradual: false,
   *   useFov: true
   * }
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;

  /**
   * Flag whether the background shader is currently required.
   * If key uniforms are at their default values, we don't need to render the background container.
   */
  get isRequired(): boolean;
}
