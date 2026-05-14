import type { InexactPartial, FixedInstanceType, Brand, IntentionalPartial, InitializedOn } from "#utils";
import type { CanvasAnimation } from "#client/canvas/animation/_module.d.mts";
import type { MouseInteractionManager, RenderFlagsMixin, Ping } from "#client/canvas/interaction/_module.d.mts";
import type { FramebufferSnapshot, SceneManager } from "#client/canvas/_module.d.mts";
import type {
  CanvasVisibility,
  EffectsCanvasGroup,
  EnvironmentCanvasGroup,
  HiddenCanvasGroup,
  InterfaceCanvasGroup,
  OverlayCanvasGroup,
  PrimaryCanvasGroup,
  RenderedCanvasGroup,
} from "#client/canvas/groups/_module.d.mts";
import type { CanvasLayer, PlaceablesLayer } from "#client/canvas/layers/_module.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import type { FogManager, PerceptionManager } from "#client/canvas/perception/_module.d.mts";
import type { CanvasEdges } from "#client/canvas/geometry/edges/_module.d.mts";
import type { HeadsUpDisplayContainer } from "#client/applications/hud/_module.d.mts";
import type { BaseGrid } from "#common/grid/_module.d.mts";
import type { Document } from "#common/abstract/_module.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- only used for links
import type { AllHooks as hookEvents } from "#client/hooks.d.mts";
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- only used for links
import type Drawing from "#client/canvas/placeables/drawing.d.mts";
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- only used for links
import type Tile from "#client/canvas/placeables/tile.d.mts";
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- only used for links
import type Token from "#client/canvas/placeables/token.d.mts";
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- only used for links
import type BaseRuler from "#client/canvas/interaction/ruler/base-ruler.d.mts";
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- only used for links
import type ControlsLayer from "#client/canvas/layers/controls.d.mts";
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- only used for links
import type SoundsLayer from "#client/canvas/layers/sounds.d.mts";

/**
 * `grid` is excluded because {@linkcode Canvas.grid | Canvas#grid} is a getter for the instance of the current
 * {@linkcode BaseGrid}-descended class. The {@linkcode foundry.canvas.layers.GridLayer | GridLayer} is generally
 * accessed via `canvas.interface.grid`.
 * @internal
 */
type InternalCanvas = new (...args: never) => {
  // white lie: these properties don't exist prior to group creation, but once created they are never removed,
  // and are typed as `| undefined` prior to `ready`.
  readonly [K in keyof CONFIG.Canvas.Groups]: InitializedOn<
    FixedInstanceType<CONFIG.Canvas.Groups[K]["groupClass"]>,
    "ready"
  >;
} & {
  // white lie: these properties don't exist prior to group creation (each group creates its layers and adds properties for them
  // to the global `canvas`), but once created they are never removed, and are typed as `| undefined` prior to `ready`.
  readonly [K in Exclude<keyof CONFIG.Canvas.Layers, "grid">]: InitializedOn<
    FixedInstanceType<CONFIG.Canvas.Layers[K]["layerClass"]>,
    "ready"
  >;
};

declare const _InternalCanvas: InternalCanvas;

