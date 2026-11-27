import type VFXPath from "../vfx-path.d.mts";

/**
 * Generate an arcing path between provided control points using cubic hermite splines.
 * @param waypoints - Explicit waypoints to interpolate
 * @param params    - Spline interpolation parameters (default: `{}`)
 * @returns A generated arc path
 */
declare function arcPath(waypoints: VFXPath.Position[], params?: ArcPathParams): VFXPath;

export default arcPath;

/**
 * Generate cubic hermite spline points for a pair of control points.
 * @param origin      - Starting point of the arc
 * @param destination - Ending point of the arc
 * @param options     - Configuration options (default: `{}`)
 * @returns Array of path points
 */
export function generateArcPoints(
  origin: VFXPath.Position,
  destination: VFXPath.Position,
  options?: ArcPathOptions,
): VFXPath.Position[];

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

/**
 * @remarks Omits `auxiliary`, which the path always replaces with `["control"]` so that each generated point carries its
 * `control`.
 * @privateRemarks Foundry types this `object & Pick<VFXPathOptions, "step"|"stepElevation">`; the remaining keys are
 * forwarded to {@linkcode generateArcPoints}.
 */
export interface ArcPathParams
  extends Omit<ArcPathOptions, "auxiliary">, Pick<VFXPath.PathOptions, "step" | "stepElevation"> {}
