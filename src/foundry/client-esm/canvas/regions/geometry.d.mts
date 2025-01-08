/**
 * The geometry of a {@link Region}.
 * - Vertex Attribute: `aVertexPosition` (`vec2`)
 * - Draw Mode: `PIXI.DRAW_MODES.TRIANGLES`
 */
declare class RegionGeometry extends PIXI.Geometry {
  /**
   * Create a RegionGeometry
   * @internal
   */
  constructor(region: Region.ConfiguredInstance);

  /** The Region this geometry belongs to */
  get region(): Region.ConfiguredInstance;
  #region: Region.ConfiguredInstance;

  /** 
   * Do the buffers need to be updated? 
   * @defaultValue `true`
   */
  #invalidBuffers: boolean;

  /**
   * Update the buffers
   * @internal
   */
  _clearBuffers(): void;

  /**
   * Update the buffers
   * @internal
   */
  _updateBuffers(): void;
}

export default RegionGeometry;