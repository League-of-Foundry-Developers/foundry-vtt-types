export {};

declare global {
  /**
   * A batch renderer with a customizable data transfer function to packed geometries.
   */
  class BatchRenderer extends PIXI.BatchRenderer {
    /**
     * The PackInterleavedGeometry function provided by the sampler.
     */
    protected _packInterleavedGeometry: (
      element: PIXI.IBatchableElement,
      attributeBuffer: PIXI.ViewableBuffer,
      indexBuffer: Uint16Array,
      aIndex: number,
      iIndex: number,
    ) => void;

    /**
     * The preRender function provided by the sampler and that is called just before a flush.
     */
    protected _preRenderBatch: (batchRenderer: typeof BatchRenderer) => void;

    get uniforms(): AbstractBaseShader.Uniforms;

    /**
     * The number of reserved texture units that the shader generator should not use (maximum 4).
     */
    protected set reservedTextureUnits(val: number);

    /**
     * Number of reserved texture units reserved by the batch shader that cannot be used by the batch renderer.
     */
    get reservedTextureUnits(): number;

    /**
     * This override allows to allocate a given number of texture units reserved for a custom batched shader.
     * These reserved texture units won't be used to batch textures for PIXI.Sprite or SpriteMesh.
     * @override
     */
    override contextChange(): void;

    override start(): void;

    override packInterleavedGeometry(
      element: PIXI.IBatchableElement,
      attributeBuffer: PIXI.ViewableBuffer,
      indexBuffer: Uint16Array,
      aIndex: number,
      iIndex: number,
    ): void;

    /**
     * Verify if a PIXI plugin exists. Check by name.
     * @param name - The name of the pixi plugin to check.
     * @returns True if the plugin exists, false otherwise.
     */
    static hasPlugin(name: string): boolean;
  }
}
