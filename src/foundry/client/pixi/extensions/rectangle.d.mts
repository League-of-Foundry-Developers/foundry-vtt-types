export {};

declare module "pixi.js" {
  interface Rectangle {
    /**
     * Bit code labels splitting a rectangle into zones, based on the Cohen-Sutherland algorithm.
     * See https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm
     *          left    central   right
     * top      1001    1000      1010
     * central  0001    0000      0010
     * bottom   0101    0100      0110
     */
    CS_ZONES: {
      INSIDE: 0x0000;
      LEFT: 0x0001;
      RIGHT: 0x0010;
      TOP: 0x1000;
      BOTTOM: 0x0100;
      TOPLEFT: 0x1001;
      TOPRIGHT: 0x1010;
      BOTTOMRIGHT: 0x0110;
      BOTTOMLEFT: 0x0101;
    };

    /**
     * Calculate center of this rectangle.
     */
    get center(): Point;

    /**
     * Return the bounding box for a PIXI.Rectangle.
     * The bounding rectangle is normalized such that the width and height are non-negative.
     */
    getBounds(): PIXI.Rectangle;

    /**
     * Determine if a point is on or nearly on this rectangle.
     * @param p - Point to test
     * @returns Is the point on the rectangle boundary?
     */
    pointIsOn(p: Point): boolean;

    /**
     * Calculate the rectangle Zone for a given point located around, on, or in the rectangle.
     * See https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm
     * This differs from _getZone in how points on the edge are treated: they are not considered inside.
     * @param point - A point to test for location relative to the rectangle
     * @returns Which edge zone does the point belong to?
     */
    _getEdgeZone(point: Point): PIXI.Rectangle["CS_ZONES"];

    /**
     * Get all the points (corners) for a polygon approximation of a rectangle between two points on the rectangle.
     * The two points can be anywhere in 2d space on or outside the rectangle.
     * The starting and ending side are based on the zone of the corresponding a and b points.
     * (See PIXI.Rectangle.CS_ZONES.)
     * This is the rectangular version of PIXI.Circle.prototype.pointsBetween, and is similarly used
     * to draw the portion of the shape between two intersection points on that shape.
     * @param a - A point on or outside the rectangle, representing the starting position.
     * @param b - A point on or outside the rectangle, representing the starting position.
     * @returns Points returned are clockwise from start to end.
     */
    pointsBetween(a: Point, b: Point): Point[];

    /**
     * Get all intersection points for a segment A|B
     * Intersections are sorted from A to B.
     * @param a - Endpoint A of the segment
     * @param b - Endpoint B of the segment
     * @returns Array of intersections or empty if no intersection.
     *  If A|B is parallel to an edge of this rectangle, returns the two furthest points on
     *  the segment A|B that are on the edge.
     */
    segmentIntersections(a: Point, b: Point): Point[];

    /**
     * Compute the intersection of this Rectangle with some other Rectangle.
     * @param other - Some other rectangle which intersects this one
     * @returns The intersected rectangle
     */
    intersection(other: PIXI.Rectangle): PIXI.Rectangle;

    /**
     * Convert this PIXI.Rectangle into a PIXI.Polygon
     * @returns The Rectangle expressed as a PIXI.Polygon
     */
    toPolygon(): PIXI.Rectangle;

    /**
     * Get the left edge of this rectangle.
     * The returned edge endpoints are oriented clockwise around the rectangle.
     */
    get leftEdge(): {
      A: Point;
      B: Point;
    };

    /**
     * Get the right edge of this rectangle.
     * The returned edge endpoints are oriented clockwise around the rectangle.
     */
    get rightEdge(): {
      A: Point;
      B: Point;
    };

    /**
     * Get the top edge of this rectangle.
     * The returned edge endpoints are oriented clockwise around the rectangle.
     */
    get topEdge(): {
      A: Point;
      B: Point;
    };

    /**
     * Get the bottom edge of this rectangle.
     * The returned edge endpoints are oriented clockwise around the rectangle.
     */
    get bottomEdge(): {
      A: Point;
      B: Point;
    };

    /**
     * Calculate the rectangle Zone for a given point located around or in the rectangle.
     * https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm
     *
     * @param p - Point to test for location relative to the rectangle
     */
    _getZone(p: Point): PIXI.Rectangle["CS_ZONES"];

    /**
     * Test whether a line segment AB intersects this rectangle.
     * @param a       - The first endpoint of segment AB
     * @param b       - The second endpoint of segment AB
     * @param options - Options affecting the intersect test.
     * @returns True if intersects.
     */
    lineSegmentIntersects(
      a: Point,
      b: Point,
      options?: {
        /** If true, a line contained within the rectangle will return true */
        inside?: boolean;
      },
    ): boolean;

    /**
     * Intersect this PIXI.Rectangle with a PIXI.Polygon.
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
    ): PIXI.Polygon | null;

    /**
     * Intersect this PIXI.Rectangle with an array of ClipperPoints. Currently, uses the clipper library.
     * In the future we may replace this with more specialized logic which uses the line-line intersection formula.
     * @param clipperPoints - Array of ClipperPoints generated by PIXI.Polygon.toClipperPoints()
     * @param options       - Options which configure how the intersection is computed
     * @returns The intersected polygon
     */
    intersectClipper(
      clipperPoints: PIXI.Polygon.ClipperPoint[],
      options?: {
        /** The number of points which defines the density of approximation */
        density: number;
      },
    ): PIXI.Polygon | null;

    /**
     * Determine whether some other Rectangle overlaps with this one.
     * This check differs from the parent class Rectangle#intersects test because it is true for adjacency (zero area).
     * @param other - Some other rectangle against which to compare
     * @returns Do the rectangles overlap?
     */
    overlaps(other: PIXI.Rectangle): boolean;

    /**
     * Normalize the width and height of the rectangle in-place, enforcing that those dimensions be positive.
     */
    normalize(): PIXI.Rectangle;

    /**
     * Generate a new rectangle by rotating this one clockwise about its center by a certain number of radians
     * @param radians - The angle of rotation
     * @returns A new rotated rectangle
     */
    rotate(radians: number): PIXI.Rectangle;

    /**
     * Create normalized rectangular bounds given a rectangle shape and an angle of central rotation.
     * @param x       - The top-left x-coordinate of the un-rotated rectangle
     * @param y       - The top-left y-coordinate of the un-rotated rectangle
     * @param width   - The width of the un-rotated rectangle
     * @param height  - The height of the un-rotated rectangle
     * @param radians - The angle of rotation about the center
     * @returns The constructed rotated rectangle bounds
     */
    fromRotation(x: number, y: number, width: number, height: number, radians: number): PIXI.Rectangle;
  }
}

declare global {
  /**
   * A PIXI.Rectangle where the width and height are always positive and the x and y are always the top-left
   * @deprecated You are using the NormalizedRectangle class which has been deprecated in favor of PIXI.Rectangle.prototype.normalize
   */
  class NormalizedRectangle extends PIXI.Rectangle {}
}
