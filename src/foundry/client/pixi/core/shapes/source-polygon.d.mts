import type { InexactPartial } from "../../../../../utils/index.d.mts";
import type PointEffectSourceMixin from "../../../../client-esm/canvas/sources/point-effect-source.d.mts";

declare global {
  interface PointSourcePolygonConfig extends PointSourcePolygon._Config {
    /** The type of polygon being computed */
    type: PointSourcePolygon.PolygonType;
  }

  /**
   * An extension of the default PIXI.Polygon which is used to represent the line of sight for a point source.
   */
  abstract class PointSourcePolygon extends PIXI.Polygon {
    /**
     * Customize how wall direction of one-way walls is applied
     */
    static readonly WALL_DIRECTION_MODES: Readonly<{
      NORMAL: 0;
      REVERSED: 1;
      BOTH: 2;
    }>;

    /**
     * The rectangular bounds of this polygon
     * @defaultValue `new PIXI.Rectangle(0, 0, 0, 0)`
     */
    bounds: PIXI.Rectangle;

    /**
     * The origin point of the source polygon.
     */
    origin: Canvas.Point;

    /**
     * The configuration of this polygon.
     * @defaultValue `{}`
     */
    config: PointSourcePolygonConfig;

    /**
     * An indicator for whether this polygon is constrained by some boundary shape?
     */
    get isConstrained(): boolean;

    /**
     * Benchmark the performance of polygon computation for this source
     * @param iterations - The number of test iterations to perform
     * @param origin     - The origin point to benchmark
     * @param config     - The polygon configuration to benchmark
     */
    static benchmark(iterations: number, origin: Canvas.Point, config: PointSourcePolygonConfig): Promise<void>;

    /**
     * Compute the polygon given a point origin and radius
     * @param origin - The origin source point
     * @param config - Configuration options which customize the polygon computation
     *                 (default: `{}`)
     * @returns The computed polygon instance
     */
    static create<T extends PointSourcePolygon.AnyConstructor>(
      this: T,
      origin: Canvas.Point,
      config?: Parameters<InstanceType<NoInfer<T>>["initialize"]>[1],
    ): InstanceType<T>;

    /**
     * Create a clone of this polygon.
     * This overrides the default PIXI.Polygon#clone behavior.
     * @returns A cloned instance
     */
    override clone(): this;

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
    initialize(origin: Canvas.Point, config: PointSourcePolygonConfig): void;

    /**
     * Apply a constraining boundary shape to an existing PointSourcePolygon.
     * Return a new instance of the polygon with the constraint applied.
     * The new instance is only a "shallow clone", as it shares references to component properties with the original.
     * @param constraint          - The constraining boundary shape
     * @param intersectionOptions - Options passed to the shape intersection method
     * @returns A new constrained polygon
     */
    applyConstraint(
      constraint: PIXI.Circle | PIXI.Rectangle | PIXI.Polygon,
      intersectionOptions?: Record<string, unknown>,
    ): PointSourcePolygon;

    contains(x: number, y: number): boolean;

    /**
     * Constrain polygon points by applying boundary shapes.
     */
    protected _constrainBoundaryShapes(): void;

    /**
     * Test whether a Ray between the origin and destination points would collide with a boundary of this Polygon.
     * A valid wall restriction type is compulsory and must be passed into the config options.
     * @param origin      - An origin point
     * @param destination - A destination point
     * @param config      - The configuration that defines a certain Polygon type
     * @param mode        - The collision mode to test: "any", "all", or "closest"
     *                      (default: "all")
     * @returns The collision result depends on the mode of the test:
     *          * any: returns a boolean for whether any collision occurred
     *          * all: returns a sorted array of PolygonVertex instances
     *          * closest: returns a PolygonVertex instance or null
     */
    static testCollision<Mode extends PointSourcePolygon.CollisionModes>(
      origin: Canvas.Point,
      destination: Canvas.Point,
      {
        mode,
        ...config
      }: {
        /**
         * The collision mode to test: "any", "all", or "closest"
         * (default: "all")
         */
        mode?: Mode;

        /** The configuration that defines a certain Polygon type */
        config?: PointSourcePolygonConfig;
      },
    ): PointSourcePolygon.TestCollision<Mode>;

    /**
     * Determine the set of collisions which occurs for a Ray.
     * @param ray  - The Ray to test
     * @param mode - The collision mode being tested
     * @returns The collision test result
     */
    protected abstract _testCollision<Mode extends PointSourcePolygon.CollisionModes>(
      ray: Ray,
      mode: Mode,
    ): PointSourcePolygon.TestCollision<Mode>;

    /**
     * Visualize the polygon, displaying its computed area, rays, and collision points
     * @returns The rendered debugging shape
     */
    visualize(): PIXI.Graphics | undefined;

    /**
     * Determine if the shape is a complete circle.
     * The config object must have an angle and a radius properties.
     */
    isCompleteCircle(): boolean;

    /**
     * Augment a PointSourcePolygon by adding additional coverage for shapes permitted by threshold walls.
     * @param polygon - The computed polygon
     * @returns The augmented polygon
     */
    static applyThresholdAttenuation(polygon: PointSourcePolygon): PointSourcePolygon;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks You are referencing PointSourcePolygon#rays which is no longer a required property of that interface.
     *          If your subclass uses the rays property it should be explicitly defined by the subclass which requires it.
     */
    get rays(): Ray[];

    set rays(rays);
  }

  namespace PointSourcePolygon {
    type AnyConstructor = typeof AnyPointSourcePolygon;

    /** @internal */
    type _Config = InexactPartial<{
      /** The angle of emission, if limited */
      angle: number;

      /** The desired density of padding rays, a number per PI */
      density: number;

      /** A limited radius of the resulting polygon */
      radius: number;

      /** The direction of facing, required if the angle is limited */
      rotation: number;

      /** Customize how wall direction of one-way walls is applied */
      wallDirectionMode: number;

      /**
       * Compute the polygon with threshold wall constraints applied
       * @defaultValue `false`
       */
      useThreshold: boolean;

      /**
       * Include edges coming from darkness sources
       * @defaultValue `false`
       */
      includeDarkness: boolean;

      /** Priority when it comes to ignore edges from darkness sources */
      priority: number;

      /** Display debugging visualization and logging for the polygon */
      debug: boolean;

      /** The object (if any) that spawned this polygon. */
      source: PointEffectSourceMixin.AnyMixed;

      /** Limiting polygon boundary shapes */
      boundaryShapes: Array<PIXI.Rectangle | PIXI.Circle | PIXI.Polygon>;

      /** Does this polygon use the Scene inner or outer bounding rectangle */
      readonly useInnerBounds: boolean;

      /** Does this polygon have a limited radius? */
      readonly hasLimitedRadius: boolean;

      /** Does this polygon have a limited angle? */
      readonly hasLimitedAngle: boolean;

      /** The computed bounding box for the polygon */
      readonly boundingBox: PIXI.Rectangle;
    }>;

    type PolygonType = "light" | "sight" | "sound" | "move" | "universal";

    type CollisionModes = "any" | "all" | "closest";

    interface CollisionTypes {
      any: boolean;
      closest: foundry.canvas.edges.PolygonVertex;
      all: foundry.canvas.edges.PolygonVertex[] | null;
    }

    type TestCollision<Mode extends CollisionModes> = CollisionTypes[Mode];
  }
}

declare abstract class AnyPointSourcePolygon extends PointSourcePolygon {
  constructor(arg0: never, ...args: never[]);
}
