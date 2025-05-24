import type { Identity } from "#utils";

declare global {
  /**
   * Extension of a PIXI.Mesh, with the capabilities to provide a snapshot of the framebuffer.
   * @remarks Foundry only uses this with `AdaptiveLightingShader` subclasses, thus the type param default
   */
  class PointSourceMesh<Shader extends PIXI.Shader = AdaptiveLightingShader> extends PIXI.Mesh<Shader> {
    /**
     * @remarks This override is not in the actual Foundry code, it's just to sync up the Shader type param with super
     */
    constructor(geometry: PIXI.Geometry, shader: Shader, state?: PIXI.State, drawMode?: PIXI.DRAW_MODES);

    /**
     * To store the previous blend mode of the last renderer PointSourceMesh.
     * @privateRemarks Despite being `protected`, this is accessed externally in `CanvasIlluminationEffects#render`
     */
    protected static _priorBlendMode: PIXI.BLEND_MODES | undefined;

    /**
     * The current texture used by the mesh.
     * @privateRemarks Despite being `protected`, this is accessed externally in `CanvasIlluminationEffects#render`
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
    override getLocalBounds(
      /**
       * @defaultValue `new PIXI.Rectangle()`
       * @remarks Default provided by `??=` in function body. `null` would be allowable here but breaks inheritance
       */
      rect?: PIXI.Rectangle,
    ): PIXI.Rectangle;
  }

  namespace PointSourceMesh {
    interface Any extends AnyPointSourceMesh {}
    interface AnyConstructor extends Identity<typeof AnyPointSourceMesh> {}
  }
}

declare abstract class AnyPointSourceMesh extends PointSourceMesh<PIXI.Shader.Any> {
  constructor(...args: never);
}
