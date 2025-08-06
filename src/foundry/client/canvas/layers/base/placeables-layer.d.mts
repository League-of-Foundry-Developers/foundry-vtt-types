import type { AnyObject, Brand, Identity, InexactPartial, NullishProps, ToMethod } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type EmbeddedCollection from "#common/abstract/embedded-collection.d.mts";
import type { InteractionLayer } from "../_module.d.mts";
import type { CanvasQuadtree } from "#client/canvas/geometry/_module.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";

/**
 * A subclass of Canvas Layer which is specifically designed to contain multiple PlaceableObject instances,
 * each corresponding to an embedded Document.
 * @template DocumentName - The key of the configuration which defines the object and document class.
 * @template Options      - The type of the options in this layer.
 */
declare class PlaceablesLayer<out DocumentName extends Document.PlaceableType> extends InteractionLayer {
  /**
   * Sort order for placeables belonging to this layer
   * @defaultValue `0`
   * @remarks Unused in v12.331
   */
  static SORT_ORDER: number;

  /**
   * Placeable Layer Objects
   * @defaultValue `null`
   * @remarks Set to `new PIXI.Container()` on draw, `null` on tearDown
   */
  objects: PIXI.Container | null;

  /**
   * Preview container for config previews
   * @defaultValue `null`
   * @remarks Only `null` prior to first draw, does not get reset on tearDown
   */
  protected _configPreview: PIXI.Container | null;

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
  history: PlaceablesLayer.HistoryEntry<DocumentName>[];

  /**
   * Keep track of an object copied with CTRL+C which can be pasted later
   * @deprecated Replaced with {@linkcode PlaceablesLayer.clipboard}
   */
  protected _copy: never;

  /**
   * A Quadtree which partitions and organizes Walls into quadrants for efficient target identification.
   * @remarks Is `new CanvasQuadtree()` if `quadtree` is truthy in `this.constructor.layerOptions`, else `null`
   */
  // TODO: If dynamic static stuff can be worked out, this can be conditional on `options.quadtree`
  quadtree: CanvasQuadtree<Document.ObjectFor<DocumentName>> | null;

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
   * @abstract
   */
  static documentName: Document.PlaceableType;

  /**
   * Creation states affected to placeables during their construction.
   */
  static CREATION_STATES: PlaceablesLayer.CreationStates;

  /**
   * Obtain a reference to the Collection of embedded Document instances within the currently viewed Scene
   * @remarks Returns `null` if `canvas.scene` does not have an EmbeddedCollection for the layer's `static documentName`
   */
  get documentCollection(): EmbeddedCollection<Document.ImplementationFor<DocumentName>, Scene.Implementation> | null;

  /**
   * Define a Container implementation used to render placeable objects contained in this layer
   * @privateRemarks Would be `Document.ConfiguredObjectInstanceForName<DocumentName>` if statics could see type params
   */
  static get placeableClass(): PlaceableObject.AnyConstructor;

  /**
   * If objects on this PlaceablesLayer have a HUD UI, provide a reference to its instance
   * @remarks Returns `null` unless overridden by subclass
   */
  get hud(): foundry.applications.hud.BasePlaceableHUD<Document.ObjectFor<DocumentName>> | null;

  /**
   * A convenience method for accessing the placeable object instances contained in this layer
   */
  get placeables(): Document.ObjectFor<DocumentName>[];

  /**
   * An Array of placeable objects in this layer which have the _controlled attribute
   */
  get controlled(): Document.ObjectFor<DocumentName>[];

  /**
   * Iterates over placeable objects that are eligible for control/select.
   * @yields A placeable object
   */
  controllableObjects(): Generator<PlaceableObject.Any, void, undefined>;

  /**
   * Track the set of PlaceableObjects on this layer which are currently controlled.
   */
  get controlledObjects(): Map<string, Document.ObjectFor<DocumentName>>;

