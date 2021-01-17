/**
 * The virtual tabletop environment is implemented using a WebGL powered HTML 5
 * canvas using the powerful PIXI.js library. The canvas is comprised of an
 * ordered sequence of layers which define rendering groups and collections of
 * objects that are drawn on the canvas itself.
 * @see {@link CanvasLayer} An abstract class for all Canvas layers.
 * @see {@link PlaceablesLayer} An abstract class for Canvas Layers which
 *      contain Placeable Objects.
 * @see {@link PlaceableObject} An abstract class for objects which are placed
 *      into the Scene and drawn on the canvas.
 * @example <caption>Example Canvas commands</caption>
 * ```javascript
 * canvas.ready; // Is the canvas ready for use?
 * canvas.scene; // The currently viewed Scene entity.
 * canvas.dimensions; // The dimensions of the current Scene.
 * canvas.draw(); // Completely re-draw the game canvas (this is usually unnecessary).
 * canvas.pan(x, y, zoom); // Pan the canvas to new coordinates and scale.
 * canvas.recenter(); // Re-center the canvas on the currently controlled Token.
 * ```
 */
declare class Canvas {
  _dragDrop: DragDrop

  /**
   * Track the last automatic pan time to throttle
   * @defaultValue `0`
   * @internal
   */
  _panTime: number

  /**
   * A Set of unique pending operation names to ensure operations are only
   * performed once
   */
  _pendingOperationNames: Set<string>

  /**
   * An object of data which is temporarily cached to be reloaded after the
   * canvas is drawn
   * @internal
   */
  _reload: {
    layer: string
  }

  /**
   * Track the timestamp of the last stage zoom operation
   * @defaultValue `0`
   * @internal
   */
  _zoomTime: number

  app: PIXI.Application

  dimensions: null

  hud: HeadsUpDisplay

  id: null

  /**
   * The singleton interaction manager instance which handles mouse workflows on
   * the Canvas
   */
  mouseInteractionManager: MouseInteractionManager | null

  /**
   * An Array of pending canvas operations which should trigger on the next
   * re-paint
   */
  pendingOperations: Array<[(args: any[]) => void, any, any[]]>

  /**
   * A flag for whether the game Canvas is ready to be used. False if the canvas
   * is not yet drawn, true otherwise.
   * @defaultValue `false`
   */
  ready: boolean

  scene: null

  stage: PIXI.Container

  constructor ()

  /**
   * A mapping of named CanvasLayers.
   * This mapping is defined in the order that layers must be drawn.
   */
  static get layers (): Record<string, CanvasLayer>

  /**
   * Get the canvas active dimensions based on the size of the scene's map.
   * We expand the image size by a factor of 1.5 and round to the nearest 2x
   * grid size.
   * The rounding accomplishes that the padding buffer around the map always
   * contains whole grid spaces.
   * @param data - The scene dimensions data being established
   */
  static getDimensions (data: Canvas.DimensionsData): Canvas.Dimensions

  /**
   * Return a reference to the active Canvas Layer
   */
  get activeLayer (): CanvasLayer

  /**
   * An Array of all CanvasLayer instances which are active on the Canvas board
   */
  get layers (): CanvasLayer[]

  /**
   * Attach event listeners to the game canvas to handle click and interaction
   * events
   * @internal
   */
  _addListeners (): void

  /**
   * Get the constrained zoom scale parameter which is allowed by the maxZoom
   * parameter
   * @param x - The requested x-coordinate
   * @param y - The requested y-coordinate
   * @param scale - The requested scale
   * @returns The allowed scale
   * @internal
   */
  _constrainView (view: Canvas.View): Canvas.View

  /**
   * Create the layers of the game Canvas.
   * @param stage - The primary canvas stage
   * @internal
   */
  _createLayers (stage: PIXI.Container): void

  /**
   * Once the canvas is drawn, initialize control, visibility, and audio states
   */
  _initialize (): Promise<void>

  /**
   * Initialize a CanvasLayer in the activation state
   * @internal
   */
  _initializeCanvasLayer (): void

  /**
   * Initialize the starting view of the canvas stage
   * If we are re-drawing a scene which was previously rendered, restore the
   * prior view position
   * Otherwise set the view to the top-left corner of the scene at standard
   * scale
   * @internal
   */
  _initializeCanvasPosition (): void

  /**
   * Initialize a token or set of tokens which should be controlled.
   * Restore controlled and targeted tokens from before the re-draw.
   * @internal
   */
  _initializeTokenControl (): void

  /**
   * Handle left mouse-click events occurring on the Canvas stage or its active
   * Layer.
   * @see {@link MouseInteractionManager#_handleClickLeft}
   * @internal
   */
  _onClickLeft (event: PIXI.InteractionEvent): void

  /**
   * Handle double left-click events occurring on the Canvas stage.
   * @see {@link MouseInteractionManager#_handleClickLeft2}
   */
  _onClickLeft2 (event: PIXI.InteractionEvent): void

  /**
   * Handle right mouse-click events occurring on the Canvas stage or it's
   * active layer
   * @see {@link MouseInteractionManager#_handleClickRight}
   * @internal
   */
  _onClickRight (event: PIXI.InteractionEvent): void

  /**
   * Pan the canvas view when the cursor position gets close to the edge of the
   * frame
   * @param event - The originating mouse movement event
   * @internal
   */
  _onDragCanvasPan (event: MouseEvent): Promise<void> | void

