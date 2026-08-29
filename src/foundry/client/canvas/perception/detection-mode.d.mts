import type { Brand, Identity, InexactPartial } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type { DataModel } from "#common/abstract/_module.d.mts";
import type { CanvasVisibility } from "#client/canvas/groups/_module.d.mts";
import type { PointSourcePolygon } from "#client/canvas/geometry/_module.d.mts";
import type { PointVisionSource } from "../sources/_module.d.mts";

/**
 * A Detection Mode which can be associated with any kind of sense/vision/perception.
 * A token could have multiple detection modes.
 */
declare class DetectionMode extends DataModel<DetectionMode.Schema> {
  static override defineSchema(): DetectionMode.Schema;

  /**
   * Get the detection filter pertaining to this mode.
   * @remarks Always `undefined` in {@linkcode DetectionMode}
   */
  static getDetectionFilter(): PIXI.Filter | undefined;

  /**
   * An optional filter to apply on the target when it is detected with this mode.
   * @remarks Never set in {@linkcode DetectionMode}; Core subclasses that use one set it in {@linkcode getDetectionFilter} overrides.
   */
  protected static _detectionFilter: PIXI.Filter | undefined;

  /**
   * The types of the detection mode.
   * @remarks Returns a reference to a private, frozen object
   */
  static get DETECTION_TYPES(): DetectionMode.DetectionTypes;

  /**
   * The identifier of the basic sight detection mode.
   * @remarks A subclass could override this in reality, but `"basicSight"` is used as a magic string without checking here in both
   * {@linkcode foundry.canvas.placeables.Token._prepareDetectionModes | Token#_prepareDetectionModes} and
   * {@linkcode foundry.canvas.groups.CanvasVisibility.testVisibility | CanvasVisibility#testVisibility}, so it's been typed as the
   * literal to avoid accidental breakage.
   */
  static get BASIC_MODE_ID(): "basicSight";

  /**
   * Test visibility of a target object or array of points for a specific vision source.
   * @param visionSource  - The vision source being tested
   * @param mode          - The detection mode configuration
   * @param config        - The visibility test configuration
   * @returns Is the test target visible?
   */
  testVisibility(
    visionSource: PointVisionSource.Implementation,
    mode: TokenDocument.DetectionModeData,
    config: CanvasVisibility.TestConfig,
  ): boolean;

  /**
   * Can this {@linkcode PointVisionSource} theoretically detect a certain object based on its properties?
   * This check should not consider the relative positions of either object, only their state.
   * @param visionSource - The vision source being tested
   * @param target       - The target object being tested
   * @param level        - The level the target is in
   * @returns Can the target object theoretically be detected by this vision source?
   * @remarks Will always be passed a `target` when called by {@linkcode testVisibility | DetectionMode#testVisibility}, it just might possibly be `undefined`.
   * All use is gated behind an `instanceof Token` check, so that's fine.
   */
  protected _canDetect(
    visionSource: PointVisionSource.Implementation,
    target: CanvasVisibility.TestObject | null,
    level: Level.Implementation,
  ): boolean;

  /**
   * Evaluate a single test point to confirm whether it is visible.
   * Standard detection rules require that the test point be both within LOS and within range.
   * @param visionSource - The vision source being tested
   * @param mode         - The detection mode configuration
   * @param target       - The target object being tested
   * @param test         - The test case being evaluated
   * @remarks As of 14.366, Foundry's implementation does not use `target` at all, neither directly, because the whole method is calling two subsidiary methods, nor in said
   * subsidiary methods.
   *
   * See {@linkcode _canDetect} remarks.
   */
  protected _testPoint(
    visionSource: PointVisionSource.Implementation,
    mode: TokenDocument.DetectionModeData,
    target: CanvasVisibility.TestObject | null,
    test: CanvasVisibility.Test,
  ): boolean;

  /**
   * Test whether the line-of-sight requirement for detection is satisfied.
   * Always true if the detection mode bypasses walls, otherwise the test point must be contained by the LOS polygon.
   * The result of is cached for the vision source so that later checks for other detection modes do not repeat it.
   * @param visionSource    - The vision source being tested
   * @param mode            - The detection mode configuration
   * @param target          - The target object being tested
   * @param test            - The test case being evaluated
   * @returns Is the LOS requirement satisfied for this test?
   * @remarks As of 14.366, Foundry's implementation does not use `target` at all.
   *
   * See {@linkcode _canDetect} remarks.
   */
  protected _testLOS(
    visionSource: PointVisionSource.Implementation,
    mode: TokenDocument.DetectionModeData,
    target: CanvasVisibility.TestObject | null,
    test: CanvasVisibility.Test,
  ): boolean;

  /**
   * Test for LOS collision.
   * For both the segment in the viewed level and in the target level, a ray is cast with the given configuration.
   * @param visionSource - The vision source
   * @param test         - The test
   * @param config       - The configuration
   * @returns True if there's a collision or the point is not in the vision angle, otherwise false
   */
  protected static _testCollision(
    visionSource: PointVisionSource.Implementation,
    test: CanvasVisibility.TestTarget,
    config?: DetectionMode.CollisionConfig,
  ): boolean;