  /**
   * Track the PlaceableObject on this layer which is currently hovered upon.
   */
  get hover(): Document.ObjectFor<DocumentName> | null;

  set hover(object);

  /**
   * Track whether "highlight all objects" is currently active
   * @defaultValue `false`
   * @remarks Set by {@link Canvas.highlightObjects | `Canvas#highlightObjects`}
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
   * @remarks Same check as {@link PlaceablesLayer.getMaxSort | `PlaceablesLayer#getMaxSort`}
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

  protected override _draw(options: AnyObject): Promise<void>;

  /**
   * Draw a single placeable object
   * @param document - The Document instance used to create the placeable object
   */
  createObject(document: Document.ImplementationFor<DocumentName>): Document.ObjectFor<DocumentName>;

  protected override _tearDown(options: AnyObject): Promise<void>;

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
  get(objectId: string): Document.ObjectFor<DocumentName> | undefined;

  /**
   * Acquire control over all PlaceableObject instances which are visible and controllable within the layer.
   *
   * @param options - Options passed to the control method of each object
   *                  (default: `{}`)
   * @returns An array of objects that were controlled
   */
  controlAll(
    options?: PlaceableObject.ControlOptions, // not:null (property set on it without checks)
  ): Document.ObjectFor<DocumentName>[];

  /**
   * Release all controlled PlaceableObject instance from this layer.
   *
   * @param options - Options passed to the release method of each object
   *                  (default: `{}`)
   * @returns The number of PlaceableObject instances which were released
   */
  releaseAll(
    options?: PlaceableObject.ReleaseOptions, // not:null (`Placeable#release` behaviour depends on subclasses, cannot assume null allowed)
  ): number;

  /**
   * Simultaneously rotate multiple PlaceableObjects using a provided angle or incremental.
   * This executes a single database operation using Scene#updateEmbeddedDocuments.
   * If rotating only a single object, it is better to use the PlaceableObject.rotate instance method.
   *
   * @param options - Options which configure how multiple objects are rotated
   *                  (default: `{}`)
   * @returns An array of objects which were rotated
   * @throws If both `options.angle` and `options.delta` are nullish
   * @remarks Overload is necessary to ensure that one of `angle` or `delta` are numeric in `options`, as neither has a parameter default
   */
  rotateMany(options: PlaceablesLayer.RotateManyOptionsWithAngle): Promise<Document.ObjectFor<DocumentName>[]>;
  rotateMany(options: PlaceablesLayer.RotateManyOptionsWithDelta): Promise<Document.ObjectFor<DocumentName>[]>;

  /**
   * Simultaneously move multiple PlaceableObjects via keyboard movement offsets.
   * This executes a single database operation using Scene#updateEmbeddedDocuments.
   *
   * @param options - Options which configure how multiple objects are moved
   *                  (default: `{}`)
   * @returns An array of objects which were moved during the operation
   * @throws If an array is passed for `ids` and any of its contents are not a valid ID for a placeable on this layer
   */
  moveMany(
    options?: PlaceablesLayer.MoveManyOptions, // not:null (destructured)
  ): Promise<Document.ObjectFor<DocumentName>[]> | undefined;

  /**
   * An internal helper method to identify the array of PlaceableObjects which can be moved or rotated.
   * @param ids           - An explicit array of IDs requested.
   * @param includeLocked - Include locked objects which would otherwise be ignored?
   * @returns An array of objects which can be moved or rotated
   * @throws If an array is passed for `ids` and any of its contents are not a valid ID for a placeable on this layer
   * @remarks Any non-array input for `ids` will default to using currently controlled objects
   */
  protected _getMovableObjects(
    ids?: string[] | null,
    includeLocked?: boolean | null,
  ): Document.ObjectFor<DocumentName>[];

  /**
   * Undo a change to the objects in this layer
   * This method is typically activated using CTRL+Z while the layer is active
   */
  undoHistory(): Promise<Document.ImplementationFor<DocumentName>[]>;

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
   * @remarks If the current layer doesn't allow objects to be controlled, copies the hovered object.
   */
  copyObjects(): Document.ObjectFor<DocumentName>[];

