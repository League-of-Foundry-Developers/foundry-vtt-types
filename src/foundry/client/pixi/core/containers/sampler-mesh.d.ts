/**
 * A Mesh subclass used to render a texture with faster performance than a PIXI.Sprite.
 */
declare class SamplerMesh extends PIXI.Mesh {
  /**
   * The basic quad geometry used for the Mesh
   * @defaultValue
   * ```javascript
   * new PIXI.Geometry()
   *   .addAttribute("aVertexPosition", [0, 0, 1, 0, 1, 1, 0, 1], 2)
   *   .addAttribute("aUvs", [0, 0, 1, 0, 1, 1, 0, 1], 2)
   *   .addIndex([0, 1, 2, 0, 2, 3])
   * ```
   */
  static QUAD: PIXI.Geometry;

  /**
   * Create a SamplerMesh using a provided RenderTexture
   * @param texture - The texture to render using a Mesh
   */
  static create(texture: PIXI.RenderTexture): SamplerMesh;
}
