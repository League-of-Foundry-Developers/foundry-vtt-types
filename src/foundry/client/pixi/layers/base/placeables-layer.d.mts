import type {
  ArrayOverlaps,
  InexactPartial,
  NullishProps,
  ValueOf,
  FixedInstanceType,
} from "../../../../../utils/index.d.mts";
import type Document from "../../../../common/abstract/document.d.mts";
import type EmbeddedCollection from "../../../../common/abstract/embedded-collection.d.mts";

type ConcretePlaceableOrPlaceableObject<T> = T extends PlaceableObject ? T : PlaceableObject;

declare global {
  /**
   * A subclass of Canvas Layer which is specifically designed to contain multiple PlaceableObject instances,
   * each corresponding to an embedded Document.
   * @typeParam DocumentName - The key of the configuration which defines the object and document class.
   * @typeParam Options      - The type of the options in this layer.
   */
  class PlaceablesLayer<
    DocumentName extends PlaceablesLayer.Type,
    DrawOptions extends PlaceablesLayer.DrawOptions = PlaceablesLayer.DrawOptions,
    TearDownOptions extends PlaceablesLayer.TearDownOptions = PlaceablesLayer.TearDownOptions,
  > extends InteractionLayer<DrawOptions, TearDownOptions> {
    constructor();

    /**
     * Sort order for placeables belonging to this layer
     * @defaultValue `0`
     */
    static SORT_ORDER: number;

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
     * @defaultValue `[]`
     */
    history: Array<CanvasHistory<DocumentName>>;

    /**
     * Keep track of an object copied with CTRL+C which can be pasted later
     * @defaultValue `[]`
     */
    protected _copy: ConcretePlaceableOrPlaceableObject<Document.ConfiguredObjectInstanceForName<DocumentName>>[];

    /**
     * A Quadtree which partitions and organizes Walls into quadrants for efficient target identification.
     */
    quadtree: CanvasQuadtree<
      ConcretePlaceableOrPlaceableObject<Document.ConfiguredObjectInstanceForName<DocumentName>>
    > | null;

    /**
     * @remarks Override not in foundry docs but implicit from layerOptions
     */
    override options: PlaceablesLayer.LayerOptions.Any;

    /**
     * @defaultValue
     * ```js
     * foundry.utils.mergeObject(super.layerOptions, {
     *   baseClass: PlaceablesLayer,
     *   controllableObjects: false,
     *   rotatableObjects: false,
     *   confirmDeleteKey: false,
     *   objectClass: CONFIG[this.documentName]?.objectClass,
     *   quadtree: true,
     * }
     * ```
     */
    static override get layerOptions(): PlaceablesLayer.LayerOptions.Any;

    /**
     * A reference to the named Document type which is contained within this Canvas Layer.
     * @remarks This getter is abstract in {@link PlaceablesLayer}.
     */
    static documentName: PlaceablesLayer.Type;

    /**
     * Creation states affected to placeables during their construction.
     */
    static CREATION_STATES: PlaceablesLayer.CREATION_STATES;

    /**
     * Obtain a reference to the Collection of embedded Document instances within the currently viewed Scene
     */
    get documentCollection(): EmbeddedCollection<
      Document.ConfiguredInstanceForName<DocumentName>,
      Scene.ConfiguredInstance
    > | null;

    /**
     * Define a Container implementation used to render placeable objects contained in this layer
     */
    static get placeableClass(): PlaceableObject.AnyConstructor;

    /**
     * If objects on this PlaceablesLayer have a HUD UI, provide a reference to its instance
     * @remarks Returns `null` unless overridden
     */
    get hud(): BasePlaceableHUD<Document.ConfiguredObjectInstanceForName<DocumentName>> | null;

    /**
     * A convenience method for accessing the placeable object instances contained in this layer
     */
    get placeables(): Document.ConfiguredObjectInstanceForName<DocumentName>[];

    /**
     * An Array of placeable objects in this layer which have the _controlled attribute
     */
    get controlled(): Document.ConfiguredObjectInstanceForName<DocumentName>[];

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
     * Get the maximum sort value of all placeables.
     * @returns The maximum sort value (-Infinity if there are no objects)
     */
    getMaxSort(): number;

    /**
     * Send the controlled objects of this layer to the back or bring them to the front.
     * @param front - Bring to front instead of send to back?
     * @returns Returns true if the layer has sortable object, and false otherwise
     */
    protected _sentToBackOrBringToFront(front: boolean): boolean;

    /**
     * Snaps the given point to grid. The layer defines the snapping behavior.
     * @param point - The point that is to be snapped
     * @returns The snapped point
     */
    getSnappedPoint(point: Canvas.Point): Canvas.Point;

    /**
     * Obtain an iterable of objects which should be added to this PlaceableLayer
     */
    getDocuments():
      | Exclude<this["documentCollection"], null>
      | FixedInstanceType<Document.ConfiguredClassForName<DocumentName>>[];

    protected override _draw(options?: DrawOptions): Promise<void>;

    /**
     * Draw a single placeable object
     * @param document - The Document instance used to create the placeable object
     */
    createObject(
      document: Document.ConfiguredInstanceForName<DocumentName>,
    ): Document.ConfiguredObjectInstanceForName<DocumentName>;

    protected override _tearDown(options?: TearDownOptions): Promise<void>;

    protected override _activate(): void;

    protected override _deactivate(): void;

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
    get(objectId: string): Document.ConfiguredObjectInstanceForName<DocumentName> | undefined;

    /**
     * Acquire control over all PlaceableObject instances which are visible and controllable within the layer.
     *
     * @param options - Options passed to the control method of each object
     *                  (default: `{}`)
     * @returns An array of objects that were controlled
     */
    controlAll(options?: PlaceableObject.ControlOptions): Document.ConfiguredObjectInstanceForName<DocumentName>[];

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
     * This executes a single database operation using Scene#updateEmbeddedDocuments.
     * If rotating only a single object, it is better to use the PlaceableObject.rotate instance method.
     *
     * @param options - Options which configure how multiple objects are rotated
     *                  (default: `{}`)
     * @returns An array of objects which were rotated
     * @throws An error if explicitly provided id is not valid
     * @remarks Overload is necessary to ensure that one of `angle` or `delta` are numeric in `options`
     */
    rotateMany(options?: RotationOptionsWithAngle): Promise<Document.ConfiguredObjectInstanceForName<DocumentName>[]>;
    rotateMany(options?: RotationOptionsWithDelta): Promise<Document.ConfiguredObjectInstanceForName<DocumentName>[]>;

    /**
     * Simultaneously move multiple PlaceableObjects via keyboard movement offsets.
     * This executes a single database operation using Scene#updateEmbeddedDocuments.
     *
     * @param options - Options which configure how multiple objects are moved
     *                  (default: `{}`)
     * @returns An array of objects which were moved during the operation
     * @throws An error if explicitly provided id is not valid
     */
    moveMany(
      /** @remarks can't be NullishProps becuase `dx` and `dy` must be in `[-1, 0, 1]` */
      options?: InexactPartial<MovementOptions>,
    ): Promise<Document.ConfiguredObjectInstanceForName<DocumentName>[]> | undefined;

    /**
     * An internal helper method to identify the array of PlaceableObjects which can be moved or rotated.
     * @param ids           - An explicit array of IDs requested.
     * @param includeLocked - Include locked objects which would otherwise be ignored?
     * @returns An array of objects which can be moved or rotated
     * @throws An error if any explicitly requested ID is not valid
     * @remarks Any non-array input for `ids` will default to using currently controlled objects,
     * allowing you to provide `true` to the includeLocked
     */
    protected _getMovableObjects<const T>(
      ids?: ArrayOverlaps<T, string>,
      includeLocked?: boolean,
    ): Document.ConfiguredObjectInstanceForName<DocumentName>[];

    /**
     * Undo a change to the objects in this layer
     * This method is typically activated using CTRL+Z while the layer is active
     */
    undoHistory(): Promise<Document.ConfiguredInstanceForName<DocumentName>[]>;

    /**
     * A helper method to prompt for deletion of all PlaceableObject instances within the Scene
     * Renders a confirmation dialogue to confirm with the requester that all objects will be deleted
     * @returns An array of Document objects which were deleted by the operation
     * @throws An error if the calling user is not a GM or Assistant GM
     */
    deleteAll(): Promise<undefined | false | null>;

    /**
     * Record a new CRUD event in the history log so that it can be undone later
     * @param type - The event type (create, update, delete)
     * @param data - The object data
     * @throws An error if any of the objects in the `data` array lack an `_id` key
     */
    storeHistory(type: PlaceablesLayer.HistoryEventType, data: Document.ConfiguredSourceForName<DocumentName>[]): void;

    /**
     * Copy currently controlled PlaceableObjects to a temporary Array, ready to paste back into the scene later
     * @returns The Array of copied PlaceableObject instances
     */
    copyObjects(): Document.ConfiguredObjectInstanceForName<DocumentName>[];

    /**
     * Paste currently copied PlaceableObjects back to the layer by creating new copies
     * @param position - The destination position for the copied data.
     * @param options  - Options which modify the paste operation
     * @returns An Array of created PlaceableObject instances
     */
    pasteObjects(
      position: Canvas.Point,
      options?: NullishProps<{
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
    ): Promise<Document.ConfiguredInstanceForName<DocumentName>[]>;

    /**
     * Get the data of the copied object pasted at the position given by the offset.
     * Called by {@link PlaceablesLayer#pasteObjects} for each copied object.
     * @param copy    - The copied object that is pasted
     * @param offset  - The offset relative from the current position to the destination
     * @param options - Options of {@link PlaceablesLayer#pasteObjects}
     * @returns The update data
     */
    _pasteObject(
      copy: Document.ConfiguredObjectInstanceForName<DocumentName>,
      offset: Canvas.Point,
      options?: NullishProps<{
        /**
         * Paste in a hidden state, if applicable.
         * @defaultValue `false`
         */
        hidden: boolean;

        /**
         * Snap to the grid.
         * @defaultValue `true`
         */
        snap: boolean;
      }>,
    ): Document.ConfiguredSourceForName<DocumentName>;

    /**
     * Select all PlaceableObject instances which fall within a coordinate rectangle.
     * @param options        - (default: `{}`)
     * @returns A boolean for whether the controlled set was changed in the operation
     */
    selectObjects(
      /**
       * @remarks Can't be NullishProps because `controlOptions` is passed on to `PlaceableObject#control`
       * which provides  a default of `{}` and then checks for `.releaseOthers` without further checks
       * */
      options?: InexactPartial<
        Canvas.Rectangle & {
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
        }
      >,
      secondOptions?: NullishProps<{
        /**
         * Whether to release other selected objects.
         * @defaultValue `true`
         */
        releaseOthers: boolean;
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
     * @throws An error if the `transformation` paramater is neither a function nor a plain object
     */
    updateAll(
      transformation:
        | ((
            placeable: Document.ConfiguredObjectInstanceForName<DocumentName>,
          ) => Partial<Document.ConfiguredSourceForName<DocumentName>>)
        | Partial<Document.ConfiguredSourceForName<DocumentName>>,
      condition?: ((placeable: Document.ConfiguredObjectInstanceForName<DocumentName>) => boolean) | null,
      options?: Document.OnUpdateOptions<DocumentName>,
    ): Promise<Array<Document.ConfiguredInstanceForName<DocumentName>>>;

    /**
     * Get the world-transformed drop position.
     * @returns Returns the transformed x, y co-ordinates, or false if the drag event was outside the canvas.
     */
    protected _canvasCoordinatesFromDrop(
      event: DragEvent,
      options?: NullishProps<{
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
      createData: Document.ConfiguredSourceForName<DocumentName>,
      options?: NullishProps<{
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
      }>,
    ): Promise<Document.ConfiguredObjectInstanceForName<DocumentName>>;

    protected override _onClickLeft(event: PIXI.FederatedEvent): void;

    protected override _canDragLeftStart(user: User.ConfiguredInstance, event: PIXI.FederatedEvent): boolean;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftDrop(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftCancel(event: PointerEvent): void;

    protected override _onClickRight(event: PIXI.FederatedEvent): void;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    protected override _onMouseWheel(event: WheelEvent): ReturnType<this["rotateMany"]>;

    protected override _onDeleteKey(event: KeyboardEvent): Promise<void>;

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks `"PlaceablesLayer#gridPrecision is deprecated. Use PlaceablesLayer#getSnappedPoint instead of GridLayer#getSnappedPosition and PlaceablesLayer#gridPrecision."`
     */
    get gridPrecision(): number;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks `"PlaceableLayer#_highlight is deprecated. Use PlaceableLayer#highlightObjects instead."`
     */
    get _highlight(): this["highlightObjects"];

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks `"PlaceableLayer#_highlight is deprecated. Use PlaceableLayer#highlightObjects instead."`
     */
    set _highlight(state);
  }

  interface CanvasHistory<DocumentName extends PlaceablesLayer.Type> {
    /**
     * The type of operation stored as history (create, update, delete)
     */
    type: PlaceablesLayer.HistoryEventType;

    /**
     * The data corresponding to the action which may later be un-done
     */
    data: FixedInstanceType<Document.ConfiguredClassForName<DocumentName>>["_source"][];
  }

  type PlaceablesLayerOptions<DocumentName extends Document.PlaceableType> = PlaceablesLayer.LayerOptions<DocumentName>;

  namespace PlaceablesLayer {
    type Any = PlaceablesLayer<any>;

    type AnyConstructor = typeof AnyPlaceablesLayer;

    type Type = Document.PlaceableType;

    type HistoryEventType = "create" | "update" | "delete";

    type CreationState = ValueOf<(typeof PlaceablesLayer)["CREATION_STATES"]>;

    type ConfiguredClassForName<Name extends Document.PlaceableType> = CONFIG[Name]["layerClass"];

    interface DrawOptions extends InteractionLayer.DrawOptions {}

    interface TearDownOptions extends CanvasLayer.DrawOptions {}

    interface CREATION_STATES {
      readonly NONE: 0;
      readonly POTENTIAL: 1;
      readonly CONFIRMED: 2;
      readonly COMPLETED: 3;
    }

    /**
     * @typeParam DocumentName - The key of the configuration which defines the object and document class.
     */
    interface LayerOptions<DocumentName extends Type> extends InteractionLayer.LayerOptions {
      baseClass: typeof PlaceablesLayer;
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
       * Confirm placeable object deletion with a dialog?
       * @defaultValue `false`
       */
      confirmDeleteKey: boolean;

      /**
       * The class used to represent an object on this layer.
       * @defaultValue `CONFIG[this.documentName]?.objectClass`
       */
      objectClass: Document.ConfiguredObjectClassForName<DocumentName>;

      /**
       * Does this layer use a quadtree to track object positions?
       * @defaultValue `true`
       */
      quadtree: boolean;
    }

    namespace LayerOptions {
      type Any = LayerOptions<any>;
    }
  }
}

declare abstract class AnyPlaceablesLayer extends PlaceablesLayer<any> {
  constructor(arg0: never, ...args: never[]);
}

interface RotationOptionsWithDelta {
  /**
   * A target angle of rotation (in degrees) where zero faces "south"
   */
  angle?: number | null | undefined;

  /**
   * An incremental angle of rotation (in degrees)
   */
  delta: number;

  /**
   * Snap the resulting angle to a multiple of some increment (in degrees)
   */
  snap?: number | null | undefined;

  /**
   * An Array of object IDs to target for rotation
   */
  ids?: string[] | null | undefined;

  /**
   * Rotate objects whose documents are locked?
   * @defaultValue `false`
   */
  includeLocked?: boolean | null | undefined;
}

interface RotationOptionsWithAngle {
  /**
   * A target angle of rotation (in degrees) where zero faces "south"
   */
  angle: number;

  /**
   * An incremental angle of rotation (in degrees)
   */
  delta?: number | null | undefined;

  /**
   * Snap the resulting angle to a multiple of some increment (in degrees)
   */
  snap?: number | null | undefined;

  /**
   * An Array of object IDs to target for rotation
   */
  ids?: string[] | null | undefined;

  /**
   * Rotate objects whose documents are locked?
   * @defaultValue `false`
   */
  includeLocked?: boolean | null | undefined;
}

interface MovementOptions {
  /**
   * Horizontal movement direction
   * @defaultValue `0`
   */
  dx: -1 | 0 | 1;

  /**
   * Vertical movement direction
   * @defaultValue `0`
   */
  dy: -1 | 0 | 1;

  /**
   * Rotate the placeable to the keyboard direction instead of moving
   * @defaultValue
   */
  rotate: boolean;

  /**
   * An Array of object IDs to target for movement. The default is the IDs of controlled objects.
   * @defaultValue `this.controlled.filter(o => !o.data.locked).map(o => o.id)`
   */
  ids: string[];

  /**
   * Move objects whose documents are locked?
   * @defaultValue `false`
   */
  includeLocked: boolean;
}
