import type Document from "../../../../common/abstract/document.d.mts";

declare global {
  /**
   * A SpriteMesh which visualizes a Tile object in the PrimaryCanvasGroup.
   */
  class TileMesh extends OccludableObjectMixin(SpriteMesh) {
    override refresh(): void;

    override setPosition(x: number, y: number): void;

    override updateBounds(): void;

    protected override _getCanvasDocumentData(data: Document.Any): unknown;
  }

  /**
   * A special case subclass of PIXI.TilingSprite which is used in cases where the tile texture needs to repeat.
   * This should eventually be refactored in favor of a more generalized TilingMesh.
   * FIXME: Workaround until we have our custom TilingMesh class.
   */
  // @ts-expect-error There's some property mismatches on Foundry's end but this class is going away in v12 anyways
  class TileSprite extends OccludableObjectMixin(PIXI.TilingSprite) {
    constructor(...args: any[]);

    override setShaderClass(): void;

    override renderDepthData(): void;

    /**
     * @remarks Always returns false
     */
    override get isOccludable(): boolean;

    /**
     * @remarks Always returns false
     */
    override get shouldRenderDepth(): boolean;

    override shader: PIXI.MeshMaterial;

    /**
     * @remarks Monkey patch copied from TileMesh.refresh()
     */
    override refresh(): void;

    /**
     * @remarks Monkey patch copied from TileMesh.setPosition()
     */
    override setPosition(): void;
  }
}
