import type { EmptyObject, HandleEmptyObject, InexactPartial, ValueOf } from "fvtt-types/utils";

declare global {
  /**
   * The visibility Layer which implements dynamic vision, lighting, and fog of war
   * This layer uses an event-driven workflow to perform the minimal required calculation in response to changes.
   * @see {@link PointSource}
   */
  class CanvasVisibility extends CanvasLayer {
    /**
     * The currently revealed vision.
     */
    vision: CanvasVisionMask.CanvasVisionContainer | undefined;

    /**
     * The exploration container which tracks exploration progress.
     */
    explored: PIXI.Container | undefined;

    /**
     * The optional visibility overlay sprite that should be drawn instead of the unexplored color in the fog of war.
     */
    visibilityOverlay: PIXI.Sprite | undefined;

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
    visionModeData: {
      source: foundry.canvas.sources.PointVisionSource.Any | null | undefined;
      activeLightingOptions: VisionMode["_source"]["lighting"] | EmptyObject;
    };

    /**
     * Define whether each lighting layer is enabled, required, or disabled by this vision mode.
     * The value for each lighting channel is a number in LIGHTING_VISIBILITY
     * ```js
     * {
     *   background: VisionMode.LIGHTING_VISIBILITY.ENABLED,
     *    illumination: VisionMode.LIGHTING_VISIBILITY.ENABLED,
     *    coloration: VisionMode.LIGHTING_VISIBILITY.ENABLED,
     *    darkness: VisionMode.LIGHTING_VISIBILITY.ENABLED,
     *    any: true
     * }
     * ```
     */
    lightingVisibility: {
      illumination: CanvasVisibility.LightingVisibility;
      background: CanvasVisibility.LightingVisibility;
      coloration: CanvasVisibility.LightingVisibility;
      darkness: CanvasVisibility.LightingVisibility;
      any: boolean;
    };

    /**
     * A status flag for whether the layer initialization workflow has succeeded.
     */
    get initialized(): boolean;

    /**
     * Indicates whether containment filtering is required when rendering vision into a texture
     */
    protected get needsContainment(): boolean;

    /**
     * Does the currently viewed Scene support Token field of vision?
     */
    get tokenVision(): Scene.Implementation["tokenVision"];

    /**
     * The configured options used for the saved fog-of-war texture.
     */
    get textureConfiguration(): VisibilityTextureConfiguration | undefined;

    /**
     * Optional overrides for exploration sprite dimensions.
     *
     * @privateRemarks Foundry types this parameter as `FogTextureConfiguration`, and
     * unlike the other place they used this type seeming in error, only `rect`'s
     * `x, y, width, height` properties are accessed, so I'm assuming they meant Rectangle
     */
    set explorationRect(rect: Canvas.Rectangle);

    /**
     * Initialize all Token vision sources which are present on this layer
     */
    initializeSources(): void;

    /**
     * Initialize the vision mode.
     */
    initializeVisionMode(): void;

    protected override _draw(options: HandleEmptyObject<CanvasVisibility.DrawOptions>): Promise<void>;

    protected override _tearDown(options: HandleEmptyObject<CanvasVisibility.TearDownOptions>): Promise<void>;

    /**
     * Update the display of the sight layer.
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
     * @param point   - The point in space to test, an object with coordinates x and y.
     * @param options - Additional options which modify visibility testing.
     * @returns Whether the point is currently visible.
     */
    testVisibility(
      point: Canvas.Point,
      /**
       * @remarks Can't be NullishProps because `tolerance` gets passed directly to `_createVisibilityTestConfig`,
       * where a default is provided only for `undefined` with `{ tolerance=2 }`, which must be numeric
       * */
      options?: InexactPartial<{
        /**
         * A numeric radial offset which allows for a non-exact match.
         * For example, if tolerance is 2 then the test will pass if the point
         * is within 2px of a vision polygon.
         */
        tolerance: number;

        /**
         * An optional reference to the object whose visibility is being tested
         */
        object: PlaceableObject | null;
      }>,
    ): boolean;

    /**
     * Create the visibility test config.
     * @param point   - The point in space to test, an object with coordinates x and y.
     * @param options - Additional options which modify visibility testing.
     */
    _createVisibilityTestConfig(
      point: Canvas.Point,
      /** @remarks Can't be NullishProps because a default for `tolerance` is provided only for `undefined` with `{ tolerance=2 }`, which must be numeric */
      options?: InexactPartial<{
        /**
         * A numeric radial offset which allows for a non-exact match.
         * For example, if tolerance is 2 then the test will pass if the point
         * is within 2px of a vision polygon
         * @defaultValue `2`
         */
        tolerance: number;

        /**
         * An optional reference to the object whose visibility is being tested
         */
        object: PlaceableObject | null;
      }>,
    ): CanvasVisibilityTestConfig;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks `"fogOverlay is deprecated in favor of visibilityOverlay"`
     */
    get fogOverlay(): this["visibilityOverlay"];
  }

  namespace CanvasVisibility {
    interface Any extends AnyCanvasVisibility {}
    type AnyConstructor = typeof AnyCanvasVisibility;

    type LightingVisibility = ValueOf<typeof VisionMode.LIGHTING_VISIBILITY>;

    interface DrawOptions extends CanvasLayer.DrawOptions {}

    interface TearDownOptions extends CanvasLayer.TearDownOptions {}
  }

  /**
   * @privateRemarks This is name foundry has for the return tyoe of `CanvasVisibility#configureVisibilityTexture`
   * The FogTextureConfiguration references seem to be in error
   */
  interface VisibilityTextureConfiguration {
    resolution: number;
    width: number;
    height: number;
    mipmap: PIXI.MIPMAP_MODES;
    multisample: PIXI.MSAA_QUALITY;
    scaleMode: PIXI.SCALE_MODES;
    alphaMode: PIXI.ALPHA_MODES;
    format: PIXI.FORMATS;
  }

  interface CanvasVisibilityTest {
    point: PIXI.Point;
    elevation: number;
    los: Map<foundry.canvas.sources.PointVisionSource.Any, boolean>;
  }

  interface CanvasVisibilityTestConfig {
    /** The target object */
    object: PlaceableObject | null;

    /** An array of visibility tests */
    tests: CanvasVisibilityTest[];
  }
}

declare abstract class AnyCanvasVisibility extends CanvasVisibility {
  constructor(arg0: never, ...args: never[]);
}