  /**
   * Handle the cancellation of a left-mouse drag workflow
   * @see {@link MouseInteractionManager#_handleDragCancel}
   * @internal
   */
  _onDragLeftCancel (event: PointerEvent): void

  /**
   * Handle the conclusion of a left-mouse drag workflow when the mouse button
   * is released.
   * @see {@link MouseInteractionManager#_handleDragDrop}
   * @internal
   */
  _onDragLeftDrop (event: PIXI.InteractionEvent): void

  /**
   * Handle mouse movement events occurring on the Canvas stage or it's active
   * layer
   * @see {@link MouseInteractionManager#_handleDragMove}
   * @internal
   */
  _onDragLeftMove (event: PIXI.InteractionEvent): void

  /**
   * Handle the beginning of a left-mouse drag workflow on the Canvas stage or
   * its active Layer.
   * @see {@link MouseInteractionManager#_handleDragStart}
   * @internal
   */
  _onDragLeftStart (event: PIXI.InteractionEvent): void

  /**
   * Handle the conclusion of a right-mouse drag workflow the Canvas stage.
   * @see {@link MouseInteractionManager#_handleDragDrop}
   * @param event - (unused)
   * @internal
   */
  _onDragRightDrop (event?: any): void

  /**
   * Handle right-mouse drag events occuring on the Canvas stage or an active
   * Layer
   * @see {@link MouseInteractionManager#_handleDragMove}
   * @internal
   */
  _onDragRightMove (event: PIXI.InteractionEvent): void

  /**
   * Determine selection coordinate rectangle during a mouse-drag workflow
   * @internal
   */
  _onDragSelect (event: PIXI.InteractionEvent): void

  /**
   * Event handler for the drop portion of a drag-and-drop event.
   * @internal
   */
  _onDrop (event: Event): boolean

  /**
   * Handle mousewheel events which adjust the scale of the canvas
   * @param event - The mousewheel event that zooms the canvas
   * @internal
   */
  _onMouseWheel (event: WheelEvent): void

  /**
   * Handle window resizing with the dimensions of the window viewport change
   * @param event - The Window resize event
   *                (default: `null`)
   * @internal
   */
  _onResize (event: Event): void

  /**
   * Update the blur strength depending on the scale of the canvas stage
   * @internal
   */
  _updateBlur (scale: number): void

  /**
   * Add a pending canvas operation that should fire once the socket handling
   * workflow concludes.
   * This registers operations by a unique string name into a queue - avoiding
   * repeating the same work multiple times.
   * This is especially helpful for multi-object updates to avoid costly and
   * redundant refresh operations.
   * @param name - A unique name for the pending operation, conventionally Class.method
   * @param fn - The unbound function to execute later
   * @param scope - The scope to which the method should be bound when called
   * @param args - Arbitrary arguments to pass to the method when called
   */
  addPendingOperation<S = any, A = any[]> (
    name: string,
    fn: (this: S, args: A) => void,
    scope: S,
    args: A
  ): void

  /**
   * Animate panning the canvas to a certain destination coordinate and zoom
   * scale
   * Customize the animation speed with additional options
   * Returns a Promise which is resolved once the animation has completed
   * @param x - The destination x-coordinate
   * @param y - The destination y-coordinate
   * @param scale - The destination zoom scale
   * @param duration - The total duration of the animation in milliseconds; used
   *                   if speed is not set
   * @param speed - The speed of animation in pixels per second; overrides
   *                duration if set
   * @returns A Promise which resolves once the animation has been completed
   */
  animatePan (
    view: Canvas.View & { duration: number, speed: number}
  ): Promise<void>

  /**
   * Draw the game canvas.
   * @returns A Promise which resolves once the Canvas is fully drawn
   */
  draw (scene: Scene): Promise<this>

  /**
   * Get a reference to the a specific CanvasLayer by it's name
   * @param layerName - The name of the canvas layer to get
   */
  getLayer (layerName: string): CanvasLayer

  /**
   * Given an embedded object name, get the canvas layer for that object
   * @internal
   */
  getLayerByEmbeddedName (embeddedName: string): PlaceablesLayer | null

  /**
   * Initialize all lighting, vision, and sound sources for the Scene.
   */
  initializeSources (): void

  /**
   * Pan the canvas to a certain \{x,y\} coordinate and a certain zoom level
   * @param view - (default: `{}`)
   * @param x - The x-coordinate of the pan destination
   * @param y - The y-coordinate of the pan destination
   * @param scale - The zoom level (max of CONFIG.Canvas.maxZoom) of the action
   */
  pan (view: Partial<Canvas.View>): void

  /**
   * Recenter the canvas
   * Otherwise, pan the stage to put the top-left corner of the map in the
   * top-left corner of the window
   */
  recenter (coordinates: Canvas.View): void

  /**
   * When re-drawing the canvas, first tear down or discontinue some existing
   * processes
   */
  tearDown (): Promise<void>

  /**
   * Fire all pending functions that are registered in the pending operations
   * queue and empty it.
   */
  triggerPendingOperations (): void
}

declare namespace Canvas {
  interface Dimensions {
    distance: number

    height: number

    paddingX: number

    paddingY: number

    ratio: number

    rect: PIXI.Rectangle

    sceneHeight: number

    sceneRect: PIXI.Rectangle

    sceneWidth: number

    shiftX: number

    shiftY: number

    size: number

    width: number
  }

  interface DimensionsData {
    grid: number

    gridDistance: number

    height: number

    padding: number

    shiftX: number

    shiftY: number

    width: number
  }

  interface View {
    scale: number

    x: number

    y: number
  }
}
