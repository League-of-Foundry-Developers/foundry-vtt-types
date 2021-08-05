/**
 * Light dome animation coloration shader
 */
declare class LightDomeColorationShader extends StandardColorationShader {
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
