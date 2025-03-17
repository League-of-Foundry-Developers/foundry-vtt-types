import type { InexactPartial } from "../../../../../utils/index.d.mts";

declare global {
  /**
   * A special class of Polygon which implements a limited angle of emission for a Point Source.
   * The shape is defined by a point origin, radius, angle, and rotation.
   * The shape is further customized by a configurable density which informs the approximation.
   * An optional secondary externalRadius can be provided which adds supplementary visibility outside the primary angle.
   * @param origin - The origin point for this polygon
   * @param config - Configuration for the polygon.
   * @remarks Despite `config` being an `={}` parameter, the `radius` key must be passed to avoid `NaN`s
   */
  class LimitedAnglePolygon extends PIXI.Polygon {
    constructor(origin: Canvas.Point, config: LimitedAnglePolygon.ConstructorOptions);

    /**
     * The origin point of the Polygon
     */
    origin: Canvas.Point;

    /**
     * The radius of the emitted cone.
     */
    radius: number;

    /**
     * The angle of the Polygon in degrees.
     * @defaultValue `360`
     */
    angle: number;

    /**
     * The direction of rotation at the center of the emitted angle in degrees.
     * @defaultValue `0`
     */
    rotation: number;

    /**
     * The density of rays which approximate the cone, defined as rays per PI.
     * @defaultValue `PIXI.Circle.approximateVertexDensity(this.radius)`
     */
    density: number;

    /**
     * An optional "external radius" which is included in the polygon for the supplementary area outside the cone.
     * @defaultValue `0`
     */
    externalRadius: number;

    /**
     * The angle of the left (counter-clockwise) edge of the emitted cone in radians.
     * @defaultValue `Math.normalizeRadians(Math.toRadians(this.rotation + 90 - (this.angle / 2)))`
     */
    aMin: number;

    /**
     * The angle of the right (clockwise) edge of the emitted cone in radians.
     * @defaultValue `this.aMin + Math.toRadians(this.angle)`
     */
    aMax: number;

    /**
     * The bounding box of the circle defined by the externalRadius, if any
     * @privateRemarks Set in `##generatePoints`, which is called at the end of the constructor
     */
    externalBounds: PIXI.Rectangle;

    /**
     * Restrict the edges which should be included in a PointSourcePolygon based on this specialized shape.
     * We use two tests to jointly keep or reject edges.
     * 1. If this shape uses an externalRadius, keep edges which collide with the bounding box of that circle.
     * 2. Keep edges which are contained within or collide with one of the primary angle boundary rays.
     * @param a - The first edge vertex
     * @param b - The second edge vertex
     * @returns Should the edge be included in the PointSourcePolygon computation?
     * @remarks Foundry marked `@internal`
     */
    _includeEdge(a: Canvas.Point, b: Canvas.Point): boolean;

    /**
     * Test whether a vertex lies between two boundary rays.
     * If the angle is greater than 180, test for points between rMax and rMin (inverse).
     * Otherwise, keep vertices that are between the rays directly.
     * @param point - The candidate point
     * @param rMin  - The counter-clockwise bounding ray
     * @param rMax  - The clockwise bounding ray
     * @param angle - The angle being tested, in degrees
     * @returns Is the vertex between the two rays?
     */
    static pointBetweenRays(
      point: Canvas.Point,
      rMin: ClockwiseSweepPolygon.Ray,
      rMax: ClockwiseSweepPolygon.Ray,
      angle: number,
    ): boolean;
  }

  namespace LimitedAnglePolygon {
    interface Any extends AnyLimitedAnglePolygon {}
    type AnyConstructor = typeof AnyLimitedAnglePolygon;

    /** @internal */
    type _ConstructorOptions = InexactPartial<{
      /**
       * The angle of the Polygon in degrees.
       * @defaultValue `360`
       * @remarks Can't be `null` as it only has a parameter default
       */
      angle: number;

      /**
       * The direction of rotation at the center of the emitted angle in degrees.
       * @defaultValue `0`
       * @remarks Can't be `null` as it only has a parameter default
       */
      rotation: number;

      /**
       * The density of rays which approximate the cone, defined as rays per PI.
       * @defaultValue `PIXI.Circle.approximateVertexDensity(this.radius)`
       */
      density: number | null;

      /**
       * An optional "external radius" which is included in the polygon for the supplementary area outside the cone.
       * @defaultValue `0`
       * @remarks Only used if truthy
       */
      externalRadius: number | null;
    }>;

    interface ConstructorOptions extends _ConstructorOptions {
      /**
       * The radius of the emitted cone.
       * @privateRemarks This is given no default, but is directly used in multiplication and division, resulting in `NaN` if allowed to be `undefined`
       */
      radius: number;
    }
  }
}

declare abstract class AnyLimitedAnglePolygon extends LimitedAnglePolygon {
  constructor(arg0: never, ...args: never[]);
}
