/**
 * The default coloration shader used by standard rendering and animations
 * A fragment shader which creates a solid light source.
 */
declare class StandardIlluminationShader extends AbstractBaseShader {
  static fragmentShader: string;

  /**
   * @defaultValue
   * ```typescript
   * {
   *   alpha: 1.0,
   *   ratio: 0.5,
   *   colorDim: [0.5, 0.5, 0.5],
   *   colorBright: [1.0, 1.0, 1.0],
   *   time: 0,
   *   intensity: 5
   * }
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;
}
