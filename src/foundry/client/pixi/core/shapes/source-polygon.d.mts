import type { Brand, InexactPartial, FixedInstanceType, NullishProps } from "fvtt-types/utils";
import type PointEffectSourceMixin from "../../../../client-esm/canvas/sources/point-effect-source.d.mts";

declare global {
  /** @remarks Keys whose value when passed is not respected have been omitted from the global type */
  type PointSourcePolygonConfig = NullishProps<
    PointSourcePolygon._Config,
    /**
     * @privateRemarks Reasons for exclusion from nullishness:
     * - `type` is the only truly non-optional property in the typedef
     * - `externalRadius` is alraedy optional, but does not have any defaults applied, so must be numeric if provided.
     * - `source` is already optional, but does not have any defaults applied, so probably shouldn't be nullish. As far as I can tell, nothing
     *   accesses this property in v12, in v13 it is used to provide a fallback `elevation` if one is not provided with `origin`
     */
    Exclude<keyof PointSourcePolygon._Config, "externalRadius" | "type" | "source">
  >;

  /**
   * An extension of the default PIXI.Polygon which is used to represent the line of sight for a point source.
   */
  abstract class PointSourcePolygon extends PIXI.Polygon {
    /**
     * @remarks This is protected because `new PointSourcePolygon` does not sufficiently initalize the class; Use the static `create` method instead.
     */
    protected constructor(...args: ConstructorParameters<typeof PIXI.Polygon>);

    /**
     * Customize how wall direction of one-way walls is applied
     */
    static WALL_DIRECTION_MODES: Readonly<
      Record<"NORMAL" | "REVERSED" | "BOTH", PointSourcePolygon.WALL_DIRECTION_MODES>
    >;

    /**
     * The rectangular bounds of this polygon
     * @defaultValue `new PIXI.Rectangle(0, 0, 0, 0)`
     */
    bounds: PIXI.Rectangle;

    /**
     * The origin point of the source polygon.
     * @remarks Not initalized to any value, but immediately set by `PointSourcePolygon#initalize`
     */
    origin: Canvas.Point;

    /**
     * The configuration of this polygon.
     * @remarks Initialized as `{}` but immediately filled by `PointSourcePolygon#initalize`
     */
    config: PointSourcePolygon._Config;

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
      config?: Parameters<FixedInstanceType<NoInfer<T>>["initialize"]>[1],
    ): FixedInstanceType<T>;

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
      constraint: PIXI.Polygon,
      /** @privateRemarks pre-InexactPartialed for now */
      intersectionOptions?: PIXI.Polygon.IntersectPolygonOptions,
    ): PointSourcePolygon;
    applyConstraint(
      constraint: PIXI.Circle,
      intersectionOptions?: NullishProps<PIXI.Circle.IntersectPolygonOptions>,
    ): PointSourcePolygon;
    applyConstraint(
      constraint: PIXI.Rectangle,
      /** @privateRemarks pre-InexactPartialed for now */
      intersectionOptions?: PIXI.Rectangle.IntersectPolygonOptions,
    ): PointSourcePolygon;

    override contains(x: number, y: number): boolean;

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

        /** The configuration that defines a certain Polygon type */
        ...config
      }: {
        /**
         * The collision mode to test: "any", "all", or "closest"
         * (default: "all")
         */
        mode?: Mode;
      } & PointSourcePolygonConfig,
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

    type WALL_DIRECTION_MODES = Brand<number, "PointSourcePolygon.WALL_DIRECTION_MODES">;

    /** @internal */
    type _Config = InexactPartial<{
      /** The angle of emission, if limited */
      angle: number;

      /**
       * The desired density of padding rays, a number per PI
       * @defaultValue `PIXI.Circle.approximateVertexDensity(cfg.radius)`
       */
      density: number;

      /**
       * A limited radius of the resulting polygon
       * @defaultValue `canvas.dimensions.maxR`
       */
      radius: number;

      /**
       * The direction of facing, required if the angle is limited
       * @defaultValue `0`
       */
      rotation: number;

      /**
       * Customize how wall direction of one-way walls is applied
       * @defaultValue `PointSourcePolygon.WALL_DIRECTION_MODES.NORMAL`
       */
      wallDirectionMode: PointSourcePolygon.WALL_DIRECTION_MODES;

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

      /**
       * Priority when it comes to ignore edges from darkness sources
       * @remarks Seemingly not in use in practice
       */
      priority?: number;

      /**
       * Display debugging visualization and logging for the polygon
       * @remarks `initialize` adds this key as `true` if `CONFIG.debug.polygons` is truthy, otherwise it is omitted. Effectively defaults `false`.
       */
      debug?: boolean;

      /**
       * The object (if any) that spawned this polygon.
       * @remarks Not guaranteed by `PointSourcePolygon#initalize` but will exist in all configs created by `PointSourceMixin` subclasses
       */
      source?: PointEffectSourceMixin.AnyMixed;

      /**
       * Limiting polygon boundary shapes
       * @defaultValue `[]`
       */
      boundaryShapes: Array<PIXI.Rectangle | PIXI.Circle | PIXI.Polygon>;

      /**
       * Does this polygon use the Scene inner or outer bounding rectangle
       * @remarks Computed by `PointSourcePolygon#initialize` if not provided or passed nullish. Is `false` unless `type` is `"sight"` and
       *          the origin point is inside `canvas.dimensions.sceneRect`
       */
      useInnerBounds: boolean;

      /**
       * The external radius of the source
       * @remarks Not in foundry's typedef, inferred from usage. It is in the object returned by `PointEffectSource#_getPolygonConfiguration`
       */
      externalRadius?: number;
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