/**
 * The virtual tabletop environment is implemented using a WebGL powered HTML 5 canvas using the powerful PIXI.js
 * library. The canvas is comprised by an ordered sequence of layers which define rendering groups and collections of
 * objects that are drawn on the canvas itself.
 *
 * ### Hook Events
 * {@linkcode hookEvents.canvasConfig}
 * {@linkcode hookEvents.canvasInit}
 * {@linkcode hookEvents.canvasReady}
 * {@linkcode hookEvents.canvasPan}
 * {@linkcode hookEvents.canvasTearDown}
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
declare class Canvas extends _InternalCanvas {
  constructor();

  /**
   * Mouse move handler priorities.
   * @remarks The object is frozen, but the property is not readonly.
   */
  static MOUSE_MOVE_HANDLER_PRIORITIES: Readonly<Canvas.MouseMoveHandlerPriorities>;

  /**
   * A set of blur filter instances which are modified by the zoom level and the "soft shadows" setting
   * @defaultValue `[]`
   */
  blurFilters: Set<PIXI.Filter>;

  /**
   * A reference to the MouseInteractionManager that is currently controlling pointer-based interaction, or null.
   * @remarks Initialized to `null`, only set by `MouseInteractionManager##handleClickLeft` and `##handleClickRight`.
   */
  currentMouseManager: MouseInteractionManager.Any | null;

  /**
   * Configure options passed to the texture loaded for the Scene.
   * This object can be configured during the `canvasInit` hook before textures have been loaded.
   * @remarks Only `undefined` prior to first draw.
   */
  loadTexturesOptions: Canvas.LoadTexturesOptions | undefined;

  /**
   * Configure options used by the visibility framework for special effects
   * This object can be configured during the `canvasInit` hook before visibility is initialized.
   * @remarks Only `undefined` prior to first draw.
   */
  visibilityOptions: Canvas.VisibilityOptions | undefined;

  /**
   * Configure options passed to initialize blur for the Scene and override normal behavior.
   * This object can be configured during the `canvasInit` hook before blur is initialized.
   * @remarks Not initialized to a value, and only ever set `undefined` on tear-down by core, so it's only *ever* `undefined` barring user
   * action. Will be passed to `Canvas##initializeBlur` every draw.
   */
  blurOptions: Canvas.BlurOptions | undefined;

  /**
   * Configure the Textures to apply to the Scene.
   * Textures registered here will be automatically loaded as part of the TextureLoader.loadSceneTextures workflow.
   * Textures which need to be loaded should be configured during the `canvasInit` hook.
   * @defaultValue `{}`
   */
  sceneTextures: Canvas.SceneTextures;

  /**
   * Record framerate performance data
   */
  fps: Canvas.FPS;

  /**
   * The singleton interaction manager instance which handles mouse interaction on the Canvas.
   * @remarks The manager for {@linkcode Canvas.stage | this.stage}, set in `Canvas##addListeners`. Only `undefined` prior to first draw.
   */
  mouseInteractionManager: MouseInteractionManager<PIXI.Container> | undefined;

  /**
   * Configured performance settings which affect the behavior of the Canvas and its renderer.
   * @remarks Only `undefined` prior to canvas {@link Canvas.initialize | initialization},
   * which happens only once, between the `setup` and `ready` hooks.
   * Set by {@linkcode Canvas._configurePerformanceMode | Canvas#_configurePerformanceMode}.
   */
  performance: Canvas.PerformanceSettings | undefined;

  /**
   * A list of supported webGL capabilities and limitations.
   * @remarks Only `undefined` prior to canvas {@link Canvas.initialize | initialization},
   * which happens only once, between the `setup` and `ready` hooks.
   *
   * @privateRemarks This is defined but not initialized in the class body, then overwritten with a `defineProperty` with
   * `{ writable: false, enumerable: true }` in `Canvas##createApplication`, with the value set to the (frozen) return of
   * `Canvas##testSupport`.
   */
  readonly supported: Readonly<Canvas.SupportedComponents> | undefined;

  /**
   * Is the photosensitive mode enabled?
   * @remarks Only `undefined` prior to canvas {@link Canvas.initialize | initialization},
   * which happens only once, between the `setup` and `ready` hooks.
   *
   * @privateRemarks This is defined but not initialized in the class body, then overwritten with a `defineProperty` with
   * `{ writable: false }`, with the core `"photosensitiveMode"` setting's value.
   */
  readonly photosensitiveMode: boolean | undefined;

  /**
   * The renderer screen dimensions.
   * @defaultValue `[0, 0]`
   */
  screenDimensions: [width: number, height: number];

  /**
   * The framebuffer snapshot.
   * @remarks Only `undefined` prior to canvas {@link Canvas.initialize | initialization},
   * which happens only once, between the `setup` and `ready` hooks.
   *
   * @privateRemarks This is defined but not initialized in the class body, then overwritten with a `defineProperty` with no options in
   * `Canvas##createApplication`. Because it exists before the `defineProperty` call, it retains its writable status.
   */
  snapshot: FramebufferSnapshot | undefined;

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
   * The singleton {@linkcode PIXI.Application} instance rendered on the Canvas.
   * @remarks Only `undefined` prior to canvas {@link Canvas.initialize | initialization},
   * which happens only once, between the `setup` and `ready` hooks.
   *
   * @privateRemarks This is defined but not initialized in the class body, then overwritten with a `defineProperty` with
   * `{ writable: false }` in `Canvas##createApplication`.
   */
  readonly app: PIXI.Application<HTMLCanvasElement> | undefined;

  /**
   * The primary stage container of the {@linkcode PIXI.Application}.
   * @remarks Only `undefined` prior to canvas {@link Canvas.initialize | initialization},
   * which happens only once, between the `setup` and `ready` hooks.
   *
   * @privateRemarks This is defined but not initialized in the class body, then overwritten with a `defineProperty` with
   * `{ writable: false }` in `Canvas##createApplication`.
   */
  readonly stage: PIXI.Container | undefined;

  /**
   * The {@link RenderedCanvasGroup | rendered canvas group} which render the environment canvas group and the interface canvas group.
   * @see {@linkcode Canvas.environment | Canvas#environment}
   * @see {@linkcode Canvas.interface | Canvas#interface}
   * @remarks Only `undefined` prior to canvas {@link Canvas.initialize | initialization},
   * which happens only once, between the `setup` and `ready` hooks.
   *
   * @privateRemarks This is defined but not initialized in the class body, then overwritten with a `defineProperty` with
   * `{ writable: false }` in `Canvas##createGroups`.
   */
  readonly rendered: InitializedOn<RenderedCanvasGroup.Implementation, "ready">;

  /**
   * A singleton CanvasEdges instance.
   * @privateRemarks Defined in the class body but not initialized, then `defineProperty`'d in construction with no options.
   */
  edges: CanvasEdges;

  /**
   * The singleton FogManager instance.
   * @remarks Only `undefined` prior to first draw.
   */
  fog: FogManager.Implementation | undefined;

  /**
   * A perception manager interface for batching lighting, sight, and sound updates
   * @privateRemarks Defined in the class body but not initialized, then `defineProperty`'d in construction with no options.
   */
  perception: PerceptionManager;

  /**
   * The environment canvas group which render the primary canvas group and the effects canvas group.
   * @see {@linkcode Canvas.primary | Canvas#primary}
   * @see {@linkcode Canvas.effects | Canvas#effects}
   * @remarks Only `undefined` prior to canvas {@link Canvas.initialize | initialization},
   * which happens only once, between the `setup` and `ready` hooks.
   *
   * @privateRemarks This is defined but not initialized in the class body, then overwritten with a `defineProperty` with
   * `{ writable: false }` in `Canvas##createGroups`.
   */
  readonly environment: InitializedOn<EnvironmentCanvasGroup.Implementation, "ready">;

  /**
   * The primary Canvas group which generally contains tangible physical objects which exist within the Scene. This group is a
   * {@linkcode CachedContainer} which is rendered to the Scene as a {@linkcode SpriteMesh}. This allows the rendered result of
   * the Primary Canvas Group to be affected by a {@linkcode BaseSamplerShader}.
   * @remarks Only `undefined` prior to canvas {@link Canvas.initialize | initialization},
   * which happens only once, between the `setup` and `ready` hooks.
   *
   * @privateRemarks This is defined but not initialized in the class body, then overwritten with a `defineProperty` with
   * `{ writable: false }` in `Canvas##createGroups`.
   */
  readonly primary: InitializedOn<PrimaryCanvasGroup.Implementation, "ready">;

  /**
   * The effects Canvas group which modifies the result of the {@link PrimaryCanvasGroup} by adding special effects.
   * This includes lighting, vision, fog of war and related animations.
   * @remarks Only `undefined` prior to canvas {@link Canvas.initialize | initialization},
   * which happens only once, between the `setup` and `ready` hooks.
   *
   * @privateRemarks This is defined but not initialized in the class body, then overwritten with a `defineProperty` with
   * `{ writable: false }` in `Canvas##createGroups`.
   */
  readonly effects: InitializedOn<EffectsCanvasGroup.Implementation, "ready">;

  /**
   * The visibility Canvas group which handles the fog of war overlay by consolidating multiple render textures,
   * and applying a filter with special effects and blur.
   * @remarks Only `undefined` prior to canvas {@link Canvas.initialize | initialization},
   * which happens only once, between the `setup` and `ready` hooks.
   *
   * @privateRemarks This is defined but not initialized in the class body, then overwritten with a `defineProperty` with
   * `{ writable: false }` in `Canvas##createGroups`.
   */
  readonly visibility: InitializedOn<CanvasVisibility.Implementation, "ready">;

  /**
   * The interface Canvas group which is rendered above other groups and contains all interactive elements.
   * The various {@linkcode InteractionLayer} instances of the interface group provide different control sets for
   * interacting with different types of {@linkcode Document}s which can be represented on the Canvas.
   * @remarks Only `undefined` prior to canvas {@link Canvas.initialize | initialization},
   * which happens only once, between the `setup` and `ready` hooks.
   *
   * @privateRemarks This is defined but not initialized in the class body, then overwritten with a `defineProperty` with
   * `{ writable: false }` in `Canvas##createGroups`.
   */
  readonly interface: InitializedOn<InterfaceCanvasGroup.Implementation, "ready">;

  /**
   * The overlay Canvas group which is rendered above other groups and contains elements not bound to stage transform.
   * @remarks Only `undefined` prior to canvas {@link Canvas.initialize | initialization},
   * which happens only once, between the `setup` and `ready` hooks.
   *
   * @privateRemarks This is defined but not initialized in the class body, then overwritten with a `defineProperty` with
   * `{ writable: false }` in `Canvas##createGroups`.
   */
  readonly overlay: InitializedOn<OverlayCanvasGroup.Implementation, "ready">;

  /**
   * The singleton {@linkcode HeadsUpDisplayContainer} which overlays HTML rendering on top of this Canvas.
   *
   */
  hud: InitializedOn<HeadsUpDisplayContainer, "ready">;

  /**
   * Position of the mouse on stage.
   */
  mousePosition: PIXI.Point;

  /**
   * Previous position of the mouse on stage.
   */
  previousMousePosition: PIXI.Point;

  /** @deprecated This was made hard private in v13. This warning will be removed in v14. */
  protected _panTime: never;

  /**
   * Force snapping to grid vertices?
   */
  get forceSnapVertices(): boolean;

  set forceSnapVertices(value);

  /**
   * A flag for whether the game Canvas is fully initialized and ready for additional content to be drawn.
   */
  get initialized(): boolean;

  /**
   * A reference to the currently displayed Scene document, or null if the Canvas is currently blank.
   */
  get scene(): Scene.Implementation | null;

  /**
   * A SceneManager instance which adds behaviors to this Scene, or null if there is no manager.
   * @defaultValue `null`
   */
  get manager(): SceneManager | null;

  /**
   * The current pixel dimensions of the displayed Scene, or null if the Canvas is blank.
   */
  get dimensions(): Canvas.Dimensions | null;

  /**
   * A reference to the grid of the currently displayed Scene document, or null if the Canvas is currently blank.
   */
  get grid(): BaseGrid | null;

  /**
   * A flag for whether the game Canvas is ready to be used. False if the canvas is not yet drawn, true otherwise.
   */
  get ready(): boolean;

  /**
   * The colors bound to this scene and handled by the color manager.
   * @remarks
   * @throws If accessed before canvas initialization. Safe after the `ready` hook.
   */
  get colors(): EnvironmentCanvasGroup.Implementation["colors"];

  /**
   * Shortcut to get the masks container from {@linkcode HiddenCanvasGroup}.
   * @remarks
   * @throws If accessed before canvas initialization. Safe after the `ready` hook.
   */
  get masks(): HiddenCanvasGroup.Implementation["masks"];

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
  get layers(): Canvas.AllLayers[];

  /**
   * Return a reference to the active Canvas Layer
   */
  get activeLayer(): CanvasLayer.Any | null;

  /**
   * The currently displayed darkness level, which may override the saved Scene value.
   * @remarks
   * @throws If accessed before canvas initialization. Safe after the `ready` hook.
   */
  get darknessLevel(): EnvironmentCanvasGroup.Implementation["darknessLevel"];

  /**
   * Initialize the Canvas by creating the HTML element and PIXI application.
   * This step should only ever be performed once per client session.
   * Subsequent requests to reset the canvas should go through Canvas#draw
   */
  initialize(): void;

  /** @deprecated Foundry made this hard private in v13. This warning will be removed in v14. */
  protected _initializeBlur(options?: never): never;

  /**
   * Configure performance settings for hte canvas application based on the selected performance mode.
   * @internal
   */
  _configurePerformanceMode(): Canvas.PerformanceSettings;

  /**
   * Draw the game canvas.
   * @param scene - A specific Scene document to render on the Canvas
   * @returns A Promise which resolves once the Canvas is fully drawn
   * @privateRemarks Foundry calls this with `null` in `Scene#_onDelete` and `Scene#_onActivate`
   */
  draw(scene?: Scene.Implementation | null): Promise<this>;

  /** @remarks Doesn't exist prior to first draw */
  blur?: Canvas.Blur;

  /**
   * When re-drawing the canvas, first tear down or discontinue some existing processes
   */
  tearDown(): Promise<void>;

  /**
   * Create a SceneManager instance used for this Scene, if any.
   */
  static getSceneManager(scene: Scene.Implementation): SceneManager.Any | null;

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

  /**
   * Given an embedded object name, get the canvas layer for that object
   */
  getLayerByEmbeddedName<Name extends string>(embeddedName: Name): Canvas.GetLayerByEmbeddedNameReturn<Name>;

  /**
   * Get the InteractionLayer of the canvas which manages Documents of a certain collection within the Scene.
   * @param collectionName - The collection name
   * @returns The canvas layer
   */
  getCollectionLayer<Name extends string>(collectionName: Name): Canvas.GetCollectionLayerReturn<Name>;

  /**
   * Activate framerate tracking by adding an HTML element to the display and refreshing it every frame.
   */
  activateFPSMeter(): void;

  /**
   * Deactivate framerate tracking by canceling ticker updates and removing the HTML element.
   */
  deactivateFPSMeter(): void;

  /**
   * Pan the canvas to a certain \{x,y\} coordinate and a certain zoom level
   * @param position - The canvas position to pan to
   */
  pan(position?: Canvas.PartialViewPosition): void;

  /**
   * Animate panning the canvas to a certain destination coordinate and zoom scale
   * Customize the animation speed with additional options
   * Returns a Promise which is resolved once the animation has completed
   *
   * @param view - The desired view parameters
   *               (default: `{}`)
   * @returns A Promise which resolves once the animation has been completed
   */
  animatePan(view: Canvas.AnimatePanOptions): CanvasAnimation.AnimateReturn;

  /**
   * Recenter the canvas with a pan animation that ends in the center of the canvas rectangle.
   * @param initial - A desired initial position from which to begin the animation
   * @returns A Promise which resolves once the animation has been completed
   */
  recenter(initial?: Canvas.PartialViewPosition): CanvasAnimation.AnimateReturn;

  /**
   * Highlight objects on any layers which are visible
   * @remarks Calls the {@linkcode hookEvents.highlightObjects | highlightObjects} hook.
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
  ping(origin: Canvas.Point, options?: Ping.ConstructorOptions): Promise<boolean>;

  /**
   * Get the constrained zoom scale parameter which is allowed by the maxZoom parameter
   * @param position - The unconstrained camera position
   * @returns The constrained position
   * @internal
   */
  _constrainView(position: Canvas.PartialViewPosition): Canvas.ViewPosition;

  /**
   * Create a BlurFilter instance and register it to the array for updates when the zoom level changes.
   * @param blurStrength - The desired blur strength to use for this filter (default: {@linkcode CONFIG.Canvas.blurStrength})
   * @param blurQuality  - The desired quality to use for this filter (default: {@linkcode CONFIG.Canvas.blurQuality})
   */
  createBlurFilter(blurStrength?: number, blurQuality?: number): PIXI.BlurFilter;

  /**
   * Add a filter to the blur filter list if it has the `blur` property.
   * @param filter - The filter instance to add
   * @returns The filter that was passed to this function
   */
  addBlurFilter<Filter extends PIXI.Filter>(filter: Filter): Filter;

  /**
   * Update the blur strength depending on the scale of the canvas stage
   * @param strength - Optional blur strength to apply (default: {@linkcode Canvas.blur | this.blur.strength})
   */
  updateBlur(strength?: number): void;

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
   * @param destroy       - If textures should be destroyed. (default: `true`)
   * @remarks Despite the parameter name and description, this calls `removeChildren` on it, which `DisplayObject`s don't have. `Container`
   * is best guess as to actual constraint.
   */
  static clearContainer(displayObject: PIXI.Container, destroy?: boolean): void;

  /**
   * Get a texture with the required configuration and clear color.
   */
  static getRenderTexture(options?: Canvas.GetRenderTextureOptions): PIXI.RenderTexture;

  /**
   * Register a new onMouseMove handler with an optional priority.
   * @param handler  - The function to call on mouse move.
   * @param priority - Optional priority. Higher values are called earlier. (default: `0`)
   * @param context  - The context in which the handler should be executed. (default: `this`)
   * @param strict   - To know if the handler should be called on real pointer move only (not simulated) (default: `false`)
   * @remarks The `priority` is not limited to specific values from {@linkcode Canvas.MOUSE_MOVE_HANDLER_PRIORITIES}, as evidenced by its
   * default not being enumerated there. It's used as a simple numerical sort.
   *
   * When called, the `this` of the handler will be `context`. Core only registers three handlers as of 13.351, and their contexts are the
   * {@linkcode PrimaryCanvasGroup}, {@linkcode SoundsLayer}, and {@linkcode ControlsLayer}.
   */
  registerMouseMoveHandler(
    handler: Canvas.MouseMoveHandler,
    priority?: Canvas.MOUSE_MOVE_HANDLER_PRIORITIES,
    context?: unknown,
    strict?: boolean,
  ): void;

  /**
   * Handle right-mouse start drag events occurring on the Canvas.
   * @see `MouseInteractionManager##handleDragStart`
   * @internal
   */
  _onDragRightStart(event: Canvas.Event.Pointer): void;

  /**
   * Handle right-mouse drag events occurring on the Canvas.
   * @see `MouseInteractionManager##handleDragMove`
   * @internal
   */
  _onDragRightMove(event: Canvas.Event.Pointer): void;

  /**
   * Handle the conclusion of a right-mouse drag workflow the Canvas stage.
   * @see `MouseInteractionManager##handleDragDrop`
   * @internal
   */
  _onDragRightDrop(event: Canvas.Event.Pointer): void;

  /**
   * Handle the cancellation of a right-mouse drag workflow the Canvas stage.
   * @see `MouseInteractionManager##handleDragCancel`
   * @internal
   */
  _onDragRightCancel(event: Canvas.Event.Pointer): void;

  /**
   * Pan the canvas view when the cursor position gets close to the edge of the frame
   * @param event - The originating mouse movement event
   * @internal
   */
  _onDragCanvasPan(event: Canvas.Event.Pointer): ReturnType<this["animatePan"]> | void;

  /**
   * Handle window resizing with the dimensions of the window viewport change
   * @internal
   */
  _onResize(): false | void;

  /**
   * Handle mousewheel events which adjust the scale of the canvas
   * @param event - The mousewheel event that zooms the canvas
   * @internal
   */
  _onMouseWheel(event: Canvas.Event.Wheel): void;

  /**
   * Track objects which have pending render flags.
   * @remarks Only `undefined` prior to first draw. Defined in the class body but not initialized, replaced every draw via `defineProperty`
   * with `{ writable: false, configurable: true }` options.
   */
  readonly pendingRenderFlags: Canvas.PendingRenderFlags | undefined;

  /**
   * @deprecated "`Canvas#colorManager` is deprecated and replaced by {@linkcode Canvas.environment | Canvas#environment}"
   * (since v12, until v14)
   */
  get colorManager(): this["environment"];

  #Canvas: true;
}

