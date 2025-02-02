import type { LineIntersection } from "../../../../common/utils/geometry.d.mts";

declare global {
  interface RayIntersection {
    /** The x-coordinate of intersection */
    x: number;

    /** The y-coordinate of intersection */
    y: number;

    /** The proximity to the Ray origin, as a ratio of distance */
    t0: number;

    /** The proximity to the Ray destination, as a ratio of distance */
    t1: number;
  }

  /**
   * A ray for the purposes of computing sight and collision
   * Given points A[x,y] and B[x,y]
   *
   * Slope-Intercept form:
   * y = a + bx
   * y = A.y + ((B.y - A.Y) / (B.x - A.x))x
   *
   * Parametric form:
   * R(t) = (1-t)A + tB
   */
  class Ray {
    /**
     * @param A - The origin of the Ray
     * @param B - The destination of the Ray
     */
    constructor(A: Canvas.Point, B: Canvas.Point);

    /**
     * The origin point, `{x, y}`
     */
    A: Canvas.Point;

    /**
     * The destination point, `{x, y}`
     */
    B: Canvas.Point;

    /**
     * The origin y-coordinate
     */
    y0: number;

    /**
     * The origin x-coordinate
     */
    x0: number;

    /**
     * The horizontal distance of the ray, x1 - x0
     */
    dx: number;

    /**
     * The vertical distance of the ray, y1 - y0
     */
    dy: number;

    /**
     * The slope of the ray, dy over dx
     */
    slope: number;

    /**
     * The cached angle, computed lazily in Ray#angle
     * @defaultValue `undefined`
     * @privateRemarks Foundry marked `@private` and doesn't type the `| undefined`
     */
    protected _angle: number | undefined;

    /**
     * The cached distance, computed lazily in Ray#distance
     * @defaultValue `undefined`
     * @privateRemarks Foundry marked `@private` and doesn't type the `| undefined`
     */
    protected _distance: number | undefined;

    /**
     * The normalized angle of the ray in radians on the range (-PI, PI).
     * The angle is computed lazily (only if required) and cached.
     */
    get angle(): number;

    set angle(value);

    /**
     * A normalized bounding rectangle that encompasses the Ray
     */
    get bounds(): PIXI.Rectangle;

    /**
     * The distance (length) of the Ray in pixels.
     * The distance is computed lazily (only if required) and cached.
     */
    get distance(): number;

    set distance(value);

    /**
     * A factory method to construct a Ray from an origin point, an angle, and a distance
     * @param x        - The origin x-coordinate
     * @param y        - The origin y-coordinate
     * @param radians  - The ray angle in radians
     * @param distance - The distance of the ray in pixels
     * @returns The constructed Ray instance
     */
    static fromAngle(x: number, y: number, radians: number, distance: number): Ray;

    /**
     * A factory method to construct a Ray from points in array format.
     * @param A - The origin point [x,y]
     * @param B - The destination point [x,y]
     * @returns The constructed Ray instance
     */
    static fromArrays(A: Canvas.PointArray, B: Canvas.PointArray): Ray;

    /**
     * Project the Array by some proportion of it's initial distance.
     * Return the coordinates of that point along the path.
     * @param t - The distance along the Ray
     * @returns The coordinates of the projected point
     */
    project(t: number): PIXI.IPointData;

    /**
     * Create a Ray by projecting a certain distance towards a known point.
     * @param origin   - The origin of the Ray
     * @param point    - The point towards which to project
     * @param distance - The distance of projection
     */
    static towardsPoint(origin: Canvas.Point, point: Canvas.Point, distance: number): Ray;

    /**
     * Create a Ray by projecting a certain squared-distance towards a known point.
     * @param origin    - The origin of the Ray
     * @param point     - The point towards which to project
     * @param distance2 - The squared distance of projection
     */
    static towardsPointSquared(origin: Canvas.Point, point: Canvas.Point, distance2: number): Ray;

    /**
     * Reverse the direction of the Ray, returning a second Ray
     */
    reverse(): Ray;

    /**
     * Create a new ray which uses the same origin point, but a slightly offset angle and distance
     * @param offset   - An offset in radians which modifies the angle of the original Ray
     * @param distance - A distance the new ray should project, otherwise uses the same distance.
     * @returns A new Ray with an offset angle
     */
    shiftAngle(
      offset: number,
      /**
       * @defaultValue `this.distance`
       * @remarks Default provided by `||`, so `0` is effectively `this.distance`
       */
      distance?: number | null,
    ): Ray;

    /**
     * Find the point I[x,y] and distance t* on ray R(t) which intersects another ray
     * @see foundry.utils.lineLineIntersection
     */
    intersectSegment(coords: Canvas.PairOfPointsArray): LineIntersection | null;
  }

  namespace Ray {
    interface Any extends AnyRay {}
    type AnyConstructor = typeof AnyRay;
  }
}

declare abstract class AnyRay extends Ray {
  constructor(arg0: never, ...args: never[]);
}
