/**
 * The base PlaceablesLayer subclass of CanvasLayer
 * @typeParam P - the type of the PlaceableObject in the layer
 */
declare abstract class PlaceablesLayer<P extends PlaceableObject = PlaceableObject> extends CanvasLayer {
  constructor();

  /**
   * Placeable Layer Objects
   * @defaultValue `null`
   */
  objects: PIXI.Container | null;

  /**
   * Preview Object Placement
   * @defaultValue `null`
   */
  preview: PIXI.Container;

  /**
   * Keep track of history so that CTRL+Z can undo changes
   */
  history: Array<PlaceablesLayer.HistoryEvent<P>>;

  /**
   * Track the PlaceableObject on this layer which is currently being hovered upon
   * @defaultValue `null`
   */
  protected _hover: P | null;

  /**
   * Track the set of PlaceableObjects on this layer which are currently controlled by their id
   * @defaultValue `{}`
   */
  protected _controlled: Record<string, P>;

  /**
   * Keep track of an object copied with CTRL+C which can be pasted later
   * @defaultValue `[]`
   */
  protected _copy: P[];

  /**
   * PlaceableObject layer options
   * @defaultValue is set from {@link PlaceablesLayer.layerOptions}
   */
  options: PlaceablesLayer.LayerOptions;

  /**
   * A Quadtree which partitions and organizes Walls into quadrants for efficient target identification.
   */
  quadtree: Quadtree | null;

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * {@inheritDoc CanvasLayer.layerOptions}
   */
  static get layerOptions(): PlaceablesLayer.LayerOptions;

  /* -------------------------------------------- */

  /**
   * Define the named Array within Scene.data containing the placeable objects displayed in this layer
   */
  static get dataArray(): string;

  /* -------------------------------------------- */

  /**
   * Define a Container implementation used to render placeable objects contained in this layer
   */
  static get placeableClass(): (...args: any[]) => PlaceableObject;

  /* -------------------------------------------- */

  /**
   * Return the precision relative to the Scene grid with which Placeable objects should be snapped
   */
  get gridPrecision(): number;

  /* -------------------------------------------- */

  /**
   * If objects on this PlaceableLayer have a HUD UI, provide a reference to its instance
   */
  get hud(): BasePlaceableHUD | null;

  /* -------------------------------------------- */

  /**
   * A convenience method for accessing the placeable object instances contained in this layer
   */
  get placeables(): P[];

  /* -------------------------------------------- */

  /**
   * An Array of placeable objects in this layer which have the _controlled attribute
   */
  get controlled(): P[];

  /* -------------------------------------------- */
  /*  Rendering
  /* -------------------------------------------- */

  /**
   * @override
   */
  draw(): Promise<P[]>;

  /* -------------------------------------------- */

  /**
   * Draw a single placeable object
   */
  createObject(data: PlaceablesLayer.DataType<P>): P;

  /* -------------------------------------------- */

  /**
   * @override
   */
  tearDown(): Promise<void>;

  /* -------------------------------------------- */
  /*  Methods                                     */
  /* -------------------------------------------- */

  /**
   * @override
   */
  activate(): this;

  /* -------------------------------------------- */

  /**
   * @override
   */
  deactivate(): this;

  /* -------------------------------------------- */

  /**
   * Get a PlaceableObject contained in this layer by it's ID
   * @param objectId - The ID of the contained object to retrieve
   * @returns The object instance, or undefined
   */
  get(objectId: string): P;

  /* -------------------------------------------- */

  /**
   * Acquire control over all PlaceableObject instances which are visible and controllable within the layer.
   * @param options - Options passed to the control method of each object
   *                  (default: `{}`)
   * @returns An array of objects that were controlled
   */
  controlAll(options?: PlaceableObject.ControlOptions): P[];

  /* -------------------------------------------- */

  /**
   * Release all controlled PlaceableObject instance from this layer.
   * @param options - Options passed to the release method of each object
   *                  (default: `{}`)
   * @returns The number of PlaceableObject instances which were released
   */
  releaseAll(options?: PlaceableObject.ReleaseOptions): number;

  /* -------------------------------------------- */

  /**
   * Simultaneously rotate multiple PlaceableObjects using a provided angle or incremental.
   * This executes a single database operation using Scene.update.
   * If rotating only a single object, it is better to use the PlaceableObject.rotate instance method.
   *
   * @param angle - A target angle of rotation (in degrees) where zero faces
   *                "south"
   *                (default: `null`)
   * @param delta - An incremental angle of rotation (in degrees)
   *                (default: `null`)
   * @param snap  - Snap the resulting angle to a multiple of some increment (in
   *                degrees)
   *                (default: `null`)
   * @param ids   - An Array or Set of object IDs to target for rotation
   *                (default: `null`)
   *
   * @returns The resulting Promise from the Scene.update operation
   */
  rotateMany({
    angle,
    delta,
    snap,
    ids
  }?: {
    angle?: number;
    delta?: number;
    ids?: string[] | Set<string>;
    snap?: number;
  }): Promise<Array<Partial<P>> | Partial<P>>;

