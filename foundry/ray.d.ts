/**
 * A representation of a the computed collision between a Ray and a segment
 */
declare interface CollisionPoint {
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
   * Point A
   */
  public A: Point;

  /**
   * Point B
   */
  public B: Point;

  /**
   * The normalized angle of the ray in radians on the range (-PI, PI)
   */
  public angle: number;

  /**
   * The distance of the ray
   */
  public distance: number;

  /**
   * Slope x
   */
  public dx: number;

  /**
   * Slope y
   */
  public dy: number;

  /**
   * Return the value of the angle normalized to the range (0, 2*PI)
   * This is useful for testing whether an angle falls between two others
   */
  public readonly normAngle: number;

  /**
   * A bounding rectangle that encompasses the Ray
   */
  public readonly bounds: NormalizedRectangle;

  /**
   * The slope of the ray, dy over dx
   */
  public slope: number;

  /**
   * Origin x
   */
  public x0: number;

  /**
   * Origin y
   */
  public y0: number;

  constructor(A: Point, B: Point);

  /**
   * An internal helper method for computing the intersection between two lines.
   * @internal
   */
  public static _getIntersection(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number
  ): CollisionPoint | false;

  /**
   * A factory method to construct a Ray from an origin point, an angle, and a distance
   * @param x - The origin x-coordinate
   * @param y - The origin y-coordinate
   * @param radians - The ray angle in radians
   * @param distance - The distance of the ray in pixels
   * @returns The constructed Ray instance
   */
  public static fromAngle(x: number, y: number, radians: number, distance: number): Ray;

  /**
   * A factory method to construct a Ray from points in array format.
   * @param A - The origin point [x,y]
   * @param B - The destination point [x,y]
   * @returns The constructed Ray instance
   */
  public static fromArrays(A: [], B: []): Ray;

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
  public intersectSegment(coords: [number, number, number, number]): CollisionPoint | false;

  /**
   * Project the Array by some proportion of it's initial distance.
   * Return the coordinates of that point along the path.
   * @param t - The distance along the Ray
   * @returns The coordinates of the projected point
   */
  public project(t: number): Point;

  /**
   * Create a new ray which uses the same origin point, but a slightly offset angle and distance
   * @param offset - An offset in radians which modifies the angle of the original Ray
   * @param distance - A distance the new ray should project, otherwise uses the same distance.
   * @returns A new Ray with an offset angle
   */
  public shiftAngle(angleOffset: number, distance?: number): Ray;
}