  /**
   * Paste currently copied PlaceableObjects back to the layer by creating new copies
   * @param position - The destination position for the copied data.
   * @param options  - Options which modify the paste operation
   * @returns An Array of created PlaceableObject instances
   */
  pasteObjects(
    position: Canvas.Point,
    options?: PlaceablesLayer.PasteOptions, // not:null (destructured)
  ): Promise<Document.ImplementationFor<DocumentName>[]>;

  /** @deprecated Foundry deleted this method in v13 (this warning will be removed in v14) */
  protected _pasteObject(copy: never, offset: never, options?: never): never;

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
    additionalOptions?: PlaceablesLayer.SelectObjectsAdditionalOptions, // not:null (destructured)
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
   * @throws An error if the `transformation` parameter is neither a function nor a plain object
   */
  updateAll(
    transformation: PlaceablesLayer.UpdateAllTransformation<DocumentName>,
    condition?: PlaceablesLayer.UpdateAllCondition<DocumentName> | null,
    options?: PlaceablesLayer.UpdateAllOptions<DocumentName>, // not:null (updateEmbeddedDocuments tries to set `parent` on it)
  ): Promise<Array<Document.ImplementationFor<DocumentName>>>;

  /**
   * Get the world-transformed drop position.
   * @returns Returns the transformed x, y co-ordinates, or false if the drag event was outside the canvas.
   */
  protected _canvasCoordinatesFromDrop(
    event: DragEvent,
    options?: PlaceablesLayer.CanvasCoordinatesFromDropOptions, // not:null (destructured)
  ): Canvas.PointTuple | false;

  /**
   * Create a preview of this layer's object type from a world document and show its sheet to be finalized.
   * @param createData - The data to create the object with.
   * @param options    - Options which configure preview creation
   * @returns The created preview object
   * @remarks Returns a temporary (`new PlaceableDocument()`) document
   */
  protected _createPreview(
    createData: Document.CreateDataForName<DocumentName>,
    options?: PlaceablesLayer.CreatePreviewOptions, // not:null (destructured)
  ): Promise<Document.ObjectFor<DocumentName>>;

  protected override _onClickLeft(event: Canvas.Event.Pointer): void;

  protected override _canDragLeftStart(user: User.Implementation, event: Canvas.Event.Pointer): boolean;

