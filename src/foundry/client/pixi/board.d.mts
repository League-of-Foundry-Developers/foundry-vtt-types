import type { InexactPartial, NullishProps, FixedInstanceType } from "../../../utils/index.d.mts";
import type Document from "../../common/abstract/document.d.mts";
import type { CANVAS_PERFORMANCE_MODES } from "../../common/constants.d.mts";

type InternalCanvas = new (
  arg0: never,
  ...args: never[]
) => {
  readonly [K in keyof CONFIG.Canvas.Groups]?: FixedInstanceType<CONFIG.Canvas.Groups[K]["groupClass"]> | undefined;
};

declare const _InternalCanvas: InternalCanvas;

declare global {
  /**
   * The virtual tabletop environment is implemented using a WebGL powered HTML 5 canvas using the powerful PIXI.js
   * library. The canvas is comprised by an ordered sequence of layers which define rendering groups and collections of
   * objects that are drawn on the canvas itself.
   *
   * ### Hook Events
   * {@link hookEvents.canvasConfig}
   * {@link hookEvents.canvasInit}
   * {@link hookEvents.canvasReady}
   * {@link hookEvents.canvasPan}
   * {@link hookEvents.canvasTearDown}
   *
   * @example Canvas State
   * ```typescript
   * canvas.ready; // Is the canvas ready for use?
   * canvas.scene; // The currently viewed Scene document.
   * canvas.dimensions; // The dimensions of the current Scene.
   * ```
   *
   * @example Canvas Methods
   * ```typescript
   * canvas.draw(); // Completely re-draw the game canvas (this is usually unnecessary).
   * canvas.pan(x, y, zoom); // Pan the canvas to new coordinates and scale.
   * canvas.recenter(); // Re-center the canvas on the currently controlled Token.
   * ```
   */
  class Canvas extends _InternalCanvas {
    constructor();

    /**
     * A set of blur filter instances which are modified by the zoom level and the "soft shadows" setting
     * @defaultValue `[]`
     */
    blurFilters: Set<PIXI.BlurFilter>;

    /**
     * A reference to the MouseInteractionManager that is currently controlling pointer-based interaction, or null.
     */
    currentMouseManager: MouseInteractionManager<PIXI.Container> | null;

    /**
     * Configure options passed to the texture loaded for the Scene.
     * This object can be configured during the canvasInit hook before textures have been loaded.
     */
    loadTexturesOptions: { expireCache: boolean; additionalSources: string[] };

    /**
     * Configure options used by the visibility framework for special effects
     * This object can be configured during the canvasInit hook before visibility is initialized.
     */
    visibilityOptions: { persistentVision: boolean };

    /**
     * Configure options passed to initialize blur for the Scene and override normal behavior.
     * This object can be configured during the canvasInit hook before blur is initialized.
     */
    blurOptions:
      | {
          enabled: boolean;
          blurClass: typeof PIXI.BlurFilter;
          strength: number;
          passes: number;
          kernels: number;
        }
      | undefined;

    /**
     * Configure the Textures to apply to the Scene.
     * Textures registered here will be automatically loaded as part of the TextureLoader.loadSceneTextures workflow.
     * Textures which need to be loaded should be configured during the "canvasInit" hook.
     */
    sceneTextures: { background?: string; foreground?: string; fogOverlay?: string };

    /**
     * Record framerate performance data
     */
    fps: {
      /** @defaultValue `0` */
      average: number;

      /** @defaultValue `[]` */
      values: number[];

      /** @defaultValue `0` */
      render: number;

      /** @defaultValue `document.getElementById("fps")` */
      element: HTMLElement;
    };

    /**
     * The singleton interaction manager instance which handles mouse interaction on the Canvas.
     */
    mouseInteractionManager: MouseInteractionManager<PIXI.Container> | undefined;

    /**
     * Configured performance settings which affect the behavior of the Canvas and its renderer.
     * @defaultValue `undefined`
     */
    performance: CanvasPerformanceSettings | undefined;

    /**
     * A list of supported webGL capabilities and limitations.
     */
    supported: CanvasSupportedComponents;

    /**
     * Is the photosensitive mode enabled?
     * @remarks Cached from core settings
     */
    readonly photosensitiveMode: boolean;

    /**
     * The renderer screen dimensions.
     * @defaultValue `[0, 0]`
     */
    screenDimensions: [x: number, y: number];

    /**
     * A flag to indicate whether a new Scene is currently being drawn.
     * @defaultValue `false`
     */
    loading: boolean;

    /**
     * A promise that resolves when the canvas is first initialized and ready.
     * @defaultValue `null`
     */
    initializing: Promise<void> | null;

    /**
     * The singleton PIXI.Application instance rendered on the Canvas.
     * @defaultValue `undefined`
     */
    readonly app: PIXI.Application | undefined;

    /**
     * The primary stage container of the PIXI.Application.
     * @defaultValue `undefined`
     */
    readonly stage: PIXI.Container | undefined;

    /**
     * The rendered canvas group which render the environment canvas group and the interface canvas group.
     */
    rendered: RenderedCanvasGroup;

    /**
     * A singleton CanvasEdges instance.
     */
    edges: foundry.canvas.edges.CanvasEdges;

    /**
     * The singleton FogManager instance.
     */
    fog: FixedInstanceType<typeof CONFIG.Canvas.fogManager>;

    /**
     * A perception manager interface for batching lighting, sight, and sound updates
     */
    perception: PerceptionManager;

    /**
     * The environment canvas group which render the primary canvas group and the effects canvas group.
     */
    environment: EnvironmentCanvasGroup;

    /**
     * The primary Canvas group which generally contains tangible physical objects which exist within the Scene.
     * This group is a {@link CachedContainer} which is rendered to the Scene as a {@link SpriteMesh}.
     * This allows the rendered result of the Primary Canvas Group to be affected by a {@link BaseSamplerShader}.
     * @defaultValue `undefined`
     */
    readonly primary: PrimaryCanvasGroup | undefined;

    /**
     * The effects Canvas group which modifies the result of the {@link PrimaryCanvasGroup} by adding special effects.
     * This includes lighting, vision, fog of war and related animations..
     * @defaultValue `undefined`
     */
    readonly effects: EffectsCanvasGroup | undefined;

    /**
     * The visibility Canvas group which handles the fog of war overlay by consolidating multiple render textures,
     * and applying a filter with special effects and blur.
     */
    visibility: CanvasVisibility;

    /**
     * The interface Canvas group which is rendered above other groups and contains all interactive elements.
     * The various {@link InteractionLayer} instances of the interface group provide different control sets for
     * interacting with different types of {@link Document}s which can be represented on the Canvas.
     * @defaultValue `undefined`
     */
    readonly interface: InterfaceCanvasGroup | undefined;

    /**
     * The overlay Canvas group which is rendered above other groups and contains elements not bound to stage transform.
     */
    readonly overlay: OverlayCanvasGroup;

    /**
     * The singleton HeadsUpDisplay container which overlays HTML rendering on top of this Canvas.
     * @defaultValue `undefined`
     */
    readonly hud: HeadsUpDisplay | undefined;

    /**
     * Position of the mouse on stage.
     */
    mousePosition: PIXI.Point;

    /**
     * Track the last automatic pan time to throttle
     * @defaultValue `0`
     */
    protected _panTime: number;

    /**
     * Force snapping to grid vertices?
     * @defaultValue `false`
     */
    forceSnapVertices: boolean;

    /**
     * A flag for whether the game Canvas is fully initialized and ready for additional content to be drawn.
     */
    get initialized(): boolean;

    /**
     * A reference to the currently displayed Scene document, or null if the Canvas is currently blank.
     */
    get scene(): Document.Stored<Scene.ConfiguredInstance> | null;

    /**
     * A SceneManager instance which adds behaviors to this Scene, or null if there is no manager.
     * @defaultValue `null`
     */
    get manager(): foundry.canvas.SceneManager | null;

    /**
     * The current pixel dimensions of the displayed Scene, or null if the Canvas is blank.
     */
    get dimensions(): Canvas.Dimensions | null;

    /**
     * A reference to the grid of the currently displayed Scene document, or null if the Canvas is currently blank.
     */
    get grid(): foundry.grid.BaseGrid | null;

    /**
     * A flag for whether the game Canvas is ready to be used. False if the canvas is not yet drawn, true otherwise.
     */
    get ready(): boolean;

    /**
     * The colors bound to this scene and handled by the color manager.
     */
    get colors(): this["environment"]["colors"];

    /**
     * Shortcut to get the masks container from HiddenCanvasGroup.
     */
    get masks(): PIXI.Container;

    /**
     * The id of the currently displayed Scene.
     */
    get id(): string | null;

    /**
     * A mapping of named CanvasLayer classes which defines the layers which comprise the Scene.
     */
    static get layers(): typeof CONFIG.Canvas.layers;

    /**
     * An Array of all CanvasLayer instances which are active on the Canvas board
     */
    get layers(): CanvasLayer[];

    /**
     * Return a reference to the active Canvas Layer
     */
    get activeLayer(): CanvasLayer | null;

    /**
     * The currently displayed darkness level, which may override the saved Scene value.
     */
    get darknessLevel(): number;

    /**
     * Initialize the Canvas by creating the HTML element and PIXI application.
     * This step should only ever be performed once per client session.
     * Subsequent requests to reset the canvas should go through Canvas#draw
     */
    initialize(): void;

    /**
     * Configure the usage of WebGL for the PIXI.Application that will be created.
     * @throws an Error if WebGL is not supported by this browser environment.
     */
    static #configureWebGL(): void;

    /**
     * Create the Canvas element which will be the render target for the PIXI.Application instance.
     * Replace the template element which serves as a placeholder in the initially served HTML response.
     */
    static #createHTMLCanvas(): HTMLCanvasElement;

    /**
     * Configure the settings used to initialize the PIXI.Application instance.
     * @returns Options passed to the PIXI.Application constructor.
     */
    static #configureCanvasSettings(): ConstructorParameters<typeof PIXI.Application>[0];

    /**
     * Initialize custom pixi plugins.
     */
    #initializePlugins(): void;

    /**
     * Create the PIXI.Application and update references to the created app and stage.
     * @param canvas - The target canvas view element
     * @param config - Desired PIXI.Application configuration options
     */
    #createApplication(canvas: HTMLCanvasElement, config: ConstructorParameters<typeof PIXI.Application>[0]): void;

    readonly snapshot?: FramebufferSnapshot;

    /**
     * Remap premultiplied blend modes/non premultiplied blend modes to fix PIXI bug with custom BM.
     */
    #mapPremultipliedBlendModes(): void;

    /**
     * Initialize the group containers of the game Canvas.
     */
    #createGroups(parentName: string, parent: PIXI.DisplayObject): void;

    // Group properties are determined by the CanvasGroups type

    /**
     * TODO: Add a quality parameter
     * Compute the blur parameters according to grid size and performance mode.
     * @param options - Blur options.
     * @remarks The TODO is foundry internal
     */
    protected _initializeBlur(
      options?: InexactPartial<{
        enabled: boolean;

        /**
         * @defaultValue `AlphaBlurFilter`
         */
        blurClass: typeof PIXI.Filter;

        /**
         * @defaultValue `AlphaBlurFilterPass`
         */
        blurPassClass: typeof PIXI.Filter;

        /**
         * @defaultValue `this.grid.size / 25`
         */
        strength: number;

        passes: number;

        kernels: number;
      }>,
    ): void;

    /**
     * Configure performance settings for hte canvas application based on the selected performance mode.
     * @internal
     */
    protected _configurePerformanceMode(): CanvasPerformanceSettings;

    /**
     * Draw the game canvas.
     * @param scene - A specific Scene document to render on the Canvas
     * @returns A Promise which resolves once the Canvas is fully drawn
     */
    draw(scene?: Scene.ConfiguredInstance): Promise<this>;

    /**
     * When re-drawing the canvas, first tear down or discontinue some existing processes
     */
    tearDown(): Promise<void>;

    /**
     * Create a SceneManager instance used for this Scene, if any.
     */
    static getSceneManager(scene: Scene.ConfiguredInstance): foundry.canvas.SceneManager | null;

    /**
     * Get the value of a GL parameter
     * @param parameter - The GL parameter to retrieve
     * @returns The returned value type depends of the parameter to retrieve
     */
    getGLParameter(parameter: string): unknown;

    /**
     * Initialize the starting view of the canvas stage
     * If we are re-drawing a scene which was previously rendered, restore the prior view position
     * Otherwise set the view to the top-left corner of the scene at standard scale
     */
    initializeCanvasPosition(): void;

    // Layers are added to the global `canvas` object via `CanvasGroupMixin#_createLayers()`
    // TODO: Revisit after updating CONFIG in #2911

    readonly weather?: WeatherEffects;

    // GridLayer is not assigned due to conflicting `Canvas#grid` property pointing to the BaseGrid subclass

    readonly drawings?: DrawingsLayer;

    readonly templates?: TemplateLayer;

    readonly tiles?: TilesLayer;

    readonly walls?: WallsLayer;

    readonly tokens?: TokenLayer;

    readonly sounds?: SoundsLayer;

    readonly lighting?: LightingLayer;

    readonly notes?: NotesLayer;

    readonly controls?: ControlsLayer;

    /**
     * Given an embedded object name, get the canvas layer for that object
     */
    getLayerByEmbeddedName<T extends string>(
      embeddedName: T,
    ): T extends keyof EmbeddedEntityNameToLayerMap ? Exclude<EmbeddedEntityNameToLayerMap[T], undefined> | null : null;

    /**
     * Get the InteractionLayer of the canvas which manages Documents of a certain collection within the Scene.
     * @param collectionName - The collection name
     * @returns The canvas layer
     */
    getCollectionLayer<T extends string>(
      collectionName: T,
    ): T extends keyof CollectionNameToLayerMap ? Exclude<CollectionNameToLayerMap[T], undefined> : undefined;

    /**
     * Activate framerate tracking by adding an HTML element to the display and refreshing it every frame.
     */
    activateFPSMeter(): void;

    /**
     * Deactivate framerate tracking by canceling ticker updates and removing the HTML element.
     */
    deactivateFPSMeter(): void;

    /**
     * Measure average framerate per second over the past 30 frames
     */
    #measureFPS(): void;

    /**
     * Pan the canvas to a certain \{x,y\} coordinate and a certain zoom level
     */
    pan({ x, y, scale }?: Canvas.ViewPosition): void;

    /**
     * Animate panning the canvas to a certain destination coordinate and zoom scale
     * Customize the animation speed with additional options
     * Returns a Promise which is resolved once the animation has completed
     *
     * @param view - The desired view parameters
     *               (default: `{}`)
     * @returns A Promise which resolves once the animation has been completed
     */
    animatePan(
      view: Canvas.ViewPosition & {
        /**
         * The total duration of the animation in milliseconds; used if speed is not set
         * @defaultValue `250`
         */
        duration?: number;

        /** The speed of animation in pixels per second; overrides duration if set */
        speed?: number;

        /** An easing function passed to CanvasAnimation animate */
        easing?: CanvasAnimation.EasingFunction;
      },
    ): ReturnType<typeof CanvasAnimation.animate>;

    /**
     * Recenter the canvas with a pan animation that ends in the center of the canvas rectangle.
     * @param initial - A desired initial position from which to begin the animation
     * @returns A Promise which resolves once the animation has been completed
     */
    recenter(initial?: Canvas.ViewPosition): ReturnType<this["animatePan"]>;

    /**
     * Highlight objects on any layers which are visible
     */
    highlightObjects(active: boolean): void;

    /**
     * Displays a Ping both locally and on other connected client, following these rules:
     * 1) Displays on the current canvas Scene
     * 2) If ALT is held, becomes an ALERT ping
     * 3) Else if the user is GM and SHIFT is held, becomes a PULL ping
     * 4) Else is a PULSE ping
     * @param origin  - Point to display Ping at
     * @param options - Additional options to configure how the ping is drawn.
     */
    ping(origin: Canvas.Point, options?: PingOptions): Promise<boolean>;

    /**
     * Create a BlurFilter instance and register it to the array for updates when the zoom level changes.
     * @param blurStrength - The desired blur strength to use for this filter
     *                       (default: `CONFIG.Canvas.blurStrength`)
     * @param blurQuality  - The desired quality to use for this filter
     *                       (default: `CONFIG.Canvas.blurQuality`)
     */
    createBlurFilter(blurStrength?: number, blurQuality?: number): PIXI.BlurFilter;

    /**
     * Add a filter to the blur filter list. The filter must have the blur property
     * @param filter - The Filter instance to add
     * @returns The added filter for method chaining
     */
    addBlurFilter(filter: PIXI.BlurFilter): PIXI.BlurFilter;

    /**
     * Update the blur strength depending on the scale of the canvas stage
     * @param strength - Optional blur strength to apply
     *                   (default: `this.blur.strength`)
     */
    protected updateBlur(strength?: number): void;

    /**
     * Convert canvas coordinates to the client's viewport.
     * @param origin - The canvas coordinates.
     * @returns The corresponding coordinates relative to the client's viewport.
     */
    clientCoordinatesFromCanvas(origin: Canvas.Point): Canvas.Point;

    /**
     * Convert client viewport coordinates to canvas coordinates.
     * @param origin - The client coordinates.
     * @returns The corresponding canvas co-ordinates.
     */
    canvasCoordinatesFromClient(origin: Canvas.Point): Canvas.Point;

    /**
     * Determine whether given canvas coordinates are off-screen.
     * @param position - The canvas coordinates.
     * @returns Is the coordinate outside the screen bounds?
     */
    isOffscreen(position: Canvas.Point): boolean;

    /**
     * Remove all children of the display object and call one cleaning method:
     * clean first, then tearDown, and destroy if no cleaning method is found.
     * @param displayObject - The display object to clean.
     * @param destroy       - If textures should be destroyed.
     *                        (default: `true`)
     */
    static clearContainer(displayObject: PIXI.DisplayObject, destroy?: boolean): void;

    /**
     * Get a texture with the required configuration and clear color.
     */
    static getRenderTexture(
      options?: InexactPartial<{
        /**
         * The clear color to use for this texture. Transparent by default.
         */
        clearColor: number[] | null;

        /**
         * The render texture configuration.
         * @privateRemarks forwarded to `PIXI.RenderTexture.create`
         */
        textureConfiguration: Parameters<(typeof PIXI.RenderTexture)["create"]>[0];
      }>,
    ): PIXI.RenderTexture;

    /**
     * Handle right-mouse start drag events occurring on the Canvas.
     */
    protected _onDragRightStart(event: PIXI.FederatedEvent): void;

    /**
     * Handle right-mouse drag events occurring on the Canvas.
     */
    protected _onDragRightMove(event: PIXI.FederatedEvent): void;

    /**
     * Handle the conclusion of a right-mouse drag workflow the Canvas stage.
     */
    protected _onDragRightDrop(event: PIXI.FederatedEvent): void;

    /**
     * Handle the cancellation of a right-mouse drag workflow the Canvas stage.
     */
    protected _onDragRightCancel(event: PIXI.FederatedEvent): void;

    /**
     * Pan the canvas view when the cursor position gets close to the edge of the frame
     * @param event - The originating mouse movement event
     */
    protected _onDragCanvasPan(event: MouseEvent): ReturnType<this["animatePan"]> | void;

    /**
     * Handle window resizing with the dimensions of the window viewport change
     * @param event - The Window resize event
     *                (default: `null`)
     */
    protected _onResize(event?: UIEvent | null): false | void;

    /**
     * Handle mousewheel events which adjust the scale of the canvas
     * @param event - The mousewheel event that zooms the canvas
     */
    protected _onMouseWheel(event: WheelEvent): void;

    /**
     * Event handler for the drop portion of a drag-and-drop event.
     * @internal
     */
    protected _onDrop(event: DragEvent): void;

    /**
     * Track objects which have pending render flags.
     */
    readonly pendingRenderFlags: {
      OBJECTS: Set<FixedInstanceType<ReturnType<typeof RenderFlagsMixin>>>;
      PERCEPTION: Set<FixedInstanceType<ReturnType<typeof RenderFlagsMixin>>>;
    };

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "Canvas#addPendingOperation is deprecated without replacement in v11.
     * The callback that you have passed as a pending operation has been executed immediately.
     * We recommend switching your code to use a debounce operation or RenderFlags to de-duplicate overlapping requests."
     */
    addPendingOperation<S, A>(name: string, fn: (this: S, args: A) => void, scope: S, args: A): void;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "Canvas#triggerPendingOperations is deprecated without replacement in v11 and performs no action."
     */
    triggerPendingOperations(): void;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks `"Canvas#pendingOperations is deprecated without replacement in v11."`
     */
    get pendingOperations(): [];

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks `"Canvas#colorManager is deprecated and replaced by Canvas#environment"`
     */
    get colorManager(): this["environment"];
  }

  interface CanvasPerformanceSettings {
    /** The performance mode in CONST.CANVAS_PERFORMANCE_MODES */
    mode: CANVAS_PERFORMANCE_MODES;

    /** Blur filter configuration */
    blur: {
      enabled: boolean;
      illumination: boolean;
    };

    /** Whether to use mipmaps, "ON" or "OFF" */
    mipmap: "ON" | "OFF";

    /** Whether to apply MSAA at the overall canvas level */
    msaa: boolean;

    /** Maximum framerate which should be the render target */
    fps: number;

    /** Whether to display token movement animation */
    tokenAnimation: boolean;

    /** Whether to display light source animation */
    lightAnimation: boolean;

    /** Whether to render soft edges for light sources */
    lightSoftEdges: boolean;

    /** Texture configuration */
    textures: {
      enabled: boolean;

      maxSize: number;

      p2Steps: number;

      /** @defaultValue `2` */
      p2StepsMax: number;
    };
  }

  interface CanvasSupportedComponents {
    /** Is WebGL2 supported? */
    webGL2: boolean;

    /** Is reading pixels in RED format supported? */
    readPixelsRED: boolean;

    /** Is the OffscreenCanvas supported? */
    offscreenCanvas: boolean;
  }

  namespace Canvas {
    interface Dimensions extends SceneDimensions {
      /** The canvas rectangle. */
      rect: PIXI.Rectangle;

      /** The scene rectangle. */
      sceneRect: PIXI.Rectangle;
    }

    /** @internal */
    type _ViewPosition = NullishProps<{
      /**
       * The x-coordinate which becomes stage.pivot.x
       */
      x: number;

      /**
       * The y-coordinate which becomes stage.pivot.y
       */
      y: number;

      /**
       * The zoom level up to CONFIG.Canvas.maxZoom which becomes stage.scale.x and y
       */
      scale: number;
    }>;

    interface ViewPosition extends _ViewPosition {}

    interface DropPosition {
      x: number;
      y: number;
    }

    /**
     * A single point, expressed as an object \{x, y\}
     * @remarks Copied from `resources/app/common/types.mjs`
     */
    type Point = PIXI.Point | { x: number; y: number };

    /**
     * A single point, expressed as an array \[x,y\]
     * @remarks Copied from `resources/app/common/types.mjs`
     */
    type PointArray = [x: number, y: number];

    /**
     * A standard rectangle interface.
     * @remarks Copied from `resources/app/common/types.mjs`
     */
    interface Rectangle {
      x: number;
      y: number;
      width: number;
      height: number;
    }
  }
}

interface EmbeddedEntityNameToLayerMap {
  AmbientLight: Canvas["lighting"];
  AmbientSound: Canvas["sounds"];
  Drawing: Canvas["drawings"];
  Note: Canvas["notes"];
  MeasuredTemplate: Canvas["templates"];
  Tile: Canvas["tiles"];
  Token: Canvas["tokens"];
  Wall: Canvas["walls"];
}

interface CollectionNameToLayerMap {
  lights: Canvas["lighting"];
  sounds: Canvas["sounds"];
  drawings: Canvas["drawings"];
  notes: Canvas["notes"];
  templates: Canvas["templates"];
  tiles: Canvas["tiles"];
  tokens: Canvas["tokens"];
  walls: Canvas["walls"];
}
