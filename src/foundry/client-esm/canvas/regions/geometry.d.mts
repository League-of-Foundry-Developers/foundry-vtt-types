/**
 * The geometry of a {@link Region | `Region`}.
 * - Vertex Attribute: `aVertexPosition` (`vec2`)
 * - Draw Mode: `PIXI.DRAW_MODES.TRIANGLES`
 */
declare class RegionGeometry extends PIXI.Geometry {
  /**
   * Create a RegionGeometry
   * @remarks Foundry marked `@internal`
   */
  constructor(region: Region.Object);

  /** The Region this geometry belongs to */
  get region(): Region.Object;

  /**
   * Update the buffers
   * @remarks Foundry marked `@internal`, is exclusively called externally in `Region##updateShapes`
   */
  protected _clearBuffers(): void;

  /**
   * Update the buffers
   * @remarks Foundry marked `@internal`, is exclusively called externally in `Region##updateShapes`
   */
  protected _updateBuffers(): void;
}

declare namespace RegionGeometry {
  interface Any extends AnyRegionGeometry {}
  type AnyConstructor = typeof AnyRegionGeometry;
}

declare abstract class AnyRegionGeometry extends RegionGeometry {
  constructor(...args: never);
}

export default RegionGeometry;
