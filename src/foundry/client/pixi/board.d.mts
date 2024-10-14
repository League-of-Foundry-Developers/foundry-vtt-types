import type { InexactPartial, StoredDocument } from "../../../types/utils.d.mts";
import type { CANVAS_PERFORMANCE_MODES } from "../../common/constants.d.mts";

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
  class Canvas {
    constructor();

    /**
     * A perception manager interface for batching lighting, sight, and sound updates
     */
    perception: PerceptionManager;

    /**
     * A flag to indicate whether a new Scene is currently being drawn.
     * @defaultValue `false`
     */
    loading: boolean;

    /**
     * A promise that resolves when the canvas is first initialized and ready.
     */
    initializing: Promise<void> | null;

    /**
     * Track the last automatic pan time to throttle
     * @defaultValue `0`
     */
    protected _panTime: number;

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
     * The current pixel dimensions of the displayed Scene, or null if the Canvas is blank.
     */
    readonly dimensions: SceneDimensions | null;

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
    sceneTextures: { background?: PIXI.Texture; foreground?: PIXI.Texture; fogOverlay?: PIXI.Texture };

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
     * The singleton Fog of War manager instance.
     * @internal
     */
    protected _fog: FogManager;

    /**
     * The singleton color manager instance.
     */
    #colorManager: CanvasColorManager;

    /**
     * The DragDrop instance which handles interactivity resulting from DragTransfer events.
     * @defaultValue `undefined`
     */
    #dragDrop: DragDrop | undefined;

    /**
     * An object of data which caches data which should be persisted across re-draws of the game canvas.
     */
    #reload: {
      scene: string;
      layer: string;
      controlledTokens: string[];
      targetedTokens: string[];
    };

    /**
     * Track the timestamp when the last mouse move event was captured
     * @defaultValue `0`
     */
    #mouseMoveTime: number;

    /**
     * The debounce timer in milliseconds for tracking mouse movements on the Canvas.
     * @defaultValue `100`
     */
    #mouseMoveDebounceMS: number;

    /**
     * A debounced function which tracks movements of the mouse on the game canvas.
     * @defaultValue `foundry.utils.debounce(this._onMouseMove.bind(this), this.#mouseMoveDebounceMS)`
     */
    #debounceMouseMove: (event: PIXI.FederatedEvent) => void;

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
     * The primary Canvas group which generally contains tangible physical objects which exist within the Scene.
     * This group is a {@link CachedContainer} which is rendered to the Scene as a {@link SpriteMesh}.
     * This allows the rendered result of the Primary Canvas Group to be affected by a {@link BaseSamplerShader}.
     * @defaultValue `undefined`
     */
    readonly primary: PrimaryCanvasGroup | undefined;

    /**
     * The effects Canvas group which modifies the result of the {@link PrimaryCanvasGroup} by adding special effects.
     * This includes lighting, weather, vision, and other visual effects which modify the appearance of the Scene.
     * @defaultValue `undefined`
     */
    readonly effects: EffectsCanvasGroup | undefined;

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
     * A flag for whether the game Canvas is fully initialized and ready for additional content to be drawn.
     */
    get initialized(): boolean;

    /** @defaultValue `false` */
    #initialized: boolean;

    /**
     * A reference to the currently displayed Scene document, or null if the Canvas is currently blank.
     */
    get scene(): StoredDocument<Scene.ConfiguredInstance> | null;

    /** @defaultValue `null` */
    #scene: StoredDocument<Scene.ConfiguredInstance> | null;

    /**
     * A flag for whether the game Canvas is ready to be used. False if the canvas is not yet drawn, true otherwise.
     */
    get ready(): boolean;

    /** @defaultValue `false` */
    #ready: boolean;

    /**
     * The fog of war bound to this canvas
     */
    get fog(): FogManager;

    /**
     * The color manager class bound to this canvas
     */
    get colorManager(): CanvasColorManager;

    /**
     * The colors bound to this scene and handled by the color manager.
     */
    get colors(): CanvasColorManager["colors"];

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
     * A special workflow to perform when rendering a blank Canvas with no active Scene.
     */
    #drawBlank(): this;

    /**
     * Get the value of a GL parameter
     * @param parameter - The GL parameter to retrieve
     * @returns The returned value type depends of the parameter to retrieve
     */
    getGLParameter(parameter: string): unknown;

    /**
     * Once the canvas is drawn, initialize control, visibility, and audio states
     */
    #initialize(): Promise<void>;

    /**
     * Initialize the starting view of the canvas stage
     * If we are re-drawing a scene which was previously rendered, restore the prior view position
     * Otherwise set the view to the top-left corner of the scene at standard scale
     */
    initializeCanvasPosition(): void;

    /**
     * Initialize a CanvasLayer in the activation state
     */
    #initializeCanvasLayer(): void;

    /**
     * Initialize a token or set of tokens which should be controlled.
     * Restore controlled and targeted tokens from before the re-draw.
     */
    #initializeTokenControl(): void;

    // Layers are added to the global `canvas` object via `BaseCanvasMixin##createLayers()`

    readonly weather?: WeatherEffects;

    readonly grid?: GridLayer;

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
    pan({ x, y, scale }?: CanvasViewPosition): void;

    /**
     * Animate panning the canvas to a certain destination coordinate and zoom scale
     * Customize the animation speed with additional options
     * Returns a Promise which is resolved once the animation has completed
     *
     * @param view - The desired view parameters
     *               (default: `{}`)
     * @returns A Promise which resolves once the animation has been completed
     */
    animatePan({
      x,
      y,
      scale,
      duration,
      speed,
    }?: CanvasViewPosition & {
      /**
       * The total duration of the animation in milliseconds; used if speed is not set
       * @defaultValue `250`
       */
      duration?: number;

      /** The speed of animation in pixels per second; overrides duration if set */
      speed?: number;
    }): ReturnType<typeof CanvasAnimation.animate>;

    /**
     * Recenter the canvas with a pan animation that ends in the center of the canvas rectangle.
     * @param initial - A desired initial position from which to begin the animation
     * @returns A Promise which resolves once the animation has been completed
     */
    recenter(initial?: CanvasViewPosition): ReturnType<this["animatePan"]>;

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
    ping(origin: Point, options?: PingOptions): Promise<boolean>;

    /**
     * Get the constrained zoom scale parameter which is allowed by the maxZoom parameter
     * @param position - The unconstrained position
     * @returns The constrained position
     */
    #constrainView({ x, y, scale }: CanvasViewPosition): CanvasViewPosition;

    /**
     * Create a BlurFilter instance and register it to the array for updates when the zoom level changes.
     * @param blurStrength - The desired blur strength to use for this filter
     *                       (default: `CONFIG.Canvas.blurStrength`)
     */
    createBlurFilter(blurStrength?: number): PIXI.BlurFilter;

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
     * Convert canvas co-ordinates to the client's viewport.
     * @param origin - The canvas coordinates.
     * @returns The corresponding co-ordinates relative to the client's viewport.
     */
    clientCoordinatesFromCanvas(origin: Point): Point;

    /**
     * Convert client viewport co-ordinates to canvas co-ordinates.
     * @param origin - The client coordinates.
     * @returns The corresponding canvas co-ordinates.
     */
    canvasCoordinatesFromClient(origin: Point): Point;

    /**
     * Determine whether given canvas co-ordinates are off-screen.
     * @param position - The canvas co-ordinates.
     * @returns Is the coordinate outside the screen bounds?
     */
    isOffscreen(position: Point): boolean;

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
        clearColor: number[];

        /**
         * The render texture configuration.
         */
        textureConfiguration: Parameters<(typeof PIXI.RenderTexture)["create"]>[0];
      }>,
    ): PIXI.RenderTexture;

    /**
     * Attach event listeners to the game canvas to handle click and interaction events
     */
    #addListeners(): void;

    /**
     * Handle mouse movement on the game canvas.
     * This handler fires on both a throttle and a debounce, ensuring that the final update is always recorded.
     */
    protected _onMouseMove(event: PIXI.FederatedEvent): void;

    /**
     * Handle left mouse-click events occurring on the Canvas.
     */
    protected _onClickLeft(event: PIXI.FederatedEvent): void;

    /**
     * Handle double left-click events occurring on the Canvas stage.
     */
    protected _onClickLeft2(event: PIXI.FederatedEvent): void;

    /**
     * Handle long press events occurring on the Canvas.
     * @param event  - The triggering canvas interaction event.
     * @param origin - The local canvas coordinates of the mousepress.
     */
    protected _onLongPress(event: PIXI.FederatedEvent, origin: PIXI.Point): void;

    /**
     * Handle the beginning of a left-mouse drag workflow on the Canvas stage or its active Layer.
     * @internal
     */
    protected _onDragLeftStart(event: PIXI.FederatedEvent): void;

    /**
     * Handle mouse movement events occurring on the Canvas.
     * @internal
     */
    protected _onDragLeftMove(event: PIXI.FederatedEvent): void;

    /**
     * Handle the conclusion of a left-mouse drag workflow when the mouse button is released.
     * @internal
     */
    protected _onDragLeftDrop(
      event: PIXI.FederatedEvent,
    ): ReturnType<PlaceablesLayer.Any["selectObjects"]> | ReturnType<TokenLayer["targetObjects"]> | void;

    /**
     * Handle the cancellation of a left-mouse drag workflow
     * @internal
     */
    protected _onDragLeftCancel(event: PointerEvent): PIXI.Graphics | void;

    /**
     * Handle right mouse-click events occurring on the Canvas stage or it's active layer
     */
    protected _onClickRight(event: PIXI.FederatedEvent): void;

    /**
     * Handle double right-click events occurring on the Canvas.
     * @internal
     */
    protected _onClickRight2(event: PIXI.FederatedEvent): void;

    /**
     * Handle right-mouse drag events occurring on the Canvas.
     */
    protected _onDragRightMove(event: PIXI.FederatedEvent): void;

    /**
     * Handle the conclusion of a right-mouse drag workflow the Canvas stage.
     */
    protected _onDragRightDrop(event: PIXI.FederatedEvent): void;

    /**
     * Determine selection coordinate rectangle during a mouse-drag workflow
     */
    protected _onDragSelect(event: PIXI.FederatedEvent): void;

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
      OBJECTS: Set<InstanceType<ReturnType<typeof RenderFlagsMixin>>>;
      PERCEPTION: Set<InstanceType<ReturnType<typeof RenderFlagsMixin>>>;
    };

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks "canvas.blurDistance is deprecated in favor of canvas.blur.strength"
     */
    get blurDistance(): number;

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks "Setting canvas.blurDistance is replaced by setting canvas.blur.strength"
     */
    set blurDistance(value: number);

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks "Canvas#activateLayer is deprecated in favor of CanvasLayer#activate"
     */
    activateLayer(
      layerName:
        | "grid"
        | "sight"
        | "effects"
        | "controls"
        | "lighting"
        | "sounds"
        | "drawings"
        | "notes"
        | "templates"
        | "background"
        | "foreground"
        | "tokens"
        | "walls",
    ): void;

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks "Canvas.getDimensions is deprecated in favor of Scene#getDimensions"
     */
    static getDimensions(data: {
      width?: number;
      height?: number;
      grid: number;
      gridDistance: number;
      padding: number;
      shiftX: number;
      shiftY: number;
    }): ReturnType<Scene["getDimensions"]>;

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks "Canvas#setBackgroundColor is deprecated in favor of Canvas#colorManager#initialize"
     */
    setBackgroundColor(color: string): void;

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
  }

  // Most canvas group properties have explicit type definitions, but some are left off
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Canvas extends CanvasGroups {}

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

  interface CanvasViewPosition {
    /**
     * The x-coordinate which becomes stage.pivot.x
     */
    x?: number | null;

    /**
     * The y-coordinate which becomes stage.pivot.y
     */
    y?: number | null;

    /**
     * The zoom level up to CONFIG.Canvas.maxZoom which becomes stage.scale.x and y
     */
    scale?: number | null;
  }

  namespace Canvas {
    interface DropPosition {
      x: number;
      y: number;
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

// TODO: Find a way to make this more dynamic
interface CanvasGroups {
  // readonly [GroupName in keyof CONFIG.Canvas.Groups]?: CONFIG.Canvas.Groups[GroupName]["groupClass"];

  readonly hidden?: HiddenCanvasGroup;

  readonly rendered?: RenderedCanvasGroup;

  readonly environment?: EnvironmentCanvasGroup;
}
