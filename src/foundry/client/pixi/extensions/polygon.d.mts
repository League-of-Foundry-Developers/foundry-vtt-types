import type { InexactPartial, NullishProps } from "../../../../utils/index.d.mts";

declare module "pixi.js" {
  interface Polygon {
    /**
     * Test whether the polygon is has a positive signed area.
     * Using a y-down axis orientation, this means that the polygon is "clockwise".
     */
    get isPositive(): boolean;

    /**
     * @remarks Non enumerable
     */
    _isPositive?: boolean;

    /**
     * Clear the cached signed orientation.
     */
    clearCache(): void;

    /**
     * Compute the signed area of polygon using an approach similar to ClipperLib.Clipper.Area.
     * The math behind this is based on the Shoelace formula. https://en.wikipedia.org/wiki/Shoelace_formula.
     * The area is positive if the orientation of the polygon is positive.
     * @returns The signed area of the polygon
     */
    signedArea(): number;

    /**
     * Reverse the order of the polygon points in-place, replacing the points array into the polygon.
     * Note: references to the old points array will not be affected.
     * @returns This polygon with its orientation reversed
     */
    reverseOrientation(): this;

    /**
     * Add a de-duplicated point to the Polygon.
     * @param point - The point to add to the Polygon
     * @returns A reference to the polygon for method chaining
     */
    addPoint(point: Canvas.Point): this;

    /**
     * Return the bounding box for a PIXI.Polygon.
     * The bounding rectangle is normalized such that the width and height are non-negative.
     * @returns The bounding PIXI.Rectangle
     */
    getBounds(): PIXI.Rectangle;

    /**
     * Construct a PIXI.Polygon instance from an array of clipper points [\{X,Y\}, ...].
     * @param points  - An array of points returned by clipper
     * @param options - Options which affect how canvas points are generated
     * @param scalingFactor -
     * @returns The resulting PIXI.Polygon
     */
    fromClipperPoints(
      points: PIXI.Polygon.ClipperPoint[],
      options?: Pick<PIXI.Polygon.IntersectClipperOptions, "scalingFactor">,
    ): PIXI.Polygon;

    /**
     * Convert a PIXI.Polygon into an array of clipper points [\{X,Y\}, ...].
     * Note that clipper points must be rounded to integers.
     * In order to preserve some amount of floating point precision, an optional scaling factor may be provided.
     * @param options - Options which affect how clipper points are generated
     * @returns An array of points to be used by clipper
     */
    toClipperPoints(options?: Pick<PIXI.Polygon.IntersectClipperOptions, "scalingFactor">): PIXI.Polygon.ClipperPoint[];

    /**
     * Determine whether the PIXI.Polygon is closed, defined by having the same starting and ending point.
     * @remarks Non-enumerable
     */
    get isClosed(): boolean;

    /**
     * Intersect this PIXI.Polygon with another PIXI.Polygon using the clipper library.
     * @param other   - Another PIXI.Polygon
     * @param options - Options which configure how the intersection is computed
     * @returns The intersected polygon
     */
    intersectPolygon(other: PIXI.Polygon, options?: PIXI.Polygon.IntersectClipperOptions): PIXI.Polygon;

    /**
     * Intersect this PIXI.Polygon with an array of ClipperPoints.
     * @param clipperPoints - Array of clipper points generated by PIXI.Polygon.toClipperPoints()
     * @param options       - Options which configure how the intersection is computed
     */
    intersectClipper(
      clipperPoints: PIXI.Polygon.ClipperPoint[],
      options?: PIXI.Polygon.IntersectClipperOptions,
    ): PIXI.Polygon.ClipperPoint[];

    /**
     * Intersect this PIXI.Polygon with a PIXI.Circle.
     * For now, convert the circle to a Polygon approximation and use intersectPolygon.
     * In the future we may replace this with more specialized logic which uses the line-circle intersection formula.
     * @param circle  - A PIXI.Circle
     * @param options - Options which configure how the intersection is computed
     * @returns The intersected polygon
     */
    intersectCircle(circle: PIXI.Circle, options?: PIXI.Circle.IntersectClipperOptions): PIXI.Polygon;

    /**
     * Intersect this PIXI.Polygon with a PIXI.Rectangle.
     * For now, convert the rectangle to a Polygon and use intersectPolygon.
     * In the future we may replace this with more specialized logic which uses the line-line intersection formula.
     * @param rect    - A PIXI.Rectangle
     * @param options - Options which configure how the intersection is computed
     * @returns The intersected polygon
     */
    intersectRectangle(rect: PIXI.Rectangle, options?: PIXI.Rectangle.IntersectPolygonOptions): PIXI.Polygon;
  }

  namespace Polygon {
    /** @privateRemarks Foundry uses this type instead of full `ClipperLib.IntPoint` objects */
    interface ClipperPoint {
      X: number;
      Y: number;
    }

    /** @internal Intermediary type to simplify use of optionality- and nullish-permissiveness-modifying helpers */
    type _IntersectClipperOptions = InexactPartial<{
      /**
       * A scaling factor passed to Polygon#toClipperPoints to preserve precision
       * @remarks Can't be null as, where it has any, it only has defaults provided by `{scalingFactor=1}={}`
       * @defaultValue `1`
       */
      scalingFactor: number;
    }> &
      NullishProps<{
        /**
         * The clipper clip type
         * @remarks ClipperLib functions require a non-nullish `ClipperLib.ClipType` value, but the Foundry functions have `??=` guards for this.
         * @defaultValue `ClipperLib.ClipType.ctIntersection`
         */
        clipType: ClipperLib.ClipType;
      }>;

    interface IntersectClipperOptions extends _IntersectClipperOptions {}
  }
}
