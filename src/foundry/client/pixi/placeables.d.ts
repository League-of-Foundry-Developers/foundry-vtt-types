import {
  DataSourceForPlaceable,
  ConfiguredObjectClassForName,
  ConfiguredDocumentClassForName,
  PlaceableDocumentType,
  ConstructorDataType
} from "../../../types/helperTypes";
import EmbeddedCollection from "../../common/abstract/embedded-collection.mjs";

type ConcretePlaceableOrPlaceableObject<T> = T extends PlaceableObject ? T : PlaceableObject;

declare global {
  /**
   * A subclass of Canvas Layer which is specifically designed to contain multiple PlaceableObject instances,
   * each corresponding to an embedded Document.
   * @typeParam DocumentName - The key of the configuration which defines the object and document class.
   * @typeParam Options      - The type of the options in this layer.
   */
  abstract class PlaceablesLayer<
    DocumentName extends PlaceableDocumentType,
    Options extends PlaceablesLayer.LayerOptions<DocumentName> = PlaceablesLayer.LayerOptions<DocumentName>
  > extends CanvasLayer<Options> {
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
    preview: PIXI.Container | null;

    /**
     * Keep track of history so that CTRL+Z can undo changes
     */
    history: Array<
      CanvasHistory<ConcretePlaceableOrPlaceableObject<InstanceType<ConfiguredObjectClassForName<DocumentName>>>>
    >;

    /**
     * Track the PlaceableObject on this layer which is currently being hovered upon
     * @defaultValue `null`
     */
    protected _hover: ConcretePlaceableOrPlaceableObject<
      InstanceType<ConfiguredObjectClassForName<DocumentName>>
    > | null;

    /**
     * Track the set of PlaceableObjects on this layer which are currently controlled by their id
     * @defaultValue `{}`
     * @remarks This is public because it's used from externally by foundry and modules might need to do the same.
     */
    _controlled: Record<string, InstanceType<ConfiguredObjectClassForName<DocumentName>>>;

    /**
     * Keep track of an object copied with CTRL+C which can be pasted later
     * @defaultValue `[]`
     */
    protected _copy: ConcretePlaceableOrPlaceableObject<InstanceType<ConfiguredObjectClassForName<DocumentName>>>[];

    /**
     * A Quadtree which partitions and organizes Walls into quadrants for efficient target identification.
     */
    quadtree: Quadtree<
      ConcretePlaceableOrPlaceableObject<InstanceType<ConfiguredObjectClassForName<DocumentName>>>
    > | null;

    static override get layerOptions(): PlaceablesLayer.LayerOptions<any>;

    /**
     * A reference to the named Document type which is contained within this Canvas Layer.
     * @remarks This getter is abstract in {@link PlaceablesLayer}.
     */
    static documentName: PlaceableDocumentType;

    /**
     * Creation states affected to placeables during their construction.
     */
    static CREATION_STATES: Readonly<{
      NONE: 0;
      POTENTIAL: 1;
      CONFIRMED: 2;
      COMPLETED: 3;
    }>;

    /**
     * Obtain a reference to the Collection of embedded Document instances within the currently viewed Scene
     */
    get documentCollection(): EmbeddedCollection<
      ConfiguredDocumentClassForName<DocumentName>,
      foundry.data.SceneData
    > | null;

    /**
     * Define a Container implementation used to render placeable objects contained in this layer
     */
    static get placeableClass(): ConstructorOf<PlaceableObject>;

    /**
     * Return the precision relative to the Scene grid with which Placeable objects should be snapped
     */
    get gridPrecision(): number;

    /**
     * If objects on this PlaceableLayer have a HUD UI, provide a reference to its instance
     * @remarks Returns `null` unless overridden
     */
    get hud(): BasePlaceableHUD<InstanceType<ConfiguredObjectClassForName<DocumentName>>> | null;

    /**
     * A convenience method for accessing the placeable object instances contained in this layer
     */
    get placeables(): InstanceType<ConfiguredObjectClassForName<DocumentName>>[];

    /**
     * An Array of placeable objects in this layer which have the _controlled attribute
     */
    get controlled(): InstanceType<ConfiguredObjectClassForName<DocumentName>>[];

    /**
     * Obtain an iterable of objects which should be added to this PlaceableLayer
     */
    getDocuments():
      | Exclude<this["documentCollection"], null>
      | InstanceType<ConfiguredDocumentClassForName<DocumentName>>[];

    /**
     * @remarks It returns Promise<this> but is overridden by a subclass in this way.
     */
    override draw(): Promise<this | undefined>;

    /**
     * Draw a single placeable object
     */
    createObject(
      data: InstanceType<ConfiguredDocumentClassForName<DocumentName>>
    ): InstanceType<ConfiguredObjectClassForName<DocumentName>> | null;

    override tearDown(): Promise<this>;

    override activate(): this;

    override deactivate(): this;

    /**
     * Clear the contents of the preview container, restoring visibility of original (non-preview) objects.
     */
    clearPreviewContainer(): void;

    /**
     * Get a PlaceableObject contained in this layer by it's ID
     *
     * @param objectId - The ID of the contained object to retrieve
     * @returns The object instance, or undefined
     */
    get(objectId: string): InstanceType<ConfiguredObjectClassForName<DocumentName>> | undefined;

    /**
     * Acquire control over all PlaceableObject instances which are visible and controllable within the layer.
     *
     * @param options - Options passed to the control method of each object
     *                  (default: `{}`)
     * @returns An array of objects that were controlled
     */
    controlAll(options?: PlaceableObject.ControlOptions): InstanceType<ConfiguredObjectClassForName<DocumentName>>[];

    /**
     * Release all controlled PlaceableObject instance from this layer.
     *
     * @param options - Options passed to the release method of each object
     *                  (default: `{}`)
     * @returns The number of PlaceableObject instances which were released
     */
    releaseAll(options?: PlaceableObject.ReleaseOptions): number;

    /**
     * Simultaneously rotate multiple PlaceableObjects using a provided angle or incremental.
     * This executes a single database operation using Scene.update.
     * If rotating only a single object, it is better to use the PlaceableObject.rotate instance method.
     *
     * @param options - Options which configure how multiple objects are rotated
     *                  (default: `{}`)
     * @returns An array of objects which were rotated
     */
    rotateMany(options?: RotationOptions): Promise<InstanceType<ConfiguredObjectClassForName<DocumentName>>[]>;

    /**
     * Simultaneously move multiple PlaceableObjects via keyboard movement offsets.
     * This executes a single database operation using Scene.update.
     * If moving only a single object, this will delegate to PlaceableObject.update for performance reasons.
     *
     * @param options - Options which configure how multiple objects are moved
     *                  (default: `{}`)
     * @returns An array of objects which were moved during the operation
     */
    moveMany(
      options?: MovementOptions
    ): Promise<InstanceType<ConfiguredObjectClassForName<DocumentName>>[]> | undefined;

    /**
     * Undo a change to the objects in this layer
     * This method is typically activated using CTRL+Z while the layer is active
     */
    undoHistory(): Promise<InstanceType<ConfiguredDocumentClassForName<DocumentName>>[]>;

    /**
     * A helper method to prompt for deletion of all PlaceableObject instances within the Scene
     * Renders a confirmation dialogue to confirm with the requester that all objects will be deleted
     * @returns An array of Document objects which were deleted by the operation
     */
    deleteAll(): Promise<InstanceType<ConfiguredDocumentClassForName<DocumentName>>[] | false | null>;

    /**
     * Record a new CRUD event in the history log so that it can be undone later
     * @param type - The event type (create, update, delete)
     * @param data - The object data
     */
    storeHistory(
      type: PlaceablesLayer.HistoryEventType,
      data: DataSourceForPlaceable<
        ConcretePlaceableOrPlaceableObject<InstanceType<ConfiguredObjectClassForName<DocumentName>>>
      >
    ): void;

    /**
     * Copy currently controlled PlaceableObjects to a temporary Array, ready to paste back into the scene later
     * @returns The Array of copied PlaceableObject instances
     */
    copyObjects(): InstanceType<ConfiguredObjectClassForName<DocumentName>>[];

    /**
     * Paste currently copied PlaceableObjects back to the layer by creating new copies
     * @param position - The destination position for the copied data.
     * @param options  - (default: `{}`);
     * @returns An Array of created PlaceableObject instances
     */
    pasteObjects(
      position: Point,
      options?: PasteOptions
    ): Promise<InstanceType<ConfiguredDocumentClassForName<DocumentName>>[]>;

    /**
     * Select all PlaceableObject instances which fall within a coordinate rectangle.
     * @param options        - (default: `{}`)
     * @returns A boolean for whether the controlled set was changed in the operation
     */
    selectObjects(options?: SelectOptions): boolean;

    /**
     * Update all objects in this layer with a provided transformation.
     * Conditionally filter to only apply to objects which match a certain condition.
     * @param transformation - An object of data or function to apply to all matched objects
     * @param condition      - A function which tests whether to target each object
     *                         (default: `null`)
     * @param options        - Additional options passed to Document.update
     *                         (default: `{}`)
     * @returns An array of updated data once the operation is complete
     */
    updateAll(
      transformation:
        | ((
            placeable: InstanceType<ConfiguredObjectClassForName<DocumentName>>
          ) => Partial<
            DataSourceForPlaceable<
              ConcretePlaceableOrPlaceableObject<InstanceType<ConfiguredObjectClassForName<DocumentName>>>
            >
          >)
        | Partial<
            DataSourceForPlaceable<
              ConcretePlaceableOrPlaceableObject<InstanceType<ConfiguredObjectClassForName<DocumentName>>>
            >
          >,
      condition?: ((placeable: InstanceType<ConfiguredObjectClassForName<DocumentName>>) => boolean) | null,
      options?: DocumentModificationContext
    ): Promise<Array<InstanceType<ConfiguredDocumentClassForName<DocumentName>>>>;

    /**
     * Get the world-transformed drop position.
     * @returns Returns the transformed x, y co-ordinates, or false if the drag event was outside the canvas.
     */
    protected _canvasCoordinatesFromDrop(
      event: DragEvent,
      {
        center
      }?:
        | {
            /**
             * Return the co-ordinates of the center of the nearest grid element.
             * @defaultValue `true`
             */
            center?: boolean | undefined;
          }
        | undefined
    ): [tx: number, ty: number] | false;

    /**
     * Create a preview of this layer's object type from a world document and show its sheet so it can be finalized.
     * @param createData - The data to create the object with.
     * @param position   - The position to render the sheet at.
     */
    protected _createPreview(
      createData: ConstructorDataType<InstanceType<ConfiguredDocumentClassForName<DocumentName>>["data"]>,
      { top, left }: { top: number; left: number }
    ): Promise<void>;

    /**
     * Handle left mouse-click events which originate from the Canvas stage and are dispatched to this Layer.
     * @see {@link Canvas#_onClickLeft}
     */
    protected _onClickLeft(event: PIXI.InteractionEvent): void;

    /**
     * Handle double left-click events which originate from the Canvas stage and are dispatched to this Layer.
     * @see {@link Canvas#_onClickLeft2}
     */
    protected _onClickLeft2(event: PIXI.InteractionEvent): void;

    /**
     * Start a left-click drag workflow originating from the Canvas stage.
     * @see {@link Canvas#_onDragLeftStart}
     */
    protected _onDragLeftStart(event: PIXI.InteractionEvent): void;

    /**
     * Continue a left-click drag workflow originating from the Canvas stage.
     * @see {@link Canvas#_onDragLeftMove}
     */
    protected _onDragLeftMove(event: PIXI.InteractionEvent): void;

    /**
     * Conclude a left-click drag workflow originating from the Canvas stage.
     * @see {@link Canvas#_onDragLeftDrop}
     */
    protected _onDragLeftDrop(event: PIXI.InteractionEvent): void;

    /**
     * Cancel a left-click drag workflow originating from the Canvas stage.
     * @see {@link Canvas#_onDragLeftDrop}
     */
    protected _onDragLeftCancel(event: PointerEvent): void;

    /**
     * Handle right mouse-click events which originate from the Canvas stage and are dispatched to this Layer.
     * @see {@link Canvas#_onClickRight}
     */
    protected _onClickRight(event: PIXI.InteractionEvent): void;

    /**
     * Handle mouse-wheel events at the PlaceableObjects layer level to rotate multiple objects at once.
     * This handler will rotate all controlled objects by some incremental angle.
     * @param event - The mousewheel event which originated the request
     */
    protected _onMouseWheel(event: WheelEvent): void;

    /**
     * Handle a DELETE keypress while a placeable object is hovered
     * @param event - The delete key press event which triggered the request
     */
    protected _onDeleteKey(event?: any): void;
  }

  interface CanvasHistory<Placeable extends PlaceableObject> {
    /**
     * The type of operation stored as history (create, update, delete)
     */
    type: PlaceablesLayer.HistoryEventType;

    /**
     * The data corresponding to the action which may later be un-done
     */
    data: DataSourceForPlaceable<Placeable>[];
  }

  namespace PlaceablesLayer {
    type HistoryEventType = "create" | "update" | "delete";

    type CreationState = ValueOf<typeof PlaceablesLayer["CREATION_STATES"]>;

    /**
     * @typeParam DocumentName - The key of the configuration which defines the object and document class.
     */
    interface LayerOptions<DocumentName extends PlaceableDocumentType> extends CanvasLayer.LayerOptions {
      /**
       * Does this layer support a mouse-drag workflow to create new objects?
       * @defaultValue `game.user.isGM`
       */
      canDragCreate: boolean;

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
       * The class used to represent an object on this layer.
       * @defaultValue `getDocumentClass(this.documentName)`
       */
      objectClass: ConfiguredObjectClassForName<DocumentName>;

      /**
       * Does this layer use a quadtree to track object positions?
       * @defaultValue `true`
       */
      quadtree: boolean;
    }
  }
}

