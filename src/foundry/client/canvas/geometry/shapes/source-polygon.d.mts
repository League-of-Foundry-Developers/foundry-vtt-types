import type { Brand, Coalesce, Identity, InexactPartial } from "#utils";
import type PointEffectSourceMixin from "#client/canvas/sources/point-effect-source.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { Ray } from "#client/canvas/geometry/_module.d.mts";
import type { PolygonVertex } from "#client/canvas/geometry/edges/_module.d.mts";

/**
 * An extension of the default PIXI.Polygon which is used to represent the line of sight for a point source.
 * @remarks Static methods that need subclass overrides to account for expanded Configs:
 * - {@linkcode PointSourcePolygon.benchmark}
 * - {@linkcode PointSourcePolygon.create}
 * - {@linkcode PointSourcePolygon.testCollision}
 */
declare abstract class PointSourcePolygon extends PIXI.Polygon {
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
   * @privateRemarks Not initialized to any value, but immediately set by {@linkcode PointSourcePolygon.initialize | #initialize}
   */
  origin: Canvas.ElevatedPoint;

  /**
   * The configuration of this polygon.
   * @remarks Initialized as `{}` but immediately filled by  {@linkcode PointSourcePolygon.initialize | #initialize}
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
  static benchmark(
    iterations: number,
    origin: Canvas.PossiblyElevatedPoint,
    config: PointSourcePolygon.Config,
  ): Promise<void>;

  /**
   * Compute the polygon given a point origin and radius
   * @param origin - The origin source point. The elevation defaults to the elevation of `config.source` if passed and otherwise `0`.
   * @param config - Configuration options which customize the polygon computation
   * @returns The computed polygon instance
   * @remarks Subclasses must implement a `.create` override to accurately type the return.
   *
   * Despite being a `={}` parameter, a `config` object with a valid `type` property must be passed
   */
  static create(origin: Canvas.PossiblyElevatedPoint, config: PointSourcePolygon.Config): unknown;

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
   * @param origin - The provided polygon origin. The elevation defaults to the elevation of `config.source` if passed and otherwise `0`.
   * @param config - The provided configuration object
   */
  initialize(origin: Canvas.PossiblyElevatedPoint, config: PointSourcePolygon.Config): void;

  /**
   * Apply a constraining boundary shape to an existing PointSourcePolygon.
   * Return a new instance of the polygon with the constraint applied.
   * The new instance is only a "shallow clone", as it shares references to component properties with the original.
   * @param constraint          - The constraining boundary shape
   * @param intersectionOptions - Options passed to the shape intersection method
   * @returns A new constrained polygon
   */
  applyConstraint(constraint: PIXI.Polygon, intersectionOptions?: PIXI.Polygon.IntersectPolygonOptions): this;
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
   * @param origin      - An origin point. The elevation defaults to the elevation of `config.source` if passed and otherwise `0`.
   * @param destination - A destination point. The elevation defaults to the elevation of the origin.
   * @param config      - The configuration that defines a certain Polygon type
   * @param mode        - The collision mode to test: "any", "all", or "closest" (default: "all")
   * @returns The collision result depends on the mode of the test:
   * - `any`: returns a boolean for whether any collision occurred
   * - `all`: returns a sorted array of PolygonVertex instances
   * - `closest`: returns a PolygonVertex instance or null
   * @remarks Despite being an `={}` parameter, `options` is required as it must be a valid
   * `PointSourcePolygon.Config`, which has a required property (`type`)
   */
  static testCollision<Mode extends PointSourcePolygon.CollisionModes | undefined = undefined>(
    origin: Canvas.PossiblyElevatedPoint,
    destination: Canvas.PossiblyElevatedPoint,
    { mode, ...config }: PointSourcePolygon.TestCollisionOptions<Mode>,
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
    destination: Canvas.ElevatedPoint,
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
}

declare namespace PointSourcePolygon {
  interface Any extends AnyPointSourcePolygon {}
  interface AnyConstructor extends Identity<typeof AnyPointSourcePolygon> {}

  type WALL_DIRECTION_MODES = Brand<number, "PointSourcePolygon.WALL_DIRECTION_MODES">;

  /** @remarks {@linkcode PointSourcePolygon.WALL_DIRECTION_MODES} is frozen*/
  interface WallDirectionModes {
    readonly NORMAL: 0 & WALL_DIRECTION_MODES;
    readonly REVERSED: 1 & WALL_DIRECTION_MODES;
    readonly BOTH: 2 & WALL_DIRECTION_MODES;
  }

  /**
   * Properties of the config that get set with no respect to their passed value
   * @internal
   */
  interface _ComputedConfig {
    /**
     * Does this polygon have a limited radius?
     * @defaultValue `(cfg.radius > 0) && (cfg.radius < canvas.dimensions.maxR)`
     * @remarks Set by {@linkcode PointSourcePolygon.initialize | PointSourcePolygon#initialize}
     */
    hasLimitedRadius: boolean;

    /**
     * Does this polygon have a limited angle?
     * @defaultValue `cfg.angle !== 360`
     * @remarks Set by {@linkcode PointSourcePolygon.initialize | PointSourcePolygon#initialize}
     */
    hasLimitedAngle: boolean;
  }

  /**
   * Properties of the config that might be omitted but can't be explicitly `undefined`
   * @internal
   */
  interface _OptionalOnlyConfig {
    /**
     * The external radius of the source
     * @remarks Can't be `undefined` or its use in math would produce `NaN`s.
     *
     * Not guaranteed by {@linkcode PointSourcePolygon.initialize | PointSourcePolygon#initialize} but will exist in all configs created by {@linkcode PointEffectSourceMixin} subclasses.
     */
    externalRadius?: number;
  }

  /**
   * Properties not guaranteed to exist by {@linkcode PointSourcePolygon.initialize | PointSourcePolygon#initialize}, without restrictions on nullishness
   */
  type _InexactConfig = InexactPartial<{
    /**
     * The object (if any) that spawned this polygon.
     * @remarks Not guaranteed by {@linkcode PointSourcePolygon.initialize | PointSourcePolygon#initialize} but will exist in all configs created by {@linkcode PointEffectSourceMixin} subclasses.
     * @privateRemarks Foundry types this as `PointEffectSource` which is the mixin class name, which isn't exported. The type here matches usage and tracks with what they probably meant.
     */
    source?: PointEffectSourceMixin.AnyMixed;
  }>;

  /**
   * Properties of the config that have defaults for nullish values in `#initialize`, and thus are guaranteed in the stored config
   * @internal
   */
  interface _BaseConfig {
    /**
     * A limited radius of the resulting polygon
     * @defaultValue {@linkcode Canvas.Dimensions.maxR | canvas.dimensions.maxR}
     * @remarks Will be replaced with `maxR` if passed value is larger
     */
    radius: number;

    /**
     * The desired density of padding rays, a number per PI
     * @defaultValue {@linkcode PIXI.Circle.approximateVertexDensity | PIXI.Circle.approximateVertexDensity(cfg.radius)}
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
     * Customize how wall direction of one-way walls is applied
     * @defaultValue {@linkcode PointSourcePolygon.WALL_DIRECTION_MODES.NORMAL}
     */
    wallDirectionMode: PointSourcePolygon.WALL_DIRECTION_MODES;

    /**
     * Compute the polygon with threshold wall constraints applied
     * @defaultValue `false`
     */
    useThreshold: boolean;

    /**
     * Limiting polygon boundary shapes
     * @defaultValue `[]`
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
   * The only property required in all configs
   * @internal
   */
  interface _RequiredConfig {
    /** The type of polygon being computed */
    type: PolygonType;
  }

  interface StoredConfig extends _RequiredConfig, _BaseConfig, _OptionalOnlyConfig, _InexactConfig, _ComputedConfig {}

  interface Config extends _RequiredConfig, InexactPartial<_BaseConfig>, _OptionalOnlyConfig, _InexactConfig {}

  type BoundaryShapes = PIXI.Rectangle | PIXI.Circle | PIXI.Polygon;

  /**
   * @remarks Foundry comments 'TODO: "universal" will be deprecated in v14'
   *
   * @privateRemarks This is provided as a union of literals, but after the removal of universal, it will also match the provided
   * keys of {@linkcode CONFIG.Canvas.polygonBackends}, or {@linkcode CONST.WALL_RESTRICTION_TYPES} plus `"darkness"`
   */
  type PolygonType = "light" | "darkness" | "sight" | "sound" | "move" | "universal";

  type CollisionModes = "any" | "all" | "closest";

  interface TestCollisionConfig extends Omit<Config, "type"> {
    /**
     * The type of polygon being computed
     * @remarks {@linkcode PointSourcePolygon.testCollision} supports only those polygon types that are
     * also a type of collision, and so far (v13) there's no such thing as a darkness-blocking wall.
     */
    type: CONST.WALL_RESTRICTION_TYPES;
  }

  /** @internal */
  type _TestCollisionOptions<Mode extends CollisionModes | undefined> = InexactPartial<{
    /**
     * The collision mode to test: "any", "all", or "closest"
     * @defaultValue `"all"`
     */
    mode: Mode;
  }>;

  interface TestCollisionOptions<Mode extends CollisionModes | undefined = undefined>
    extends _TestCollisionOptions<Mode>,
      TestCollisionConfig {}

  /** @internal */
  interface _CollisionTypesReturnMap {
    any: boolean;
    closest: PolygonVertex | null;
    all: PolygonVertex[];
  }

  type TestCollision<Mode extends CollisionModes | undefined = undefined> = _CollisionTypesReturnMap[Coalesce<
    Mode,
    "all"
  >];
}

export default PointSourcePolygon;

declare abstract class AnyPointSourcePolygon extends PointSourcePolygon {
  constructor(...args: never);
}
