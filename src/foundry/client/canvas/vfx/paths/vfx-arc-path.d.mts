import type VFXPath from "../vfx-path.d.mts";

/**
 * Generate an arcing path between provided control points using cubic Hermite splines.
 * @param waypoints - Explicit waypoints to interpolate
 * @param params    - Spline interpolation parameters
 */
declare function arcPath(waypoints: VFXPath.BasePathPoint[], params?: ArcPathOptions): VFXPath;

export default arcPath;

/**
 * Generate cubic Hermite spline points for a pair of control points.
 * @param origin      - Starting point of the arc
 * @param destination - Ending point of the arc
 * @param options     - Configuration options
 */
export function generateArcPoints(
  origin: VFXPath.BasePathPoint,
  destination: VFXPath.BasePathPoint,
  options?: ArcPathOptions,
): VFXPath.BasePathPoint[];

interface ArcPathOptions {
  /** Position along path where arc peaks (0-1, default 0.5). */
  peakRatio?: number | undefined;
  /** Height of arc as ratio of path length (default 0.3). */
  peakHeight?: number | undefined;
  /** Direction of arc perpendicular to path (1 for "up", -1 for "down", default 1). */
  direction?: number | undefined;
  /** Number of points to generate (default: half of distance in pixels). */
  numPoints?: number | undefined;
  /** Scaling factor for tangent vectors (default 1). */
  tangentScale?: number | undefined;
  /** An array of auxiliary parameter names. */
  auxiliary?: string[] | undefined;
}