declare namespace Canvas {
  type MOUSE_MOVE_HANDLER_PRIORITIES = Brand<number, "Canvas.MOUSE_MOVE_HANDLER_PRIORITIES">;

  interface MouseMoveHandlerPriorities {
    HIGH: 75 & MOUSE_MOVE_HANDLER_PRIORITIES;
    MEDIUM: 50 & MOUSE_MOVE_HANDLER_PRIORITIES;
    LOW: 25 & MOUSE_MOVE_HANDLER_PRIORITIES;
  }

  interface LoadTexturesOptions {
    /** @defaultValue `true` */
    expireCache: boolean;

    /** @defaultValue `[]` */
    additionalSources: string[];
  }

  interface VisibilityOptions {
    /** @defaultValue `false` */
    persistentVision: boolean;
  }

  interface BlurOptions {
    enabled: boolean;
    blurClass: typeof PIXI.Filter;
    blurPassClass: typeof PIXI.Filter;
    strength: number;
    passes: number;
    kernels: number;
  }

  /** The interface for {@linkcode Canvas.blur | Canvas#blur}, which doesn't exist until first draw */
  interface Blur extends Readonly<Omit<BlurOptions, "strength">>, Pick<BlurOptions, "strength"> {}

  interface SceneTextures extends Record<string, string | PIXI.Texture | PIXI.Spritesheet> {
    /** A specific background texture used for the Scene */
    background?: string | PIXI.Texture;