  /**
   * Test for LOS collision.
   * For the segment of the ray in the viewed level, `los` is tested.
   * For the segment of the ray in the target level, a ray is cast with the configuration of `los`.
   * @param visionSource - The vision source
   * @param test         - The test
   * @param los          - The LOS polygon
   * @returns True if there's a collision or the point is not in the vision angle, otherwise false
   */
  protected static _testCollision(
    visionSource: PointVisionSource.Implementation,
    test: CanvasVisibility.TestTarget,
    los: PointSourcePolygon.Any,
  ): boolean;

  /**
   * Test whether the target is within the vision angle.
   * @param visionSource    - The vision source being tested
   * @param mode            - The detection mode configuration
   * @param target          - The target object being tested
   * @param test            - The test case being evaluated
   * @returns Is the point within the vision angle?
   * @remarks As of 14.366, Foundry's implementation does not use `target` at all
   *
   * See {@linkcode _canDetect} remarks.
   */
  protected _testAngle(
    visionSource: PointVisionSource.Implementation,
    mode: TokenDocument.DetectionModeData,
    target: CanvasVisibility.TestObject | null,
    test: CanvasVisibility.Test,
  ): boolean;

  /**
   * Verify that a target is in range of a source.
   * @param visionSource    - The vision source being tested
   * @param mode            - The detection mode configuration
   * @param target          - The target object being tested
   * @param test            - The test case being evaluated
   * @returns Is the target within range?
   * @remarks As of 14.366, Foundry's implementation does not use `target` at all
   *
   * See {@linkcode _canDetect} remarks.
   */
  protected _testRange(
    visionSource: PointVisionSource.Implementation,
    mode: TokenDocument.DetectionModeData,
    target: CanvasVisibility.TestObject | null,
    test: CanvasVisibility.Test,
  ): boolean;

  /**
   * @deprecated "`DetectionMode#BASIC_MODE_ID` is deprecated. Please use {@linkcode DetectionMode.BASIC_MODE_ID} instead." (since v13, until v15)
   * @privateRemarks This was not previously typed by us, as it had been erroneously marked static in v12
   */
  get BASIC_MODE_ID(): typeof DetectionMode.BASIC_MODE_ID;

  /* DataModel overrides */

  static override _schema: fields.DataModelSchemaField<typeof DetectionMode>;

  static override get schema(): fields.DataModelSchemaField<typeof DetectionMode>;

  override get schema(): typeof DetectionMode.schema;

  static override validateJoint(data: DetectionMode.Source): void;

  static override fromSource(source: DetectionMode.CreateData, context?: DataModel.FromSourceOptions): DetectionMode;

  static override fromJSON(json: string): DetectionMode;
}

declare namespace DetectionMode {
  interface Any extends AnyDetectionMode {}
  interface AnyConstructor extends Identity<typeof AnyDetectionMode> {}

  /**
   * @remarks Foundry documents this as `Partial<Omit<PointSourcePolygonConfig, "source"|"level">>`, but both keys are
   * simply overwritten before the collision is cast, and core passes a whole stored polygon config through here.
   */
  interface CollisionConfig extends InexactPartial<PointSourcePolygon.StoredConfig> {}

  interface Schema extends DataSchema {
    id: fields.StringField<{ blank: false }>;

    label: fields.StringField<{ blank: false }>;

    /** If this DM is available in Token Config UI */
    tokenConfig: fields.BooleanField<{ initial: true }>;

    /** If this DM is constrained by walls and surfaces */
    walls: fields.BooleanField<{ initial: true }>;

    /** If this DM is constrained by the vision angle */
    angle: fields.BooleanField<{ initial: true }>;

    type: fields.NumberField<
      {
        initial: typeof DetectionMode.DETECTION_TYPES.SIGHT;
        choices: DetectionMode.DETECTION_TYPES[];
      },
      DetectionMode.DETECTION_TYPES,
      DetectionMode.DETECTION_TYPES,
      DetectionMode.DETECTION_TYPES
    >;
  }

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}

  type DETECTION_TYPES = Brand<number, "DetectionMode.DETECTION_TYPES">;

  interface DetectionTypes {
    /** Sight, and anything depending on light perception */
    readonly SIGHT: 0 & DETECTION_TYPES;

    /** What you can hear. Includes echolocation for bats per example */
    readonly SOUND: 1 & DETECTION_TYPES;

    /** This is mostly a sense for touch and vibration, like tremorsense, movement detection, etc. */
    readonly MOVE: 2 & DETECTION_TYPES;

    /** Can't fit in other types (smell, life sense, trans-dimensional sense, sense of humor...) */
    readonly OTHER: 3 & DETECTION_TYPES;
  }

  /** @deprecated Use {@linkcode DetectionMode.Source} instead. This type will be removed in v14. */
  type SourceData = Source;
}

export default DetectionMode;

declare abstract class AnyDetectionMode extends DetectionMode {
  constructor(...args: never);
}
