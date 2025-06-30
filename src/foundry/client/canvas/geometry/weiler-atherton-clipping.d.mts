import type { Brand, Identity, InexactPartial } from "#utils";

/**
 * An implementation of the Weiler Atherton algorithm for clipping polygons.
 * This currently only handles combinations that will not result in any holes.
 * Support may be added for holes in the future.
 *
 * This algorithm is faster than the Clipper library for this task because it relies on the unique properties of the
 * circle, ellipse, or convex simple clip object.
 * It is also more precise in that it uses the actual intersection points between the circle/ellipse and polygon,
 * instead of relying on the polygon approximation of the circle/ellipse to find the intersection points.
 *
 * For more explanation of the underlying algorithm, see:
 * {@link https://en.wikipedia.org/wiki/Weiler%E2%80%93Atherton_clipping_algorithm}
 * {@link https://www.geeksforgeeks.org/weiler-atherton-polygon-clipping-algorithm}
 * {@link https://h-educate.in/weiler-atherton-polygon-clipping-algorithm/}
 *
 * @throws If `!polygon.isPositive`
 * @remarks In Foundry usage the only thing that calls `new WeilerAthertonClipper` is the class's static methods
 */
declare class WeilerAthertonClipper {
  /**
   * Construct a WeilerAthertonClipper instance used to perform the calculation.
   * @param polygon    - Polygon to clip
   * @param clipObject - Object used to clip the polygon
   * @param clipType   - Type of clip to use (default: `0`)
   * @param clipOpts   - Object passed to the {@linkcode WeilerAthertonClipper.ClipObject | clipObject} methods
   * {@linkcode WeilerAthertonClipper.ClipObject.toPolygon | toPolygon} and
   * {@linkcode WeilerAthertonClipper.ClipObject.pointsBetween | pointsBetween} (default: `{}`)
   */
  constructor(
    polygon: PIXI.Polygon,
    clipObject: WeilerAthertonClipper.ClipObject,
    clipType?: WeilerAthertonClipper.CLIP_TYPES,
    clipOpts?: WeilerAthertonClipper.ClipOpts,
  );

  /**
   * The supported clip types.
   * Values are equivalent to those in {@linkcode ClipperLib.ClipType}.
   */
  static CLIP_TYPES: WeilerAthertonClipper.ClipTypes;

  /**
   * The supported intersection types.
   */
  static INTERSECTION_TYPES: WeilerAthertonClipper.IntersectionTypes;

  polygon: PIXI.Polygon;

  clipObject: WeilerAthertonClipper.ClipObject;

  /**
   * Configuration settings
   */
  config: WeilerAthertonClipper.Config;

  /**
   * Union a polygon and clipObject using the Weiler Atherton algorithm.
   * @param polygon    - Polygon to clip
   * @param clipObject - Object to clip against the polygon
   * @param clipOpts   - Object passed to the {@linkcode WeilerAthertonClipper.ClipObject | clipObject} methods
   * {@linkcode WeilerAthertonClipper.ClipObject.toPolygon | toPolygon} and
   * {@linkcode WeilerAthertonClipper.ClipObject.pointsBetween | pointsBetween} (default: `{}`)
   */
  static union(
    polygon: PIXI.Polygon,
    clipObject: WeilerAthertonClipper.ClipObject,
    clipOpts?: WeilerAthertonClipper.ClipOpts,
  ): PIXI.Polygon[];

  /**
   * Intersect a polygon and clipObject using the Weiler Atherton algorithm.
   * @param polygon    - Polygon to clip
   * @param clipObject - Object to clip against the polygon
   * @param clipOpts   - Object passed to the {@linkcode WeilerAthertonClipper.ClipObject | clipObject} methods
   * {@linkcode WeilerAthertonClipper.ClipObject.toPolygon | toPolygon} and
   * {@linkcode WeilerAthertonClipper.ClipObject.pointsBetween | pointsBetween} (default: `{}`)
   */
  static intersect(
    polygon: PIXI.Polygon,
    clipObject: WeilerAthertonClipper.ClipObject,
    clipOpts?: WeilerAthertonClipper.ClipOpts,
  ): PIXI.Polygon[];

  /**
   * Clip a given clipObject using the Weiler-Atherton algorithm.
   *
   * At the moment, this will return a single PIXI.Polygon in the array unless clipType is a union and the polygon
   * and clipObject do not overlap, in which case the [polygon, clipObject.toPolygon()] array will be returned.
   * If this algorithm is expanded in the future to handle holes, an array of polygons may be returned.
   *
   * @param polygon    - Polygon to clip
   * @param clipObject - Object to clip against the polygon
   * @param options    - Options which configure how the union or intersection is computed. Any additional properties
   * in `options` (besides `clipType` and `canMutate`) are captured by the rest operator (`...clipOpts`) and passed
   * to the {@linkcode WeilerAthertonClipper} constructor.
   * @returns Array of polygons and clipObjects
   */
  static combine(
    polygon: PIXI.Polygon,
    clipObject: WeilerAthertonClipper.ClipObject,
    options: WeilerAthertonClipper.CombineOptions,
  ): PIXI.Polygon[];

