/**
 * A filter which is rendering explored color according to FoW intensity.
 */
declare class FogColorFilter extends AbstractFilter {
  /**
   * @defaultValue
   * ```typescript
   * {
   *   exploredColor: [1, 1, 1]
   * }
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;

  static fragmentShader: string;
}
