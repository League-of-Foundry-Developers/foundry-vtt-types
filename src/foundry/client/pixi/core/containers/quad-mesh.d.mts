import type { Identity } from "#utils";

declare global {
  /**
   * A basic rectangular mesh with a shader only. Does not natively handle textures (but a bound shader can).
   * Bounds calculations are simplified and the geometry does not need to handle texture coords.
   * @privateRemarks Ideally the `shaderClass` passed to the constructor and `get shader()` could be synced up, but `setShaderClass` removes that option
   */
  class QuadMesh extends PIXI.Container {
    /**
     * @param shaderClass - The shader class to use.
     */
    constructor(shaderClass: AbstractBaseShader.AnyConstructor);

    /**
     * The shader bound to this mesh.
     */
    get shader(): AbstractBaseShader;

    /**
     * Assigned blend mode to this mesh.
     */
    get blendMode(): PIXI.BLEND_MODES;

    set blendMode(value);

    /**
     * Initialize shader based on the shader class type.
     * @param shaderClass - Shader class used. Must inherit from AbstractBaseShader.
     */
    setShaderClass(shaderClass: AbstractBaseShader.AnyConstructor): void;

    protected override _render(renderer: PIXI.Renderer): void;

    protected override _calculateBounds(): void;

    /**
     * Tests if a point is inside this QuadMesh.
     */
    containsPoint(point: PIXI.IPointData): boolean;

    override destroy(options?: PIXI.IDestroyOptions | boolean): void;
  }

  namespace QuadMesh {
    interface Any extends AnyQuadMesh {}
    interface AnyConstructor extends Identity<typeof AnyQuadMesh> {}
  }
}

declare abstract class AnyQuadMesh extends QuadMesh {
  constructor(...args: never);
}
