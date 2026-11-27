import type VFXPath from "../vfx-path.d.mts";

/**
 * Generate a smooth path through every waypoint using a Catmull-Rom spline of cubic hermite segments.
 * @param waypoints - Explicit waypoints the path passes through
 * @param params    - Spline interpolation parameters (default: `{}`)
 * @returns A generated spline path
 */
declare function splinePath(waypoints: VFXPath.Position[], params?: SplinePathParams): VFXPath;

export default splinePath;

/**
 * Generate cubic hermite spline points between a waypoint and the next, tangent at each to the line between its
 * neighbors, so that consecutive segments join without a corner.
 * @param waypoints - Every waypoint of the spline
 * @param index     - The index of the waypoint which starts the segment
 * @param options   - Configuration options (default: `{}`)
 * @returns Array of path points, each giving its control position along the waypoints
 */
export function generateSplinePoints(
  waypoints: VFXPath.Position[],
  index: number,
  options?: SplinePathOptions,
): VFXPath.Position[];

export interface SplinePathOptions {
  /**
   * Number of points to generate (default: half of distance in pixels)
   * @defaultValue `Math.max(10, Math.floor(distance / 2))`
   */
  numPoints?: number | undefined;

  /**
   * Scaling factor for tangent vectors. Determines how curvy the spline is
   * @defaultValue `1`
   */
  tangentScale?: number | undefined;

  /**
   * An array of auxiliary parameter names
   * @defaultValue `["control"]`
   */
  auxiliary?: string[] | undefined;
}

/**
 * @remarks Omits `auxiliary`, which the path always replaces with `["control"]` so that each generated point carries its
 * `control`.
 * @privateRemarks Foundry types this `object & Pick<VFXPathOptions, "step"|"stepElevation">`; the remaining keys are
 * forwarded to {@linkcode generateSplinePoints}.
 */
export interface SplinePathParams
  extends Omit<SplinePathOptions, "auxiliary">, Pick<VFXPath.PathOptions, "step" | "stepElevation"> {}
