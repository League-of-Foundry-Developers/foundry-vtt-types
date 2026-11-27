import type { AnyObject, Identity } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";

/**
 * A class responsible for constructing a path of points used for animation.
 */
declare class VFXPath {
  /**
   * Construct a VFXPath by providing an array of positions.
   * @param points  - The points which give the path's shape
   * @param options - (default: `{}`)
   * @remarks
   * @throws If `points`, or `options.controlPoints` when passed, is not an array of at least two points.
   */
  constructor(points: VFXPath.Position[], options?: VFXPath.PathOptions);
  constructor(points: VFXPath.ControlledPosition[], options: VFXPath.ControlledPathOptions);

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
   * @remarks
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
  static create(pathName: VFXPath.ConfiguredPath, points: VFXPath.Position[], parameters?: AnyObject): VFXPath;

  #VFXPath: true;
}

declare namespace VFXPath {
  interface Any extends AnyVFXPath {}
  interface AnyConstructor extends Identity<typeof AnyVFXPath> {}

  /** The name of a path generator registered in `CONFIG.Canvas.vfx.paths`. */
  type ConfiguredPath = keyof CONFIG.Canvas.VFX.Paths;

  /**
   * The position of a sprite or other canvas object, as a VFXPositionField describes it.
   * Along a path, an omitted value retains its prior value.
   */
  interface Position extends Canvas.Point {
    /** The elevation */
    elevation?: number | undefined;

    /** The rotation in radians; along a path, the heading where omitted */
    rotation?: number | undefined;

    /** A multiplier of the sprite's own scale on each axis */
    scale?: Canvas.Point | undefined;

    /** The sort order within the elevation */
    sort?: number | undefined;

    /** The sort layer, a value of PrimaryCanvasGroup.SORT_LAYERS */
    sortLayer?: number | undefined;
  }

  /**
   * @remarks A {@linkcode Position} generated between control points, as the path generators pass to the
   * {@linkcode VFXPath} constructor along with {@linkcode PathOptions.controlPoints | controlPoints}.
   */
  interface ControlledPosition extends Position {
    /** @remarks A control index plus the fraction toward the next control point */
    control: number;
  }

  /**
   * @deprecated Replaced by {@linkcode VFXPath.Position} in 14.371, where `elevation` became optional.
   */
  type BasePathPoint = Position;

  /**
   * A point along a VFXPath. Its control is its position along the path's control points:
   * a control index plus the fraction toward the next control point.
   */
  interface PathPoint extends Position {
    rotation: number;

    distance: number;

    index: number;

    elevation: number;

    sort: number;

    control: number;
  }

  /**
   * How a VFXPath interpolates the values of its control points. Each control point holds any value it omits from the
   * one before, with elevation and sort zero until one is given. Elevation and scale blend between control points.
   * Sort and sort layer step to the next control point's value. Rotation turns the short way between control points
   * which both give it, and otherwise follows the heading of the path.
   * @remarks Options for a path whose points are its own control points. With `controlPoints`, use
   * {@linkcode ControlledPathOptions} instead.
   */
  interface PathOptions {
    /**
     * @remarks Only accepted together with {@linkcode ControlledPosition} points; see
     * {@linkcode ControlledPathOptions.controlPoints | ControlledPathOptions#controlPoints}.
     */
    controlPoints?: undefined;

    /**
     * The moment along each control segment, from 0 to 1, at which stepped
     * values change to the next control point's
     * @defaultValue `0`
     */
    step?: number | undefined;

    /**
     * Step elevation with sort and sort layer, rather than blending it
     * @defaultValue `false`
     */
    stepElevation?: boolean | undefined;
  }

  /**
   * {@linkcode PathOptions} for a path whose points were generated between control points.
   * @remarks Split from Foundry's single `VFXPathOptions` typedef so that `controlPoints` can only be passed with
   * {@linkcode ControlledPosition} points, whose `control` the constructor reads.
   */
  interface ControlledPathOptions extends Omit<PathOptions, "controlPoints"> {
    /**
     * Control points for points generated between them, each generated point
     * giving its control: a control index plus the fraction toward the next control point. By default, the points are
     * the control points.
     */
    controlPoints: Position[];
  }

  /** A function that generates a VFXPath from a set of positions and parameters. */
  type Generator = (points: VFXPath.Position[], params: AnyObject) => VFXPath;
}

export default VFXPath;

declare abstract class AnyVFXPath extends VFXPath {
  constructor(...args: never);
}
