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
declare class Ray {
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
  static fromArrays(A: [x: number, y: number], B: [x: number, y: number]): Ray;

  /**
   * An internal helper method for computing the intersection between two lines.
   * @internal
   */
  protected static _getIntersection(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number
  ): Ray.CollisionPoint | false;

  /**
   * @param A - The origin of the Ray
   * @param B - The destination of the Ray
   */
  constructor(A: Point, B: Point);

  A: Point;

  B: Point;

  /**
   * The normalized angle of the ray in radians on the range (-PI, PI)
   */
  angle: number;

  /**
   * The distance of the ray
   */
  distance: number;

  dx: number;

  dy: number;

  /**
   * The slope of the ray, dy over dx
   */
  slope: number;

  x0: number;

  y0: number;

  /**
   * A bounding rectangle that encompasses the Ray
   */
  get bounds(): NormalizedRectangle;

  /**
   * Return the value of the angle normalized to the range (0, 2*PI)
   * This is useful for testing whether an angle falls between two others
   */
  get normAngle(): number;

  /**
   * Find the point I[x,y] and distance t* on ray R(t) which intersects another ray
   * http://paulbourke.net/geometry/pointlineplane/
   *
   * @param coords - An array of coordinates [x0, y0, x1, y1] which defines a line segment to test
   *
   * @returns
   *    The point of collision [x,y] the position of that collision point along the Ray (t0) an the tested
   *    segment (t1). Returns false if no collision occurs.
   */
  intersectSegment(coords: [x0: number, y0: number, x1: number, y1: number]): Ray.CollisionPoint | false;

  /**
   * Project the Array by some proportion of it's initial distance.
   * Return the coordinates of that point along the path.
   * @param t - The distance along the Ray
   * @returns The coordinates of the projected point
   */
  project(t: number): Point;

  /**
   * Create a new ray which uses the same origin point, but a slightly offset angle and distance
   * @param offset   - An offset in radians which modifies the angle of the original Ray
   * @param distance - A distance the new ray should project, otherwise uses the same distance.
   * @returns A new Ray with an offset angle
   */
  shiftAngle(angleOffset: number, distance?: number): Ray;
}

declare namespace Ray {
  /**
   * A representation of a the computed collision between a Ray and a segment
   */
  interface CollisionPoint {
    /**
     * Distance of collision along the Ray
     */
    t0: number;

    /**
     * Distance of collision along the Segment
     */
    t1: number;

    /**
     * Point of collision x
     */
    x: number;

    /**
     * Point of collision y
     */
    y: number;
  }
}
