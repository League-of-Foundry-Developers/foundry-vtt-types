/**
 * Pulse animation coloration shader
 */
declare class PulseColorationShader extends AdaptiveColorationShader {
  static fragmentShader: string;

  /**
   * @override
   * @defaultValue
   * ```typescript
   * Object.assign({}, super.defaultUniforms, {
   *   pulse: 0
   * })
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;
}
