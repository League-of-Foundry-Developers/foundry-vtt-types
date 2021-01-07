// @TODO: Types

declare interface LayerOptions {
  canDragCreate: boolean
  controllableObjects: boolean
  gridPrecision: number
  rotatableObjects: boolean
  snapToGrid: boolean
}

/**
 * The base PlaceablesLayer subclass of CanvasLayer
 */
declare class PlaceablesLayer extends CanvasLayer {
  /**
   * Keep track of history so that CTRL+Z can undo changes
   */
  history: any[]

  /**
   * Placeable Layer Objects
   */
  objects: PlaceableObject[]

  /**
   * PlaceableObject layer options
   */
  options: any

  /**
   * Preview Object Placement
   */
  preview: PlaceableObject

  /**
   * Track the set of PlaceableObjects on this layer which are currently controlled by their id
   */
  protected _controlled: any

  /**
   * Keep track of an object copied with CTRL+C which can be pasted later
   */
  protected _copy: any[]

  /**
   * Track the PlaceableObject on this layer which is currently being hovered upon
   */
  protected _hover: PlaceableObject

  constructor ();

  /**
   * Customize behaviors of this PlaceablesLayer by modifying some behaviors at a class level
   */
  static get layerOptions (): LayerOptions;

  /**
   * Return a reference to the active instance of this canvas layer
   */
  static get instance (): PlaceablesLayer;

  /**
   * Define the named Array within Scene.data containing the placeable objects displayed in this layer
   */
  static get dataArray (): string;

  /**
   * Define a Container implementation used to render placeable objects contained in this layer
   */
  static get placeableClass (): PIXI.Container;

  /**
   * Return the precision relative to the Scene grid with which Placeable objects should be snapped
   */
  get gridPrecision (): number;

  /**
   * If objects on this PlaceableLayer have a HUD UI, provide a reference to its instance
   */
  get hud (): BasePlaceableHUD | null;

  /**
   * A convenience method for accessing the placeable object instances contained in this layer
   */
  get placeables (): PlaceableObject[];

  /**
   * An Array of placeable objects in this layer which have the _controlled attribute
   */
  get controlled (): PlaceableObject[];

  /**
   * Override the activation behavior of the PlaceablesLayer.
   * While active, ambient sound previews are displayed.
   */
  activate (): void;

  /**
   * Copy currently controlled PlaceableObjects to a temporary Array, ready to paste back into the scene later
   * @returns The Array of copied Objects
   */
  copyObjects (): any[];

  /**
   * Create multiple embedded entities in a parent Entity collection using an Array of provided data
   * @param data - An Array of update data Objects which provide incremental data
   * @param options - Additional options which customize the update workflow
   * @returns A Promise which resolves to the returned socket response (if successful)
   */
  createMany (data: any[], options?: any): Promise<any>;

  /**
   * Draw a single placeable object
   */
  createObject (data: any): Promise<PlaceableObject>;

  /**
   * Override the deactivation behavior of the PlaceablesLayer.
   * When inactive, ambient sound previews are hidden from view.
   */
  deactivate (): void;

  /**
   * A helper method to prompt for deletion of all PlaceableObject instances within the Scene
   * Renders a confirmation dialogue to confirm with the requester that all objects will be deleted
   */
  deleteAll (): void;

  /**
   * Simultaneously delete multiple PlaceableObjects.
   * This executes a single database operation using Scene.update.
   * If deleting only a single object, this will delegate to PlaceableObject.delete for performance reasons.
   * @param ids - An Array of object IDs to target for deletion
   * @param options - Additional options which customize the update workflow
   * @returns A Promise which resolves to the returned socket response (if successful)
   */
  deleteMany (ids: number[], options?: any): Promise<any>;

  /**
   * Draw the PlaceablesLayer.
   * Draw each Sound within the scene as a child of the sounds container.
   */
  draw (): Promise<PlaceablesLayer>;

  /**
   * Get a PlaceableObject contained in this layer by it's ID
   * @param objectId - The ID of the contained object to retrieve
   * @returns The object instance, or undefined
   */
  get (objectId: number): PlaceableObject;

  /**
   * Simultaneously move multiple PlaceableObjects via keyboard movement offsets.
   * This executes a single database operation using Scene.update.
   * If moving only a single object, this will delegate to PlaceableObject.update for performance reasons.
   *
   * @param dx - The number of incremental grid units in the horizontal direction
   * @param dy - The number of incremental grid units in the vertical direction
   * @param rotate - Rotate the token to the keyboard direction instead of moving
   * @param ids - An Array or Set of object IDs to target for rotation
   * @returns The resulting Promise from the Scene.update operation
   */
  moveMany (options?: {
    dx?: number
    dy?: number
    ids?: number[] | Set<number>
    rotate?: boolean
  }): Promise<any>;

