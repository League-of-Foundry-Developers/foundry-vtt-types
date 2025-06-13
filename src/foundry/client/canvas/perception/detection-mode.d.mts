import type { Brand, Identity, NullishProps } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type { CanvasVisibility } from "#client/canvas/groups/_module.d.mts";

/**
 * A Detection Mode which can be associated with any kind of sense/vision/perception.
 * A token could have multiple detection modes.
 */
declare class DetectionMode extends foundry.abstract.DataModel<DetectionMode.Schema> {
  static override defineSchema(): DetectionMode.Schema;

  /**
   * Get the detection filter pertaining to this mode.
   */
  static getDetectionFilter(): PIXI.Filter | undefined;

  /**
   * An optional filter to apply on the target when it is detected with this mode.
   */
  static _detectionFilter: PIXI.Filter | undefined;

  /**
   * The type of the detection mode.
   * @see {@linkcode CONST.WALL_RESTRICTION_TYPES}
   * @remarks Set via `Object.defineProperty` with a frozen object, so `readonly` is justified both here and for the interface properties
   */
  static readonly DETECTION_TYPES: DetectionMode.DetectionTypes;

  /**
   * The identifier of the basic sight detection mode.
   */
  static readonly BASIC_MODE_ID: "basicSight";

  /**
   * Test visibility of a target object or array of points for a specific vision source.
   * @param visionSource  - The vision source being tested
   * @param mode          - The detection mode configuration
   * @param config        - The visibility test configuration
   * @returns   Is the test target visible?
   */
  testVisibility(
    visionSource: foundry.canvas.sources.PointVisionSource.Any,
    mode: TokenDocument.DetectionModeData,
    { object, tests }: DetectionMode.TestConfig, // not:null (destructured)
  ): boolean;

  /**
   * Can this VisionSource theoretically detect a certain object based on its properties?
   * This check should not consider the relative positions of either object, only their state.
   * @param visionSource - The vision source being tested
   * @param target       - The target object being tested
   * @returns Can the target object theoretically be detected by this vision source?
   */
  protected _canDetect(
    visionSource: foundry.canvas.sources.PointVisionSource.Any,
    target: CanvasVisibility.TestObject,
  ): boolean;

  /**
   * Evaluate a single test point to confirm whether it is visible.
   * Standard detection rules require that the test point be both within LOS and within range.
   * @param visionSource - The vision source being tested
   * @param mode         - The detection mode configuration
   * @param target       - The target object being tested
   * @param test         - The test case being evaluated
   */
  protected _testPoint(
    visionSource: foundry.canvas.sources.PointVisionSource.Any,
    mode: TokenDocument.DetectionModeData,
    target: CanvasVisibility.TestObject,
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
   */
  protected _testLOS(
    visionSource: foundry.canvas.sources.PointVisionSource.Any,
    mode: TokenDocument.DetectionModeData,
    target: CanvasVisibility.TestObject,
    test: CanvasVisibility.Test,
  ): boolean;

  /**
   * Test whether the target is within the vision angle.
   * @param visionSource    - The vision source being tested
   * @param mode            - The detection mode configuration
   * @param target          - The target object being tested
   * @param test            - The test case being evaluated
   * @returns Is the point within the vision angle?
   */
  protected _testAngle(
    visionSource: foundry.canvas.sources.PointVisionSource.Any,
    mode: TokenDocument.DetectionModeData,
    target: CanvasVisibility.TestObject,
    test: CanvasVisibility.Test,
  ): boolean;

  /**
   * Verify that a target is in range of a source.
   * @param visionSource    - The vision source being tested
   * @param mode            - The detection mode configuration
   * @param target          - The target object being tested
   * @param test            - The test case being evaluated
   * @returns Is the target within range?
   */
  protected _testRange(
    visionSource: foundry.canvas.sources.PointVisionSource.Any,
    mode: TokenDocument.DetectionModeData,
    target: CanvasVisibility.TestObject,
    test: CanvasVisibility.Test,
  ): boolean;
}

declare namespace DetectionMode {
  interface Any extends AnyDetectionMode {}
  interface AnyConstructor extends Identity<typeof AnyDetectionMode> {}

  interface Schema extends DataSchema {
    id: fields.StringField<{ blank: false }>;

    label: fields.StringField<{ blank: false }>;

    /** If this DM is available in Token Config UI */
    tokenConfig: fields.BooleanField<{ initial: true }>;

    /** If this DM is constrained by walls */
    walls: fields.BooleanField<{ initial: true }>;

    /** If this DM is constrained by the vision angle */
    angle: fields.BooleanField<{ initial: true }>;

    type: fields.NumberField<{
      initial: DetectionMode.DETECTION_TYPES;
      choices: DetectionMode.DETECTION_TYPES[];
    }>;
  }

  /** @see CanvasVisibility.TestConfig */
  interface TestConfig
    extends CanvasVisibility._TestConfigRequired,
      NullishProps<CanvasVisibility._TestConfigOptional> {}

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
}

export default DetectionMode;

declare abstract class AnyDetectionMode extends DetectionMode {
  constructor(...args: never);
}
