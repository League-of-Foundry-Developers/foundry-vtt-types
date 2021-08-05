/**
 * Fog animation coloration shader
 */
declare class FogColorationShader extends StandardColorationShader {
  static fragmentShader: string;

  /**
   * @override
   * @defaultValue
   * ```typescript
   * Object.assign({}, super.defaultUniforms, {
   *   color: PIXI.utils.hex2rgb(0xCCCCCC)
   * })
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;
}
