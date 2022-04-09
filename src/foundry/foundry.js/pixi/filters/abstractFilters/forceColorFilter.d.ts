/**
 * A filter which forces all non-transparent pixels to a specific color and transparency.
 */
declare class ForceColorFilter extends AbstractFilter {
  /**
   * @defaultValue
   * ```typescript
   * {
   *   color: [1, 1, 1],
   *   alpha: 1.0
   * }
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;

  static fragmentShader: string;
}