    /** A specific foreground texture used for the Scene */
    foreground?: string | PIXI.Texture;

    /** A specific fog overlay texture used for the Scene */
    fogOverlay?: string | PIXI.Texture;
  }

  interface FPS {
    /** @defaultValue `[]` */
    values: number[];

    /** @defaultValue `0` */
    renderTime: number;
  }

  interface PerformanceSettings {
    /** The performance mode in {@linkcode CONST.CANVAS_PERFORMANCE_MODES} */
    mode: CONST.CANVAS_PERFORMANCE_MODES;

    /**
     * Whether to use mipmaps, "ON" or "OFF"
     * @remarks Foundry uses a string union instead of a boolean because this is used to index {@linkcode PIXI.MIPMAP_MODES}.
     */
    mipmap: "ON" | "OFF";

    /** Whether to apply MSAA at the overall canvas level */
    msaa: boolean;

    /** Whether to apply SMAA at the overall canvas level */
    smaa: boolean;

    /** Maximum framerate which should be the render target */
    fps: number;

    /** Whether to display token movement animation */
    tokenAnimation: boolean;

    /** Whether to display light source animation */
    lightAnimation: boolean;

    /** Whether to render soft edges for light sources */
    lightSoftEdges: boolean;
  }

  /** @internal */
  interface _SupportedComponents {
    /** Is reading pixels in RED format supported? */
    readPixelsRED: boolean;

