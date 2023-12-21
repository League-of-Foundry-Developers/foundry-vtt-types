export {};

declare global {
  /**
   * Extension of a PIXI.Mesh, with the capabilities to provide a snapshot of the framebuffer.
   */
  class PointSourceMesh extends PIXI.Mesh {
    /**
     * To store the previous blend mode of the last renderer PointSourceMesh.
     */
    protected static _priorBlendMode: PIXI.BLEND_MODES;

    /**
     * The current texture used by the mesh.
     */
    protected static _currentTexture: PIXI.Texture;

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

    /**
     * @throws You can't add children to a PointSourceMesh.
     * @privateRemarks This method is meant to be an override, but the PIXI.Mesh class does not have an addChildren() method
     */
    addChildren(): never;

    protected override _render(renderer: PIXI.Renderer): void;

    override calculateBounds(): void;

    protected override _calculateBounds(): void;

    /** The local bounds need to be drawn from the underlying geometry. */
    override getLocalBounds(rect?: PIXI.Rectangle | undefined): PIXI.Rectangle;
  }
}
