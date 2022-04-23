/**
 * A simple shader to emulate a PIXI.Sprite with a PIXI.Mesh (but faster!)
 */
declare class BaseSamplerShader extends AbstractBaseShader {
  static override vertexShader: string;

  static override fragmentShader: string;

  /**
   * @defaultValue
   * ```javascript
   * {
   *   screenDimensions: [1, 1],
   *   sampler: 0
   * };
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms;
}
