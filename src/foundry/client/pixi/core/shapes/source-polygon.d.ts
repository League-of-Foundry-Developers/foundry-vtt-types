interface PointSourcePolygonConfig {
  /** The type of polygon being computed */
  type?: foundry.CONST.WALL_RESTRICTION_TYPES;

  /** The angle of emission, if limited */
  angle?: number;

  /** The desired density of padding rays, a number per PI */
  density?: number;

  /** A limited radius of the resulting polygon */
  radius?: number;

  /** The direction of facing, required if the angle is limited */
  rotation?: number;

  /** Display debugging visualization and logging for the polygon */
  debug?: boolean;

  /** Is this polygon constrained by any walls? */
  walls?: boolean;

  /** The object (if any) that spawned this polygon. */
  source?: PointSource;
}

/**
 * An extension of the default PIXI.Polygon which is used to represent the line of sight for a point source.
 */
declare abstract class PointSourcePolygon extends PIXI.Polygon {
  /**
   * The origin point of the source polygon.
   */
  origin: Point;

  /**
   * The configuration of this polygon.
   * @defaultValue `{}`
   */
  config: PointSourcePolygonConfig;

  /**
   * A cached array of SightRay objects used to compute the polygon.
   * @defaultValue `[]`
   * @remarks This is documented as `SightRay[]` but that's only correct for the {@link RadialSweepPolygon}
   */
  rays: Ray[];

  /**
   * Compute the rectangular bounds for the Polygon.
   * @param points - The initially provided array of coordinates
   * @returns The computed Rectangular bounds
   */
  protected _getBounds(points: number[]): PIXI.Rectangle;

  /**
   * Benchmark the performance of polygon computation for this source
   * @param iterations - The number of test iterations to perform
   * @param args       - Arguments passed to the compute method
   */
  static benchmark(
    iterations: number,
    ...args: Parameters<typeof PointSourcePolygon["create"]>
  ): ReturnType<typeof foundry.utils.benchmark>;

  /**
   * Compute the polygon given a point origin and radius
   * @param origin - The origin source point
   * @param config - Configuration options which customize the polygon computation
   *                 (default: `{}`)
   * @returns The computed polygon instance
   */
  static create(
    origin: Point,
    config?: Parameters<PointSourcePolygon["initialize"]>[1] | undefined
  ): ReturnType<PointSourcePolygon["compute"]>;

  /**
   * Compute the polygon using the origin and configuration options.
   * @returns The computed polygon
   */
  compute(): this;

  /**
   * Perform the implementation-specific computation
   */
  protected abstract _compute(): void;

  /**
   * Customize the provided configuration object for this polygon type.
   * @param origin - The provided polygon origin
   * @param config - The provided configuration object
   */
  initialize(origin: Point, config: PointSourcePolygonConfig): void;

  /**
   * Visualize the polygon, displaying its computed area, rays, and collision points
   */
  visualize(): void;
}

/**
 * Compare sight performance between different algorithms
 * @param n    - The number of iterations
 * @param args - Arguments passed to the polygon compute function
 */
declare function benchmarkSight(
  n: number,
  ...args: Parameters<typeof ClockwiseSweepPolygon["benchmark"]>
): Promise<void>;