  /* -------------------------------------------- */

  /**
   * Simultaneously move multiple PlaceableObjects via keyboard movement offsets.
   * This executes a single database operation using Scene.update.
   * If moving only a single object, this will delegate to PlaceableObject.update for performance reasons.
   *
   * @param dx     - The number of incremental grid units in the horizontal direction
   *                 (default: `0`)
   * @param dy     - The number of incremental grid units in the vertical direction
   *                 (default: `0`)
   * @param rotate - Rotate the token to the keyboard direction instead of moving
   *                 (default: `false`)
   * @param ids    - An Array or Set of object IDs to target for rotation
   *                 (default: `null`)
   *
   * @returns The resulting Promise from the Scene.update operation
   */
  moveMany({
    dx,
    dy,
    rotate,
    ids
  }?: {
    dx: number;
    dy: number;
    ids: string[] | Set<string>;
    rotate: boolean;
  }): Promise<Array<Partial<P>> | Partial<P>>;

  /* -------------------------------------------- */

  /**
   * Undo a change to the objects in this layer
   * This method is typically activated using CTRL+Z while the layer is active
   */
  undoHistory(): Promise<Partial<P>>;

  /* -------------------------------------------- */

  /**
   * Create multiple embedded entities in a parent Entity collection using an Array of provided data
   *
   * @param data    - An Array of update data Objects which provide incremental data
   * @param options - Additional options which customize the update workflow
   *                  (default: `{}`)
   *
   * @returns A Promise which resolves to the returned socket response (if successful)
   */
  createMany(data: Array<PlaceablesLayer.DataType<P>>, options?: Entity.CreateOptions): Promise<P[]>;

  /* -------------------------------------------- */

  /**
   * Update multiple embedded entities in a parent Entity collection using an Array of provided data
   *
   * @param data    - An Array of update data Objects which provide incremental data
   * @param options - Additional options which customize the update workflow
   *                  (default: `{}`)
   *
   * @returns A Promise which resolves to the returned socket response (if successful)
   */
  // TODO: update later
  updateMany(data: any[], options?: Entity.UpdateOptions): Promise<Partial<P>>;

  /* -------------------------------------------- */

  /**
   * Simultaneously delete multiple PlaceableObjects.
   * This executes a single database operation using Scene.update.
   * If deleting only a single object, this will delegate to PlaceableObject.delete for performance reasons.
   *
   * @param ids     - An Array of object IDs to target for deletion
   * @param options - Additional options which customize the update workflow
   *                  (default: `{}`)
   *
   * @returns A Promise which resolves to the returned socket response (if successful)
   */
  deleteMany(ids: string[], options?: Entity.DeleteOptions): Promise<Array<Partial<P>> | Partial<P>>;

  /* -------------------------------------------- */

  /**
   * Update all objects in this layer with a provided transformation.
   * Conditionally filter to only apply to objects which match a certain condition.
   * @param transformation - An object of data or function to apply to all matched objects
   * @param condition      - A function which tests whether to target each object
   *                         (default: `null`)
   * @param options        - Additional options passed to Entity.update
   *                         (default: `{}`)
   * @returns An array of updated data once the operation is complete
   */
  updateAll(
    transformation: ((placeable: P) => P) | P,
    condition?: (placeable: P) => boolean,
    options?: Entity.UpdateOptions
  ): Promise<Array<Partial<P>> | Partial<P>>;

  /* -------------------------------------------- */

  /**
   * A helper method to prompt for deletion of all PlaceableObject instances within the Scene
   * Renders a confirmation dialogue to confirm with the requester that all objects will be deleted
   */
  deleteAll(): Promise<void>;

  /* -------------------------------------------- */

  /**
   * Record a new CRUD event in the history log so that it can be undone later
   * @param type - The event type (create, update, delete)
   * @param data - The object data
   */
  storeHistory(type: PlaceablesLayer.HistoryEventType, data: Array<Partial<P>> | Partial<P>): void;

  /* -------------------------------------------- */

  /**
   * Copy currently controlled PlaceableObjects to a temporary Array, ready to paste back into the scene later
   * @returns The Array of copied PlaceableObject instances
   */
  copyObjects(): P[];

  /* -------------------------------------------- */

  /**
   * Paste currently copied PlaceableObjects back to the layer by creating new copies
   * @param position - The destination position for the copied data.
   * @param hidden   - Paste data in a hidden state, if applicable. Default is false.
   * @param snap     - Snap the resulting objects to the grid. Default is true.
   * @returns An Array of created PlaceableObject instances
   */
  pasteObjects(position: Point, { hidden, snap }?: { hidden: boolean; snap: boolean }): Promise<P[]>;

  /* -------------------------------------------- */

