export {};

declare global {
  /**
   * An extension of PIXI.Mesh which emulate a PIXI.Sprite with a specific shader.
   */
  class SpriteMesh extends PIXI.Mesh {
    /**
     * @param texture   - Texture bound to this sprite mesh.
     * @param shaderCls - Shader class used by this sprite mesh.
     */
    constructor(texture: PIXI.Texture, shaderCls: BaseSamplerShader);
  }
}
