/**
 * The Sight Layer which implements dynamic vision, lighting, and fog of war
 * This layer uses an event-driven workflow to perform the minimal required calculation in response to changes.
 * @see PointSource
 *
 * The container structure of this layer is as follows:
 *
 * unexplored   The unexplored background which spans the entire canvas
 * explored     The exploration container which tracks exploration progress
 * revealed       A container of regions which have previously been revealed
 * saved          The saved fog exploration texture
 * pending        Pending exploration which has not yet been committed to the texture
 * vision         The container of current vision exploration
 * vision.base      Baseline provided vision
 * vision.fov       Current light source field-of-view polygons
 * vision.los       Current vision source line-of-sight polygons
 * vision.roofs     Roof textures which should temporarily be revealed
 *
 * @example <caption>The sightRefresh hook</caption>
 * ```typescript
 * Hooks.on("sightRefresh", layer => {});
 * ```
 */
import { ConfiguredDocumentClass } from "../../../../types/helperTypes";

declare global {
  class SightLayer extends CanvasLayer<SightLayer.LayerOptions> {
    /** The unexplored background which spans the entire canvas */
    unexplored?: PIXI.Graphics;

    /** The exploration container which tracks exploration progress */
    explored?: PIXI.Container;

    /** A container of regions which have previously been revealed */
    revealed?: PIXI.Container;

    /** The saved fog exploration texture */
    saved?: PIXI.Sprite;

    /** Pending exploration which has not yet been committed to the texture */
    pending?: PIXI.Container;

    constructor();

    /**
     * The FogExploration document which applies to this canvas view
     * @defaultValue `null`
     */
    exploration: InstanceType<ConfiguredDocumentClass<typeof FogExploration>> | null;

    /**
     * A Collection of vision sources which are currently active within the rendered Scene.
     */
    sources: foundry.utils.Collection<PointSource>;

    /**
     * A status flag for whether the layer initialization workflow has succeeded
     * @defaultValue `false`
     * @internal
     */
    protected _initialized: boolean;

    /**
     * A debounced function to save fog of war exploration once a stream of updates have stopped
     */
    debounceSaveFog: (...args: Parameters<this["saveFog"]>) => void;

    /**
     * The current vision container which provides line-of-sight for vision sources and field-of-view of light sources.
     * @defaultValue `undefined`
     */
    vision:
      | (PIXI.Container & {
          /** Baseline provided vision */
          base: PIXI.Graphics;

          /** Current light source field-of-view polygons */
          fov: PIXI.Container;

          /** Current vision source line-of-sight polygons */
          los: PIXI.Graphics;

          /** Roof textures which should temporarily be revealed */
          roofs: PIXI.Container;
        })
      | undefined;

    /**
     * The canonical line-of-sight polygon which defines current Token visibility.
     * @defaultValue `undefined`
     */
    los: PIXI.Graphics | undefined;

    /**
     * A cached container which creates a render texture used for the LOS mask.
     * @defaultValue `undefined`
     */
    losCache: CachedContainer | undefined;

    /**
     * Track whether we have pending fog updates which have not yet been saved to the database
     * @defaultValue `false`
     * @internal
     */
    protected _fogUpdated: boolean;

    /**
     * The configured resolution used for the saved fog-of-war texture
     * @defaultValue `undefined`
     * @internal
     */
    protected _fogResolution: { resolution: number; width: number; height: number } | undefined;

    /**
     * A pool of RenderTexture objects which can be cycled through to save fog exploration progress.
     * @defaultValue `[]`
     * @internal
     */
    protected _fogTextures: PIXI.RenderTexture[];

    /**
     * Track whether there is a source of vision within the buffer region outside the primary scene canvas
     * @defaultValue `false`
     * @internal
     */
    protected _inBuffer: boolean;

    /**
     * Define the threshold value for the number of distinct Wall endpoints.
     * Below this threshold, exact vision computation is used by casting a Ray at every endpoint.
     * Above this threshold, approximate vision computation is used by culling to only nearby endpoints.
     * @defaultValue `200`
     */
    static EXACT_VISION_THRESHOLD: number;

    /**
     * Define the number of positions that are explored before a set of fog updates are pushed to the server.
     * @defaultValue `10`
     */
    static FOG_COMMIT_THRESHOLD: number;

    /**
     * The maximum allowable fog of war texture size.
     * @defaultValue `4096`
     */
    static MAXIMUM_FOW_TEXTURE_SIZE: number;

    /**
     * @remarks This is not overridden in foundry but reflects the real behavior.
     */
    // @ts-expect-error FIXME: SightLayer does not exist anymore, should be removed.
    static get instance(): Canvas["sight"];

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.layerOptions, {
     *  name: "sight",
     *  zIndex: 400
     * })
     * ```
     */
    static override get layerOptions(): SightLayer.LayerOptions;

    /**
     * Does the currently viewed Scene support Token field of vision?
     */
    get tokenVision(): boolean;

    /**
     * Does the currently viewed Scene support fog of war exploration?
     */
    get fogExploration(): boolean;

    override tearDown(): Promise<this>;

    /**
     * Initialize fog of war - resetting it when switching scenes or re-drawing the canvas
     */
    initializeFog(): Promise<void>;

    /**
     * Initialize all Token sight sources which are present on this layer
     */
    initializeSources(): Promise<void>;

    /**
     * Update FoW unexplored and explored colors
     */
    updateFogExplorationColors(): void;

    override draw(): Promise<this>;

    /**
     * Create the cached container and sprite used to provide a LOS mask
     * @internal
     */
    protected _createCachedMask(): void;

    /**
     * Construct a vision container that is used to render a single view position.
     * @internal
     */
    protected _createVisionContainer(): PIXI.Container;

    /**
     * Update the display of the sight layer.
     * Organize sources into rendering queues and draw lighting containers for each source
     */
    refresh({
      forceUpdateFog,
      skipUpdateFog
    }?: {
      /**
       * Always update the Fog exploration progress for this update
       * (default: `false`)
       */
      forceUpdateFog?: boolean;

      /**
       * Never update the Fog exploration progress for this update
       * (default: `false`)
       */
      skipUpdateFog?: boolean;
    }): void | ReturnType<this["restrictVisibility"]>;

    /**
     * Restrict the visibility of certain canvas assets (like Tokens or DoorControls) based on the visibility polygon
     * These assets should only be displayed if they are visible given the current player's field of view
     */
    restrictVisibility(): void;

    /**
     * Test whether a point on the Canvas is visible based on the current vision and LOS polygons
     *
     * @param point - The point in space to test, an object with coordinates x and y.
     * @returns Whether the point is currently visible.
     */
    testVisibility(
      point: Point,
      {
        tolerance,
        object
      }?: {
        /**
         * A numeric radial offset which allows for a non-exact match. For example, if
         * tolerance is 2 then the test will pass if the point is within 2px of a vision
         * polygon.
         * (defaultValue: `2`)
         */
        tolerance?: number;

        /**
         * An optional reference to the object whose visibility is being tested
         * (defaultValue: `null`)
         */
        object?: PIXI.DisplayObject | null;
      }
    ): boolean;

    /** @internal */
    protected _getFogTexture(): PIXI.RenderTexture;

    /**
     * Once a new Fog of War location is explored, composite the explored container with the current staging sprite
     * Save that staging Sprite as the rendered fog exploration and swap it out for a fresh staging texture
     * Do all this asynchronously, so it doesn't block token movement animation since this takes some extra time
     */
    commitFog(): void;

    /**
     * Load existing fog of war data from local storage and populate the initial exploration sprite
     */
    loadFog(): Promise<PIXI.Texture | void>;

    /**
     * Dispatch a request to reset the fog of war exploration status for all users within this Scene.
     * Once the server has deleted existing FogExploration documents, the _onResetFog handler will re-draw the canvas.
     */
    resetFog(): Promise<void>;

    /**
     * Save Fog of War exploration data to a base64 string to the FogExploration document in the database.
     * Assumes that the fog exploration has already been rendered as fog.rendered.texture.
     */
    saveFog(): Promise<void>;

    /**
     * Update the fog layer when a player token reaches a board position which was not previously explored
     * @param source - The vision source for which the fog layer should update
     * @param force  - Force fog to be updated even if the location is already explored
     *                 (default: `false`)
     */
    updateFog(source: PointSource, force?: boolean): void;

    /**
     * Choose an adaptive fog rendering resolution which downscales the saved fog textures for larger dimension Scenes.
     * It is important that the width and height of the fog texture is evenly divisible by the downscaling resolution.
     * @internal
     */
    protected _configureFogResolution(): { resolution: number; width: number; height: number };

    /**
     * If fog of war data is reset from the server, re-draw the canvas
     */
    protected _handleResetFog(): Promise<void>;
  }

  namespace SightLayer {
    interface LayerOptions extends CanvasLayer.LayerOptions {
      name: "sight";
    }
  }
}
