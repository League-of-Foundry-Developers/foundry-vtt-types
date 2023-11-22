export {};

declare global {
  namespace PIXI {
    interface Circle {
      /**
       * Determine the center of the circle.
       * Trivial, but used to match center method for other shapes.
       */
      get circle(): Point;

      /**
       * Determine if a point is on or nearly on this circle.
       * @param point   - Point to test
       * @param epsilon - Tolerated margin of error
       *                  (default: `1e-08`)
       * @returns Is the point on the circle within the allowed tolerance?
       */
      pointIsOn(point: Point, epsilon: number): boolean;

      /**
       * Get all intersection points on this circle for a segment A|B
       * Intersections are sorted from A to B.
       * @param a - The first endpoint on segment A|B
       * @param b - The second endpoint on segment A|B
       * @returns Points where the segment A|B intersects the circle
       */
      segmentIntersections(a: Point, b: Point): Point[];

      /**
       * Calculate an x,y point on this circle's circumference given an angle
       * 0: due east
       * π / 2: due south
       * π or -π: due west
       * -π/2: due north
       * @param angle - Angle of the point, in radians
       * @returns The point on the circle at the given angle
       */
      pointAtAngle(angle: number): Point;

      /**
       * Get all the points for a polygon approximation of this circle between two points.
       * The two points can be anywhere in 2d space. The intersection of this circle with the line from this circle center
       * to the point will be used as the start or end point, respectively.
       * This is used to draw the portion of the circle (the arc) between two intersection points on this circle.
       * @param a       - Point in 2d space representing the start point
       * @param b       - Point in 2d space representing the end point
       * @param options - Options passed on to the pointsForArc method
       * @returns An array of points arranged clockwise from start to end
       */
      pointsBetween(a: Point, b: Point, options?: Record<string, unknown>): Point[];

      /**
       * Get the points that would approximate a circular arc along this circle, given a starting and ending angle.
       * Points returned are clockwise. If from and to are the same, a full circle will be returned.
       * @param fromAngle - Starting angle, in radians. π is due north, π/2 is due east
       * @param toAngle   - Ending angle, in radians
       * @param options   - Options which affect how the circle is converted
       * @returns An array of points along the requested arc
       */
      pointsForArc(
        fromAngle: number,
        toAngle: number,
        options?: {
          /** The number of points which defines the density of approximation */
          density: number;
          /** Whether to include points at the circle where the arc starts and ends */
          includeEndpoints: boolean;
        },
      ): Point[];

      /**
       * Approximate this PIXI.Circle as a PIXI.Polygon
       * @param options - Options forwarded on to the pointsForArc method
       * @returns The Circle expressed as a PIXI.Polygon
       */
      toPolygon(options?: Record<string, unknown>): PIXI.Polygon;

      /**
       * The recommended vertex density for the regular polygon approximation of a circle of a given radius.
       * Small radius circles have fewer vertices. The returned value will be rounded up to the nearest integer.
       * See the formula described at:
       * https://math.stackexchange.com/questions/4132060/compute-number-of-regular-polgy-sides-to-approximate-circle-to-defined-precision
       * @param radius  - Circle radius
       * @param epsilon - The maximum tolerable distance between an approximated line segment and the true radius.
       *                            A larger epsilon results in fewer points for a given radius.
       * @returns The number of points for the approximated polygon
       */
      approximateVertexDensity(radius: number, epsilon?: number): number;

      /**
       * Intersect this PIXI.Circle with a PIXI.Polygon.
       * @param polygon - A PIXI.Polygon
       * @param options - Options which configure how the intersection is computed
       * @returns The intersected polygon
       */
      intersectPolygon(
        polygon: PIXI.Polygon,
        options?: {
          /** The number of points which defines the density of approximation */
          density: number;
          /** The clipper clip type */
          clipType: number;
          /**
           * Use the Weiler-Atherton algorithm. Otherwise, use Clipper.
           * (default: `true`)
           * */
          weilerAtherton: boolean;
        },
      ): PIXI.Polygon;

      /**
       * Intersect this PIXI.Circle with an array of ClipperPoints.
       * Convert the circle to a Polygon approximation and use intersectPolygon.
       * In the future we may replace this with more specialized logic which uses the line-circle intersection formula.
       * @param clipperPoints - Array of ClipperPoints generated by PIXI.Polygon.toClipperPoints()
       * @param options       - Options which configure how the intersection is computed
       * @returns The intersected polygon
       */
      intersectClipper(
        clipperPoints: ClipperPoint[],
        options?: {
          /** The number of points which defines the density of approximation */
          density: number;
        },
      ): PIXI.Polygon;
    }
  }
}