    /** Is the OffscreenCanvas supported? */
    offscreenCanvas: boolean;

    // These `max_` properties are undocumented, but I assume are self-explanatory for people in a position to care.
    maxVertexVectors: number;
    maxFragmentVectors: number;
    maxVertexAttributes: number;
    maxVaryingVectors: number;
    maxTextureUnits: number;
    maxVertexTextureUnits: number;
  }

  /**
   * If {@linkcode SupportedComponents.webGL2 | webGL2} is `false`, the object will be returned with only that property.
   */
  interface SupportedComponents extends IntentionalPartial<_SupportedComponents> {
    /** Is WebGL2 supported? */
    webGL2: boolean;
  }

  interface Dimensions extends Scene.Dimensions {
    /** The minimum, maximum, and default canvas scale. */
    scale: {
      min: number;
      max: number;
      default: number;
    };

    /** The scaling factor for canvas UI elements. Based on the normalized grid size (100px). */
    uiScale: number;
  }

  type AllLayers = _AllLayers<keyof CONFIG.Canvas.Layers>;

  /** @internal */
  type _AllLayers<K extends keyof CONFIG.Canvas.Layers> = K extends unknown
    ? FixedInstanceType<CONFIG.Canvas.Layers[K]["layerClass"]>
    : never;

  /**
   * @privateRemarks The `NonNullable` is necessary because the layer properties are `InitializedOn` themselves, but that's handled by
   * `|| null` at runtime for this method.
   */
  type GetLayerByEmbeddedNameReturn<Name extends string> = Name extends Document.PlaceableType
    ? _GetLayerByEmbeddedNameReturn<NonNullable<EmbeddedEntityNameToLayerMap[Name]>>
    : null;

