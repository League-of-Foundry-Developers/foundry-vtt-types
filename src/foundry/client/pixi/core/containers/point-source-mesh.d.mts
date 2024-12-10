import type { ValueOf } from "../../../../../types/utils.d.mts";

declare global {
  /**
   * Extension of a PIXI.Mesh, with the capabilities to provide a snapshot of the framebuffer.
   */
  class PointSourceMesh extends PIXI.Mesh {
    /**
     * @remarks This override is not in the actual Foundry code, this is reflecting actual usage.
     * PIXI.Mesh asks for a PIXI.MeshMaterial for its second argument, a subclass of PIXI.Shader.
     * But foundry doesn't use those additional properties, so in actual practice it just needs PIXI.Shader.
     */
    constructor(geometry: PIXI.Geometry, shader: PIXI.Shader, state?: PIXI.State, drawMode?: PIXI.DRAW_MODES);

    /**
     * To store the previous blend mode of the last renderer PointSourceMesh.
     */
    protected static _priorBlendMode: ValueOf<PIXI.BLEND_MODES> | undefined;

    /**
     * The current texture used by the mesh.
     */
    protected static _currentTexture: PIXI.Texture | undefined;

    /**
     * The transform world ID of the bounds.
     * @defaultValue `-1`
     */
    _worldID: number;

    /**
     * The geometry update ID of the bounds.
     * @defaultValue `-1`
     */
    _updateID: number;

    override get geometry(): PIXI.Geometry;

    set geometry(value: PIXI.Geometry);

    /** @throws You can't add children to a PointSourceMesh. */
    override addChild(): never;

    /** @throws You can't add children to a PointSourceMesh. */
    override addChildAt(): never;

    protected override _render(renderer: PIXI.Renderer): void;

    override calculateBounds(): void;

    protected override _calculateBounds(): void;

    /** The local bounds need to be drawn from the underlying geometry. */
    override getLocalBounds(rect?: PIXI.Rectangle | null): PIXI.Rectangle;
  }

  namespace PointSourceMesh {
    type AnyConstructor = typeof AnyPointSourceMesh;
  }
}

declare abstract class AnyPointSourceMesh extends PointSourceMesh {
  constructor(arg0: never, ...args: never[]);
}
