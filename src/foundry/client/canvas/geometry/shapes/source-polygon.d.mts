import type { Coalesce, Identity, InexactPartial } from "#utils";
import type PointEffectSourceMixin from "#client/canvas/sources/point-effect-source.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { Ray } from "#client/canvas/geometry/_module.d.mts";
import type { PolygonVertex } from "#client/canvas/geometry/edges/_module.d.mts";
import type ElevatedSurfaceExposureGenerator from "./elevated-surface-exposure-polygon.d.mts";
// TODO: V14 renames this to `PolygonTree` and moves it to `client/data/polygon-tree.mjs`; retarget this
// import in the `client/data` migration.
import type { RegionPolygonTree } from "#client/data/region-shapes/_module.d.mts";
import type { Level, Scene } from "#client/documents/_module.d.mts";

/**
 * An extension of the default PIXI.Polygon which is used to represent the line of sight for a point source.
 * @remarks Methods and types that need subclass overrides to account for expanded Configs:
 * - {@linkcode PointSourcePolygon.Config}
 * - {@linkcode PointSourcePolygon.StoredConfig}
 * - {@linkcode PointSourcePolygon.config | PointSourcePolygon#config}
 * - {@linkcode PointSourcePolygon.benchmark}
 * - {@linkcode PointSourcePolygon.create}
 * - {@linkcode PointSourcePolygon.testCollision}
 * - {@linkcode PointSourcePolygon.TestCollisionOptions}
 * - {@linkcode PointSourcePolygon.TestCollisionConfig}
 *
 * See {@linkcode foundry.canvas.geometry.ClockwiseSweepPolygon | ClockwiseSweepPolygon} for examples (and probably
 * use it as your base class, since Foundry is assuming the availability of its APIs in more places as time goes on)
 */
declare abstract class PointSourcePolygon extends PIXI.Polygon {
  /**
   * @remarks This is protected because `new PointSourcePolygon` does not sufficiently initialize the class; Use the static `create` method instead.
   */
  protected constructor(...args: ConstructorParameters<typeof PIXI.Polygon>);

  /**
   * Customize how wall direction of one-way walls is applied
   * @deprecated "`PointSourcePolygon.WALL_DIRECTION_MODES` has been deprecated in favor of
   * {@linkcode CONST.EDGE_DIRECTION_MODES}." (since v14, until v16)
   * @remarks Returns {@linkcode CONST.EDGE_DIRECTION_MODES} itself, not a distinct object, so its members
   * remain assignable to {@linkcode ClockwiseSweepPolygon.Config.edgeDirectionMode | edgeDirectionMode}.
   */
  static get WALL_DIRECTION_MODES(): typeof CONST.EDGE_DIRECTION_MODES;

  /**
   * The rectangular bounds of this polygon
   * @defaultValue `new PIXI.Rectangle(0, 0, 0, 0)`
   */
  bounds: PIXI.Rectangle;

  /**
   * The origin point of the source polygon.
   * @privateRemarks Declared without an initializer, so `undefined` until {@linkcode PointSourcePolygon.initialize | #initialize} sets it.
   */
  origin: Canvas.ElevatedPoint | undefined;

  /**
   * The configuration of this polygon.
   * @remarks Initialized as `{}` but immediately filled by  {@linkcode PointSourcePolygon.initialize | #initialize}
   */
  config: PointSourcePolygon.StoredConfig;

  /**
   * The area of surfaces that is visible to this polygon, if any.
   * @privateRemarks Declared without an initializer, so `undefined` until {@linkcode PointSourcePolygon.create} assigns it.
   */
  surfaceExposure: RegionPolygonTree | null | undefined;

  /**
   * The level the polygon is computed it.
   */
  get level(): Level.Implementation;