  /** @internal */
  type _GetLayerByEmbeddedNameReturn<Layer> = InitializedOn<Layer, "ready", Layer | null>;

  type GetCollectionLayerReturn<Name extends string> = Name extends PlaceableObject.AnyCanvasDocument["collectionName"]
    ? CollectionNameToLayerMap[Name]
    : undefined;

  interface ViewPosition {
    /**
     * The x-coordinate which becomes stage.pivot.x
     * @defaultValue `canvas.stage.pivot.x`
     */
    x: number;

    /**
     * The y-coordinate which becomes stage.pivot.y
     * @defaultValue `canvas.stage.pivot.y`
     */
    y: number;

    /**
     * The zoom level up to {@linkcode CONFIG.Canvas.maxZoom} which becomes stage.scale.x and y
     * @defaultValue `canvas.stage.scale.x`
     */
    scale: number;
  }

  interface PartialViewPosition extends InexactPartial<ViewPosition> {}

  interface _AnimatePanOptions {
    /**
     * The total duration of the animation in milliseconds; used if speed is not set
     * @defaultValue `250`
     */
    duration?: number;

    /** The speed of animation in pixels per second; overrides duration if set */
    speed?: number;

    /**
     * An easing function passed to CanvasAnimation animate
     * @defaultValue {@linkcode CanvasAnimation.easeInOutCosine}
     */
    easing?: CanvasAnimation.EasingFunction;
  }

  interface AnimatePanOptions extends InexactPartial<ViewPosition>, InexactPartial<_AnimatePanOptions> {}

  // TODO: do we really need this type separate from Point?
  interface DropPosition {
    x: number;
    y: number;
  }

  /**
   * A 2D point, expressed as `{x, y}`
   * @remarks Copied from `common/_types.mjs`
   */
  interface Point {
    x: number;
    y: number;
  }

  /**
   * A 3D point, expressed as `{x, y, elevation}`.
   * @remarks Copied from `common/_types.mjs`
   */
  interface ElevatedPoint {
    /** The x-coordinate in pixels */
    x: number;

    /** The y-coordinate in pixels */
    y: number;

    /** The elevation in grid units */
    elevation: number;
  }

  type PossiblyElevatedPoint = Point | ElevatedPoint;

  /**
   * A single point, expressed as an array `[x,y]`
   * @remarks Copied from `resources/app/common/types.mjs`
   *
   * Renamed from `PointArray` to avoid confusion (for `[{x,y},{x,y}]` for example)
   */
  type PointTuple = [x: number, y: number];

  type PairOfPointsTuple = [x0: number, y0: number, x1: number, y1: number];

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

  interface GetRenderTextureOptions {
    /**
     * The clear color to use for this texture. Transparent by default.
     * @remarks Foundry types this as just `number[]` because they seem to prefer RGB(A) arrays for specifying PIXI colors,
     * but this gets assigned to {@linkcode PIXI.BaseRenderTexture.clearColor}.
     */
    clearColor?: PIXI.ColorSource | undefined;

