import type { MaybeArray } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type VFXPath from "./vfx-path.mjs";
import type VFXComponent from "./vfx-component.mjs";

/**
 * Interpolate rotation in radians between two angles.
 * @param r1 - Start rotation in radians
 * @param r2 - End rotation in radians
 * @param i  - Interpolation weight in [0, 1]
 */
export function interpolateRotation(r1: number, r2: number, i: number): number;

/**
 * Rotation options accepted by {@linkcode parseRotation}.
 */
export interface ParseRotationData {
  /** Initial rotation in degrees */
  angle?: number | undefined;

  /** Initial rotation in radians */
  rotation?: number | undefined;

  /** Incremental rotation towards a destination position */
  rotateTowards?: Canvas.Point | undefined;

  /** Rotate from an origin position, needed if using rotateTowards */
  origin?: Canvas.Point | undefined;
}

/**
 * Parse rotation options normalized to radians from shared config objects
 */
export function parseRotation(data: ParseRotationData): number;

/**
 * Resolves a component animation by name.
 * @param functionName - Name of the animation object in `foundry.vfx.CONFIG.animations`
 * @returns The resolved animations object
 * @throws If the named animation has not been registered in `CONFIG.Canvas.vfx.animations`
 */
export function resolveAnimation(functionName: keyof CONFIG.Canvas.VFX.Animations): VFXComponent.Animation;

/**
 * Resolves an anime.js easing function by name and initializes it with parameters.
 * @param functionName - Name of the easing function
 * @param easingParams - Optional positional parameters to initialize the easing function
 * @returns The resolved easing function
 * @throws If no such animejs easing function exists, or if it requires parameters that were not provided
 */
export function resolveEasing(
  functionName: string,
  easingParams?: MaybeArray<number | string>,
): (time: number) => number;

/**
 * Generates points along a cubic Hermite spline segment.
 * @param p0        - Start control point
 * @param m0        - Tangent vector at start point
 * @param p1        - End control point
 * @param m1        - Tangent vector at end point
 * @param numPoints - Number of points to generate along the segment
 * @param auxiliary - An array of auxiliary numeric attributes to interpolate
 * @returns Array of points which may be augmented with additional auxiliary attributes
 */
export function generateHermiteSegment(
  p0: VFXPath.BasePathPoint,
  m0: Canvas.Point,
  p1: VFXPath.BasePathPoint,
  m1: Canvas.Point,
  numPoints: number,
  auxiliary?: string[],
): VFXPath.BasePathPoint[];

/**
 * Interpolate auxiliary attributes between two points.
 * @param p0        - Start control point
 * @param p1        - End control point
 * @param t         - Interpolation parameter
 * @param auxiliary - An array of auxiliary numeric attributes to interpolate. These attributes must be
 *                    present all points. Attributes are either interpolated or carried forward from
 *                    their last-observed value.
 * @returns Interpolated auxiliary properties
 */
export function interpolateProperties(
  p0: VFXPath.BasePathPoint,
  p1: VFXPath.BasePathPoint,
  t: number,
  auxiliary?: string[],
): Record<string, number>;
