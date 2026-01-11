import type { EmptyObject, FixedInstanceType, HandleEmptyObject, Identity, InexactPartial } from "#utils";
import type { Canvas } from "#client/canvas/_module.mjs";
import type { VisibilityFilter } from "#client/canvas/rendering/filters/_module.mjs";
import type { CanvasGroupMixin } from "#client/canvas/groups/_module.d.mts";
import type { CanvasVisionMask } from "#client/canvas/layers/_module.d.mts";
// PerceptionManager is only used for @links
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { PerceptionManager, VisionMode } from "#client/canvas/perception/_module.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import type { PointVisionSource } from "#client/canvas/sources/_module.d.mts";
// Hooks are only linked, aliased to match foundry's links
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AllHooks as hookEvents } from "#client/hooks.mjs";

declare module "#configuration" {
  namespace Hooks {
    interface CanvasGroupConfig {
      CanvasVisibility: CanvasVisibility.Implementation;
    }
  }
}

/**
 * The visibility group which implements dynamic vision, lighting, and fog of war.
 * This group uses an event-driven workflow to perform the minimal required calculation in response to changes.
 *
 * ### Hook Events
 * - {@linkcode hookEvents.initializeVisionMode}
 * - {@linkcode hookEvents.initializeVisionSources}
 * - {@linkcode hookEvents.sightRefresh}
 * - {@linkcode hookEvents.visibilityRefresh}
 */
declare class CanvasVisibility<
  DrawOptions extends CanvasVisibility.DrawOptions = CanvasVisibility.DrawOptions,
  TearDownOptions extends CanvasVisibility.TearDownOptions = CanvasVisibility.TearDownOptions,
> extends CanvasGroupMixin<typeof PIXI.Container, "visibility">(PIXI.Container)<DrawOptions, TearDownOptions> {
  // static override groupName is handled by the CanvasGroupMixin type

  /**
   * The currently revealed vision.
   * @remarks Only `undefined` prior to first draw
   */
  vision: CanvasVisionMask.CanvasVisionContainer | undefined;

  /**
   * The exploration container which tracks exploration progress.
   * @remarks Only `undefined` prior to first draw
   */
  explored: PIXI.Container | undefined;

  /**
   * The optional visibility overlay sprite that should be drawn instead of the unexplored color in the fog of war.
   * @remarks This is `undefined` prior to first draw, and it remains that way unless a fog overlay texture has been set for the current scene
   */
  visibilityOverlay: PIXI.Sprite | undefined;

  /** @remarks Doesn't exist until it's set on draw */
  filter?: VisibilityFilter.Implementation;

  /**
   * The active vision source data object
   * @defaultValue
   * ```js
   * {
   *    source: undefined,
   *    activeLightingOptions: {}
   * }
   * ```
   */
  visionModeData: CanvasVisibility.VisionModeData;

  /**
   * Define whether each lighting layer is enabled, required, or disabled by this vision mode.
   * The value for each lighting channel is a number in {@linkcode VisionMode.LIGHTING_VISIBILITY}
   * ```js
   * {
   *   background: VisionMode.LIGHTING_VISIBILITY.ENABLED,
   *   illumination: VisionMode.LIGHTING_VISIBILITY.ENABLED,
   *   coloration: VisionMode.LIGHTING_VISIBILITY.ENABLED,
   *   darkness: VisionMode.LIGHTING_VISIBILITY.ENABLED,
   *   any: true
   * }
   * ```
   */
  lightingVisibility: CanvasVisibility.LightingVisibility;

  /**
   * A status flag for whether the group initialization workflow has succeeded.
   */
  get initialized(): boolean;

  /**
   * Indicates whether containment filtering is required when rendering vision into a texture
   * @internal
   */
  get needsContainment(): boolean;

  /**
   * Does the currently viewed Scene support Token field of vision?
   * @remarks
   * @throws If {@linkcode Canvas.scene | Canvas#scene} is `null`
   */
  get tokenVision(): Scene.Implementation["tokenVision"];

  /**
   * The configured options used for the saved fog-of-war texture.
   * @remarks Only `undefined` prior to first draw
   */
  get textureConfiguration(): CanvasVisibility.TextureConfiguration | undefined;

  /**
   * Optional overrides for exploration sprite dimensions.
   * @privateRemarks Only `x`, `y`, `width`, and `height` are ever checked, and this is never even set by core anywhere,
   * but they type it as a `PIXI.Rectangle` so might as well match.
   */
  set explorationRect(rect: PIXI.Rectangle | undefined);

  /** @remarks This getter doesn't actually exist, it's only here to correct the type inferred from the setter */
  get explorationRect(): undefined;

  /**
   * Initialize all Token vision sources which are present on this group
   */
  initializeSources(): void;

  /**
   * Initialize the vision mode.
   */
  initializeVisionMode(): void;

  protected override _draw(options?: HandleEmptyObject<DrawOptions>): Promise<void>;

  protected override _tearDown(options: HandleEmptyObject<TearDownOptions>): Promise<void>;

  /**
   * Update the display of the visibility group.
   * Organize sources into rendering queues and draw lighting containers for each source
   */
  refresh(): void;

  /**
   * Update vision (and fog if necessary)
   */
  refreshVisibility(): void;

  /**
   * Reset the exploration container with the fog sprite
   */
  resetExploration(): void;

  /**
   * Restrict the visibility of certain canvas assets (like Tokens or DoorControls) based on the visibility polygon
   * These assets should only be displayed if they are visible given the current player's field of view
   */
  restrictVisibility(): void;

  /**
   * Test whether a target point on the Canvas is visible based on the current vision and LOS polygons.
   * @param point   - The point in space to test
   * @param options - Additional options which modify visibility testing.
   * @returns Whether the point is currently visible.
   */
  testVisibility(point: Canvas.PossiblyElevatedPoint, options?: CanvasVisibility.TestVisibilityOptions): boolean;

  /**
   * Create the visibility test config.
   * @param point   - The point in space to test, an object with coordinates x and y.
   * @param options - Additional options which modify visibility testing.
   * @internal
   * @remarks If a Point is passed without elevation, uses the `object`'s if it's a `Token`, otherwise defaults to `0`
   */
  protected _createVisibilityTestConfig(
    point: Canvas.PossiblyElevatedPoint,
    options?: CanvasVisibility.CreateTestConfigOptions,
  ): CanvasVisibility.TestConfig;

  #CanvasVisibility: true;
}

