/**
 * Energy field animation coloration shader
 */
declare class EnergyFieldColorationShader extends StandardColorationShader {
  static fragmentShader: string;

  /**
   * @override
   * @defaultValue
   * ```typescript
   * Object.assign({}, super.defaultUniforms, {
   *   pulse: 0,
   *   color: PIXI.utils.hex2rgb(0xCEECEE)
   * })
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;
}
