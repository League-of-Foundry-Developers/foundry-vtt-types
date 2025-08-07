import type { AnyObject, Brand, FixedInstanceType, Identity, InexactPartial, ToMethod } from "#utils";
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
declare abstract class PlaceablesLayer<out DocumentName extends Document.PlaceableType> extends InteractionLayer {
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
   * Keep track of objects copied with CTRL+C/X which can be pasted later.
   */
  clipboard: PlaceablesLayer.ClipboardData<DocumentName>;

  /**
   * A Quadtree which partitions and organizes Walls into quadrants for efficient target identification.
   * @remarks Is `new CanvasQuadtree()` if `quadtree` is truthy in `this.constructor.layerOptions`, else `null`
   */
  quadtree: CanvasQuadtree<Document.ObjectFor<DocumentName>> | null;

  /** @privateRemarks Fake type override */
  override options: PlaceablesLayer.LayerOptions<Document.ObjectClassFor<DocumentName>>;

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
   * @remarks Keys are {@linkcode PlaceableObject} IDs, and are added/removed in {@linkcode PlaceableObject.control | PlaceableObject#control}
   * and {@linkcode PlaceableObject.release | #release} respectively.
   */
  get controlledObjects(): Map<string, Document.ObjectFor<DocumentName>>;

  /**
   * Track the PlaceableObject on this layer which is currently hovered upon.
   * @defaultValue `null`
   */
  get hover(): Document.ObjectFor<DocumentName> | null;

  set hover(object);

  /**
   * Track whether "highlight all objects" is currently active
   * @defaultValue `false`
   * @remarks Set by {@linkcode _highlightObjects | PlaceablesLayer#_highlightObjects} which gets called by {@link Canvas.highlightObjects | `Canvas#highlightObjects`}
   */
  highlightObjects: boolean;

  /**
   * Get the maximum sort value of all placeables.
   * @returns The maximum sort value (-Infinity if there are no objects)
   * @remarks Also returns `-Infinity` if the schema of the layer's document lacks a `sort` field in its schema
   */
  getMaxSort(): number;

  /**
   * Send the controlled objects of this layer to the back or bring them to the front.
   * @param front - Bring to front instead of send to back?
   * @returns Returns true if the layer has sortable object, and false otherwise
   * @remarks Also returns `false` with no action taken if the layer's document lacks a `sort` field in its schema
   */
  protected _sendToBackOrBringToFront(front?: boolean): boolean;

  /**
   * Snaps the given point to grid. The layer defines the snapping behavior.
   * @param point - The point that is to be snapped
   * @returns The snapped point
   */
  getSnappedPoint(point: Canvas.Point): Canvas.Point;

  protected override _highlightObjects(active: boolean): void;

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
   * @param options - Options passed to the control method of each object (default: `{}`)
   * @returns An array of objects that were controlled
   */
  controlAll(options?: PlaceableObject.ControlOptions): Document.ObjectFor<DocumentName>[];

  /**
   * Release all controlled PlaceableObject instance from this layer.
   *
   * @param options - Options passed to the release method of each object (default: `{}`)
   * @returns The number of PlaceableObject instances which were released
   */
  releaseAll(options?: PlaceableObject.ReleaseOptions): number;

  /**
   * Simultaneously rotate multiple PlaceableObjects using a provided angle or incremental.
   * This executes a single database operation using Scene#updateEmbeddedDocuments.
   * If rotating only a single object, it is better to use the PlaceableObject.rotate instance method.
   *
   * @param options - Options which configure how multiple objects are rotated (default: `{}`)
   * @returns An array of objects which were rotated
   * @remarks Also throws if both `options.angle` and `options.delta` are nullish; the overload is necessary to ensure that one of them is numeric, as neither has a parameter default
   */
  rotateMany(options: PlaceablesLayer.RotateManyOptionsWithAngle): Promise<Document.ObjectFor<DocumentName>[]>;
  rotateMany(options: PlaceablesLayer.RotateManyOptionsWithDelta): Promise<Document.ObjectFor<DocumentName>[]>;

  /**
   * Simultaneously move multiple PlaceableObjects via keyboard movement offsets.
   * This executes a single database operation using Scene#updateEmbeddedDocuments.
   *
   * @param options - Options which configure how multiple objects are moved (default: `{}`)
   * @returns An array of objects which were moved during the operation
   * @throws An error if an explicitly provided id is not valid
   */
  moveMany(options?: PlaceablesLayer.MoveManyOptions): Promise<Document.ObjectFor<DocumentName>[]> | undefined;

  /**
   * Prepare the updates and update options for moving the given placeable objects via keyboard.
   * @see {@linkcode moveMany | PlaceablesLayer#moveMany}
   * @internal
   */
  protected _prepareKeyboardMovementUpdates(
    objects: Document.ObjectFor<DocumentName>[],
    dx: -1 | 0 | 1,
    dy: -1 | 0 | 1,
    dz: -1 | 0 | 1,
  ): PlaceablesLayer.PreparedUpdates<DocumentName>;

  /**
   * Prepare the updates and update options for rotating the given placeable objects via keyboard.
   * @see {@linkcode moveMany | PlaceablesLayer#moveMany}
   * @internal
   */
  protected _prepareKeyboardRotationUpdates(
    objects: Document.ObjectFor<DocumentName>[],
    dx: -1 | 0 | 1,
    dy: -1 | 0 | 1,
    dz: -1 | 0 | 1,
  ): PlaceablesLayer.PreparedUpdates<DocumentName>;

  /**
   * Assign a set of render flags to all placeables in this layer.
   * @param flags - The flags to set
   */
  setAllRenderFlags(flags: PlaceableObject.PassableRenderFlagsFor<DocumentName>): void;

  /**
   * An internal helper method to identify the array of PlaceableObjects which can be moved or rotated.
   * @param ids           - An explicit array of IDs requested.
   * @param includeLocked - Include locked objects which would otherwise be ignored?
   * @returns An array of objects which can be moved or rotated
   * @throws If any explicitly requested ID is not valid
   * @remarks If `ids` is not passed, the currently controlled objects are used
   */
  protected _getMovableObjects(ids?: string[], includeLocked?: boolean): Document.ObjectFor<DocumentName>[];

  /**
   * An internal helper method to identify the array of PlaceableObjects which can be copied/cut.
   * @param options - Additional options
   * @returns An array of objects which can be copied/cut
   * @internal
   */
  protected _getCopyableObjects(options: PlaceablesLayer.GetCopyableObjectsOptions): Document.ObjectFor<DocumentName>[];

  /**
   * Undo a change to the objects in this layer
   * This method is typically activated using CTRL+Z while the layer is active
   */
  undoHistory(): Promise<Document.ImplementationFor<DocumentName>[]>;

  /**
   * Undo creation with deletion workflow
   * @returns An array of documents which were modified by the undo operation
   */
  protected _onUndoCreate(
    event: PlaceablesLayer.CreationHistoryEntry<DocumentName>,
  ): Promise<Document.ImplementationFor<DocumentName>[]>;

  /**
   * Undo updates with update workflow.
   * @returns An array of documents which were modified by the undo operation
   */
  protected _onUndoUpdate(
    event: PlaceablesLayer.UpdateHistoryEntry<DocumentName>,
  ): Promise<Document.ImplementationFor<DocumentName>[]>;

  /**
   * Undo deletion with creation workflow.
   * @returns An array of documents which were modified by the undo operation
   */
  protected _onUndoDelete(
    event: PlaceablesLayer.DeletionHistoryEntry<DocumentName>,
  ): Promise<Document.ImplementationFor<DocumentName>[]>;

  /**
   * A helper method to prompt for deletion of all PlaceableObject instances within the Scene
   * Renders a confirmation dialogue to confirm with the requester that all objects will be deleted
   * @returns An array of Document objects which were deleted by the operation
   * @remarks Returns `null` if the dialog spawned is closed by header button, `false` if cancelled by button, `undefined` if confirmed
   * @throws If `!game.user.isGM`
   */
  deleteAll(): Promise<undefined | false | null>;

  /**
   * Record a new CRUD event in the history log so that it can be undone later. The base implementation calls
   * {@linkcode PlaceablesLayer._storeHistory | PlaceablesLayer#_storeHistory} without passing the given options.
   * Subclasses may override this function and can call `#_storeHistory` themselves to pass options as needed.
   * @param type    - The event type
   * @param data    - The create/update/delete data
   * @param options - The create/update/delete options
   * @remarks See {@linkcode PlaceablesLayer.HistoryEntry} remarks.
   */
  storeHistory<Operation extends Document.Database.Operation>(
    type: Operation,
    data: PlaceablesLayer.HistoryDataFor<Operation, DocumentName>[],
    options?: PlaceablesLayer.HistoryEntry<DocumentName>["options"],
  ): void;

  /**
   * Record a new CRUD event in the history log so that it can be undone later.
   * Updates without changes are filtered out unless the `diff` option is set to false.
   * This function may not be overridden.
   * @param type    - The event type
   * @param data    - The create/update/delete data
   * @param options - The options of the undo operation
   */
  protected _storeHistory<Operation extends Document.Database.Operation>(
    type: Operation,
    data: PlaceablesLayer.HistoryDataFor<Operation, DocumentName>[],
    options?: PlaceablesLayer.HistoryEntry<DocumentName>["options"],
  ): void;

  /**
   * Copy currently controlled {@linkcode PlaceableObject}s to a temporary Array, ready to paste back into the scene later
   * @returns The Array of copied `PlaceableObject` instances
   * @remarks If the current layer doesn't allow objects to be controlled, copies the hovered object.
   */
  copyObjects(options?: PlaceablesLayer.CopyObjectsOptions): Document.ObjectFor<DocumentName>[];

  /**
   * Paste currently copied {@linkcode PlaceableObject}s back to the layer by creating new copies
   * @param position - The destination position for the copied data.
   * @param options  - Options which modify the paste operation
   * @returns An Array of created `PlaceableObject` instances
   */
  pasteObjects(
    position: Canvas.Point,
    options?: PlaceablesLayer.PasteOptions,
  ): Promise<Document.ImplementationFor<DocumentName>[]>;

  /** @deprecated Foundry deleted this method in v13 (this warning will be removed in v14) */
  protected _pasteObject(copy: never, offset: never, options?: never): never;

  /**
   * Select all PlaceableObject instances which fall within a coordinate rectangle.
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
   * @param condition      - A function which tests whether to target each object (default: `null`)
   * @param options        - Additional options passed to Document.update (default: `{}`)
   * @returns An array of updated data once the operation is complete
   * @throws An error if the `transformation` parameter is neither a function nor a plain object
   */
  updateAll(
    transformation: PlaceablesLayer.UpdateAllTransformation<DocumentName>,
    condition?: PlaceablesLayer.UpdateAllCondition<DocumentName> | null,
    options?: PlaceablesLayer.UpdateAllOptions<DocumentName>,
  ): Promise<Array<Document.ImplementationFor<DocumentName>>>;

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
   * @remarks Returns a temporary (`new CanvasDocument()`) document
   */
  protected _createPreview(
    createData: Document.CreateDataForName<DocumentName>,
    options?: PlaceablesLayer.CreatePreviewOptions,
  ): Promise<Document.ObjectFor<DocumentName>>;

  protected override _onClickLeft(event: Canvas.Event.Pointer): void;

  protected override _canDragLeftStart(user: User.Implementation, event: Canvas.Event.Pointer): boolean;

  protected override _onDragLeftStart(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftMove(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftDrop(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  protected override _onClickRight(event: Canvas.Event.Pointer): void;

  /**
   * @remarks {@linkcode foundry.canvas.layers.LightingLayer | LightingLayer} and
   * {@linkcode foundry.canvas.layers.TemplateLayer | TemplateLayer} return single
   * Documents instead of an array
   */
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  protected override _onMouseWheel(
    event: Canvas.Event.Wheel,
  ): Promise<Document.ObjectFor<DocumentName>[] | Document.ObjectFor<DocumentName>> | void;

  protected override _onDeleteKey(event: KeyboardEvent): boolean;

  /**
   * Confirm deletion via the delete key. Called only if {@linkcode PlaceablesLayer.LayerOptions.confirmDeleteKey} is true.
   * @param documents - The documents that will be deleted on confirmation.
   * @returns True if the deletion is confirmed to proceed.
   */
  protected _confirmDeleteKey(documents: Document.ImplementationFor<DocumentName>[]): Promise<boolean>;

  protected override _onSelectAllKey(event: KeyboardEvent): boolean;

  protected override _onDismissKey(event: KeyboardEvent): boolean;

  protected override _onUndoKey(event: KeyboardEvent): boolean;

  protected override _onCutKey(event: KeyboardEvent): boolean;

  protected override _onCopyKey(event: KeyboardEvent): boolean;

  protected override _onPasteKey(event: KeyboardEvent): boolean;

  /**
   * @deprecated "`PlaceablesLayer#gridPrecision` is deprecated. Use {@linkcode PlaceablesLayer.getSnappedPoint | PlaceablesLayer#getSnappedPoint} instead of
   * {@linkcode foundry.canvas.layers.GridLayer.getSnappedPosition | GridLayer#getSnappedPosition} and `PlaceablesLayer#gridPrecision`." (since v12, until v14)
   */
  get gridPrecision(): number;

  /** @privateRemarks Included so inference of the Name always works */
  #documentName: DocumentName;

  #PlaceablesLayer: true;
}

declare namespace PlaceablesLayer {
  interface Any extends AnyPlaceablesLayer {}
  interface AnyConstructor extends Identity<typeof AnyPlaceablesLayer> {}

  /** @deprecated Use {@linkcode Document.PlaceableType} */
  type DocumentNames = Document.PlaceableType;

  type ImplementationClassFor<Name extends Document.PlaceableType> =
    CONFIG["Canvas"]["layers"][DocumentNameToLayerNameMap[Name]]["layerClass"];
  type ImplementationFor<Name extends Document.PlaceableType> = FixedInstanceType<ImplementationClassFor<Name>>;

  interface DocumentNameToLayerNameMap {
    AmbientLight: "lighting";
    AmbientSound: "sounds";
    Drawing: "drawings";
    MeasuredTemplate: "templates";
    Note: "notes";
    Region: "regions";
    Tile: "tiles";
    Token: "tokens";
    Wall: "walls";
  }

  type DocumentNameOf<ConcretePlaceablesLayer extends PlaceablesLayer.Any> =
    ConcretePlaceablesLayer extends PlaceablesLayer<infer DocumentName> ? DocumentName : never;

  type ObjectOf<ConcretePlaceablesLayer extends PlaceablesLayer.Any> = Document.ObjectFor<
    DocumentNameOf<ConcretePlaceablesLayer>
  >;

  type CREATION_STATES = Brand<number, "PlaceablesLayer.CREATION_STATES">;

  interface ClipboardData<DocumentName extends Document.PlaceableType> {
    /** @defaultValue `[]` */
    objects: Document.ObjectClassFor<DocumentName>[];

    /**
     * @defaultValue `false`
     * @remarks Was {@linkcode objects} populated by a `cut` event, rather than a `copy`?
     */
    cut: boolean;
  }

  /** Creation states affected to placeables during their construction. */
  interface CreationStates {
    NONE: 0 & CREATION_STATES;
    POTENTIAL: 1 & CREATION_STATES;
    CONFIRMED: 2 & CREATION_STATES;
    COMPLETED: 3 & CREATION_STATES;
  }

  interface LayerOptions<ConcretePlaceableClass extends PlaceableObject.AnyConstructor>
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
    objectClass: ConcretePlaceableClass;

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
  type _RotateManyOptions = InexactPartial<{
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
      InexactPartial<_RotateManyOptionsDelta>,
      _RotateManyOptionsAngle {}

  interface RotateManyOptionsWithDelta
    extends _RotateManyOptions,
      InexactPartial<_RotateManyOptionsAngle>,
      _RotateManyOptionsDelta {}

  /** @internal */
  type _MoveManyOptions = InexactPartial<{
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
     * Movement direction along the z-axis (elevation)
     * @defaultValue `0`
     */
    dz: -1 | 0 | 1;

    /**
     * Rotate the placeable to the keyboard direction instead of moving
     * @defaultValue `false`
     */
    rotate: boolean;

    /**
     * An Array of object IDs to target for movement. The default is the IDs of controlled objects.
     * @remarks Passed to {@linkcode PlaceablesLayer._getMovableObjects | PlaceablesLayer#_getMovableObjects}
     */
    ids: string[];

    /**
     * Move objects whose documents are locked?
     * @defaultValue `false`
     */
    includeLocked: boolean;
  }>;

  interface MoveManyOptions extends _MoveManyOptions {}

  type PreparedUpdates<DocumentName extends Document.PlaceableType> = [
    /**
     * @remarks An array of position or rotation updates, keys being `_id` and either
     * {@linkcode PlaceableObject._getShiftedPosition | ...placeable._getShiftedPosition(dx, dy, dz)}
     * or `rotation`
     */
    updates: Document.UpdateDataForName<DocumentName>[],

    /**
     * @remarks Update operation options for the given placeable. As of 13.346, core only provides this in
     * {@linkcode foundry.canvas.placeables.Token._prepareKeyboardMovementUpdates | Token#_prepareKeyboardMovementUpdates}
     */
    options?: Document.Database.UpdateOptionsFor<DocumentName>,
  ];

  interface GetCopyableObjectsOptions {
    /**
     * Cut instead of copy?
     * @remarks Despite being marked required in {@linkcode PlaceablesLayer._getCopyableObjects | PlaceablesLayer#_getCopyableObjects},
     * no core implementation makes use of this property.
     */
    cut: boolean;
  }

  /** @privateRemarks Handled like this rather than an interface mapping to avoid extraneous type calculation */
  type HistoryDataFor<Operation extends Document.Database.Operation, DocumentName extends Document.PlaceableType> =
    | (Operation extends "create" ? { _id: string } : never)
    | (Operation extends "update" ? Document.UpdateDataForName<DocumentName> & { _id: string } : never)
    | (Operation extends "delete" ? Document.CreateDataForName<DocumentName> & { _id: string } : never);

  /**
   * @remarks Because {@linkcode PlaceablesLayer.storeHistory | PlaceablesLayer#storeHistory} does *not* pass `options` along to
   * {@linkcode PlaceablesLayer._storeHistory | #_storeHistory}, but {@linkcode foundry.canvas.placeables.Token.storeHistory | Token#storeHistory}
   * does, the `options` of any given entry will be `{}` (the `#_storeHistory` parameter default) unless it is a Token update involving movement,
   * specifically.
   */
  type HistoryEntry<DocumentName extends Document.PlaceableType> =
    | CreationHistoryEntry<DocumentName>
    | UpdateHistoryEntry<DocumentName>
    | DeletionHistoryEntry<DocumentName>;

  interface CreationHistoryEntry<DocumentName extends Document.PlaceableType> {
    type: "create";
    data: HistoryDataFor<"create", DocumentName>[];
    options: Document.Database.DeleteOptionsFor<DocumentName>;
  }

  interface UpdateHistoryEntry<DocumentName extends Document.PlaceableType> {
    type: "update";
    data: HistoryDataFor<"update", DocumentName>[];
    options: Document.Database.UpdateOptionsFor<DocumentName>;
  }

  interface DeletionHistoryEntry<DocumentName extends Document.PlaceableType> {
    type: "delete";
    data: HistoryDataFor<"delete", DocumentName>[];
    options: Document.Database.CreateOptionsFor<DocumentName>;
  }

  /** @internal */
  type _CopyObjectsOptions = InexactPartial<{
    /**
     * Cut instead of copy?
     * @defaultValue `false`
     */
    cut: boolean;
  }>;

  interface CopyObjectsOptions extends _CopyObjectsOptions {}

  /** @internal */
  type _PasteOptions = InexactPartial<{
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

  /** @internal */
  type _SelectObjectsOptions = InexactPartial<{
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

  interface SelectObjectsOptions extends _SelectObjectsOptions {
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
  }

  /**
   * This is functionally identical to {@linkcode PlaceableObject.ControlOptions}, but only the one key gets checked,
   * and it's not passed on anywhere, so it gets its own type to not cause confusion with {@linkcode SelectObjectsOptions.controlOptions}
   * @internal
   */
  type _SelectObjectAdditionalOptions = InexactPartial<{
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
  type _CanvasCoordinatesFromDropOptions = InexactPartial<{
    /**
     * Return the co-ordinates of the center of the nearest grid element.
     * @defaultValue `true`
     */
    center: boolean;
  }>;

  interface CanvasCoordinatesFromDropOptions extends _CanvasCoordinatesFromDropOptions {}

  /** @internal */
  type _CreatePreviewOptions = InexactPartial<{
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
