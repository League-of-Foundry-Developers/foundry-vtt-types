import type { Brand, Coalesce, Identity, InexactPartial, NullishProps } from "#utils";
import type PointEffectSourceMixin from "#client/canvas/sources/point-effect-source.d.mts";

declare global {
  /**
   * An extension of the default PIXI.Polygon which is used to represent the line of sight for a point source.
   */
  abstract class PointSourcePolygon extends PIXI.Polygon {
    /**
     * @remarks This is protected because `new PointSourcePolygon` does not sufficiently initialize the class; Use the static `create` method instead.
     */
    protected constructor(...args: ConstructorParameters<typeof PIXI.Polygon>);

    /**
     * Customize how wall direction of one-way walls is applied
     */
    static WALL_DIRECTION_MODES: PointSourcePolygon.WallDirectionModes;

    /**
     * The rectangular bounds of this polygon
     * @defaultValue `new PIXI.Rectangle(0, 0, 0, 0)`
     */
    bounds: PIXI.Rectangle;

    /**
     * The origin point of the source polygon.
     * @remarks Not initialized to any value, but immediately set by `PointSourcePolygon#initialize`
     */
    origin: Canvas.Point;

    /**
     * The configuration of this polygon.
     * @remarks Initialized as `{}` but immediately filled by `PointSourcePolygon#initialize`
     */
    config: PointSourcePolygon.StoredConfig;

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
    static benchmark(iterations: number, origin: Canvas.Point, config: PointSourcePolygon.Config): Promise<void>;

    /**
     * Compute the polygon given a point origin and radius
     * @param origin - The origin source point
     * @param config - Configuration options which customize the polygon computation
     * @returns The computed polygon instance
     * @remarks Subclasses must implement a `.create` override to accurately type the return.
     *
     * Despite being a `={}` parameter, a `config` object with a valid `type` property must be passed
     */
    static create(origin: Canvas.Point, config: PointSourcePolygon.Config): unknown;

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
    initialize(origin: Canvas.Point, config: PointSourcePolygon.Config): void;

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
      intersectionOptions?: PIXI.Polygon.IntersectPolygonOptions, // not:null (property set on it via `??=`)
    ): this;
    applyConstraint(constraint: PIXI.Circle, intersectionOptions?: PIXI.Circle.WACIntersectPolygonOptions): this;
    applyConstraint(constraint: PIXI.Circle, intersectionOptions?: PIXI.Circle.ClipperLibIntersectPolygonOptions): this;
    applyConstraint(constraint: PIXI.Rectangle, intersectionOptions?: PIXI.Rectangle.WACIntersectPolygonOptions): this;
    applyConstraint(
      constraint: PIXI.Rectangle,
      intersectionOptions?: PIXI.Rectangle.ClipperLibIntersectPolygonOptions,
    ): this;

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
     *          - any: returns a boolean for whether any collision occurred
     *          - all: returns a sorted array of PolygonVertex instances
     *          - closest: returns a PolygonVertex instance or null
     * @remarks Despite being an `={}` parameter, `options` is required as it must be a valid
     * `PointSourcePolygon.Config`, which has a required property (`type`)
     */
    static testCollision<Mode extends PointSourcePolygon.CollisionModes | undefined = undefined>(
      origin: Canvas.Point,
      destination: Canvas.Point,
      { mode, ...config }: PointSourcePolygon.TestCollisionConfig<Mode>,
    ): PointSourcePolygon.TestCollision<Coalesce<Mode, "all">>;

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
     * @remarks Mutates and returns the same reference it's passed, not a new polygon
     */
    static applyThresholdAttenuation<PolyType extends PointSourcePolygon>(polygon: PolyType): PolyType;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks You are referencing PointSourcePolygon#rays which is no longer a required property of that interface.
     *          If your subclass uses the rays property it should be explicitly defined by the subclass which requires it.
     */
    get rays(): Ray[];

    set rays(rays);
  }

  namespace PointSourcePolygon {
    interface Any extends AnyPointSourcePolygon {}
    interface AnyConstructor extends Identity<typeof AnyPointSourcePolygon> {}

    type WALL_DIRECTION_MODES = Brand<number, "PointSourcePolygon.WALL_DIRECTION_MODES">;

    interface WallDirectionModes {
      readonly NORMAL: 0 & WALL_DIRECTION_MODES;
      readonly REVERSED: 1 & WALL_DIRECTION_MODES;
      readonly BOTH: 2 & WALL_DIRECTION_MODES;
    }

    /** @internal */
    type _TestCollisionConfig<Mode> = InexactPartial<{
      /**
       * The collision mode to test: "any", "all", or "closest"
       * @defaultValue `"all"`
       * @remarks Can't be `null` as it only has a parameter default
       */
      mode: Mode;
    }>;

    interface TestCollisionConfig<Mode> extends _TestCollisionConfig<Mode>, Config {}

    /**
     * @internal
     * @privateRemarks Properties of the config that get set in `#initialize` or elsewhere with no respect to their passed value
     */
    interface _ComputedConfig {
      /**
       * Does this polygon have a limited radius?
       * @remarks `true` if `(cfg.radius > 0) && (cfg.radius < canvas.dimensions.maxR)`
       */
      hasLimitedRadius: boolean;

      /**
       * Does this polygon have a limited angle?
       * @remarks `true` if `cfg.angle !== 360`
       */
      hasLimitedAngle: boolean;
    }

    /**
     * @internal
     * @privateRemarks Properties of the config that might be omitted but can't be explicitly `undefined`
     */
    interface _OptionalOnlyConfig {
      /**
       * The object (if any) that spawned this polygon.
       * @remarks Not guaranteed by `PointSourcePolygon#initialize` but will exist in all configs created by `PointEffectSourceMixin` subclasses. No default provided
       * @privateRemarks Foundry types this as `PointSource` which is neither a typedef nor a class, not even a mixin class name. The type here matches usage and tracks with what they probably meant.
       */
      source?: PointEffectSourceMixin.AnyMixed;

      /**
       * The external radius of the source
       * @remarks Can't be `undefined` or `null` or its use in math would produce `NaN`s.
       *
       * Not guaranteed by `PointSourcePolygon#initialize` but will exist in all configs created by `PointEffectSourceMixin` subclasses.
       */
      externalRadius?: number;
    }

    /**
     * @internal
     * @privateRemarks Properties of the config that have defaults for nullish values in `#initialize`, and thus are guaranteed in the stored config
     */
    interface _BaseConfig {
      /**
       * A limited radius of the resulting polygon
       * @defaultValue `canvas.dimensions.maxR`
       */
      radius: number;

      /**
       * The desired density of padding rays, a number per PI
       * @defaultValue `PIXI.Circle.approximateVertexDensity(cfg.radius)`
       */
      density: number;

      /**
       * The angle of emission, if limited
       * @defaultValue `360`
       */
      angle: number;

      /**
       * The direction of facing, required if the angle is limited
       * @defaultValue `0`
       */
      rotation: number;

      /**
       * Does this polygon use the Scene inner or outer bounding rectangle
       * @defaultValue `true` if `type === "sight"` and the origin point is inside `canvas.dimensions.sceneRect` else `false`
       * @remarks Computed if not provided or passed nullish.
       */
      useInnerBounds: boolean;

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
       * Limiting polygon boundary shapes
       * @defaultValue `[]`
       * @remarks Never passed in Foundry practice
       */
      boundaryShapes: Array<BoundaryShapes>;

      /**
       * Display debugging visualization and logging for the polygon
       * @remarks Overridden `true` if `CONFIG.debug.polygons` is truthy
       */
      debug?: boolean;

      /**
       * Priority when it comes to ignore edges from darkness sources
       * @remarks This is listed in the typedef, but is not in use by Foundry in 12.331
       */
      priority?: number;
    }

    /**
     * @internal
     * @privateRemarks The only property required in all configs
     */
    interface _RequiredConfig {
      /** The type of polygon being computed */
      type: PolygonType;
    }

    interface StoredConfig extends _RequiredConfig, _BaseConfig, _OptionalOnlyConfig, _ComputedConfig {}

    interface Config extends _RequiredConfig, NullishProps<_BaseConfig>, _OptionalOnlyConfig {}

    type BoundaryShapes = PIXI.Rectangle | PIXI.Circle | PIXI.Polygon;

    type PolygonType = "light" | "sight" | "sound" | "move" | "universal";

    type CollisionModes = "any" | "all" | "closest";

    /** @internal */
    interface _CollisionTypesReturnMap {
      any: boolean;
      closest: foundry.canvas.edges.PolygonVertex | null;
      all: foundry.canvas.edges.PolygonVertex[];
    }

    type TestCollision<Mode extends CollisionModes> = _CollisionTypesReturnMap[Mode];
  }
}

declare abstract class AnyPointSourcePolygon extends PointSourcePolygon {
  constructor(...args: never);
}