    /**
     * The render texture configuration.
     * @remarks Options for {@linkcode PIXI.RenderTexture.create}.
     */
    textureConfiguration?: PIXI.IBaseTextureOptions | undefined;
  }

  type MouseMoveHandler = (position: PIXI.Point) => void;

  namespace Event {
    /**
     * All known InteractionData properties. Last updated 13.346.
     * @internal
     */
    // TODO: audit in v14
    type _InteractionData<ObjectFor extends PIXI.DisplayObject> = InexactPartial<{
      /**
       * @remarks Set in `MouseInteractionManager##assignInteractionData`, which is called in
       * {@linkcode MouseInteractionManager.callback | #callback}, so this will always be available
       * to {@linkcode CallbackFunction}s
       */
      object: ObjectFor;

      /**
       * @privateRemarks Set as:
       *
       * A {@linkcode PIXI.Point} in:
       * - `MouseInteractionManager##handlePointerMove`
       * - `MouseInteractionManager##handlePointerUp`
       *
       * A {@linkcode Canvas.PossiblyElevatedPoint} in:
       * - {@linkcode DrawingsLayer._onDragLeftDrop | DrawingsLayer#_onDragLeftDrop}
       * - {@linkcode RegionLayer._onDragLeftMove | RegionLayer#_onDragLeftMove}
       * - {@linkcode RegionLayer._onDragLeftDrop | RegionLayer#_onDragLeftDrop}
       * - {@linkcode SoundsLayer._onDragLeftDrop | SoundsLayer#_onDragLeftDrop}
       * - {@linkcode TemplateLayer._onDragLeftMove | TemplateLayer#_onDragLeftMove}
       * - {@linkcode TilesLayer._onDragLeftMove | TilesLayer#_onDragLeftMove}
       * - {@linkcode TilesLayer._onDragLeftDrop | TilesLayer#_onDragLeftDrop}
       * - {@linkcode Tile._onHandleDragMove | Tile#_onHandleDragMove}
       * - {@linkcode Tile._onHandleDragDrop | Tile#_onHandleDragDrop}
       */
      destination: PIXI.Point | Canvas.PossiblyElevatedPoint;

      /**
       * @privateRemarks Set:
       * - As {@linkcode PIXI.Point} in `MouseInteractionManager##assignOriginData`
       * - As {@linkcode Canvas.Rectangle} in {@linkcode Tile._onHandleDragStart | Tile#_onHandleDragStart}
       */
      origin: PIXI.Point | Canvas.Rectangle;

      /** @privateRemarks Set in `MouseInteractionManager##assignOriginData` */
      screenOrigin: PIXI.Point;

      /** @privateRemarks Set in `Canvas##onDragSelect` */
      coords: Canvas.Rectangle;

      /** @privateRemarks Set in `Canvas##onDragLeftStart` */
      ruler: boolean;

      /**
       * @privateRemarks Set in:
       * - `SceneControls##onToolChange`
       * - `ClientKeybindings.#onDismiss`
       * - {@linkcode BaseRuler._onDragStart | BaseRuler#_onDragStart}
       * - {@linkcode BaseRuler._onClickLeft | BaseRuler#_onClickLeft}
       * - {@linkcode BaseRuler._onClickRight | BaseRuler#_onClickRight}
       * - {@linkcode BaseRuler._onMouseUp | BaseRuler#_onMouseUp}
       * - {@linkcode ControlsLayer._onLongPress | ControlsLayer#_onLongPress}
       * - {@linkcode WallsLayer._onUndoCreate | WallsLayer#_onUndoCreate}
       * - {@linkcode Token._initializeDragLeft | Token#_initializeDragLeft}
       * - {@linkcode Token._triggerDragLeftCancel | Token#_triggerDragLeftCancel}
       */
      cancelled: boolean;

      /**
       * @privateRemarks Set in:
       * - {@linkcode Token._initializeDragLeft | Token#_initializeDragLeft}
       * - {@linkcode Token._onDragLeftDrop | Token#_onDragLeftDrop}
       * - {@linkcode Token._triggerDragLeftDrop | Token#_triggerDragLeftDrop}
       */
      dropped: boolean;

      /**
       * @privateRemarks Set in:
       * - {@linkcode BaseRuler._onDragStart | BaseRuler#_onDragStart}
       * - {@linkcode BaseRuler._onMouseUp | BaseRuler#_onMouseUp}
       * - {@linkcode Token._initializeDragLeft | Token#_initializeDragLeft}
       * - {@linkcode Token._onDragLeftDrop | Token#_onDragLeftDrop}
       */
      released: boolean;

      /**
       * @privateRemarks Set in:
       * - {@linkcode DrawingsLayer._onDragLeftStart | DrawingsLayer#_onDragLeftStart}
       * - {@linkcode LightingLayer._onDragLeftStart | LightingLayer#_onDragLeftStart}
       * - {@linkcode SoundsLayer._onDragLeftStart | SoundsLayer#_onDragLeftStart}
       * - {@linkcode TemplateLayer._onDragLeftStart | TemplateLayer#_onDragLeftStart}
       * - {@linkcode WallsLayer._onDragLeftStart | WallsLayer#_onDragLeftStart}
       */
      preview: ObjectFor;

      /**
       * @privateRemarks Set in:
       * - {@linkcode DrawingsLayer._onClickLeft2 | DrawingsLayer#_onClickLeft2}
       * - {@linkcode DrawingsLayer._onDragLeftStart | DrawingsLayer#_onDragLeftStart}
       * - {@linkcode DrawingsLayer._onDragLeftMove | DrawingsLayer#_onDragLeftMove}
       * - {@linkcode DrawingsLayer._onDragLeftDrop | DrawingsLayer#_onDragLeftDrop}
       * - {@linkcode DrawingsLayer._onDragLeftCancel | DrawingsLayer#_onDragLeftCancel}
       */
      drawingsState: PlaceablesLayer.CREATION_STATES;

      /**
       * @privateRemarks Set in:
       * - {@linkcode SoundsLayer._onDragLeftStart | SoundsLayer#_onDragLeftStart}
       * - {@linkcode SoundsLayer._onDragLeftMove | SoundsLayer#_onDragLeftMove}
       */
      soundState: PlaceablesLayer.CREATION_STATES;

      /**
       * @privateRemarks Set in:
       * - {@linkcode PlaceableObject._onDragLeftDrop | PlaceableObject#_onDragLeftDrop}
       * - {@linkcode PlaceablesLayer._onDragLeftDrop | PlaceablesLayer#_onDragLeftDrop}
       * - {@linkcode DrawingsLayer._onDragLeftDrop | DrawingsLayer#_onDragLeftDrop}
       * - {@linkcode WallsLayer._onDragLeftStart | WallsLayer#_onDragLeftStart}
       * - {@linkcode WallsLayer._onDragLeftDrop | WallsLayer#_onDragLeftDrop}
       */
      clearPreviewContainer: boolean;

      /**
       * @privateRemarks Set in: {@linkcode PlaceableObject._onClickLeft | PlaceableObject#_onClickLeft}
       */
      release: boolean;

      /**
       * @privateRemarks Set in:
       * - {@linkcode Drawing._onClickLeft | Drawing#_onClickLeft}
       * - {@linkcode Tile._onClickLeft | Tile#_onClickLeft}
       */
      dragHandle: boolean;

      /**
       * @privateRemarks Set in {@linkcode Drawing._onHandleDragStart | Drawing#_onHandleDragStart}
       */
      handleOrigin: Canvas.Point;

      /**
       * @privateRemarks Set in {@linkcode Drawing._onHandleDragStart | Drawing#_onHandleDragStart}
       */
      originalData: DrawingDocument.Source;

      /**
       * @privateRemarks Set in {@linkcode Drawing._onHandleDragDrop | Drawing#_onHandleDragDrop}
       */
      restoreOriginalData: boolean;

      /**
       * @privateRemarks Set in {@linkcode PlaceableObject._initializeDragLeft | PlaceableObject#_initializeDragLeft}
       */
      clones: ObjectFor[];

      /**
       * @privateRemarks Set in {@linkcode WallsLayer._onDragLeftStart | WallsLayer#_onDragLeftStart}
       */
      fixed: boolean;
    }>;

