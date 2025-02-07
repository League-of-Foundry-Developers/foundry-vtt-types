import type { Brand, HandleEmptyObject, InexactPartial, IntentionalPartial, NullishProps } from "fvtt-types/utils";
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
  class PlaceablesLayer<DocumentName extends PlaceablesLayer.DocumentNames> extends InteractionLayer {
    /**
     * Sort order for placeables belonging to this layer
     * @defaultValue `0`
     * @remarks Unusused in v12.331
     */
    static SORT_ORDER: number;

    /**
     * Placeable Layer Objects
     * @defaultValue `null`
     * @remarks Set to `new PIXI.Container()` on draw, `null` on tearDown
     */
    objects: PIXI.Container | null;

    /**
     * Preview Object Placement
     * @defaultValue `null`
     * @remarks Only `null` prior to first draw, does not get reset on tearDown
     */
    preview: PIXI.Container | null;

    /**
     * Keep track of history so that CTRL+Z can undo changes
     * @defaultValue `[]`
     */
    history: Array<PlaceablesLayer.HistoryEntry<DocumentName>>;

    /**
     * Keep track of an object copied with CTRL+C which can be pasted later
     * @defaultValue `[]`
     * @privateRemarks Accessed externally in `ClientKeybinds#_onPaste`, which is marked `@private`
     */
    protected _copy: ConcretePlaceableOrPlaceableObject<Document.ConfiguredObjectInstanceForName<DocumentName>>[];

    /**
     * A Quadtree which partitions and organizes Walls into quadrants for efficient target identification.
     * @remarks Is `new CanvasQuadtree()` if `quadtree` is truthy in `this.constructor.layerOptions`, else `null`
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
     * @defaultValue `undefined`
     * @remarks Subclasses must define
     */
    static documentName: PlaceablesLayer.DocumentNames | undefined;

    /**
     * Creation states affected to placeables during their construction.
     */
    static CREATION_STATES: PlaceablesLayer.CreationStates;

    /**
     * Obtain a reference to the Collection of embedded Document instances within the currently viewed Scene
     * @remarks Returns `null` if `canvas.scene` does not have an EmbeddedCollection for the layer's `static documentName`
     */
    get documentCollection(): EmbeddedCollection<
      Document.ConfiguredInstanceForName<DocumentName>,
      Scene.ConfiguredInstance
    > | null;

    /**
     * Define a Container implementation used to render placeable objects contained in this layer
     * @privateRemarks Would be `Document.ConfiguredObjectInstanceForName<DocumentName>` if statics could see type params
     */
    static get placeableClass(): PlaceableObject.AnyConstructor;

    /**
     * If objects on this PlaceablesLayer have a HUD UI, provide a reference to its instance
     * @remarks Returns `null` unless overridden by subclass
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
    get controlledObjects(): Map<string, Document.ConfiguredObjectInstanceForName<DocumentName>>;

    /**
     * Track the PlaceableObject on this layer which is currently hovered upon.
     */
    get hover(): Document.ConfiguredObjectInstanceForName<DocumentName> | null;

    set hover(object);

    /**
     * Track whether "highlight all objects" is currently active
     * @defaultValue `false`
     * @remarks Set by {@link Canvas#highlightObjects}
     */
    highlightObjects: boolean;

    /**
     * Get the maximum sort value of all placeables.
     * @returns The maximum sort value (-Infinity if there are no objects)
     * @remarks Despite the above comment, returns `-Infinity` if the schema of the layer's document lacks a `sort` field, object count is not relevant
     */
    getMaxSort(): number;

    /**
     * Send the controlled objects of this layer to the back or bring them to the front.
     * @param front - Bring to front instead of send to back?
     * @returns Returns true if the layer has sortable object, and false otherwise
     * @remarks Same check as {@link PlaceablesLayer#getMaxSort}
     */
    protected _sendToBackOrBringToFront(front?: boolean | null): boolean;

    /**
     * Snaps the given point to grid. The layer defines the snapping behavior.
     * @param point - The point that is to be snapped
     * @returns The snapped point
     */
    getSnappedPoint(point: Canvas.Point): Canvas.Point;

    /**
     * Obtain an iterable of objects which should be added to this PlaceableLayer
     * @remarks Returns the EmbeddedCollection for this layer's associated Document on the currently viewed scene, or an empty array if not found
     */
    getDocuments(): NonNullable<this["documentCollection"]> | [];

    protected override _draw(options: HandleEmptyObject<PlaceablesLayer.DrawOptions>): Promise<void>;

    /**
     * Draw a single placeable object
     * @param document - The Document instance used to create the placeable object
     */
    createObject(
      document: Document.ConfiguredInstanceForName<DocumentName>,
    ): Document.ConfiguredObjectInstanceForName<DocumentName>;

    protected override _tearDown(options: HandleEmptyObject<PlaceablesLayer.TearDownOptions>): Promise<void>;

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
     * @throws If both `options.angle` and `options.delta` are nullish
     * @remarks Overload is necessary to ensure that one of `angle` or `delta` are numeric in `options`
     */
    rotateMany(
      options: PlaceablesLayer.RotateManyOptionsWithAngle,
    ): Promise<Document.ConfiguredObjectInstanceForName<DocumentName>[]>;
    rotateMany(
      options: PlaceablesLayer.RotateManyOptionsWithDelta,
    ): Promise<Document.ConfiguredObjectInstanceForName<DocumentName>[]>;

    /**
     * Simultaneously move multiple PlaceableObjects via keyboard movement offsets.
     * This executes a single database operation using Scene#updateEmbeddedDocuments.
     *
     * @param options - Options which configure how multiple objects are moved
     *                  (default: `{}`)
     * @returns An array of objects which were moved during the operation
     */
    moveMany(
      options?: PlaceablesLayer.MoveManyOptions,
    ): Promise<Document.ConfiguredObjectInstanceForName<DocumentName>[]> | undefined;

    /**
     * An internal helper method to identify the array of PlaceableObjects which can be moved or rotated.
     * @param ids           - An explicit array of IDs requested.
     * @param includeLocked - Include locked objects which would otherwise be ignored?
     * @returns An array of objects which can be moved or rotated
     * @throws If an array is passed and any of its contents are not a valid ID for a placeable on this layer
     * @remarks Any non-array input for `ids` will default to using currently controlled objects
     */
    protected _getMovableObjects(
      ids?: string[] | null,
      includeLocked?: boolean | null,
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
     * @throws If `!game.user.isGM`
     * @remarks Returns `null` if the dialog spawned is closed by header button, `false` if cancelled by button, `undefined` if confirmed
     */
    deleteAll(): Promise<undefined | false | null>;

    /**
     * Record a new CRUD event in the history log so that it can be undone later
     * @param type - The event type (create, update, delete)
     * @param data - The object data
     * @throws An error if any of the objects in the `data` array lack an `_id` key
     */
    storeHistory<Operation extends Document.Database.Operation>(
      type: Operation,
      data: PlaceablesLayer.HistoryDataFor<Operation, DocumentName>,
    ): void;

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
      options?: PlaceablesLayer.PasteOptions,
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
      options?: PlaceablesLayer.PasteOptions,
    ): Document.ConfiguredSourceForName<DocumentName>;

    /**
     * Select all PlaceableObject instances which fall within a coordinate rectangle.
     * @param options           - (default: `{}`)
     * @param additionalOptions - (default: `{}`)
     * @returns A boolean for whether the controlled set was changed in the operation
     * @remarks Despite being a `={}` parameter, an `options` object with positive `width` and `height` properties
     * is required for reasonable operation
     */
    selectObjects(
      options: PlaceablesLayer.SelectObjectsOptions,
      additionalOptions?: PlaceablesLayer.SelectObjectsAdditionalOptions,
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
          ) => Document.UpdateDataFor<Document.ConfiguredClassForName<DocumentName>>)
        | Document.UpdateDataFor<Document.ConfiguredClassForName<DocumentName>>,
      condition?: ((placeable: Document.ConfiguredObjectInstanceForName<DocumentName>) => boolean) | null,
      options?: PlaceablesLayer.UpdateAllOptions<DocumentName>,
    ): Promise<Array<Document.ConfiguredInstanceForName<DocumentName>>>;

    /**
     * Get the world-transformed drop position.
     * @returns Returns the transformed x, y co-ordinates, or false if the drag event was outside the canvas.
     */
    protected _canvasCoordinatesFromDrop(
      event: DragEvent,
      options?: PlaceablesLayer.CanvasCoordinatesFromDropOptions,
    ): Canvas.PointTuple | false;

    /**
     * Create a preview of this layer's object type from a world document and show its sheet to be finalized.
     * @param createData - The data to create the object with.
     * @param options    - Options which configure preview creation
     * @returns The created preview object
     * @remarks Returns a temporary (`new PlaceableDocument()`) document
     */
    protected _createPreview(
      createData: Document.ConstructorDataFor<Document.ConfiguredClassForName<DocumentName>>,
      options?: PlaceablesLayer.CreatePreviewOptions,
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

  namespace PlaceablesLayer {
    interface Any extends AnyPlaceablesLayer {}
    type AnyConstructor = typeof AnyPlaceablesLayer;

    type DocumentNames = Document.PlaceableType;

    type ConfiguredClassForName<Name extends DocumentNames> = CONFIG[Name]["layerClass"];

    interface DrawOptions extends InteractionLayer.DrawOptions {}

    interface TearDownOptions extends CanvasLayer.DrawOptions {}

    type CREATION_STATES = Brand<number, "PlaceablesLayer.CREATION_STATES">;

    /** Creation states affected to placeables during their construction. */
    interface CreationStates {
      NONE: 0 & CREATION_STATES;
      POTENTIAL: 1 & CREATION_STATES;
      CONFIRMED: 2 & CREATION_STATES;
      COMPLETED: 3 & CREATION_STATES;
    }

    /**
     * @typeParam DocumentName - The key of the configuration which defines the object and document class.
     */
    interface LayerOptions<DocumentName extends DocumentNames> extends InteractionLayer.LayerOptions {
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

    /** @internal */
    type _RotateManyOptions = NullishProps<{
      /**
       * Snap the resulting angle to a multiple of some increment (in degrees)
       * @remarks Passed to {@link PlaceableObject#_updateRotation} where it is checked for `> 0` before being passed to the non-null-safe `Number#toNearest`
       */
      snap: number;
      /**
       * An Array of object IDs to target for rotation
       * @remarks Passed to {@link PlaceablesLayer#_getMovableObjects}
       */
      ids: string[];
      /**
       * Rotate objects whose documents are locked?
       * @defaultValue `false`
       */
      includeLocked: boolean;
    }>;

    /** @internal */
    interface _RotateManyOptionsAngle {
      /**
       * A target angle of rotation (in degrees) where zero faces "south"
       */
      angle: number;
    }

    /** @internal */
    interface _RotateManyOptionsDelta {
      /**
       * An incremental angle of rotation (in degrees)
       */
      delta: number;
    }

    interface RotateManyOptionsWithAngle
      extends _RotateManyOptions,
        NullishProps<_RotateManyOptionsDelta>,
        _RotateManyOptionsAngle {}

    interface RotateManyOptionsWithDelta
      extends _RotateManyOptions,
        NullishProps<_RotateManyOptionsAngle>,
        _RotateManyOptionsDelta {}

    /** @internal */
    type _MoveManyOptions = InexactPartial<{
      /**
       * Horizontal movement direction
       * @defaultValue `0`
       * @remarks Can't be `null` because it only has a parameter default
       */
      dx: -1 | 0 | 1;

      /**
       * Vertical movement direction
       * @defaultValue `0`
       * @remarks Can't be `null` because it only has a parameter default
       */
      dy: -1 | 0 | 1;
    }> &
      NullishProps<{
        /**
         * Rotate the placeable to the keyboard direction instead of moving
         * @defaultValue `false`
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
      }>;

    interface MoveManyOptions extends _MoveManyOptions {}

    /** @privateRemarks Handled like this rather than an interface mapping to avoid extraneous type calculation */
    type HistoryDataFor<Operation extends Document.Database.Operation, DocumentName extends DocumentNames> =
      | (Operation extends "create" ? { _id: string } : never)
      | (Operation extends "update"
          ? Document.UpdateDataFor<Document.ConfiguredClassForName<DocumentName>> & { _id: string }
          : never)
      | (Operation extends "delete"
          ? Document.ConstructorDataFor<Document.ConfiguredClassForName<DocumentName>> & { _id: string }
          : never);

    type HistoryEntry<DocumentName extends DocumentNames> =
      | { type: "create"; data: HistoryDataFor<"create", DocumentName>[] }
      | {
          type: "update";
          data: HistoryDataFor<"update", DocumentName>[];
        }
      | {
          type: "delete";
          data: HistoryDataFor<"delete", DocumentName>[];
        };

    /** @internal */
    type _PasteOptions = NullishProps<{
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
    }>;

    interface PasteOptions extends _PasteOptions {}

    /**
     * @internal
     * @privateRemarks Only marking `x` and `y` from `Canvas.Rectangle` optional, as the `PIXI.Rectangle` defaults of `0` make no sense for `width` or `height` in this context
     */
    type _SelectObjectsOptions = NullishProps<Canvas.Rectangle, "x" | "y"> &
      InexactPartial<{
        /**
         * Optional arguments provided to any called release() method
         * @defaultValue `{}`
         * @remarks Can't be null as it only has a parameter default
         */
        releaseOptions: PlaceableObject.ReleaseOptions;

        /**
         * Optional arguments provided to any called control() method
         * @defaultValue `{}`
         * @remarks Can't be null as it only has a parameter default
         */
        controlOptions: PlaceableObject.ControlOptions;
      }>;

    interface SelectObjectsOptions extends _SelectObjectsOptions {}

    /**
     * @internal
     * @privateRemarks This is functionally identical to `PlaceableObject.ControlOptions`, but only the one key gets checked,
     * and it's not passed on anywhere, so it gets its own type to not cause confusion with `SelectObjectsOptions["controlOptions"]`
     */
    type _SelectObjectAdditionalOptions = NullishProps<{
      /**
       * Whether to release other selected objects.
       * @defaultValue `true`
       */
      releaseOthers: boolean;
    }>;

    interface SelectObjectsAdditionalOptions extends _SelectObjectAdditionalOptions {}

    // TODO: revisit this after docs v2
    type UpdateAllOptions<DocumentName extends DocumentNames> = IntentionalPartial<
      Document.Database.OperationOf<DocumentName, "update">
    >;

    /** @internal */
    type _CanvasCoordinatesFromDropOptions = NullishProps<{
      /**
       * Return the co-ordinates of the center of the nearest grid element.
       * @defaultValue `true`
       */
      center: boolean;
    }>;

    interface CanvasCoordinatesFromDropOptions extends _CanvasCoordinatesFromDropOptions {}

    /** @internal */
    type _CreatePreviewOptions = NullishProps<{
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
    }>;

    interface CreatePreviewOptions extends _CreatePreviewOptions {}
  }
}

declare abstract class AnyPlaceablesLayer extends PlaceablesLayer<PlaceablesLayer.DocumentNames> {
  constructor(arg0: never, ...args: never[]);
}
