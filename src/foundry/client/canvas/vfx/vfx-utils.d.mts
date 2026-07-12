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
 * Parse rotation options normalized to radians from shared config objects.
 * @param data - Object with optional angle, rotation, rotateTowards, or origin
 */
export function parseRotation(data: {
  angle?: number | undefined;
  rotation?: number | undefined;
  rotateTowards?: { x: number; y: number } | undefined;
  origin?: { x: number; y: number } | undefined;
}): number;

/**
 * Resolves a component animation by name.
 * @param functionName - Name of the animation object in CONFIG.Canvas.vfx.animations
 */
export function resolveAnimation(functionName: string): VFXComponent.Animation;

/**
 * Resolves an anime.js easing function by name and initializes it with parameters.
 * @param functionName - Name of the easing function
 * @param easingParams - Optional positional parameters to initialize the easing function
 */
export function resolveEasing(functionName: string, easingParams?: unknown[]): (time: number) => number;

/**
 * Generates points along a cubic Hermite spline segment.
 * @param p0        - Start control point
 * @param m0        - Tangent vector at start point
 * @param p1        - End control point
 * @param m1        - Tangent vector at end point
 * @param numPoints - Number of points to generate along the segment
 * @param auxiliary - An array of auxiliary numeric attributes to interpolate
 */
export function generateHermiteSegment(
  p0: VFXPath.BasePathPoint,
  m0: { x: number; y: number },
  p1: VFXPath.BasePathPoint,
  m1: { x: number; y: number },
  numPoints: number,
  auxiliary?: string[],
): VFXPath.BasePathPoint[];

/**
 * Interpolate auxiliary attributes between two points.
 * @param p0        - Start control point
 * @param p1        - End control point
 * @param t         - Interpolation parameter
 * @param auxiliary - An array of auxiliary numeric attributes to interpolate
 */
export function interpolateProperties(
  p0: VFXPath.BasePathPoint,
  p1: VFXPath.BasePathPoint,
  t: number,
  auxiliary?: string[],
): Record<string, number>;
