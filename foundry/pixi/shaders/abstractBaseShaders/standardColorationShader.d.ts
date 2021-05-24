/**
 * The default coloration shader used by standard rendering and animations.
 * A fragment shader which creates a light source.
 */
declare class StandardColorationShader extends AbstractBaseShader {
  static fragmentShader: string;

  /**
   * @defaultValue
   * ```typescript
   * {
   *   alpha: 1.0,
   *   color: [1.0, 1.0, 1.0],
   *   time: 0,
   *   intensity: 5,
   *   darkness: false,
   * }
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;
}
