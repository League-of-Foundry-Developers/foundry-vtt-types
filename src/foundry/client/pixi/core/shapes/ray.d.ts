import type { LineIntersection } from "../../../../common/utils/geometry.mjs.js";

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
    constructor(A: Point, B: Point);

    /**
     * The origin point, `{x, y}`
     */
    A: Point;

    /**
     * The destination point, `{x, y}`
     */
    B: Point;

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
     * @internal
     */
    protected _angle: number | undefined;

    /**
     * The cached distance, computed lazily in Ray#distance
     * @defaultValue `undefined`
     * @internal
     */
    protected _distance: number | undefined;

    /**
     * The normalized angle of the ray in radians on the range (-PI, PI).
     * The angle is computed lazily (only if required) and cached.
     */
    get angle(): number;
    set angle(value: number);

    /**
     * A bounding rectangle that encompasses the Ray
     */
    get bounds(): NormalizedRectangle;

    /**
     * The distance (length) of the Ray in pixels.
     * The distance is computed lazily (only if required) and cached.
     */
    get distance(): number;
    set distance(value: number);

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
    static fromArrays(A: PointArray, B: PointArray): Ray;

    /**
     * Project the Array by some proportion of it's initial distance.
     * Return the coordinates of that point along the path.
     * @param t - The distance along the Ray
     * @returns The coordinates of the projected point
     */
    project(t: number): { x: number; y: number };

    /**
     * Create a Ray by projecting a certain distance towards a known point.
     * @param origin   - The origin of the Ray
     * @param point    - The point towards which to project
     * @param distance - The distance of projection
     */
    static towardsPoint(origin: Point, point: Point, distance: number): Ray;

    /**
     * Create a Ray by projecting a certain squared-distance towards a known point.
     * @param origin    - The origin of the Ray
     * @param point     - The point towards which to project
     * @param distance2 - The squared distance of projection
     */
    static towardsPointSquared(origin: Point, point: Point, distance2: number): Ray;

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
    shiftAngle(angleOffset: number, distance?: number): Ray;

    /**
     * Find the point I[x,y] and distance t* on ray R(t) which intersects another ray
     * @see foundry.utils.lineLineIntersection
     */
    intersectSegment(coords: [x0: number, y0: number, x1: number, y1: number]): LineIntersection | null;
  }

  /**
   * A subclass of Ray that is used specifically for computing source polygons
   *
   * This was used for the RadialSweepPolygon but can now be deleted once that is
   * @deprecated since v9d2
   */
  class SightRay extends Ray {
    /**
     * The array of sorted collision points which apply for this Ray.
     */
    collisions: WallEndpoint[];

    /**
     * The target endpoint at which this Ray was fired
     */
    endpoint: WallEndpoint | null;

    /**
     * The result objects which records the outcome of this Ray
     */
    result: {
      collisions: unknown[];
      continuation: unknown | undefined;
      limitation: number;
      superfluous: boolean;
      stopped: boolean;
      activeWalls: unknown | undefined;
    };

    /**
     * The final collision point that this SightRay encountered.
     */
    get lastCollision(): WallEndpoint | null;
  }
}