  /**
   * Test if one shape envelops the other. Assumes the shapes do not intersect.
   *  1. Polygon is contained within the clip object. Union: clip object; Intersect: polygon
   *  2. Clip object is contained with polygon. Union: polygon; Intersect: clip object
   *  3. Polygon and clip object are outside one another. Union: both; Intersect: null
   * @param polygon    - Polygon to clip
   * @param clipObject - Object to clip against the polygon
   * @param clipType   - One of {@linkcode WeilerAthertonClipper.ClipTypes | CLIP_TYPES}
   * @param clipOpts   - Clip options which are forwarded to toPolygon methods
   * @returns Returns the polygon, the clipObject.toPolygon(), both, or neither.
   */
  static testForEnvelopment(
    polygon: PIXI.Polygon,
    clipObject: WeilerAthertonClipper.ClipObject,
    clipType: WeilerAthertonClipper.CLIP_TYPES,
    clipOpts?: WeilerAthertonClipper.ClipOpts,
  ): PIXI.Polygon[];

  #WeilerAthertonClipper: true;
}

declare namespace WeilerAthertonClipper {
  interface Any extends AnyWeilerAthertonClipper {}
  interface AnyConstructor extends Identity<typeof AnyWeilerAthertonClipper> {}

  type ClipObject = PIXI.Rectangle | PIXI.Circle;

  type CLIP_TYPES = Brand<number, "WeilerAthertonClipper.CLIP_TYPES">;

  interface ClipTypes {
    readonly INTERSECT: 0 & CLIP_TYPES;
    readonly UNION: 1 & CLIP_TYPES;
  }

  type INTERSECTION_TYPES = Brand<number, "WeilerAthertonClipper.INTERSECTION_TYPES">;

  interface IntersectionTypes {
    readonly OUT_IN: -1 & INTERSECTION_TYPES;
    readonly IN_OUT: 1 & INTERSECTION_TYPES;
    readonly TANGENT: 0 & INTERSECTION_TYPES;
  }

  /** Configuration settings */
  interface Config {
    /**
     * One of {@linkcode WeilerAthertonClipper.ClipTypes | CLIP_TYPES}
     * @defaultValue {@linkcode WeilerAthertonClipper.CLIP_TYPES.INTERSECT}
     * @remarks Set to the value of the equivalent constructor parameter if provided, or the above default
     */
    clipType: WeilerAthertonClipper.CLIP_TYPES;

    /**
     * Object passed to the Object passed to the {@linkcode WeilerAthertonClipper.ClipObject | clipObject} methods
     * {@linkcode WeilerAthertonClipper.ClipObject.toPolygon | toPolygon} and
     * {@linkcode WeilerAthertonClipper.ClipObject.pointsBetween | pointsBetween}
     * @defaultValue `{}`
     * @remarks Set to the value of the equivalent constructor parameter if provided, or the above default
     */
    clipOpts: WeilerAthertonClipper.ClipOpts;
  }

  /**
   *
   * @internal
   */
  type _CombineOptions = InexactPartial<{
    /**
     * If the WeilerAtherton constructor could mutate or not the subject polygon points
     */
    canMutate: boolean;
  }>;

  /**
   * @remarks See {@linkcode WeilerAthertonClipper.combine}'s `options` parameter description
   * @privateRemarks This interface does *not* contain:
   * - a `scalingFactor` property, despite one being passed in {@linkcode PIXI.Rectangle.intersectPolygon | PIXI.Rectangle#intersectPolygon} as of 13.1346
   * - a `density` property, despite one being passed in {@linkcode PIXI.Circle.intersectPolygon | PIXI.Circle#intersectPolygon} as of 13.346
   * as those are not used by {@linkcode WeilerAthertonClipper.combine}
   */
  interface CombineOptions extends _CombineOptions, ClipOpts {
    /**
     * One of {@linkcode WeilerAthertonClipper.ClipTypes | CLIP_TYPES}
     * @privateRemarks This *could* have been optional, as it gets passed to `new WAC()`, where it has a default, but Foundry has a pair of `!==` checks in
     * {@linkcode WeilerAthertonClipper.combine} before that happens which make it required
     */
    clipType: WeilerAthertonClipper.CLIP_TYPES;
  }

  /**
   * @remarks These are ultimately passed to {@linkcode PIXI.Rectangle.toPolygon | PIXI.Rectangle#toPolygon}, {@linkcode PIXI.Circle.toPolygon | PIXI.Circle#toPolygon},
   * {@linkcode PIXI.Rectangle.pointsBetween | PIXI.Rectangle#pointsBetween}, or {@linkcode PIXI.Circle.pointsBetween | PIXI.Circle#pointsBetween}. Only the `Circle`
   * methods actually take options and those are only passed on to {@linkcode PIXI.Circle.pointsForArc | PIXI.Circle#pointsForArc}.
   */
  type ClipOpts = PIXI.Circle.PointsForArcOptions;
}

export default WeilerAthertonClipper;

declare abstract class AnyWeilerAthertonClipper extends WeilerAthertonClipper {
  constructor(...args: never);
}