    interface InteractionData<
      ObjectFor extends PIXI.DisplayObject = PIXI.DisplayObject,
    > extends _InteractionData<ObjectFor> {}

    /** @internal */
    interface _Base<
      ObjectFor extends PIXI.DisplayObject = PIXI.DisplayObject,
      Original extends UIEvent | PIXI.PixiTouch = UIEvent | PIXI.PixiTouch,
    > extends PIXI.FederatedEvent<Original> {
      interactionData: InteractionData<ObjectFor>;
    }

    interface Pointer<ObjectFor extends PIXI.Container = PIXI.Container> extends _Base<ObjectFor, PointerEvent> {}
    interface Wheel extends WheelEvent {}

    /** @deprecated Just use {@linkcode KeyboardEvent} instead */
    interface DeleteKey extends KeyboardEvent {}

    interface DarknessChange extends PIXI.FederatedEvent {
      type: "darknessChange";
      environmentData: {
        darknessLevel: number;
        priorDarknessLevel: number;
      };
    }
  }

  interface PendingRenderFlags {
    OBJECTS: Set<RenderFlagsMixin.AnyMixed>;
    PERCEPTION: Set<RenderFlagsMixin.AnyMixed>;
  }
}

export default Canvas;

// TODO: move this somewhere accessible, or at least make somewhere accessible to add to it
interface EmbeddedEntityNameToLayerMap {
  AmbientLight: Canvas["lighting"];
  AmbientSound: Canvas["sounds"];
  Drawing: Canvas["drawings"];
  Note: Canvas["notes"];
  MeasuredTemplate: Canvas["templates"];
  Region: Canvas["regions"];
  Tile: Canvas["tiles"];
  Token: Canvas["tokens"];
  Wall: Canvas["walls"];
}

// TODO: move this somewhere accessible, or at least make somewhere accessible to add to it
interface CollectionNameToLayerMap {
  lights: Canvas["lighting"];
  sounds: Canvas["sounds"];
  drawings: Canvas["drawings"];
  notes: Canvas["notes"];
  regions: Canvas["regions"];
  templates: Canvas["templates"];
  tiles: Canvas["tiles"];
  tokens: Canvas["tokens"];
  walls: Canvas["walls"];
}
