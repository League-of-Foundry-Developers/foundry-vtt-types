/**
 * Emanation animation coloration shader
 */
declare class EmanationColorationShader extends StandardColorationShader {
  static fragmentShader: string;

  /**
   * @override
   * @defaultValue
   * ```typescript
   * Object.assign({}, super.defaultUniforms, {
   *   color: PIXI.utils.hex2rgb(0xCEECEE)
   * })
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;
}
