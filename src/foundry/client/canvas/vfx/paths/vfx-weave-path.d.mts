import type VFXPath from "../vfx-path.d.mts";

/**
 * Generate an oscillating weave path between provided control points using cubic hermite splines.
 * @param waypoints - Explicit waypoints to interpolate
 * @param params    - Spline interpolation parameters (default: `{}`)
 * @returns A generated weave path
 */
declare function weavePath(waypoints: VFXPath.BasePathPoint[], params?: WeavePathOptions): VFXPath;

export default weavePath;

/**
 * Generate cubic hermite spline points for a pair of control points.
 * @param origin      - Starting point of the arc
 * @param destination - Ending point of the arc
 * @param options     - Configuration options (default: `{}`)
 * @returns Array of path points
 */
export function generateWeavePoints(
  origin: VFXPath.BasePathPoint,
  destination: VFXPath.BasePathPoint,
  options?: WeavePathOptions,
): VFXPath.BasePathPoint[];

export interface WeavePathOptions {
  /**
   * Number of Hermite arcs (1 = single arc, 2 = up/down pair, etc.)
   * @defaultValue `1`
   */
  arcCount?: number | undefined;

  /**
   * Ratio of the path length that determines the peak displacement of the arcs (1 = full path length)
   * @defaultValue `0.15`
   */
  amplitude?: number | undefined;

  /**
   * Multiplier applied to the Hermite tangents
   * @defaultValue `1`
   */
  tangentScale?: number | undefined;

  /**
   * Starting direction of the weave (1 = "up", -1 = "down")
   * @defaultValue `1`
   */
  direction?: number | undefined;

  /**
   * Points generated per Hermite segment
   * @defaultValue `8`
   */
  segmentPoints?: number | undefined;

  /**
   * An array of auxiliary parameter names
   * @defaultValue `["elevation", "sort"]`
   */
  auxiliary?: string[] | undefined;
}