  /**
   * Paste currently copied PlaceableObjects back to the layer by creating new copies
   * @returns An Array of created Objects
   */
  pasteObjects (
    position: { x: number, y: number },
    { hidden }?: { hidden?: boolean }
  ): Promise<any[]>;

  /**
   * Release all controlled PlaceableObject instance from this layer.
   * @param options - Additional options which customize the Object releasing behavior
   * @returns The number of PlaceableObject instances which were released
   */
  releaseAll (options: any): number;

  /**
   * Simultaneously rotate multiple PlaceableObjects using a provided angle or incremental.
   * This executes a single database operation using Scene.update.
   * If rotating only a single object, it is better to use the PlaceableObject.rotate instance method.
   * @param angle - A target angle of rotation (in degrees) where zero faces "south"
   * @param delta - An incremental angle of rotation (in degrees)
   * @param snap - Snap the resulting angle to a multiple of some increment (in degrees)
   * @param ids - An Array or Set of object IDs to target for rotation
   * @returns The resulting Promise from the Scene.update operation
   */
  rotateMany (options?: {
    angle?: number
    delta?: number
    ids?: number[] | Set<number>
    snap?: number
  }): Promise<any>;

  /**
   * Select all PlaceableObject instances which fall within a coordinate rectangle.
   *
   * @param x - The top-left x-coordinate of the selection rectangle
   * @param y - The top-left y-coordinate of the selection rectangle
   * @param width - The width of the selection rectangle
   * @param height - The height of the selection rectangle
   * @param releaseOptions - Optional arguments provided to any called release() method
   * @param controlOptions - Optional arguments provided to any called control() method
   * @returns The number of PlaceableObject instances which were controlled.
   */
  selectObjects (options: {
    controlOptions?: any
    height: number
    releaseOptions?: any
    width: number
    x: number
    y: number
  }): number;

  /**
   * Record a new CRUD event in the history log so that it can be undone later
   * @param type - The event type (create, update, delete)
   * @param data - The object data
   */
  storeHistory (type: string, data: any): void;

  /**
   * Undo a change to the objects in this layer
   * This method is typically activated using CTRL+Z while the layer is active
   */
  undoHistory (): Promise<any>;

  /**
   * Update multiple embedded entities in a parent Entity collection using an Array of provided data
   * @param data - An Array of update data Objects which provide incremental data
   * @param options - Additional options which customize the update workflow
   * @returns A Promise which resolves to the returned socket response (if successful)
   */
  updateMany (data: any[], options?: any): Promise<any>;

  /**
   * Handle a DELETE keypress while a placeable object is hovered
   * @param event - The delete key press event which triggered the request
   */
  protected _onDeleteKey (event: PIXI.InteractionEvent): void;

  /**
   * Default handling of drag cancel events by right clicking during a drag creation
   */
  protected _onDragCancel (event: PIXI.InteractionEvent): void;

  /**
   * Handle successful creation of an object through the drag creation workflow.
   * This logic requires that the drag exceeded some minimum distance for the new object to be created.
   */
  protected _onDragCreate (event: PIXI.InteractionEvent): void;

  /**
   * Default handling of drag start events by left click + dragging
   */
  protected _onDragStart (event: PIXI.InteractionEvent): void;

  /**
   * Default mouse-down event handling implementation
   */
  protected _onMouseDown (
    event: PIXI.InteractionEvent,
    options?: {
      isCtrlRuler: any
      isRuler: any
      isSelect: any
    }
  ): void;

  /**
   * Default handling of mouse move events during a dragging workflow
   */
  protected _onMouseMove (event: PIXI.InteractionEvent): void;

  /**
   * Default handling of mouse-up events which conclude a new object creation after dragging
   */
  protected _onMouseUp (event: PIXI.InteractionEvent): void;

  /**
   * Handle mouse-wheel events at the PlaceableObjects layer level to rotate multiple objects at once.
   * This handler will rotate all controlled objects by some incremental angle.
   * @param event - The mousewheel event which originated the request
   */
  protected _onMouseWheel (event: PIXI.InteractionEvent): void;

  /**
   * Handle right mouse-click events which occur while this layer is active
   */
  protected _onRightDown (event: PIXI.InteractionEvent): void;
}
