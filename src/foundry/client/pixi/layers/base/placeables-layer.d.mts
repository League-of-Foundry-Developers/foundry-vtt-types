import type {
  ConfiguredDocumentClassForName,
  ConfiguredObjectClassForName,
  PlaceableDocumentType,
} from "../../../../../types/helperTypes.d.mts";
import type { ConstructorOf, InexactPartial, ValueOf } from "../../../../../types/utils.d.mts";
import type { DocumentOnUpdateOptions } from "../../../../common/abstract/document.d.mts";
import type EmbeddedCollection from "../../../../common/abstract/embedded-collection.d.mts";

type ConcretePlaceableOrPlaceableObject<T> = T extends PlaceableObject ? T : PlaceableObject;

declare global {
  /**
   * A subclass of Canvas Layer which is specifically designed to contain multiple PlaceableObject instances,
   * each corresponding to an embedded Document.
   * @typeParam DocumentName - The key of the configuration which defines the object and document class.
   * @typeParam Options      - The type of the options in this layer.
   */
  class PlaceablesLayer<DocumentName extends PlaceableDocumentType> extends InteractionLayer {
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
    history: Array<CanvasHistory<DocumentName>>;

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

    /**
     * @remarks Override not in foundry docs but implicit from layerOptions
     */
    override options: PlaceablesLayer.LayerOptions<any>;

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
      InstanceType<ConfiguredDocumentClassForName<DocumentName>>,
      Scene.ConfiguredInstance
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
     * Iterates over placeable objects that are eligible for control/select.
     * @remarks yields A placeable object
     */
    // TODO: Update remark with proper @yields tag https://github.com/microsoft/tsdoc/issues/234
    controllableObjects(): Generator<PlaceableObject>;

    /**
     * Track the set of PlaceableObjects on this layer which are currently controlled.
     */
    get controlledObjects(): Map<string, PlaceableObject>;

    /**
     * Track the PlaceableObject on this layer which is currently hovered upon.
     */
    get hover(): PlaceableObject | null;

    set hover(object);

    /**
     * Track whether "highlight all objects" is currently active
     * @defaultValue `false`
     */
    highlightObjects: boolean;

    /**
     * Obtain an iterable of objects which should be added to this PlaceableLayer
     */
    getDocuments():
      | Exclude<this["documentCollection"], null>
      | InstanceType<ConfiguredDocumentClassForName<DocumentName>>[];

    override _draw(options?: Record<string, unknown>): Promise<void>;

    /**
     * Draw a single placeable object
     * @param document - The Document instance used to create the placeable object
     */
    createObject(
      document: InstanceType<ConfiguredDocumentClassForName<DocumentName>>,
    ): InstanceType<ConfiguredObjectClassForName<DocumentName>> | null;

    override _tearDown(options?: Record<string, unknown>): Promise<void>;

    /**
     * Override the default PIXI.Container behavior for how objects in this container are sorted.
     * @internal
     */
    protected _sortObjectsByElevation(): void;

    override _activate(): void;

    override _deactivate(): void;

    /**
     * Clear the contents of the preview container, restoring visibility of original (non-preview) objects.
     */
    clearPreviewContainer(): void;

    /**
     * Get a PlaceableObject contained in this layer by its ID.
     * Returns undefined if the object doesn't exist or if the canvas is not rendering a Scene.
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
      options?: MovementOptions,
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
      data: InstanceType<ConfiguredDocumentClassForName<DocumentName>>["_source"],
    ): void;

    /**
     * Copy currently controlled PlaceableObjects to a temporary Array, ready to paste back into the scene later
     * @returns The Array of copied PlaceableObject instances
     */
    copyObjects(): InstanceType<ConfiguredObjectClassForName<DocumentName>>[];

    /**
     * Paste currently copied PlaceableObjects back to the layer by creating new copies
     * @param position - The destination position for the copied data.
     * @param options  - Options which modify the paste operation
     * @returns An Array of created PlaceableObject instances
     */
    pasteObjects(
      position: Point,
      options?: InexactPartial<{
        /**
         * Paste data in a hidden state, if applicable. Default is false.
         * @defaultValue `false`
         */
        hidden: boolean;

        /**
         * Snap the resulting objects to the grid. Default is true.
         * @defaultValue `true`
         */
        snap: boolean;
      }>,
    ): Promise<InstanceType<ConfiguredDocumentClassForName<DocumentName>>[]>;

    /**
     * Select all PlaceableObject instances which fall within a coordinate rectangle.
     * @param options        - (default: `{}`)
     * @returns A boolean for whether the controlled set was changed in the operation
     */
    selectObjects(
      options?: InexactPartial<{
        /**
         * The top-left x-coordinate of the selection rectangle
         */
        x: number;

        /**
         * The top-left y-coordinate of the selection rectangle
         */
        y: number;

        /**
         * The width of the selection rectangle
         */
        width: number;

        /**
         * The height of the selection rectangle
         */
        height: number;

        /**
         * Optional arguments provided to any called release() method
         * @defaultValue `{}`
         */
        releaseOptions: PlaceableObject.ReleaseOptions;

        /**
         * Optional arguments provided to any called control() method
         * @defaultValue `{ releaseOthers: false }`
         */
        controlOptions: PlaceableObject.ControlOptions;
      }>,
    ): boolean;

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
            placeable: InstanceType<ConfiguredObjectClassForName<DocumentName>>,
          ) => Partial<InstanceType<ConfiguredDocumentClassForName<DocumentName>>["_source"]>)
        | Partial<InstanceType<ConfiguredDocumentClassForName<DocumentName>>["_source"]>,
      condition?: ((placeable: InstanceType<ConfiguredObjectClassForName<DocumentName>>) => boolean) | null,
      options?: DocumentOnUpdateOptions<DocumentName>,
    ): Promise<Array<InstanceType<ConfiguredDocumentClassForName<DocumentName>>>>;

    /**
     * Get the world-transformed drop position.
     * @returns Returns the transformed x, y co-ordinates, or false if the drag event was outside the canvas.
     */
    protected _canvasCoordinatesFromDrop(
      event: DragEvent,
      options?: InexactPartial<{
        /**
         * Return the co-ordinates of the center of the nearest grid element.
         * @defaultValue `true`
         */
        center: boolean;
      }>,
    ): [tx: number, ty: number] | false;

    /**
     * Create a preview of this layer's object type from a world document and show its sheet to be finalized.
     * @param createData - The data to create the object with.
     * @param options    - Options which configure preview creation
     * @returns The created preview object
     */
    protected _createPreview(
      createData: InstanceType<ConfiguredDocumentClassForName<DocumentName>>["_source"],
      options: {
        /**
         * Render the preview object config sheet?
         * @defaultValue `true`
         */
        renderSheet: boolean;

        /**
         * The offset-top position where the sheet should be rendered
         * @defaultValue `0`
         */
        top: number;

        /**
         * The offset-left position where the sheet should be rendered
         * @defaultValue `0`
         */
        left: number;
      },
    ): Promise<DocumentName>;

    protected override _onClickLeft(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): Promise<unknown>;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftDrop(event: PIXI.FederatedEvent): Promise<void>;

    protected override _onDragLeftCancel(event: PointerEvent): void;

    protected override _onClickRight(event: PIXI.FederatedEvent): void;

    protected override _onMouseWheel(event: WheelEvent): void;

    /**
     * @param event - Unused
     */
    protected override _onDeleteKey(event?: KeyboardEvent): Promise<void>;

    /**
     * @deprecated since v11, will be removed in v11
     * @remarks `"PlaceableLayer#_highlight is deprecated. Use PlaceableLayer#highlightObjects instead."`
     */
    get _highlight(): this["highlightObjects"];

    /**
     * @deprecated since v11, will be removed in v11
     * @remarks `"PlaceableLayer#_highlight is deprecated. Use PlaceableLayer#highlightObjects instead."`
     */
    set _highlight(state);
  }

  interface CanvasHistory<DocumentName extends PlaceableDocumentType> {
    /**
     * The type of operation stored as history (create, update, delete)
     */
    type: PlaceablesLayer.HistoryEventType;

    /**
     * The data corresponding to the action which may later be un-done
     */
    data: InstanceType<ConfiguredDocumentClassForName<DocumentName>>["_source"][];
  }

  namespace PlaceablesLayer {
    type HistoryEventType = "create" | "update" | "delete";

    type CreationState = ValueOf<(typeof PlaceablesLayer)["CREATION_STATES"]>;

    /**
     * @typeParam DocumentName - The key of the configuration which defines the object and document class.
     */
    interface LayerOptions<DocumentName extends PlaceableDocumentType> extends InteractionLayer.LayerOptions {
      baseClass: typeof PlaceablesLayer;

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

      /**
       * Are contained objects sorted based on elevation instead of zIndex
       * @defaultValue `false`
       */
      elevationSorting: boolean;
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
