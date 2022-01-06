/**
 * The default coloration shader used by standard rendering and animations.
 * A fragment shader which creates a light source.
 */
declare class AdaptiveColorationShader extends AdaptiveLightingShader {
  /**
   * Incorporate falloff if a falloff uniform is requested
   */
  static FALLOFF: string;

  /**
   * Color adjustments : exposure, contrast and shadows
   */
  static ADJUSTMENTS: string;

  /**
   * Memory allocations for the Adaptive Coloration Shader
   */
  static SHADER_HEADER: string;

  /** @override */
  static fragmentShader: string;

  /**
   * @override
   * @defaultValue
   * ```javascript
   * {
   *   technique: 1,
   *   ratio: 0.0,
   *   shadows: 0.0,
   *   saturation: 0.0,
   *   alpha: 1.0,
   *   color: [1.0, 1.0, 1.0],
   *   time: 0,
   *   intensity: 5,
   *   darkness: false,
   *   screenDimensions: [1, 1],
   *   uBkgSampler: 0,
   *   fovTexture: 0,
   *   gradual: true,
   *   useFov: true
   * }
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;
}
