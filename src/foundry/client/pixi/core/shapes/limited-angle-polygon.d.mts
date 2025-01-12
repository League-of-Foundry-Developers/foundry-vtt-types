export {};

declare global {
  /**
   * A special class of Polygon which implements a limited angle of emission for a Point Source.
   * The shape is defined by a point origin, radius, angle, and rotation.
   * The shape is further customized by a configurable density which informs the approximation.
   * An optional secondary externalRadius can be provided which adds supplementary visibility outside the primary angle.
   */
  class LimitedAnglePolygon extends PIXI.Polygon {
    constructor(
      origin: Canvas.Point,
      { radius, angle, rotation, density, externalRadius }: LimitedAnglePolygon.ConstructorOptions,
    );

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
     */
    externalBounds: PIXI.Rectangle | undefined;

    /**
     * Restrict the edges which should be included in a PointSourcePolygon based on this specialized shape.
     * We use two tests to jointly keep or reject edges.
     * 1. If this shape uses an externalRadius, keep edges which collide with the bounding box of that circle.
     * 2. Keep edges which are contained within or collide with one of the primary angle boundary rays.
     * @param a - The first edge vertex
     * @param b - The second edge vertex
     * @returns Should the edge be included in the PointSourcePolygon computation?
     */
    protected _includeEdge(a: Canvas.Point, b: Canvas.Point): boolean;

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
    static pointBetweenRays(point: Canvas.Point, rMin: PolygonRay, rMax: PolygonRay, angle: number): boolean;
  }

  namespace LimitedAnglePolygon {
    type AnyConstructor = typeof AnyLimitedAnglePolygon;

    interface ConstructorOptions {
      /**
       * The radius of the emitted cone.
       */
      radius: number;

      /**
       * The angle of the Polygon in degrees.
       * @defaultValue `360`
       */
      angle?: number | undefined;

      /**
       * The direction of rotation at the center of the emitted angle in degrees.
       * @defaultValue `0`
       */
      rotation?: number | undefined;

      /**
       * The density of rays which approximate the cone, defined as rays per PI.
       * @defaultValue `PIXI.Circle.approximateVertexDensity(this.radius)`
       */
      density?: number | undefined | null;

      /**
       * An optional "external radius" which is included in the polygon for the supplementary area outside the cone.
       * @defaultValue `0`
       */
      externalRadius?: number | undefined | null;
    }
  }
}

declare abstract class AnyLimitedAnglePolygon extends LimitedAnglePolygon {
  constructor(arg0: never, ...args: never[]);
}