interface RotationOptions {
  /**
   * A target angle of rotation (in degrees) where zero faces "south"
   */
  angle?: number;

  /**
   * An incremental angle of rotation (in degrees)
   */
  delta?: number;

  /**
   * Snap the resulting angle to a multiple of some increment (in degrees)
   */
  snap?: number;

  /**
   * An Array of object IDs to target for rotation
   */
  ids?: string[];
}

interface MovementOptions {
  /**
   * The number of incremental grid units in the horizontal direction
   * @defaultValue `0`
   */
  dx?: number;

  /**
   * The number of incremental grid units in the vertical direction
   * @defaultValue `0`
   */
  dy?: number;

  /**
   * Rotate the token to the keyboard direction instead of moving
   * @defaultValue
   */
  rotate?: boolean;

  /**
   * An Array of object IDs to target for movement
   * @defaultValue `this.controlled.filter(o => !o.data.locked).map(o => o.id)`
   */
  ids?: string[];
}

interface PasteOptions {
  /**
   * Paste data in a hidden state, if applicable. Default is false.
   * @defaultValue `false`
   */
  hidden?: boolean;

  /**
   * Snap the resulting objects to the grid. Default is true.
   * @defaultValue `true`
   */
  snap?: boolean;
}

interface SelectOptions {
  /**
   * The top-left x-coordinate of the selection rectangle
   */
  x?: number;

  /**
   * The top-left y-coordinate of the selection rectangle
   */
  y?: number;

  /**
   * The width of the selection rectangle
   */
  width?: number;

  /**
   * The height of the selection rectangle
   */
  height?: number;

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
}