  /**
   * Select all PlaceableObject instances which fall within a coordinate rectangle.
   * @param x              - The top-left x-coordinate of the selection rectangle
   * @param y              - The top-left y-coordinate of the selection rectangle
   * @param width          - The width of the selection rectangle
   * @param height         - The height of the selection rectangle
   * @param releaseOptions - Optional arguments provided to any called release() method
   *                         (default: `{}`)
   * @param controlOptions - Optional arguments provided to any called control() method
   *                         (default: `{}`)
   * @returns A boolean for whether the controlled set was changed in the operation
   */
  selectObjects({
    x,
    y,
    width,
    height,
    releaseOptions,
    controlOptions
  }?: {
    /** The top-left x-coordinate of the selection rectangle */
    x: number;

    /** The top-left y-coordinate of the selection rectangle */
    y: number;

    /** The width of the selection rectangle */
    width: number;

    /** The height of the selection rectangle */
    height: number;

    /**
     * Optional arguments provided to any called release() method
     * @defaultValue `{}`
     */
    releaseOptions?: PlaceableObject.ReleaseOptions;

    /**
     * Optional arguments provided to any called control() method
     * @defaultValue `{ releaseOthers: false }`
     */
    controlOptions?: PlaceableObject.ControlOptions;
  }): boolean;

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /**
   * Handle left mouse-click events which originate from the Canvas stage and are dispatched to this Layer.
   * @param event - (unused)
   * @see {@link Canvas#_onClickLeft}
   */
  protected _onClickLeft(event?: any): void;

  /* -------------------------------------------- */

  /**
   * Handle double left-click events which originate from the Canvas stage and are dispatched to this Layer.
   * @param event - (unused)
   * @see {@link Canvas#_onClickLeft2}
   */
  protected _onClickLeft2(event?: any): void;

  /* -------------------------------------------- */

  /**
   * Start a left-click drag workflow originating from the Canvas stage.
   * @see {@link Canvas#_onDragLeftStart}
   */
  protected _onDragLeftStart(event: PIXI.InteractionEvent): void;

  /* -------------------------------------------- */

  /**
   * Continue a left-click drag workflow originating from the Canvas stage.
   * @see {@link Canvas#_onDragLeftMove}
   */
  protected _onDragLeftMove(event?: PIXI.InteractionEvent): void;

  /* -------------------------------------------- */

  /**
   * Conclude a left-click drag workflow originating from the Canvas stage.
   * @see {@link Canvas#_onDragLeftDrop}
   */
  protected _onDragLeftDrop(event: PIXI.InteractionEvent): void;

  /* -------------------------------------------- */

  /**
   * Cancel a left-click drag workflow originating from the Canvas stage.
   * @param event - (unused)
   * @see {@link Canvas#_onDragLeftDrop}
   */
  protected _onDragLeftCancel(event?: any): void;

  /* -------------------------------------------- */

  /**
   * Handle right mouse-click events which originate from the Canvas stage and are dispatched to this Layer.
   * @param event - (unused)
   * @see {@link Canvas#_onClickRight}
   */
  protected _onClickRight(event?: any): void;

  /* -------------------------------------------- */

  /**
   * Handle mouse-wheel events at the PlaceableObjects layer level to rotate multiple objects at once.
   * This handler will rotate all controlled objects by some incremental angle.
   * @param event - The mousewheel event which originated the request
   */
  protected _onMouseWheel(event: MouseWheelEvent): Promise<Array<Partial<P>> | Partial<P>> | null;

  /* -------------------------------------------- */

  /**
   * Handle a DELETE keypress while a placeable object is hovered
   * @param event - The delete key press event which triggered the request
   *                (unused)
   */
  protected _onDeleteKey(event?: any): Promise<string[]>;
}

declare namespace PlaceablesLayer {
  // TODO: maybe move this somewhere else
  type DataType<P extends PlaceableObject> = P extends PlaceableObject<infer D> ? D : never;

  interface HistoryEvent<P extends PlaceableObject> {
    data: Partial<P>;
    type: HistoryEventType;
  }

  type HistoryEventType = 'create' | 'update' | 'delete';

  interface LayerOptions extends CanvasLayer.LayerOptions {
    /**
     * Does this layer support a mouse-drag workflow to create new objects?
     * @defaultValue whether the user is GM
     */
    canDragCreate: boolean;

    /**
     * Can objects be deleted from this layer?
     * @defaultValue whether the user is GM
     */
    canDelete: boolean;

    /**
     * Can placeable objects in this layer be controlled?
     * @defaultValue `false`
     */
    controllableObjects: boolean;

    /**
     * Can placeable objects in this layer be rotated?
     * @defaultValue `false`
     */
    rotatableObjects: boolean;

    /**
     * Do objects in this layer snap to the grid
     * @defaultValue `true`
     */
    snapToGrid: boolean;

    /**
     * At what numeric grid precision do objects snap?
     * @defaultValue `2`
     */
    gridPrecision: number;

    /**
     * The class used to represent an object on this layer.
     * @defaultValue `null`
     */
    objectClass: PlaceableObject | null;

    /**
     * Does this layer use a quadtree to track object positions?
     * @defaultValue `false`
     */
    quadtree: boolean;

    /**
     * The FormApplication class used to configure objects on this layer.
     * @defaultValue `null`
     */
    sheetClass: FormApplication | null;
  }
}
