export {};

declare global {
  /**
   * A basic rectangular mesh with a shader only. Does not natively handle textures (but a bound shader can).
   * Bounds calculations are simplified and the geometry does not need to handle texture coords.
   */
  class QuadMesh extends PIXI.Container {
    /**
     * @param shaderClass - The shader class to use.
     */
    constructor(shaderClass: typeof AbstractBaseShader);

    /**
     * The shader bound to this mesh.
     */
    get shader(): AbstractBaseShader;

    /**
     * Assigned blend mode to this mesh.
     */
    get blendMode(): PIXI.BLEND_MODES;

    set blendMode(value: PIXI.BLEND_MODES);

    /**
     * Initialize shader based on the shader class type.
     * @param shaderClass - Shader class used. Must inherit from AbstractBaseShader.
     */
    setShaderClass(shaderClass: typeof AbstractBaseShader): void;

    protected override _render(_renderer: PIXI.Renderer): void;

    protected override _calculateBounds(): void;

    /**
     * Tests if a point is inside this QuadMesh.
     */
    containsPoint(point: PIXI.IPointData): boolean;

    override destroy(options?: boolean | PIXI.IDestroyOptions): void;
  }
}
