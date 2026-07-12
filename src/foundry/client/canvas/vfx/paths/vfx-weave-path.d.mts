import type VFXPath from "../vfx-path.d.mts";

/**
 * Generate an oscillating weave path between provided control points using cubic Hermite splines.
 * @param waypoints - Explicit waypoints to interpolate
 * @param params    - Spline interpolation parameters
 */
declare function weavePath(waypoints: VFXPath.BasePathPoint[], params?: WeavePathOptions): VFXPath;

export default weavePath;

/**
 * Generate cubic Hermite spline points for a pair of control points.
 * @param origin      - Starting point of the weave
 * @param destination - Ending point of the weave
 * @param options     - Configuration options
 */
export function generateWeavePoints(
  origin: VFXPath.BasePathPoint,
  destination: VFXPath.BasePathPoint,
  options?: WeavePathOptions,
): VFXPath.BasePathPoint[];

export interface WeavePathOptions {
  /** Number of Hermite arcs (1 = single arc, 2 = up/down pair, etc., default 1). */
  arcCount?: number | undefined;
  /** Ratio of the path length that determines the peak displacement (default 0.15). */
  amplitude?: number | undefined;
  /** Multiplier applied to the Hermite tangents (default 1). */
  tangentScale?: number | undefined;
  /** Starting direction of the weave (1 = "up", -1 = "down", default 1). */
  direction?: number | undefined;
  /** Points generated per Hermite segment (default 8). */
  segmentPoints?: number | undefined;
  /** An array of auxiliary parameter names. */
  auxiliary?: string[] | undefined;
}
