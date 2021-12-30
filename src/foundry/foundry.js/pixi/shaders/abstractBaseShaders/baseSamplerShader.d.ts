/**
 * A simple shader to emulate a PIXI.Sprite with a PIXI.Mesh (but faster!)
 */
declare class BaseSamplerShader extends AbstractBaseShader {
  /** @override */
  static vertexShader: string;

  /** @override */
  static fragmentShader: string;

  /**
   * @override
   * @defaultValue
   * ```javascript
   * {
   *   screenDimensions: [1, 1],
   *   sampler: 0
   * };
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;
}