  /**
   * The level the polygon is computed it.
   */
  get scene(): Scene.Implementation;

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
   * @param ray         - The Ray to test
   * @param mode        - The collision mode being tested
   * @param destination - The destination
   * @param tMin        - Intersections of the ray and an edge with t-value at most
   * `tMin` are not considered collisions. Default: `0`.
   * @param tMax        - Intersections of the ray and an edge with t-value greater than
   * `tMax` are not considered collisions. Default: `1`.
   * @returns The collision test result
   */
  protected abstract _testCollision<Mode extends PointSourcePolygon.CollisionModes>(
    ray: Ray,
    mode: Mode,
    destination: Canvas.ElevatedPoint,
    tMin: number,
    tMax: number,
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

  /**
   * @deprecated V14 collapsed this into {@linkcode CONST.EDGE_DIRECTION_MODES}; the branded standalone type it
   * described no longer exists at runtime. Use {@linkcode CONST.EDGE_DIRECTION_MODES} instead.
   */
  type WALL_DIRECTION_MODES = CONST.EDGE_DIRECTION_MODES;

  /**
   * @deprecated V14 collapsed this into {@linkcode CONST.EDGE_DIRECTION_MODES}. Use
   * {@linkcode CONST.EDGE_DIRECTION_MODES} instead.
   */
  type WallDirectionModes = typeof CONST.EDGE_DIRECTION_MODES;

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
   * @internal
   */
  interface _InexactConfig {
    /**
     * The object (if any) that spawned this polygon.
     * @remarks Not guaranteed by {@linkcode PointSourcePolygon.initialize | PointSourcePolygon#initialize} but will exist in all configs created by {@linkcode PointEffectSourceMixin} subclasses.
     * @privateRemarks Foundry types this as `PointEffectSource` which is the mixin class name, which isn't exported. The type here matches usage and tracks with what they probably meant.
     */
    source: PointEffectSourceMixin.AnyMixed;

    /**
     * Display debugging visualization and logging for the polygon
     * @remarks Overridden `true` if `CONFIG.debug.polygons` is truthy
     */
    debug: boolean;
  }

  /**
   * Properties of the config that have defaults for nullish values in {@linkcode PointSourcePolygon.initialize | PointSourcePolygon#initialize}, and thus are guaranteed in the stored config
   * @internal
   */
  interface _BaseConfig {
    /**
     * The Level the polygon is computed in. Defaults to the viewed Level.
     * @defaultValue {@linkcode Canvas.level | canvas.level}
     */
    level: Level.Implementation;

    /**
     * Additional options passed through to surface exposure generator
     * @defaultValue `{}`
     */
    surfaceExposure: ElevatedSurfaceExposureGenerator.Options;

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
     * Compute the polygon with threshold wall constraints applied
     * @defaultValue `false`
     */
    useThreshold: boolean;

    /**
     * Limiting polygon boundary shapes
     * @defaultValue `[]`
     */
    boundaryShapes: Array<BoundaryShapes>;
  }

  /**
   * The only property required in all configs
   * @internal
   */
  interface _RequiredConfig {
    /** The type of polygon being computed */
    type: PolygonType;
  }

  /**
   * @remarks The interface stored in {@link PointSourcePolygon.config | PointSourcePolygon#config}, with defaults applied
   */
  interface StoredConfig
    extends _RequiredConfig, _BaseConfig, _OptionalOnlyConfig, InexactPartial<_InexactConfig>, _ComputedConfig {}

  /**
   * @remarks The interface passed to {@linkcode PointSourcePolygon.create}, etc. All properties are optional other than `type`
   */
  interface Config
    extends _RequiredConfig, InexactPartial<_BaseConfig>, _OptionalOnlyConfig, InexactPartial<_InexactConfig> {}

  type BoundaryShapes = PIXI.Rectangle | PIXI.Circle | PIXI.Polygon;

  /**
   * @remarks Foundry comments 'TODO: "universal" will be deprecated in v14'
   *
   * @privateRemarks This is provided as a union of literals, but after the removal of universal, it will also match the provided
   * keys of {@linkcode CONFIG.Canvas.polygonBackends}, or {@linkcode CONST.WALL_RESTRICTION_TYPES} plus `"darkness"`
   */
  type PolygonType = "light" | "darkness" | "sight" | "sound" | "move" | "universal";

  type CollisionModes = "any" | "all" | "closest";

  interface _TestCollisionConfig {
    /**
     * The type of polygon being computed
     * @remarks {@linkcode PointSourcePolygon.testCollision} supports only those polygon types that are
     * also a type of collision, and so far (v13) there's no such thing as a darkness-blocking wall.
     */
    type: CONST.WALL_RESTRICTION_TYPES;
  }

  interface TestCollisionConfig extends _TestCollisionConfig, Omit<Config, "type"> {}

  /** @internal */
  interface _TestCollisionOptions<Mode extends CollisionModes | undefined> {
    /**
     * The collision mode to test: "any", "all", or "closest"
     * @defaultValue `"all"`
     */
    mode: Mode;

    /**
     * Intersections of the ray and an edge with t-value at most `tMin` are not considered collisions.
     * @defaultValue `0`
     */
    tMin: number;

    /**
     * Intersections of the ray and an edge with t-value greater than `tMax` are not considered collisions.
     * @defaultValue `1`
     */
    tMax: number;
  }

  interface TestCollisionOptions<Mode extends CollisionModes | undefined = undefined>
    extends InexactPartial<_TestCollisionOptions<Mode>>, TestCollisionConfig {}

  /** @internal */
  interface _CollisionTypesReturnMap {
    any: boolean;
    closest: PolygonVertex | null;
    all: PolygonVertex[];
  }

  type TestCollision<
    Mode extends CollisionModes | undefined = undefined,
    Default extends keyof _CollisionTypesReturnMap = "all",
  > = _CollisionTypesReturnMap[Coalesce<Mode, Default>];
}

export default PointSourcePolygon;

declare abstract class AnyPointSourcePolygon extends PointSourcePolygon {
  constructor(...args: never);
}
