import type { AnyObject, Identity } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";

/**
 * A class responsible for constructing a path of points used for animation.
 */
declare class VFXPath {
  /**
   * Construct a VFXPath by providing an array of base point data.
   */
  constructor(points: VFXPath.BasePathPoint[]);

  /**
   * The array of points in the path
   */
  get pathPoints(): VFXPath.PathPoint[];

  /**
   * Total length of the traveled path across all segments.
   */
  get pathLength(): number;

  /**
   * Get the interpolated point for a value x on [0, 1]
   * @param x     - The animation progress on [0, 1]
   * @param index - A known index of the path which was already reached
   */
  interpolatedPoint(x: number, index?: number): VFXPath.PathPoint;

  /**
   * Compute an interpolated point along the path at a given distance.
   * @param distance - The desired distance along the path
   * @returns An interpolated point for object position at that distance
   */
  interpolatedPointAtDistance(distance: number): VFXPath.PathPoint;

  /**
   * Get a configured path generator from CONFIG.Canvas.vfx.paths.
   * @param pathName - The named path type
   * @returns The path generator function
   * @throws If the named path generator has not been registered in `CONFIG.Canvas.vfx.paths`
   */
  static getPathGenerator(pathName: VFXPath.ConfiguredPath): VFXPath.Generator;

  /**
   * Create a VFXPath instance of a certain named path type defined in CONFIG.Canvas.vfx.paths.
   * @param pathName   - The named path type to construct
   * @param points     - Path points to construct
   * @param parameters - Additional parameters used to construct the path
   * @returns The generated path
   */
  static create(pathName: VFXPath.ConfiguredPath, points: VFXPath.BasePathPoint[], parameters?: AnyObject): VFXPath;

  #VFXPath: true;
}

declare namespace VFXPath {
  interface Any extends AnyVFXPath {}
  interface AnyConstructor extends Identity<typeof AnyVFXPath> {}

  /** The name of a path generator registered in `CONFIG.Canvas.vfx.paths`. */
  type ConfiguredPath = keyof CONFIG.Canvas.VFX.Paths;

  /** Base point data accepted by the VFXPath constructor. */
  interface BasePathPoint extends Canvas.Point {
    elevation: number;
    rotation?: number | undefined;
    sort?: number | undefined;
    sortLayer?: number | undefined;
  }

  /** A fully-resolved path point with interpolated distance and index. */
  interface PathPoint extends Canvas.Point {
    rotation: number;
    distance: number;
    index: number;
    elevation: number;
    sort: number;
    sortLayer?: number | undefined;
  }

  /** A function that generates a VFXPath from a set of base points and parameters. */
  type Generator = (points: VFXPath.BasePathPoint[], params: AnyObject) => VFXPath;
}

export default VFXPath;

declare abstract class AnyVFXPath extends VFXPath {
  constructor(...args: never);
}
