/**
 * The geometry of a {@link Region | `Region`}.
 * - Vertex Attribute: `aVertexPosition` (`vec2`)
 * - Draw Mode: `PIXI.DRAW_MODES.TRIANGLES`
 */
declare class RegionGeometry extends PIXI.Geometry {
  /**
   * Create a RegionGeometry
   * @internal
   */
  constructor(region: Region.Object);

  /** The Region this geometry belongs to */
  get region(): Region.Object;

  /**
   * Update the buffers
   * @internal
   */
  protected _clearBuffers(): void;

  /**
   * Update the buffers
   * @internal
   */
  protected _updateBuffers(): void;

  #regionGeometry: true;
}

export default RegionGeometry;
