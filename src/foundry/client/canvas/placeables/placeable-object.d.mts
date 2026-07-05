import type {
  Identity,
  InterfaceToObject,
  HandleEmptyObject,
  InexactPartial,
  Titlecase,
  GetKey,
  FixedInstanceType,
} from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { Token, Wall } from "./_module.d.mts";
import type { ControlIcon } from "#client/canvas/containers/_module.d.mts";
import type { Document } from "#common/abstract/_module.d.mts";
import {
  MouseInteractionManager,
  RenderFlagsMixin,
  RenderFlags,
  type RenderFlag,
} from "#client/canvas/interaction/_module.mjs";
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";
import type { PlaceablesLayer } from "#client/canvas/layers/_module.d.mts";
import type { BaseGrid } from "#common/grid/_module.d.mts";

/**
 * An Abstract Base Class which defines a Placeable Object which represents a Document placed on the Canvas
 */
declare abstract class PlaceableObject<
  CanvasDocument extends PlaceableObject.AnyCanvasDocument = PlaceableObject.AnyCanvasDocument,
  // Note(LukeAbby): The generic parameter being required to be provided is due to
  // https://github.com/microsoft/TypeScript/issues/61633
> extends RenderFlagsMixin<typeof PIXI.Container>(PIXI.Container) {
  /**
   * @param document - The Document instance which is represented by this object
   */
  constructor(document: CanvasDocument);

  /**
   * Retain a reference to the Scene within which this Placeable Object resides
   * @privateRemarks Not defined in the class body, set during construction
   */
  scene: Scene.Implementation;

  /**
   * A reference to the Scene embedded Document instance which this object represents
   * @privateRemarks Not defined in the class body, set during construction
   */
  document: CanvasDocument;

  /**
   * A control icon for interacting with the object
   * @defaultValue `null`
   * @remarks Set to `null` in {@linkcode PlaceableObject | PlaceableObject#constructor} and
   * {@linkcode AmbientSound.clear | AmbientSound#clear}.
   *
   * In placeables which render an icon ({@linkcode AmbientLight}, {@linkcode AmbientSound},
   * {@linkcode Note}, and {@linkcode MeasuredTemplate}), it's only `null` prior to first draw; In all others, it is never set to other than `null`
   *
   * @privateRemarks Not defined in the class body, set during construction
   */
  controlIcon: ControlIcon | null;

  /**
   * A mouse interaction manager instance which handles mouse workflows related to this object.
   * @defaultValue `null`
   * @privateRemarks Not defined in the class body, set during construction
   */
  mouseInteractionManager: MouseInteractionManager<this> | null;

  /**
   * Allow objects to be culled when off-screen
   * @defaultValue `false`
   * @privateRemarks Override of `PIXI.Container` property in the constructor, only typed here for the defaultValue
   */
  override cullable: boolean;

  /**
   * Identify the official Document name for this PlaceableObject class
   * @remarks This is abstract in {@linkcode PlaceableObject}.
   */
  static embeddedName: string;

  /**
   * Return a reference to the configured subclass of this base `PlaceableObject` type.
   */
  static get implementation(): PlaceableObject.AnyConstructor;

  /**
   * The flags declared here are required for all PlaceableObject subclasses to also support.
   * @privateRemarks `InterfaceToObject` is required here, but not in the subclasses, to bridge the assignability gap
   * between interfaces (subclasses) and an index signature (super)
   */
  static override RENDER_FLAGS: InterfaceToObject<PlaceableObject.RENDER_FLAGS>;

  // Note: This isn't a "real" override but `renderFlags` is set corresponding to the
  // `RENDER_FLAGS` and so it has to be adjusted here.
  renderFlags: RenderFlags<PlaceableObject.RENDER_FLAGS>;

  /**
   * The object that this object is a preview of if this object is a preview
   */
  get _original(): this | undefined;

  /**
   * A convenient reference for whether the current User has full control over the document.
   */
  get isOwner(): boolean;

  /**
   * The mouse interaction state of this placeable.
   */
  get interactionState(): MouseInteractionManager.INTERACTION_STATES | undefined;

  /**
   * The bounding box for this PlaceableObject.
   * This is required if the layer uses a Quadtree, otherwise it is optional
   */
  abstract get bounds(): PIXI.Rectangle;

  /**
   * The central coordinate pair of the placeable object based on it's own width and height
   */
  get center(): PIXI.Point;

  /**
   * The id of the corresponding Document which this PlaceableObject represents.
   * @privateRemarks `null` included because of temporary documents
   */
  get id(): string | null;

  /**
   * A unique identifier which is used to uniquely identify elements on the canvas related to this object.
   * @remarks For temporary documents this will (usually) be `"Token.null.preview"` (unless you create a temporary doc with an ID).
   */
  get objectId(): string;

  /**
   * The named identified for the source object associated with this PlaceableObject.
   * This differs from the objectId because the sourceId is the same for preview objects as for the original.
   * @remarks For temporary documents this will (usually) be `"Token.null.preview"` (unless you create a temporary doc with an ID).
   */
  get sourceId(): string;

  /**
   * Is this placeable object a temporary preview?
   */
  get isPreview(): boolean;

  /**
   * Does there exist a temporary preview of this placeable object?
   */
  get hasPreview(): boolean;

  /**
   * Provide a reference to the CanvasLayer which contains this PlaceableObject.
   */
  get layer(): PlaceablesLayer.ImplementationFor<CanvasDocument["documentName"]>;

  /**
   * A Form Application which is used to configure the properties of this Placeable Object or the Document it
   * represents.
   */
  get sheet(): ClientDocumentMixin.AnyMixed["sheet"];

  /**
   * An indicator for whether the object is currently controlled
   */
  get controlled(): boolean;

  /**
   * An indicator for whether the object is currently a hover target
   * @remarks In JS the setter treats all non-boolean values as `false`
   */
  get hover(): boolean;

  set hover(state);

  /**
   * Is the HUD display active for this Placeable?
   */
  get hasActiveHUD(): boolean;

  /**
   * Get the snapped position for a given position or the current position
   * @param position - The position to be used instead of the current position
   * @returns The snapped position
   * @remarks Calls `this.layer.getSnappedPoint`. If `position` is not provided or nullish, it uses the `x`/`y` of this placeable.
   */
  getSnappedPosition(position?: Canvas.Point): Canvas.Point;

  /**
   * Get the origin used for pasting the copied objects.
   * @param copies - The objects that are copied
   * @returns The offset
   * @internal
   */
  static _getCopiedObjectsOrigin(copies: PlaceableObject.Any[]): Canvas.Point;

  /**
   * Get the data of the copied object pasted at the position given by the offset.
   * Called by {@linkcode PlaceablesLayer.pasteObjects | PlaceablesLayer#pasteObjects} for each copied object.
   * @param offset - The offset relative from the current position to the destination
   * @param options - Options of `PlaceablesLayer#pasteObjects`
   * @returns The update data
   * @internal
   */
  _pasteObject(
    offset: Canvas.Point,
    options?: PlaceablesLayer.PasteOptions,
  ): Document.SourceForName<CanvasDocument["documentName"]>;

  override applyRenderFlags(): void;

  /**
   * Apply render flags before a render occurs.
   * @param flags - The render flags which must be applied
   */
  protected _applyRenderFlags(flags: PlaceableObject.RenderFlags): void;

  /**
   * Clear the display of the existing object
   * @returns The cleared object
   */
  clear(): this;

  override destroy(options?: PIXI.IDestroyOptions | boolean): void;

  /**
   * The inner _destroy method which may optionally be defined by each PlaceableObject subclass.
   * @param options - Options passed to the initial destroy call
   * @remarks The options passed to {@linkcode PlaceableObject.destroy | PlaceableObject#destroy} get forwarded here.
   * `| undefined` since `destroy` has no `={}` for its `options`.
   *
   * The implementation in `PlaceableObject` is a no-op.
   */
  protected _destroy(options: PIXI.IDestroyOptions | boolean | undefined): void;

  /**
   * Draw the placeable object into its parent container
   * @returns The drawn object
   */
  draw(options?: HandleEmptyObject<PlaceableObject.DrawOptions>): Promise<this>;

  /**
   * The inner _draw method which must be defined by each PlaceableObject subclass.
   * @param options - Options which may modify the draw workflow
   * @remarks The options passed to {@linkcode PlaceableObject.draw | PlaceableObject#draw} get forwarded here.
   */
  protected abstract _draw(options: HandleEmptyObject<PlaceableObject.DrawOptions>): Promise<void>;

  /**
   * Execute a partial draw.
   * @param fn - The draw function
   * @returns The drawn object
   * @internal
   */
  _partialDraw(fn: () => Promise<void>): Promise<this>;

  /**
   * Refresh all incremental render flags for the PlaceableObject.
   * This method is no longer used by the core software but provided for backwards compatibility.
   * @param options - Options which may modify the refresh workflow
   * @returns The refreshed object
   */
  refresh(options?: HandleEmptyObject<PlaceableObject.RefreshOptions>): this;

  /**
   * Update the quadtree.
   * @internal
   */
  protected _updateQuadtree(): void;

  /* -------------------------------------------- */

  /**
   * Is this PlaceableObject within the selection rectangle?
   * @param rectangle - The selection rectangle
   */
  protected _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

  /**
   * Get the target opacity that should be used for a Placeable Object depending on its preview state.
   */
  protected _getTargetAlpha(): number;

  /**
   * Register pending canvas operations which should occur after a new PlaceableObject of this type is created
   * @remarks The implementation in `PlaceableObject` is a no-op.
   */
  protected _onCreate(
    data: Document.CreateDataForName<CanvasDocument["documentName"]>,
    options: Document.Database.OnCreateOptionsForName<CanvasDocument["documentName"]>,
    userId: string,
  ): void;

  /**
   * Define additional steps taken when an existing placeable object of this type is updated with new data
   */
  protected _onUpdate(
    changed: Document.UpdateDataForName<CanvasDocument["documentName"]>,
    options: Document.Database.OnUpdateOptionsForName<CanvasDocument["documentName"]>,
    userId: string,
  ): void;

  /**
   * Define additional steps taken when an existing placeable object of this type is deleted
   */
  protected _onDelete(
    options: Document.Database.OnDeleteOptionsForName<CanvasDocument["documentName"]>,
    userId: string,
  ): void;

  /**
   * Assume control over a PlaceableObject, flagging it as controlled and enabling downstream behaviors
   * @param options - Additional options which modify the control request (default: `{}`)
   * @returns A flag denoting whether control was successful
   */
  control(options?: PlaceableObject.ControlOptions): boolean;

  /**
   * Additional events that trigger once control of the object is established
   * @param options - Optional parameters which apply for specific implementations
   * @remarks The options passed to {@linkcode PlaceableObject.control | PlaceableObject#control} get forwarded here
   */
  protected _onControl(options: PlaceableObject.ControlOptions): void;

  /**
   * Release control over a PlaceableObject, removing it from the controlled set
   * @param options - Options which modify the releasing workflow (default: `{}`)
   * @returns A Boolean flag confirming the object was released.
   */
  release(options?: HandleEmptyObject<PlaceableObject.ReleaseOptions>): boolean;

  /**
   * Additional events which trigger once control of the object is released
   * @param options - Options which modify the releasing workflow
   * @remarks The options passed to {@linkcode PlaceableObject.release | PlaceableObject#release} get forwarded here
   */
  protected _onRelease(options: HandleEmptyObject<PlaceableObject.ReleaseOptions>): void;

  /**
   * Clone the placeable object, returning a new object with identical attributes.
   * The returned object is non-interactive, and has no assigned ID.
   * If you plan to use it permanently you should call the create method.
   * @returns A new object with identical data
   * @remarks Sets the clone's {@linkcode PIXI.Container.eventMode | #eventMode} to `"none"`
   */
  clone(): this;

  /**
   * Rotate the PlaceableObject to a certain angle of facing
   * @param angle - The desired angle of rotation
   * @param snap  - Snap the angle of rotation to a certain target degree increment
   * @returns A Promise which resolves once the rotation has completed
   */
  rotate(angle: number, snap?: number): Promise<this>;

  /**
   * Determine a new angle of rotation for a PlaceableObject either from an explicit angle or from a delta offset.
   * @param options - An object which defines the rotation update parameters
   * @returns The new rotation angle for the object
   * @internal
   */
  _updateRotation(options?: PlaceableObject.UpdateRotationOptionsWithAngle): number;
  _updateRotation(options?: PlaceableObject.UpdateRotationOptionsWithDelta): number;

  /**
   * Obtain a shifted position for the Placeable Object
   * @param dx - The number of grid units to shift along the X-axis
   * @param dy - The number of grid units to shift along the Y-axis
   * @param dz - The number of grid units to shift along the Z-axis
   * @returns The shifted target coordinates
   * @internal
   * @remarks Despite the parameter descriptions saying 'number of grid units', they're only checked for sign.
   */
  _getShiftedPosition(dx: -1 | 0 | 1, dy: -1 | 0 | 1, dz: -1 | 0 | 1): Canvas.ElevatedPoint;

  /**
   * Obtain the shifted position.
   * @param dx       - The number of grid units to shift along the X-axis
   * @param dy       - The number of grid units to shift along the Y-axis
   * @param dz       - The number of grid units to shift along the Z-axis
   * @param position - The unsnapped position
   * @param snapped  - The snapped position
   * @param grid     - The grid
   * @returns The shifted target coordinates
   * @internal
   */
  static _getShiftedPosition(
    dx: -1 | 0 | 1,
    dy: -1 | 0 | 1,
    dz: -1 | 0 | 1,
    position: Canvas.ElevatedPoint,
    snapped: Canvas.ElevatedPoint,
    grid: BaseGrid,
  ): Canvas.ElevatedPoint;

  /**
   * Activate interactivity for the Placeable Object
   */
  activateListeners(): void;

  /**
   * Create a standard MouseInteractionManager for the PlaceableObject
   */
  protected _createInteractionManager(): MouseInteractionManager<this>;

  /**
   * Test whether a user can perform a certain interaction regarding a Placeable Object
   * @param user   - The User performing the action
   * @param action - The named action being attempted
   * @returns Does the User have rights to perform the action?
   * @remarks See {@linkcode PlaceableObject.Action}.
   * @privateRemarks `can` and its associated methods are all temporary-document-safe as of 13.351.
   */
  can(user: User.Implementation, action: PlaceableObject.Action): boolean;

  /**
   * Can the User access the HUD for this Placeable Object?
   * @param user  - The User performing the action. Always equal to `game.user`.
   * @param event - The pointer event if this function was called by {@linkcode foundry.canvas.interaction.MouseInteractionManager}.
   */
  protected _canHUD(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  /**
   * Does the User have permission to configure the Placeable Object?
   * @param user  - The User performing the action. Always equal to `game.user`.
   * @param event - The pointer event if this function was called by {@linkcode foundry.canvas.interaction.MouseInteractionManager}.
   */
  protected _canConfigure(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  /**
   * Does the User have permission to control the Placeable Object?
   * @param user  - The User performing the action. Always equal to `game.user`.
   * @param event - The pointer event if this function was called by {@linkcode foundry.canvas.interaction.MouseInteractionManager}.
   */
  protected _canControl(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  /**
   * Does the User have permission to view details of the Placeable Object?
   * @param user  - The User performing the action. Always equal to `game.user`.
   * @param event - The pointer event if this function was called by {@linkcode foundry.canvas.interaction.MouseInteractionManager}.
   */
  protected _canView(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  /**
   * Does the User have permission to create the underlying Document?
   * @param user  - The User performing the action. Always equal to `game.user`.
   * @param event - The pointer event if this function was called by {@linkcode foundry.canvas.interaction.MouseInteractionManager}.
   * @remarks It appears that `_canCreate` is completely unused as of 14.361.
   */
  protected _canCreate(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  /**
   * Does the User have permission to drag this Placeable Object?
   * @param user  - The User performing the action. Always equal to `game.user`.
   * @param event - The pointer event if this function was called by {@linkcode foundry.canvas.interaction.MouseInteractionManager}.
   */
  protected _canDrag(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  /**
   * Does the User have permission to left-click drag this Placeable Object?
   * @param user    - The User performing the action. Always equal to `game.user`.
   * @param event   - The pointer event
   * @param options - Options, used internally
   */
  protected _canDragLeftStart(
    user: User.Implementation,
    event?: Canvas.Event.Pointer,
    options?: PlaceableObject.CanDragLeftStartOptions,
  ): boolean;

  /**
   * Does the User have permission to hover on this Placeable Object?
   * @param user  - The User performing the action. Always equal to `game.user`.
   * @param event - The pointer event if this function was called by {@linkcode foundry.canvas.interaction.MouseInteractionManager}.
   */
  protected _canHover(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  /**
   * Does the User have permission to update the underlying Document?
   * @param user  - The User performing the action. Always equal to `game.user`.
   * @param event - The pointer event if this function was called by {@linkcode foundry.canvas.interaction.MouseInteractionManager}.
   */
  protected _canUpdate(user: User.Implementation, event?: PIXI.FederatedEvent): boolean;

  /**
   * Does the User have permission to delete the underlying Document?
   * @param user  - The User performing the action. Always equal to `game.user`.
   * @param event - The pointer event if this function was called by {@linkcode foundry.canvas.interaction.MouseInteractionManager}.
   */
  protected _canDelete(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  /**
   * Actions that should be taken for this Placeable Object when a mouseover event occurs.
   * Hover events on PlaceableObject instances allow event propagation by default.
   * @see `MouseInteractionManager##handlePointerOver`
   * @param event   - The triggering canvas interaction event
   * @param options - Options which customize event handling
   * @remarks {@linkcode Wall._onHoverIn | Wall#_onHoverIn} can return `false`, otherwise this is always `void`.
   */
  protected _onHoverIn(event: Canvas.Event.Pointer, options?: PlaceableObject.HoverInOptions): boolean | void;

  /**
   * Actions that should be taken for this Placeable Object when a mouseout event occurs
   * @param event - The triggering canvas interaction event
   */
  protected _onHoverOut(event: Canvas.Event.Pointer): void;

  /**
   * Should the placeable propagate left click downstream?
   * @remarks Unconditionally returns `false` in `PlaceableObject`
   */
  protected _propagateLeftClick(_event: Canvas.Event.Pointer): boolean;

  /**
   * Callback actions which occur on a single left-click event to assume control of the object
   * @param event - The triggering canvas interaction event
   */
  protected _onClickLeft(event: Canvas.Event.Pointer): boolean | void;

  /**
   * Callback actions which occur on a single left-unclick event to assume control of the object
   * @param event - The triggering canvas interaction event
   */
  protected _onUnclickLeft(event: Canvas.Event.Pointer): void;

  /**
   * Callback actions which occur on a double left-click event to activate
   * @param event - The triggering canvas interaction event
   */
  protected _onClickLeft2(event: Canvas.Event.Pointer): void;

  /**
   * Should the placeable propagate right click downstream?
   * @remarks Unconditionally returns `false` in `PlaceableObject`
   */
  protected _propagateRightClick(_event: Canvas.Event.Pointer): boolean;

  /**
   * Callback actions which occur on a single right-click event to configure properties of the object
   * @param event - The triggering canvas interaction event
   */
  protected _onClickRight(event: Canvas.Event.Pointer): void;

  /**
   * Callback actions which occur on a single right-unclick event
   * @param event - The triggering canvas interaction event
   */
  protected _onUnclickRight(event: Canvas.Event.Pointer): void;

  /**
   * Callback actions which occur on a double right-click event to configure properties of the object
   * @param event - The triggering canvas interaction event
   */
  protected _onClickRight2(event: Canvas.Event.Pointer): void;

  /**
   * Callback actions which occur when a mouse-drag action is first begun.
   * @param event - The triggering canvas interaction event
   * @returns If `false`, the start if prevented
   */
  protected _onDragLeftStart(event: Canvas.Event.Pointer): boolean | void;

  /**
   * Initialize the left-drag operation.
   * @param event - The triggering canvas interaction event
   */
  protected _initializeDragLeft(event: Canvas.Event.Pointer): void;

  /**
   * Begin a drag operation from the perspective of the preview clone.
   * Modify the appearance of both the clone (this) and the original (_original) object.
   */
  protected _onDragStart(): void;

  /**
   * Conclude a drag operation from the perspective of the preview clone.
   * Modify the appearance of both the clone (this) and the original (_original) object.
   */
  protected _onDragEnd(): void;

  /**
   * Callback actions which occur on a mouse-move operation.
   * @param event - The triggering canvas interaction event
   */
  protected _onDragLeftMove(event: Canvas.Event.Pointer): void;

  /**
   * Callback actions which occur on a mouse-move operation.
   * @param event - The triggering canvas interaction event
   */
  protected _onDragLeftDrop(event: Canvas.Event.Pointer): void;

  /**
   * Perform the database updates that should occur as the result of a drag-left-drop operation.
   * @param event - The triggering canvas interaction event
   * @returns An array of database updates to perform for documents in this collection
   * @remarks `| null` in the return because of the `Wall` override
   */
  protected _prepareDragLeftDropUpdates(event: Canvas.Event.Pointer): PlaceableObject.AnyDragLeftDropUpdate[] | null;

  /**
   * Callback actions which occur on a mouse-move operation.
   * @param event - The triggering mouse click event
   * @returns If `false`, the cancellation is prevented
   */
  protected _onDragLeftCancel(event: Canvas.Event.Pointer): boolean | void;

  /**
   * Finalize the left-drag operation.
   * @param event - The triggering mouse click event
   */
  protected _finalizeDragLeft(event: Canvas.Event.Pointer): void;

  /**
   * Callback actions which occur on a right mouse-drag operation.
   * @param event - The triggering mouse click event
   * @returns If `false`, the start if prevented
   */
  protected _onDragRightStart(event: Canvas.Event.Pointer): false | void;

  /**
   * Initialize the right-drag operation.
   * @param event - The triggering canvas interaction event
   */
  protected _initializeDragRight(event: Canvas.Event.Pointer): void;

  /**
   * Callback actions which occur on a right mouse-drag operation.
   * @param event - The triggering canvas interaction event
   */
  protected _onDragRightMove(event: Canvas.Event.Pointer): void;

  /**
   * Callback actions which occur on a right mouse-drag operation.
   * @param event - The triggering canvas interaction event
   */
  protected _onDragRightDrop(event: Canvas.Event.Pointer): void;

  /**
   * Callback actions which occur on a right mouse-drag operation.
   * @param event - The triggering mouse click event
   * @returns If `false`, the start if prevented
   */
  protected _onDragRightCancel(event: Canvas.Event.Pointer): boolean | void;

  /**
   * Finalize the right-drag operation.
   * @param event - The triggering mouse click event
   */
  protected _finalizeDragRight(event: Canvas.Event.Pointer): void;

  /**
   * Callback action which occurs on a long press.
   * @param event  - The triggering canvas interaction event
   * @param origin - The local canvas coordinates of the mousepress.
   */
  protected _onLongPress(event: Canvas.Event.Pointer, origin: PIXI.Point): void;

  #PlaceableObject: true;
}

declare namespace PlaceableObject {
  interface Any extends AnyPlaceableObject {}
  interface AnyConstructor extends Identity<typeof AnyPlaceableObject> {}

  type ImplementationClassFor<Name extends Document.PlaceableType> = GetKey<
    PlaceableObjectClassConfig,
    Name,
    DefaultPlaceables[Name]
  >;
  type ImplementationFor<Name extends Document.PlaceableType> = FixedInstanceType<ImplementationClassFor<Name>>;

  /**
   * A mapping of Document name to the placeable class associated with it by core, before any user action.
   *
   * Its concrete keys define {@linkcode Document.PlaceableType}, so if you are creating a new placeable out of an existing document,
   * this is where to merge into.
   */
  interface DefaultPlaceables {
    [documentName: string]: PlaceableObject.AnyConstructor;
    AmbientLight: typeof foundry.canvas.placeables.AmbientLight;
    AmbientSound: typeof foundry.canvas.placeables.AmbientSound;
    Drawing: typeof foundry.canvas.placeables.Drawing;
    MeasuredTemplate: typeof foundry.canvas.placeables.MeasuredTemplate;
    Note: typeof foundry.canvas.placeables.Note;
    Region: typeof foundry.canvas.placeables.Region;
    Token: typeof foundry.canvas.placeables.Token;
    Tile: typeof foundry.canvas.placeables.Tile;
    Wall: typeof foundry.canvas.placeables.Wall;
  }

  /**
   * Since this is the constraint on the `CanvasDocument` generic on {@linkcode PlaceablesLayer}, it can't be {@linkcode Scene.Embedded}/
   * {@linkcode Scene.DirectDescendant | .DirectDescendant}, or placeables for temporary documents couldn't exist.
   */
  type AnyCanvasDocument = Document.ImplementationFor<Document.PlaceableType>;

  type RenderFlags = RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS>;

  type PassableRenderFlagsFor<DocumentName extends Document.PlaceableType> = RenderFlagsMixin.ToBooleanFlags<
    Document.ObjectClassFor<DocumentName>["RENDER_FLAGS"]
  >;

  interface RENDER_FLAGS {
    /** @defaultValue `{ propagate: ["refresh"] }` */
    redraw: RenderFlag<this, "redraw">;

    /** @defaultValue `{ propagate: ["refreshState"], alias: true }` */
    refresh: RenderFlag<this, "refresh">;

    /** @defaultValue `{}` */
    refreshState: RenderFlag<this, "refreshState">;
  }

  // TODO: deprecate and simplify `get sheet()`
  type Sheet<CanvasDocument extends AnyCanvasDocument> = GetKey<
    CanvasDocument,
    "sheet"
    // Application.Any | DocumentSheetV2.Any | null
  >;

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface DrawOptions {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RefreshOptions {}

  interface ControlOptions {
    /**
     * Release any other controlled objects first
     * @remarks No default, so effectively defaults `true`. Can't be undefined because it's checked via `!== false` in
     * {@linkcode PlaceableObject.control | PlaceableObject#control}.
     */
    releaseOthers?: boolean;
  }

  /**
   * @remarks As of 13.351, no placeable uses any options for `#release`
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ReleaseOptions {}

  interface UpdateRotationOptionsWithAngle extends Pick<
    PlaceablesLayer.RotateManyOptionsWithAngle,
    "snap" | "angle" | "delta"
  > {}
  interface UpdateRotationOptionsWithDelta extends Pick<
    PlaceablesLayer.RotateManyOptionsWithDelta,
    "snap" | "angle" | "delta"
  > {}

  /** @internal */
  interface _HoverInOptions {
    /**
     * Trigger hover-out behavior on sibling objects
     * @defaultValue `false`
     */
    hoverOutOthers: boolean;
  }

  interface HoverInOptions extends InexactPartial<_HoverInOptions> {}

  /**
   * @remarks While in theory a custom action could be added through a custom `_can*` method method Atropos
   * has indicated that this is not intended to be user-extensible, and as of 13.351 this is typed as a literal union, not `string`.
   *
   * @privateRemarks {@linkcode PlaceableObject.can | PlaceableObject#can} checks for
   * ```js
   * this[`_can${action.titleCase()}`]
   * ```
   * first, but as of 13.351 *also* checks
   * ```js
   * this[`_can${action}`]
   * ```
   * thus fixing the bug that existed prior where `HUD` was mangled to `Hud` and was falsely rejected. `"HUD"` has been pulled out of this
   * union so we don't allow `"Hud"` in the types via {@linkcode PlaceableObject.Action}.
   */
  type BaseAction = "hover" | "control" | "drag" | "view" | "configure" | "create" | "update" | "delete";

  type Action = Titlecase<BaseAction> | BaseAction | "HUD";

  /** @internal */
  interface _CanDragLeftStartOptions {
    /**
     * @defaultValue `true`
     * @remarks Controls whether certain warning notifications are presented if a `PlaceableObject` is dragged with insufficient permissions.
     */
    notify: boolean;
  }

  interface CanDragLeftStartOptions extends InexactPartial<_CanDragLeftStartOptions> {}

  /**
   * @remarks Foundry does some unsound subclassing around
   * {@linkcode PlaceableObject._prepareDragLeftDropUpdates | PlaceableObject#_prepareDragLeftDropUpdates}
   */
  type AnyDragLeftDropUpdate = DragLeftDropUpdate | Token.DragLeftDropUpdate | Wall.DragLeftDropUpdate;

  /**
   * @remarks The type {@linkcode PlaceableObject._prepareDragLeftDropUpdates | PlaceableObject#_prepareDragLeftDropUpdates}
   * returns if not overridden by the specific placeable
   */
  interface DragLeftDropUpdate {
    _id: string;
    x: number;
    y: number;

    /**
     * @remarks Possibly `undefined` as this is set to `clone.document.rotation` and not all canvas documents
     * have a `rotation` field.
     */
    rotation: number | undefined;
  }

  interface PasteObjectOptions {
    /**
     * Paste in a hidden state, if applicable. Default is false.
     * @defaultValue `false`
     */
    hidden?: boolean | undefined;

    /**
     * Snap to the grid. Default is true.
     * @defaultValue `true`
     */
    snap?: boolean | undefined;
  }

  /** @deprecated Use {@linkcode Document.SourceForName} directly instead. This type will be removed in v15. */
  type PasteObjectReturn<CanvasDocument extends PlaceableObject.AnyCanvasDocument> = Document.SourceForName<
    CanvasDocument["documentName"]
  >;

  /** @deprecated Use {@linkcode PlaceablesLayer.ImplementationClassFor} instead. This type will be removed in v15. */
  type Layer<CanvasDocument extends AnyCanvasDocument> = PlaceablesLayer.ImplementationFor<
    CanvasDocument["documentName"]
  >;
}

export default PlaceableObject;

declare abstract class AnyPlaceableObject extends PlaceableObject<PlaceableObject.AnyCanvasDocument> {
  constructor(...args: never);
}
