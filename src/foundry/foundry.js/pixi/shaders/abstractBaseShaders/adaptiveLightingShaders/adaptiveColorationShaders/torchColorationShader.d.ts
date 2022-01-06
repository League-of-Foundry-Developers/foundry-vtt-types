/**
 * Torch animation coloration shader
 */
declare class TorchColorationShader extends AdaptiveColorationShader {
  static fragmentShader: string;

  /**
   * @override
   * @defaultValue
   * ```typescript
   * Object.assign({}, super.defaultUniforms, {
   *   ratio: 0,
   *   brightnessPulse: 1
   * })
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;
}
