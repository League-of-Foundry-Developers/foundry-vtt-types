/**
 * Torch animation coloration shader
 */
declare class TorchColorationShader extends StandardColorationShader {
  static fragmentShader: string;

  /**
   * @override
   * @defaultValue
   * ```typescript
   * Object.assign({}, super.defaultUniforms, {
   *   ratio: 0
   * })
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;
}
