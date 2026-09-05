import type VFXPath from "../vfx-path.d.mts";

/**
 * Generate an arcing path between provided control points using cubic hermite splines.
 * @param waypoints - Explicit waypoints to interpolate
 * @param params    - Spline interpolation parameters (default: `{}`)
 * @returns A generated arc path
 */
declare function arcPath(waypoints: VFXPath.BasePathPoint[], params?: ArcPathOptions): VFXPath;

export default arcPath;

/**
 * Generate cubic hermite spline points for a pair of control points.
 * @param origin      - Starting point of the arc
 * @param destination - Ending point of the arc
 * @param options     - Configuration options (default: `{}`)
 * @returns Array of path points
 */
export function generateArcPoints(
  origin: VFXPath.BasePathPoint,
  destination: VFXPath.BasePathPoint,
  options?: ArcPathOptions,
): VFXPath.BasePathPoint[];

export interface ArcPathOptions {
  /**
   * Position along path where arc peaks (0-1)
   * @defaultValue `0.5`
   */
  peakRatio?: number | undefined;

  /**
   * Height of arc as ratio of path length
   * @defaultValue `0.3`
   */
  peakHeight?: number | undefined;

  /**
   * Direction of arc perpendicular to path (1 for "up", -1 for "down")
   * @defaultValue `1`
   */
  direction?: number | undefined;

  /**
   * Number of points to generate (default: half of distance in pixels)
   * @defaultValue `Math.max(10, Math.floor(distance / 2))`
   */
  numPoints?: number | undefined;

  /**
   * Scaling factor for tangent vectors. Determines how curvy the arc is
   * @defaultValue `1`
   */
  tangentScale?: number | undefined;

  /**
   * An array of auxiliary parameter names
   * @defaultValue `["elevation", "sort"]`
   */
  auxiliary?: string[] | undefined;
}
