import type { InexactPartial, ValueOf } from "../../../../types/utils.d.mts";
import type { fields } from "../../../common/data/module.d.mts";

declare global {
  namespace DetectionMode {
    interface Schema extends DataSchema {
      id: fields.StringField<{ blank: false }>;
      label: fields.StringField<{ blank: false }>;
      tokenConfig: fields.BooleanField<{ initial: true }>;
      walls: fields.BooleanField<{ initial: true }>;
      angle: fields.BooleanField<{ initial: true }>;
      type: fields.NumberField<{
        initial: typeof DetectionMode.DETECTION_TYPES.SIGHT;
        choices: ValueOf<typeof DetectionMode.DETECTION_TYPES>[];
      }>;
    }
  }

  /**
   * A Detection Mode which can be associated with any kind of sense/vision/perception.
   * A token could have multiple detection modes.
   */
  class DetectionMode extends foundry.abstract.DataModel<DetectionMode.Schema> {
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
     * The type of the detection mode. If its sight based, sound based, etc.
     * It is related to wall's WALL_RESTRICTION_TYPES
     * @see CONST.WALL_RESTRICTION_TYPES
     */
    static DETECTION_TYPES: {
      /** Sight, and anything depending on light perception */
      SIGHT: 0;
      /** What you can hear. Includes echolocation for bats per example */
      SOUND: 1;
      /** This is mostly a sense for touch and vibration, like tremorsense, movement detection, etc. */
      MOVE: 2;
      /** Can't fit in other types (smell, life sense, trans-dimensional sense, sense of humor...) */
      OTHER: 3;
    };

    /**
     * The identifier of the basic sight detection mode.
     */
    static BASIC_MODE_ID: "basicSight";

    /**
     * Test visibility of a target object or array of points for a specific vision source.
     * @param visionSource  - The vision source being tested
     * @param mode          - The detection mode configuration
     * @param config        - The visibility test configuration
     * @returns   Is the test target visible?
     */
    testVisibility(
      visionSource: VisionSource,
      mode: TokenDetectionMode,
      { object, tests }: InexactPartial<CanvasVisibilityTestConfig>,
    ): boolean;

    /**
     * Can this VisionSource theoretically detect a certain object based on its properties?
     * This check should not consider the relative positions of either object, only their state.
     * @param visionSource - The vision source being tested
     * @param target       - The target object being tested
     * @returns Can the target object theoretically be detected by this vision source?
     */
    protected _canDetect(visionSource: VisionSource, target: PlaceableObject): boolean;

    /**
     * Evaluate a single test point to confirm whether it is visible.
     * Standard detection rules require that the test point be both within LOS and within range.
     * @param visionSource - The vision source being tested
     * @param mode         - The detection mode configuration
     * @param target       - The target object being tested
     * @param test         - The test case being evaluated
     */
    protected _testPoint(
      visionSource: VisionSource,
      mode: TokenDetectionMode,
      target: PlaceableObject,
      test: CanvasVisibilityTest,
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
      visionSource: VisionSource,
      mode: TokenDetectionMode,
      target: PlaceableObject,
      test: CanvasVisibilityTest,
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
      visionSource: VisionSource,
      mode: TokenDetectionMode,
      target: PlaceableObject,
      test: CanvasVisibilityTest,
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
      visionSource: VisionSource,
      mode: TokenDetectionMode,
      target: PlaceableObject,
      test: CanvasVisibilityTest,
    ): boolean;
  }

  /**
   * A special detection mode which models standard human vision.
   * This mode is the default case which is tested first when evaluating visibility of objects.
   * It is also a special case, in that it is the only detection mode which considers the area of distant light sources.
   */
  class DetectionModeBasicSight extends DetectionMode {
    override _testPoint(
      visionSource: VisionSource,
      mode: TokenDetectionMode,
      target: PlaceableObject,
      test: CanvasVisibilityTest,
    ): boolean;
  }

  /**
   * Detection mode that see invisible creatures.
   * This detection mode allows the source to:
   * - See/Detect the invisible target as if visible.
   * - The "See" version needs sight and is affected by blindness
   */
  class DetectionModeInvisibility extends DetectionMode {
    static override getDetectionFilter(): PIXI.Filter | undefined;

    protected override _canDetect(visionSource: VisionSource, target: PlaceableObject): boolean;
  }

  /**
   * Detection mode that see creatures in contact with the ground.
   */
  class DetectionModeTremor extends DetectionMode {
    static override getDetectionFilter(): PIXI.Filter | undefined;

    protected override _canDetect(visionSource: VisionSource, target: PlaceableObject): boolean;
  }

  /**
   * Detection mode that see ALL creatures (no blockers).
   * If not constrained by walls, see everything within the range.
   */
  class DetectionModeAll extends DetectionMode {
    static override getDetectionFilter(): PIXI.Filter | undefined;

    protected override _canDetect(visionSource: VisionSource, target: PlaceableObject): boolean;
  }
}
