import type { UnionToIntersection, Brand, InexactPartial, NullishProps } from "fvtt-types/utils";
import * as _PIXI from "pixi.js";
/**
 * Typically in a mapped type TypeScript associates your type to the original.
 * This means you keep modifiers (`readonly` and `?`), go to definition takes you
 * to the original type not the mapped type, and comments are inherited.
 *
 * This utility type disables all of that by effectively tricking TypeScript into
 * not associating them anymore. Writing `{ [_ in string as K]: ... }` is the primary
 * trick used in this type.
 *
 * The reason why this type is so verbose though is because it's trying to preserve
 * modifiers which means it has to check for all 4 possibilities:
 * - mutable and optional
 * - mutable and required
 * - readonly and optional
 * - readonly and required
 */
type RemoveComments<T extends object> = UnionToIntersection<
  {
    [K in keyof T]-?: T extends { [_ in string as K]: unknown }
      ? T extends { [_ in string as K]?: unknown }
        ? { [_ in string as K]?: T[K] }
        : { [_ in string as K]: T[K] }
      : T extends { readonly [_ in string as K]?: unknown }
        ? { readonly [_ in string as K]?: T[K] }
        : { readonly [_ in string as K]: T[K] };
  }[keyof T]
>;

declare global {
  namespace PIXI {
    interface Rectangle {
      /**
       * Bit code labels splitting a rectangle into zones, based on the Cohen-Sutherland algorithm.
       * See https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm
       *          left    central   right
       * top      1001    1000      1010
       * central  0001    0000      0010
       * bottom   0101    0100      0110
       */
      CS_ZONES: PIXI.Rectangle.CS_Zones;

      /**
       * Calculate center of this rectangle.
       */
      get center(): Canvas.Point;

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
      pointIsOn(p: Canvas.Point): boolean;

      /**
       * Calculate the rectangle Zone for a given point located around, on, or in the rectangle.
       * See https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm
       * This differs from _getZone in how points on the edge are treated: they are not considered inside.
       * @param point - A point to test for location relative to the rectangle
       * @returns Which edge zone does the point belong to?
       */
      _getEdgeZone(point: Canvas.Point): PIXI.Rectangle.CS_ZONES;

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
      pointsBetween(a: Canvas.Point, b: Canvas.Point): Canvas.Point[];

      /**
       * Get all intersection points for a segment A|B
       * Intersections are sorted from A to B.
       * @param a - Endpoint A of the segment
       * @param b - Endpoint B of the segment
       * @returns Array of intersections or empty if no intersection.
       *  If A|B is parallel to an edge of this rectangle, returns the two furthest points on
       *  the segment A|B that are on the edge.
       *  The return object's t0 property signifies the location of the intersection on segment A|B.
       *  This will be NaN if the segment is a point.
       *  The return object's t1 property signifies the location of the intersection on the rectangle edge.
       *  The t1 value is measured relative to the intersecting edge of the rectangle.
       */
      segmentIntersections(a: Canvas.Point, b: Canvas.Point): Canvas.Point[];

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
      toPolygon(): PIXI.Polygon;

      /**
       * Get the left edge of this rectangle.
       * The returned edge endpoints are oriented clockwise around the rectangle.
       */
      get leftEdge(): PIXI.Rectangle.Edge;

      /**
       * Get the right edge of this rectangle.
       * The returned edge endpoints are oriented clockwise around the rectangle.
       */
      get rightEdge(): PIXI.Rectangle.Edge;

      /**
       * Get the top edge of this rectangle.
       * The returned edge endpoints are oriented clockwise around the rectangle.
       */
      get topEdge(): PIXI.Rectangle.Edge;

      /**
       * Get the bottom edge of this rectangle.
       * The returned edge endpoints are oriented clockwise around the rectangle.
       */
      get bottomEdge(): PIXI.Rectangle.Edge;

      /**
       * Calculate the rectangle Zone for a given point located around or in the rectangle.
       * https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm
       *
       * @param p - Point to test for location relative to the rectangle
       */
      _getZone(p: Canvas.Point): PIXI.Rectangle.CS_ZONES;

      /**
       * Test whether a line segment AB intersects this rectangle.
       * @param a       - The first endpoint of segment AB
       * @param b       - The second endpoint of segment AB
       * @param options - Options affecting the intersect test.
       * @returns True if intersects.
       */
      lineSegmentIntersects(
        a: Canvas.Point,
        b: Canvas.Point,
        options?: PIXI.Rectangle.LineSegmentIntersectsOptions,
      ): boolean;

      /**
       * Intersect this PIXI.Rectangle with a PIXI.Polygon.
       * @param polygon - A PIXI.Polygon
       * @param options - Options which configure how the intersection is computed
       * @returns The intersected polygon
       */
      intersectPolygon(polygon: PIXI.Polygon, options?: PIXI.Rectangle.WACIntersectPolygonOptions): PIXI.Polygon;
      intersectPolygon(polygon: PIXI.Polygon, options?: PIXI.Rectangle.ClipperLibIntersectPolygonOptions): PIXI.Polygon;
      intersectPolygon(polygon: PIXI.Polygon, options?: PIXI.Rectangle.IntersectPolygonOptions): PIXI.Polygon;

      /**
       * Intersect this PIXI.Rectangle with an array of ClipperPoints. Currently, uses the clipper library.
       * In the future we may replace this with more specialized logic which uses the line-line intersection formula.
       * @param clipperPoints - Array of ClipperPoints generated by PIXI.Polygon.toClipperPoints()
       * @param options       - Options which configure how the intersection is computed
       * @returns The intersected polygon
       * @remarks Foundry has this typed as returning `PIXI.Polygon | null`, but this method will actually
       *          return an empty array if this rectangle's width or height are 0. I believe this is a bug.
       */
      intersectClipper(
        clipperPoints: PIXI.Polygon.ClipperPoint[],
        options?: PIXI.Polygon.IntersectClipperOptions,
      ): PIXI.Polygon | [];

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
       * Fits this rectangle around this rectangle rotated around the given pivot counterclockwise by the given angle in radians.
       * @param radians - The angle of rotation.
       * @param pivot   - An optional pivot point (normalized).
       * @returns A new rotated rectangle
       */
      rotate(radians: number, pivot?: PIXI.Point): PIXI.Rectangle;
    }

    namespace Rectangle {
      type CS_ZONES = Brand<number, "PIXI.Rectangle.CS_ZONES">;

      interface CS_Zones {
        INSIDE: 0x0000 & CS_ZONES;
        LEFT: 0x0001 & CS_ZONES;
        RIGHT: 0x0010 & CS_ZONES;
        TOP: 0x1000 & CS_ZONES;
        BOTTOM: 0x0100 & CS_ZONES;
        TOPLEFT: 0x1001 & CS_ZONES;
        TOPRIGHT: 0x1010 & CS_ZONES;
        BOTTOMRIGHT: 0x0110 & CS_ZONES;
        BOTTOMLEFT: 0x0101 & CS_ZONES;
      }

      interface Edge {
        A: Canvas.Point;
        B: Canvas.Point;
      }

      /** @internal */
      type _LineSegmentIntersectsOptions = InexactPartial<{
        /**
         * If true, a line contained within the rectangle will return true
         * @defaultValue `false`
         * @remarks Can't be null as it only has a parameter default
         */
        inside: boolean;
      }>;

      /** Options affecting the intersect test. */
      interface LineSegmentIntersectsOptions extends _LineSegmentIntersectsOptions {}

      /**
       *  @privateRemarks The options for `intersectPolygon` when `weilerAtherton` is true (or not provided)
       * Property descriptions have been omitted and `RemoveComments` is in use here to avoid redundant
       * instellisense on overloaded method.
       */
      interface WACIntersectPolygonOptions
        extends RemoveComments<Omit<WeilerAthertonClipper.CombineOptions, keyof WeilerAthertonClipper.ClipOpts>> {
        weilerAtherton?: true;
      }

      /**
       * @privateRemarks The options for `intersectPolygon` when `weilerAtherton` is false.
       * Property descriptions have been omitted and `RemoveComments` is in use here to avoid redundant
       * instellisense on overloaded method.
       */
      interface ClipperLibIntersectPolygonOptions extends RemoveComments<PIXI.Polygon.IntersectClipperOptions> {
        weilerAtherton: false;
      }

      /** @internal */
      type _IntersectPolygonOptions = NullishProps<{
        /**
         * The clipper clip type
         * @defaultValue `ClipperLib.ClipType.ctIntersection` (equivalent to `WeilerAthertonClipper.CLIP_TYPES.INTERSECTION`)
         * @remarks If `weilerAtherton` is truthy or not provided, this must be one of the two `WeilerAthertonClipper.CLIP_TYPES`.
         * However, the first two entries in `ClipperLib.ClipType` map 1:1 with the two `CLIP_TYPES`, so the main restriction is
         * that a combination of a truthy `weilerAtherton` and a `clipType` that is either `ClipperLib.ClipTypes.ctDifference` or
         * `.ctXor` is not allowed.
         */
        clipType: ClipperLib.ClipType | WeilerAthertonClipper.CLIP_TYPES;

        /**
         * Use the Weiler-Atherton algorithm. Otherwise, use Clipper.
         * @defaultValue `true`
         * */
        weilerAtherton: boolean;
      }> &
        Pick<PIXI.Polygon.IntersectClipperOptions, "scalingFactor"> &
        Pick<WeilerAthertonClipper.CombineOptions, "canMutate">;

      interface IntersectPolygonOptions extends _IntersectPolygonOptions {}
    }
    class Rectangle extends _PIXI.Rectangle {
      /**
       * Create normalized rectangular bounds given a rectangle shape and an angle of central rotation.
       * @param x       - The top-left x-coordinate of the un-rotated rectangle
       * @param y       - The top-left y-coordinate of the un-rotated rectangle
       * @param width   - The width of the un-rotated rectangle
       * @param height  - The height of the un-rotated rectangle
       * @param radians - The angle of rotation about the center
       * @param pivot   - An optional pivot point (if not provided, the pivot is the centroid)
       * @param _outRect - (Internal)
       * @returns The constructed rotated rectangle bounds
       */
      static fromRotation(
        x: number,
        y: number,
        width: number,
        height: number,
        radians: number,
        pivot?: PIXI.Point,
        _outRect?: PIXI.Rectangle,
      ): PIXI.Rectangle;
    }
  }
}
