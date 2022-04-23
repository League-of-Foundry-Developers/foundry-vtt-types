import { ConfiguredDocumentClass } from '../../../types/helperTypes';
import { BaseScene } from '../../common/documents.mjs';

declare global {
  /**
   * The virtual tabletop environment is implemented using a WebGL powered HTML 5 canvas using the powerful PIXI.js
   * library. The canvas is comprised of an ordered sequence of layers which define rendering groups and collections of
   * objects that are drawn on the canvas itself.
   *
   * @see {@link CanvasLayer} An abstract class for all Canvas layers.
   * @see {@link PlaceablesLayer} An abstract class for Canvas Layers which contain Placeable Objects.
   * @see {@link PlaceableObject} An abstract class for objects which are placed into the Scene and drawn on the canvas.
   *
   * @example <caption>Example Canvas commands</caption>
   * ```typescript
   * canvas.ready; // Is the canvas ready for use?
   * canvas.scene; // The currently viewed Scene document.
   * canvas.dimensions; // The dimensions of the current Scene.
   * canvas.draw(); // Completely re-draw the game canvas (this is usually unnecessary).
   * canvas.pan(x, y, zoom); // Pan the canvas to new coordinates and scale.
   * canvas.recenter(); // Re-center the canvas on the currently controlled Token.
   * ```
   */
  class Canvas {
    constructor();

    /**
     * A reference to the currently displayed Scene document, or null if the Canvas is currently blank.
     * @defaultValue `null`
     */
    scene: StoredDocument<InstanceType<ConfiguredDocumentClass<typeof Scene>>> | null;

    /**
     * The current pixel dimensions of the displayed Scene, or null if the Canvas is blank.
     * @defaultValue `null`
     */
    dimensions: Canvas.Dimensions | null;

    /**
     * A reference to the HeadsUpDisplay container which overlays HTML rendering on top of this Canvas.
     * @defaultValue `null`
     */
    hud: HeadsUpDisplay | null;

    /**
     * An Array of pending canvas operations which should trigger on the next re-paint
     * @defaultValue `[]`
     */
    pendingOperations: Array<[fn: (args: any[]) => void, scope: any, args: any[]]>;

    /**
     * A perception manager interface for batching lighting, sight, and sound updates
     */
    perception: PerceptionManager;

    /**
     * A flag for whether the game Canvas is ready to be used. False if the canvas is not yet drawn, true otherwise.
     * @defaultValue `false`
     */
    ready: boolean;

    /**
     * A flag to indicate whether a new Scene is currently being drawn.
     * @defaultValue `false`
     */
    loading: boolean;

    /**
     * A flag for whether the game Canvas is initialized and ready for drawing.
     * @defaultValue `false`
     */
    initialized: boolean;

    /**
     * A promise that resolves when the canvas is first initialized and ready.
     */
    initializing: Promise<void> | null;

    /**
     * Track the timestamp of the last stage zoom operation
     * @defaultValue `0`
     */
    protected _zoomTime: number;

    /**
     * Track the last automatic pan time to throttle
     * @defaultValue `0`
     */
    protected _panTime: number;

    /**
     * An object of data which is temporarily cached to be reloaded after the canvas is drawn
     * @defaultValue `{}`
     */
    protected _reload: Partial<{ scene: string; layer: string; controlledTokens: string[]; targetedTokens: string[] }>;

    /**
     * A Set of unique pending operation names to ensure operations are only performed once
     */
    protected _pendingOperationNames: Set<string>;

    /**
     * The pixel radius of blur distance that should be applied for the current zoom level
     * @defaultValue `0`
     */
    blurDistance: number;

    /**
     * An array of blur filter instances which are modified by the zoom level and the "soft shadows" setting
     * @defaultValue `[]`
     */
    blurFilters: PIXI.filters.BlurFilter[];

    /**
     * A reference to the MouseInteractionManager that is currently controlling pointer-based interaction, or null.
     */
    currentMouseManager: MouseInteractionManager<PIXI.Container> | null;

    /**
     * Record framerate performance data
     */
    fps: {
      /** @defaultValue `[]` */
      values: number[];

      /** @defaultValue `0` */
      average: number;

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
     * The renderer screen dimensions.
     * @defaultValue `[0, 0]`
     */
    screenDimensions: [x: number, y: number];

    /**
     * Initialize the Canvas by creating the HTML element and PIXI application.
     * This step should only ever be performed once per client session.
     * Subsequent requests to reset the canvas should go through Canvas#draw
     */
    initialize(): void;

    app?: PIXI.Application;

    stage?: PIXI.Container;

    protected _dragDrop?: DragDrop;

    outline?: PIXI.Graphics;

    msk?: PIXI.Graphics;

    readonly primary?: PrimaryCanvasGroup;

    readonly effects?: EffectsCanvasGroup;

    readonly interface?: InterfaceCanvasGroup;

    readonly background?: BackgroundLayer;

    readonly drawings?: DrawingsLayer;

    readonly grid?: GridLayer;

    readonly walls?: WallsLayer;

    readonly templates?: TemplateLayer;

    readonly notes?: NotesLayer;

    readonly tokens?: TokenLayer;

    readonly foreground?: ForegroundLayer;

    readonly sounds?: SoundsLayer;

    readonly lighting?: LightingLayer;

    readonly sight?: SightLayer;

    readonly weather?: WeatherLayer;

    readonly controls?: ControlsLayer;

    /**
     * Display warnings for known performance issues which may occur due to the user's hardware or browser configuration
     * @internal
     */
    protected _displayPerformanceWarnings(): void;

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
     * Initialize the group containers of the game Canvas.
     * @internal
     */
    protected _createGroups(): void;

    /**
     * When re-drawing the canvas, first tear down or discontinue some existing processes
     */
    tearDown(): Promise<void>;

    /**
     * Draw the game canvas.
     * @param scene - A specific Scene document to render on the Canvas
     * @returns A Promise which resolves once the Canvas is fully drawn
     */
    draw(scene?: InstanceType<ConfiguredDocumentClass<typeof Scene>>): Promise<this>;

    performance?: PerformanceSettings;

    /**
     * Get the value of a GL parameter
     * @param parameter - The GL parameter to retrieve
     * @returns The returned value type depends of the parameter to retrieve
     */
    getGLParameter(parameter: string): unknown;

    /**
     * Get the canvas active dimensions based on the size of the scene's map.
     * We expand the image size by a factor of 1.5 and round to the nearest 2x grid size.
     * The rounding accomplishes that the padding buffer around the map always contains whole grid spaces.
     * @see {@link documents.BaseScene.getDimensions}
     * @param data - The scene dimensions data being established
     */
    static getDimensions(data: Canvas.DimensionsData): Canvas.Dimensions;

    /**
     * Configure performance settings for hte canvas application based on the selected performance mode
     * @internal
     */
    protected _configurePerformanceMode(): PerformanceSettings;

    /**
     * Once the canvas is drawn, initialize control, visibility, and audio states
     */
    protected _initialize(): Promise<void>;

    /**
     * Initialize the starting view of the canvas stage
     * If we are re-drawing a scene which was previously rendered, restore the prior view position
     * Otherwise set the view to the top-left corner of the scene at standard scale
     */
    protected _initializeCanvasPosition(): void;

    /**
     * Initialize a CanvasLayer in the activation state
     */
    protected _initializeCanvasLayer(): void;

    /**
     * Initialize a token or set of tokens which should be controlled.
     * Restore controlled and targeted tokens from before the re-draw.
     */
    protected _initializeTokenControl(): void;

    /**
     * Given an embedded object name, get the canvas layer for that object
     */
    getLayerByEmbeddedName<T extends string>(
      embeddedName: T
    ): T extends keyof EmbeddedEntityNameToLayerMap ? Exclude<EmbeddedEntityNameToLayerMap[T], undefined> | null : null;

    /**
     * Activate a specific CanvasLayer by its canonical name
     * @param layerName - The named layer to activate
     */
    activateLayer(layerName: LayerName): void;

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
     * @internal
     */
    protected _measureFPS(): void;

    /**
     * Pan the canvas to a certain \{x,y\} coordinate and a certain zoom level
     * @param options - (default: `{}`)
     */
    pan(options?: PanView): void;

    /**
     * Animate panning the canvas to a certain destination coordinate and zoom scale
     * Customize the animation speed with additional options
     * Returns a Promise which is resolved once the animation has completed
     *
     * @param view - The desired view parameters
     *               (default: `{}`)
     * @returns A Promise which resolves once the animation has been completed
     */
    animatePan(view?: Partial<AnimatedPanView>): ReturnType<typeof CanvasAnimation.animateLinear>;

    /**
     * Recenter the canvas
     * Otherwise, pan the stage to put the top-left corner of the map in the top-left corner of the window
     * @returns A Promise which resolves once the animation has been completed
     */
    recenter(coordinates?: PanView): ReturnType<this['animatePan']>;

    /**
     * Highlight objects on any layers which are visible
     */
    highlightObjects(active: boolean): void;

    /**
     * Get the constrained zoom scale parameter which is allowed by the maxZoom parameter
     * @param x     - The requested x-coordinate
     * @param y     - The requested y-coordinate
     * @param scale - The requested scale
     * @returns The allowed scale
     */
    protected _constrainView({ x, y, scale }: Canvas.View): Canvas.View;

    /**
     * Create a BlurFilter instance and register it to the array for updates when the zoom level changes.
     */
    createBlurFilter(): PIXI.filters.BlurFilter;

    /**
     * Update the blur strength depending on the scale of the canvas stage
     * @param scale - (default: `this.stage.scale.x`)
     */
    protected updateBlur(scale?: number): void;

    /**
     * Sets the background color.
     * @param color - The color to set the canvas background to.
     */
    setBackgroundColor(color: string): void;

    /**
     * Attach event listeners to the game canvas to handle click and interaction events
     */
    protected _addListeners(): void;

    /**
     * Handle normal mouse movement.
     * Throttle cursor position updates to 100ms intervals
     */
    protected _onMouseMove(event: PIXI.InteractionEvent): void;

    /**
     * Handle left mouse-click events occurring on the Canvas stage or its active Layer.
     * @see {@link MouseInteractionManager#_handleClickLeft}
     */
    protected _onClickLeft(event: PIXI.InteractionEvent): void;

    /**
     * Handle double left-click events occurring on the Canvas stage.
     * @see {@link MouseInteractionManager#_handleClickLeft2}
     */
    protected _onClickLeft2(event: PIXI.InteractionEvent): void;

    /**
     * Handle the beginning of a left-mouse drag workflow on the Canvas stage or its active Layer.
     * @see {@link MouseInteractionManager#_handleDragStart}
     */
    protected _onDragLeftStart(event: PIXI.InteractionEvent): void;

    /**
     * Handle mouse movement events occurring on the Canvas stage or it's active layer
     * @see {@link MouseInteractionManager#_handleDragMove}
     */
    protected _onDragLeftMove(event: PIXI.InteractionEvent): void;

    /**
     * Handle the conclusion of a left-mouse drag workflow when the mouse button is released.
     * @see {@link MouseInteractionManager#_handleDragDrop}
     */
    protected _onDragLeftDrop(
      event: PIXI.InteractionEvent
    ): ReturnType<PlaceablesLayer<any>['selectObjects']> | ReturnType<TokenLayer['targetObjects']> | void;

    /**
     * Handle the cancellation of a left-mouse drag workflow
     * @see {@link MouseInteractionManager#_handleDragCancel}
     */
    protected _onDragLeftCancel(event: PointerEvent): PIXI.Graphics | void;

    /**
     * Handle right mouse-click events occurring on the Canvas stage or it's active layer
     * @see {@link MouseInteractionManager#_handleClickRight}
     */
    protected _onClickRight(event: PIXI.InteractionEvent): void;

    /**
     * Handle right-mouse drag events occuring on the Canvas stage or an active Layer
     * @see {@link MouseInteractionManager#_handleDragMove}
     */
    protected _onDragRightMove(event: PIXI.InteractionEvent): void;

    /**
     * Handle the conclusion of a right-mouse drag workflow the Canvas stage.
     * @see {@link MouseInteractionManager#_handleDragDrop}
     */
    protected _onDragRightDrop(event: PIXI.InteractionEvent): void;

    /**
     * Determine selection coordinate rectangle during a mouse-drag workflow
     */
    protected _onDragSelect(event: PIXI.InteractionEvent): void;

    /**
     * Pan the canvas view when the cursor position gets close to the edge of the frame
     * @param event - The originating mouse movement event
     */
    protected _onDragCanvasPan(event: MouseEvent): ReturnType<this['animatePan']> | void;

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
     * Add a pending canvas operation that should fire once the socket handling workflow concludes.
     * This registers operations by a unique string name into a queue - avoiding repeating the same work multiple times.
     * This is especially helpful for multi-object updates to avoid costly and redundant refresh operations.
     * @param name  - A unique name for the pending operation, conventionally Class.method
     * @param fn    - The unbound function to execute later
     * @param scope - The scope to which the method should be bound when called
     * @param args  - Arbitrary arguments to pass to the method when called
     */
    addPendingOperation<S, A>(name: string, fn: (this: S, args: A) => void, scope: S, args: A): void;

    /**
     * Fire all pending functions that are registered in the pending operations queue and empty it.
     */
    triggerPendingOperations(): void;

    /**
     * Get a reference to the a specific CanvasLayer by it's name
     * @param layerName - The name of the canvas layer to get
     * @deprecated since v9, will be deleted in v10
     */
    getLayer(layerName: any): {
      BackgroundLayer: Canvas['background'];
      DrawingsLayer: Canvas['drawings'];
      GridLayer: Canvas['grid'];
      TemplateLayer: Canvas['templates'];
      TokenLayer: Canvas['tokens'];
      WallsLayer: Canvas['walls'];
      LightingLayer: Canvas['lighting'];
      WeatherLayer: Canvas['weather'];
      SightLayer: Canvas['sight'];
      SoundsLayer: Canvas['sounds'];
      NotesLayer: Canvas['notes'];
      ControlsLayer: Canvas['controls'];
    };
  }

  namespace Canvas {
    interface Dimensions extends ReturnType<typeof BaseScene['getDimensions']> {
      rect: PIXI.Rectangle;
      sceneRect: PIXI.Rectangle;
      maxR: number;
    }

    interface DimensionsData {
      width?: number;
      height?: number;
      grid: number;
      gridDistance: number;
      padding: number;
      shiftX: number;
      shiftY: number;
    }

    interface DropPosition {
      x: number;
      y: number;
    }

    interface View {
      x: number;
      y: number;
      scale: number;
    }
  }
}

interface PerformanceSettings {
  mode: foundry.CONST.CANVAS_PERFORMANCE_MODES;
  blur: {
    enabled: boolean;
    illumination: boolean;
  };
  mipmap: 'ON' | 'OFF';
  msaa: boolean;
  fps: number;
  tokenAnimation: boolean;
  lightAnimation: boolean;
  textures: {
    enabled: boolean;
    maxSize: number;
    p2Steps: number;
    p2StepsMax: number;
  };
}

interface PanView {
  /**
   * The x-coordinate of the pan destination
   * @defaultValue `null`
   */
  x?: number | null;

  /**
   * The y-coordinate of the pan destination
   * @defaultValue `null`
   */
  y?: number | null;

  /**
   * The zoom level (max of CONFIG.Canvas.maxZoom) of the action
   * @defaultValue `null`
   */
  scale?: number | null;
}

interface AnimatedPanView {
  /**
   * The destination x-coordinate
   */
  x?: number;

  /**
   * The destination y-coordinate
   */
  y?: number;

  /**
   * The destination zoom scale
   */
  scale?: number;

  /**
   * The total duration of the animation in milliseconds; used if speed is not set
   * @defaultValue 250
   */
  duration: number;

  /**
   * The speed of animation in pixels per second; overrides duration if set
   */
  speed?: number;
}

interface EmbeddedEntityNameToLayerMap {
  AmbientLight: Canvas['lighting'];
  AmbientSound: Canvas['sounds'];
  Drawing: Canvas['drawings'];
  Note: Canvas['notes'];
  MeasuredTemplate: Canvas['templates'];
  Tile: Canvas['background'];
  Token: Canvas['tokens'];
  Wall: Canvas['walls'];
}

type LayerName =
  | 'grid'
  | 'sight'
  | 'effects'
  | 'controls'
  | 'lighting'
  | 'sounds'
  | 'drawings'
  | 'notes'
  | 'templates'
  | 'background'
  | 'foreground'
  | 'tokens'
  | 'walls';
