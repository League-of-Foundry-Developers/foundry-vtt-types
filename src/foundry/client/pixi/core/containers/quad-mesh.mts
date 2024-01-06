declare global {
  /**
   * A basic rectangular mesh with a shader only. Does not natively handle textures (but a bound shader can).
   * Bounds calculations are simplified and the geometry does not need to handle texture coords.
   */
  class QuadMesh extends PIXI.Container {
    /**
     * @param shaderCls - The shader class to use.
     */
    constructor(shaderCls: AbstractBaseShader);

    /**
     * The shader.
     */
    shader: BaseSamplerShader;

    /**
     * The state.
     */
    state: PIXI.State;

    /**
     * Assigned geometry to this mesh.
     * We need to handle the refCount.
     */
    get geometry(): PIXI.Geometry;

    set geometry(value: PIXI.Geometry);

    /**
     * Assigned blend mode to this mesh.
     */
    get blendMode(): PIXI.BLEND_MODES;

    set blendMode(value: PIXI.BLEND_MODES);

    /**
     * Initialize shader based on the shader class type.
     * @param shaderCls - Shader class used. Must inherit from AbstractBaseShader.
     */
    setShaderClass(shaderCls: typeof AbstractBaseShader): void;

    protected override _render(_renderer: PIXI.Renderer): void;

    override get width(): number;
    override set width(value: number);

    protected _width: number;

    get height(): number;
    set height(value: number);

    protected _height: number;

    protected override _calculateBounds(): void;

    /**
     * Tests if a point is inside this QuadMesh.
     */
    containsPoint(point: PIXI.IPointData): boolean;

    override destroy(options?: boolean | PIXI.IDestroyOptions | undefined): void;
  }
}