  protected override _onDragLeftStart(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftMove(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftDrop(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  protected override _onClickRight(event: Canvas.Event.Pointer): void;

  /** @privateRemarks `void` added to return union for TokenLayer reasons */
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  protected override _onMouseWheel(
    event: Canvas.Event.Wheel,
  ): Promise<Document.ObjectFor<DocumentName>[] | Document.ObjectFor<DocumentName>> | void;

  // protected override _onDeleteKey(event: Canvas.Event.DeleteKey): Promise<void>;

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

  #documentName: DocumentName;
}

declare namespace PlaceablesLayer {
  interface Any extends AnyPlaceablesLayer {}
  interface AnyConstructor extends Identity<typeof AnyPlaceablesLayer> {}

  /** @deprecated Use {@linkcode Document.PlaceableType} */
  type DocumentNames = Document.PlaceableType;

  // type ImplementationClassFor<Name extends Document.PlaceableType> =
  type ImplementationFor<Name extends Document.PlaceableType> = DocumentNameToLayerMap[Name];

  /**
   * No constraint on T, unlike {@linkcode DocumentNameOf}; use that instead if possible
   * @internal
   */
  type _LayerClassName<T> = T extends abstract new (...args: never) => PlaceablesLayer<infer Name> ? Name : never;

  type DocumentNameToLayerMap = {
    [K in keyof typeof CONFIG.Canvas.layers as _LayerClassName<
      (typeof CONFIG.Canvas.layers)[K]["layerClass"]
    >]: (typeof CONFIG.Canvas.layers)[K]["layerClass"];
  };

  type DocumentNameOf<ConcretePlaceablesLayer extends PlaceablesLayer.Any> =
    ConcretePlaceablesLayer extends PlaceablesLayer<infer DocumentName> ? DocumentName : never;

  type ObjectOf<ConcretePlaceablesLayer extends PlaceablesLayer.Any> = Document.ObjectFor<
    DocumentNameOf<ConcretePlaceablesLayer>
  >;

  type CREATION_STATES = Brand<number, "PlaceablesLayer.CREATION_STATES">;

  /** Creation states affected to placeables during their construction. */
  interface CreationStates {
    NONE: 0 & CREATION_STATES;
    POTENTIAL: 1 & CREATION_STATES;
    CONFIRMED: 2 & CREATION_STATES;
    COMPLETED: 3 & CREATION_STATES;
  }

  interface LayerOptions<ConcretePlaceable extends PlaceableObject.AnyConstructor>
    extends InteractionLayer.LayerOptions {
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
    objectClass: ConcretePlaceable;

    /**
     * Does this layer use a quadtree to track object positions?
     * @defaultValue `true`
     */
    quadtree: boolean;
  }

  namespace LayerOptions {
    interface Any extends LayerOptions<any> {}
  }

  /** @internal */
  type _RotateManyOptions = NullishProps<{
    /**
     * Snap the resulting angle to a multiple of some increment (in degrees)
     * @remarks Passed to {@link PlaceableObject._updateRotation | `PlaceableObject#_updateRotation`} where it is checked for `> 0` before being passed to the non-null-safe `Number#toNearest`
     */
    snap: number;

    /**
     * An Array of object IDs to target for rotation
     * @remarks Passed to {@link PlaceablesLayer._getMovableObjects | `PlaceablesLayer#_getMovableObjects`}
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
  type HistoryDataFor<Operation extends Document.Database.Operation, DocumentName extends Document.PlaceableType> =
    | (Operation extends "create" ? { _id: string } : never)
    | (Operation extends "update" ? Document.UpdateDataForName<DocumentName> & { _id: string } : never)
    | (Operation extends "delete" ? Document.CreateDataForName<DocumentName> & { _id: string } : never);

  type HistoryEntry<DocumentName extends Document.PlaceableType> =
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
   */
  type _SelectObjectsOptions = {
    /**
     * The top-left x-coordinate of the selection rectangle.
     * @remarks Foundry marked optional. Ignored as the default of 0 is questionable.
     */
    x: number;

    /**
     * The top-left y-coordinate of the selection rectangle.
     * @remarks Foundry marked optional. Ignored as the default of 0 is questionable.
     */
    y: number;

    /**
     * The width of the selection rectangle.
     * @remarks Foundry marked optional. Ignored as the default of 0 is questionable.
     */
    width: number;

    /**
     * The height of the selection rectangle.
     * @remarks Foundry marked optional. Ignored as the default of 0 is questionable.
     */
    height: number;
  } & InexactPartial<{
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

  // Note(LukeAbby): This uses `ToMethod` for variance reasons. Specifically this should be
  // covariant over `DocumentName`.
  type UpdateAllTransformation<DocumentName extends Document.PlaceableType> =
    | ToMethod<(placeable: Document.ObjectFor<DocumentName>) => Document.UpdateDataForName<DocumentName>>
    | Document.UpdateDataForName<DocumentName>;

  type UpdateAllCondition<DocumentName extends Document.PlaceableType> = (
    placeable: Document.ObjectFor<DocumentName>,
  ) => boolean;

  type UpdateAllOptions<DocumentName extends Document.PlaceableType> =
    Document.Database.UpdateOperationForName<DocumentName>;

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

export default PlaceablesLayer;

declare abstract class AnyPlaceablesLayer extends PlaceablesLayer<Document.PlaceableType> {
  constructor(...args: never);
}