declare namespace CanvasVisibility {
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyCanvasVisibility {}
    interface AnyConstructor extends Identity<typeof AnyCanvasVisibility> {}
  }

  interface ImplementationClass extends Identity<typeof CONFIG.Canvas.groups.visibility.groupClass> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface DrawOptions extends CanvasGroupMixin.DrawOptions {}

  interface TearDownOptions extends CanvasGroupMixin.TearDownOptions {}

  type TestObject = PlaceableObject.Any | null;

  interface VisionModeData {
    /**
     * @remarks Only `undefined` immediately following construction. Gets set to a Source or `null` when {@linkcode Canvas.perception | canvas.perception} receives the
     * {@linkcode PerceptionManager.RENDER_FLAGS.initializeVisionModes | initializeVisionModes} render flag
     */
    source: PointVisionSource.Internal.Any | null | undefined;

    /**
     * @remarks Defaults to `{}` at construction. Gets set to {@linkcode VisionMode.lighting | this.visionModeData.source?.visionMode.lighting}`|| {}` when
     * {@linkcode Canvas.perception | canvas.perception} receives the {@linkcode PerceptionManager.RENDER_FLAGS.initializeVisionModes | initializeVisionModes}
     * render flag.
     */
    activeLightingOptions: VisionMode.LightingData | EmptyObject;
  }

  interface LightingVisibility {
    /**
     * @remarks Defaults to {@linkcode VisionMode.LIGHTING_VISIBILITY.ENABLED | ENABLED} at construction. Updated in `CanvasVisibility##configureLightingVisibility`
     * when {@linkcode Canvas.perception | canvas.perception} receives the {@linkcode PerceptionManager.RENDER_FLAGS.initializeVisionModes | initializeVisionModes}
     * render flag.
     */
    illumination: VisionMode.LIGHTING_VISIBILITY;

    /**
     * @remarks Defaults to {@linkcode VisionMode.LIGHTING_VISIBILITY.ENABLED | ENABLED} at construction. Updated in `CanvasVisibility##configureLightingVisibility`
     * when {@linkcode Canvas.perception | canvas.perception} receives the {@linkcode PerceptionManager.RENDER_FLAGS.initializeVisionModes | initializeVisionModes}
     * render flag.
     */
    background: VisionMode.LIGHTING_VISIBILITY;

    /**
     * @remarks Defaults to {@linkcode VisionMode.LIGHTING_VISIBILITY.ENABLED | ENABLED} at construction. Updated in `CanvasVisibility##configureLightingVisibility`
     * when {@linkcode Canvas.perception | canvas.perception} receives the {@linkcode PerceptionManager.RENDER_FLAGS.initializeVisionModes | initializeVisionModes}
     * render flag.
     */
    coloration: VisionMode.LIGHTING_VISIBILITY;

    /**
     * @remarks Defaults to {@linkcode VisionMode.LIGHTING_VISIBILITY.ENABLED | ENABLED} at construction. Updated in `CanvasVisibility##configureLightingVisibility`
     * when {@linkcode Canvas.perception | canvas.perception} receives the {@linkcode PerceptionManager.RENDER_FLAGS.initializeVisionModes | initializeVisionModes}
     * render flag.
     */
    darkness: VisionMode.LIGHTING_VISIBILITY;

    /** @remarks Only set `false` if **all** other keys are {@linkcode VisionMode.LIGHTING_VISIBILITY.DISABLED} */
    any: boolean;
  }

  interface TestVisibilityOptions extends CreateTestConfigOptions {}

  /** @internal */
  type _CreateTestConfigOptions = InexactPartial<{
    /**
     * A numeric radial offset which allows for a non-exact match.
     * For example, if tolerance is 2 then the test will pass if the point is within 2px of a vision polygon
     * @defaultValue `2`
     */
    tolerance: number;

    /**
     * An optional reference to the object whose visibility is being tested
     * @defaultValue `null`
     */
    object: TestObject;
  }>;

  interface CreateTestConfigOptions extends _CreateTestConfigOptions {}

  /** @internal */
  type _TestConfigOptional = InexactPartial<{
    /**
     * The target object
     * @defaultValue `null`
     * @remarks Foundry marks this required, but it's only checked in three places in core:
     * - {@linkcode DetectionMode._canDetect | DetectionMode#_canDetect} for `object instanceof Token`
     * - {@linkcode CanvasVisibility._createVisibilityTestConfig | CanvasVisibility#_crateVisibilityTestConfig} for `object instanceof Token`
     * - {@linkcode foundry.canvas.sources.PointLightSource._canDetectObject | PointLightSource#_canDetectObject} for `object?.document instanceof TokenDocument`
     * All of which are nullish-safe, so this is allowed to be optional/`undefined`, and if coming in via {@linkcode CanvasVisibility.testVisibility | #testVisibility}, it
     * gets a `null` parameter default applied
     */
    object: TestObject;
  }>;

  interface TestConfig extends _TestConfigOptional {
    /** An array of visibility tests */
    tests: CanvasVisibility.Test[];
  }

  interface Test {
    point: Canvas.ElevatedPoint;

    /**
     * @deprecated "`CanvasVisibility.Test#elevation` has been deprecated in favor of {@linkcode Canvas.ElevatedPoint.elevation | CanvasVisibility.Test#point#elevation}." (since v13, until v15)
     * @remarks This deprecation shim only exists on configs generated by {@linkcode CanvasVisibility._createVisibilityTestConfig | CanvasVisibility#_createVisibilityTestConfig}.
     * @privateRemarks Actually a getter/setter pair tied to `this.point.elevation`, but getters/setters can't be optional.
     *
     * Can't be `undefined` as that is not a valid value for {@linkcode Canvas.ElevatedPoint.elevation}
     */
    elevation?: number;

    los: Map<PointVisionSource.Internal.Any, boolean>;
  }

  /**
   * @remarks The subset of {@linkcode PIXI.IBaseTextureOptions} that `CanvasVisibility##createTextureConfiguration` returns.
   */
  interface TextureConfiguration extends Pick<
    PIXI.IBaseTextureOptions,
    "resolution" | "width" | "height" | "mipmap" | "multisample" | "scaleMode" | "alphaMode" | "format"
  > {}
}

export default CanvasVisibility;

declare abstract class AnyCanvasVisibility extends CanvasVisibility {
  constructor(...args: never);
}
