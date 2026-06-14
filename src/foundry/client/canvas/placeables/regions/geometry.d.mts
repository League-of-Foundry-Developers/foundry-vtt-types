import type { Region } from "#client/canvas/placeables/_module.d.mts";
import type { Identity } from "#utils";

/**
 * The geometry of a {@linkcode Region}.
 * - Vertex Attribute: `aVertexPosition` (`vec2`)
 * - Draw Mode: {@linkcode PIXI.DRAW_MODES.TRIANGLES}
 */
declare class RegionGeometry extends PIXI.Geometry {
  /**
   * Create a RegionGeometry
   * @internal
   */
  constructor(region: Region.Implementation);

  /** The Region this geometry belongs to */
  get region(): Region.Implementation;

  /**
   * Update the buffers
   * @internal
   * @remarks Is exclusively called externally in `Region##updateShapes`
   */
  _clearBuffers(): void;

  /**
   * Update the buffers
   * @internal
   * @remarks Is exclusively called externally in `Region##updateShapes`
   */
  _updateBuffers(): void;

  #RegionGeometry: true;
}

declare namespace RegionGeometry {
  interface Any extends AnyRegionGeometry {}
  interface AnyConstructor extends Identity<typeof AnyRegionGeometry> {}
}

declare abstract class AnyRegionGeometry extends RegionGeometry {
  constructor(...args: never);
}

export default RegionGeometry;
