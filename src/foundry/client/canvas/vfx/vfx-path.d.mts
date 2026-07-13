import type { Identity } from "#utils";

/**
 * A class responsible for constructing a path of points used for animation.
 */
declare class VFXPath {
  /**
   * @param points - An array of base path points with length of at least 2
   */
  constructor(points: VFXPath.BasePathPoint[]);

  /**
   * The array of points in the path.
   */
  get pathPoints(): VFXPath.PathPoint[];

  /**
   * Total length of the traveled path across all segments.
   */
  get pathLength(): number;

  /**
   * Get the interpolated point for a value x on [0, 1].
   * @param x     - The animation progress on [0, 1]
   * @param index - A known index of the path which was already reached
   */
  interpolatedPoint(x: number, index?: number): VFXPath.PathPoint;

  /**
   * Compute an interpolated point along the path at a given distance.
   * @param distance - The desired distance along the path
   */
  interpolatedPointAtDistance(distance: number): VFXPath.PathPoint;

  /**
   * Get a configured path generator from CONFIG.Canvas.vfx.paths.
   * @param pathName - The named path type
   */
  static getPathGenerator(pathName: string): VFXPath.Generator;

  /**
   * Create a VFXPath instance of a certain named path type defined in CONFIG.Canvas.vfx.paths.
   * @param pathName   - The named path type to construct
   * @param points     - Path points to construct
   * @param parameters - Additional parameters used to construct the path
   */
  static create(pathName: string, points: VFXPath.BasePathPoint[], parameters?: Record<string, unknown>): VFXPath;

  #VFXPath: true;
}

declare namespace VFXPath {
  interface Any extends AnyVFXPath {}
  interface AnyConstructor extends Identity<typeof AnyVFXPath> {}

  /** Base point data accepted by the VFXPath constructor. */
  interface BasePathPoint {
    x: number;
    y: number;
    elevation: number;
    rotation?: number | undefined;
    sort?: number | undefined;
    sortLayer?: number | undefined;
  }

  /** A fully-resolved path point with interpolated distance and index. */
  interface PathPoint {
    x: number;
    y: number;
    rotation: number;
    distance: number;
    index: number;
    elevation: number;
    sort: number;
    sortLayer?: number | undefined;
  }

  /** A function that generates a VFXPath from a set of base points and parameters. */
  type Generator = (points: VFXPath.BasePathPoint[], params: Record<string, unknown>) => VFXPath;
}

export default VFXPath;

declare abstract class AnyVFXPath extends VFXPath {
  constructor(...args: never);
}
