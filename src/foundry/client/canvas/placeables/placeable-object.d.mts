import type {
  Identity,
  InterfaceToObject,
  HandleEmptyObject,
  InexactPartial,
  NullishProps,
  Titlecase,
  GetKey,
} from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { Token, Wall } from "./_module.d.mts";
import type { ControlIcon } from "#client/canvas/containers/_module.d.mts";
import type { Document } from "#common/abstract/_module.d.mts";
import type {
  DatabaseCreateOperation,
  DatabaseDeleteOperation,
  DatabaseUpdateOperation,
} from "#common/abstract/_types.d.mts";
import {
  MouseInteractionManager,
  RenderFlagsMixin,
  RenderFlags,
  type RenderFlag,
} from "#client/canvas/interaction/_module.mjs";

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
   * @remarks Set to `null` in {@link PlaceableObject | `PlaceableObject#constructor`} and {@link AmbientSound.clear | `AmbientSound#clear`}.
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
   */
  get id(): string;

  /**
   * A unique identifier which is used to uniquely identify elements on the canvas related to this object.
   */
  get objectId(): string;

  /**
   * The named identified for the source object associated with this PlaceableObject.
   * This differs from the objectId because the sourceId is the same for preview objects as for the original.
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
  get layer(): PlaceableObject.Layer<CanvasDocument>;

  /**
   * A Form Application which is used to configure the properties of this Placeable Object or the Document it
   * represents.
   */
  get sheet(): PlaceableObject.Sheet<CanvasDocument>;

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
   * @remarks Calls `this#layer#getSnappedPoint`. If `position` is not provided or nullish, the document's values are used
   */
  getSnappedPosition(position?: Canvas.Point | null): Canvas.Point;

  /**
   * Get the data of the copied object pasted at the position given by the offset.
   * Called by {@linkcode foundry.canvas.layers.PlaceablesLayer#pasteObjects} for each copied object.
   * @param offset - The offset relative from the current position to the destination
   * @param options - Options of {@linkcode foundry.canvas.layers.PlaceablesLayer#pasteObjects}
   * @returns The update data
   * @internal
   */
  _pasteObject(
    offset: Canvas.Point,
    { hidden, snap }?: PlaceableObject.PasteObjectOptions,
  ): PlaceableObject.PasteObjectReturn<CanvasDocument>;

  override applyRenderFlags(): void;

  /**
   * Apply render flags before a render occurs.
   * @param flags - The render flags which must be applied
   */
  protected _applyRenderFlags(flags: PlaceableObject.RenderFlags): void;

  /**
   * Clear the display of the existing object
   * @returns The cleared object
   * @remarks {@link Tile.clear | `Tile`} and {@link Token.clear | `Token`} return void
   */
  clear(): this | void;

  // options: not null (PIXI signature)
  override destroy(options?: PIXI.IDestroyOptions | boolean): void;

  /**
   * The inner _destroy method which may optionally be defined by each PlaceableObject subclass.
   * @param options - Options passed to the initial destroy call
   * @remarks The options passed to {@link PlaceableObject.destroy | `PlaceableObject#destroy`} get forwarded here.
   * `| undefined` since `destroy` has no `={}` for its `options`
   */
  protected _destroy(options: PIXI.IDestroyOptions | boolean | undefined): void;

  /**
   * Draw the placeable object into its parent container
   * @returns The drawn object
   */
  // options: not null (will likely be destructured if any options ever materialize, parameter default)
  draw(options?: HandleEmptyObject<PlaceableObject.DrawOptions>): Promise<this>;

  /**
   * The inner _draw method which must be defined by each PlaceableObject subclass.
   * @param options - Options which may modify the draw workflow
   * @remarks The options passed to {@link PlaceableObject.draw | `PlaceableObject#draw`} get forwarded here
   */
  protected abstract _draw(options: HandleEmptyObject<PlaceableObject.DrawOptions>): Promise<void>;

  /**
   * Execute a partial draw.
   * @param fn - The draw function
   * @returns The drawn object
   */
  protected _partialDraw(fn: () => Promise<void>): Promise<this>;

  /**
   * Refresh all incremental render flags for the PlaceableObject.
   * This method is no longer used by the core software but provided for backwards compatibility.
   * @param options - Options which may modify the refresh workflow
   * @returns The refreshed object
   */
  refresh(options?: HandleEmptyObject<PlaceableObject.RefreshOptions>): this;

  /**
   * Update the quadtree.
   * @remarks Foundry marked `@internal`
   */
  protected _updateQuadtree(): void;

  /* -------------------------------------------- */

  /**
   * Is this PlaceableObject within the selection rectangle?
   * @param rectangle - The selection rectangle
   * @remarks Foundry marked `@internal`
   */
  protected _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

  /**
   * Get the target opacity that should be used for a Placeable Object depending on its preview state.
   */
  protected _getTargetAlpha(): number;

  /**
   * Register pending canvas operations which should occur after a new PlaceableObject of this type is created
   */
  // TODO: should be `MaybePromise<void>` to allow async subclassing?
  protected _onCreate(
    data: foundry.data.fields.SchemaField.CreateData<CanvasDocument["schema"]["fields"]>,
    options: Document.Database.CreateOptions<DatabaseCreateOperation>,
    userId: string,
  ): void;

  /**
   * Define additional steps taken when an existing placeable object of this type is updated with new data
   */
  protected _onUpdate(
    changed: foundry.data.fields.SchemaField.UpdateData<CanvasDocument["schema"]["fields"]>,
    options: Document.Database.UpdateOptions<DatabaseUpdateOperation>,
    userId: string,
  ): void;

  /**
   * Define additional steps taken when an existing placeable object of this type is deleted
   */
  protected _onDelete(options: Document.Database.DeleteOptions<DatabaseDeleteOperation>, userId: string): void;

  /**
   * Assume control over a PlaceableObject, flagging it as controlled and enabling downstream behaviors
   * @param options - Additional options which modify the control request
   *                  (default: `{}`)
   * @returns A flag denoting whether control was successful
   */
  // options: not null (property access with only a parameter default)
  control(options?: PlaceableObject.ControlOptions): boolean;

  /**
   * Additional events which trigger once control of the object is established
   * @param options - Optional parameters which apply for specific implementations
   * @remarks The options passed to {@link PlaceableObject.control | `PlaceableObject#control`} get forwarded here
   */
  protected _onControl(options: PlaceableObject.ControlOptions): void;

  /**
   * Release control over a PlaceableObject, removing it from the controlled set
   * @param options - Options which modify the releasing workflow
   *                  (default: `{}`)
   * @returns A Boolean flag confirming the object was released.
   */
  // options: not null (parameter default only, forwarded to `_onRelease`)
  release(options?: HandleEmptyObject<PlaceableObject.ReleaseOptions>): boolean;

  /**
   * Additional events which trigger once control of the object is released
   * @param options - Options which modify the releasing workflow
   * @remarks The options passed to {@link PlaceableObject.release | `PlaceableObject#release`} get forwarded here
   */
  protected _onRelease(options: HandleEmptyObject<PlaceableObject.ReleaseOptions>): void;

  /**
   * Clone the placeable object, returning a new object with identical attributes.
   * The returned object is non-interactive, and has no assigned ID.
   * If you plan to use it permanently you should call the create method.
   * @returns A new object with identical data
   */
  clone(): this;

  /**
   * Rotate the PlaceableObject to a certain angle of facing
   * @param angle - The desired angle of rotation
   * @param snap  - Snap the angle of rotation to a certain target degree increment
   * @returns A Promise which resolves once the rotation has completed
   */
  // snap: not null (forwarded to _updateRotation with only a parameter default)
  rotate(angle: number, snap?: number): Promise<this>;

  /**
   * Determine a new angle of rotation for a PlaceableObject either from an explicit angle or from a delta offset.
   * @param options - An object which defines the rotation update parameters
   * @returns The new rotation angle for the object
   */
  // options: not null (destructured)
  protected _updateRotation(options?: PlaceableObject.UpdateRotationOptions): number;

  /**
   * Obtain a shifted position for the Placeable Object
   * @param dx - The number of grid units to shift along the X-axis
   * @param dy - The number of grid units to shift along the Y-axis
   * @returns The shifted target coordinates
   * @remarks Despite the parameter descriptions saying 'number of grid units', they're only checked for sign.
   * @privateRemarks Foundry types this correctly, but describes it wrong, logged
   */
  protected _getShiftedPosition(dx: -1 | 0 | 1, dy: -1 | 0 | 1): Canvas.Point;

  /**
   * Activate interactivity for the Placeable Object
   */
  activateListeners(): void;

  /**
   * Create a standard MouseInteractionManager for the PlaceableObject
   */
  protected _createInteractionManager(): NonNullable<this["mouseInteractionManager"]>;

  /**
   * Test whether a user can perform a certain interaction regarding a Placeable Object
   * @param user   - The User performing the action
   * @param action - The named action being attempted
   * @returns Does the User have rights to perform the action?
   * @see {@linkcode PlaceableObject.Action}
   */
  can(user: User.Implementation, action: PlaceableObject.Action): boolean;

  /**
   * Can the User access the HUD for this Placeable Object?
   * @param user  - The User performing the action.
   * @param event - The event object.
   * @returns The returned status.
   */
  protected _canHUD(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

  /**
   * Does the User have permission to configure the Placeable Object?
   * @param user  - The User performing the action.
   * @param event - The event object.
   * @returns The returned status.
   */
  protected _canConfigure(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

  /**
   * Does the User have permission to control the Placeable Object?
   * @param user  - The User performing the action.
   * @param event - The event object.
   * @returns The returned status.
   */
  protected _canControl(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

  /**
   * Does the User have permission to view details of the Placeable Object?
   * @param user  - The User performing the action.
   * @param event - The event object.
   * @returns The returned status.
   */
  protected _canView(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

  /**
   * Does the User have permission to create the underlying Document?
   * @param user  - The User performing the action.
   * @param event - The event object.
   * @returns The returned status.
   */
  protected _canCreate(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

  /**
   * Does the User have permission to drag this Placeable Object?
   * @param user  - The User performing the action.
   * @param event - The event object.
   * @returns The returned status.
   */
  protected _canDrag(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

  /**
   * Does the User have permission to left-click drag this Placeable Object?
   * @param user  - The User performing the action.
   * @param event - The event object.
   * @returns The returned status
   */
  protected _canDragLeftStart(user: User.Implementation, event: DragEvent): boolean;

  /**
   * Does the User have permission to hover on this Placeable Object?
   * @param user  - The User performing the action.
   * @param event - The event object.
   * @returns The returned status.
   */
  protected _canHover(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

  /**
   * Does the User have permission to update the underlying Document?
   * @param user  - The User performing the action.
   * @param event - The event object.
   * @returns The returned status.
   */
  protected _canUpdate(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

  /**
   * Does the User have permission to delete the underlying Document?
   * @param user  - The User performing the action.
   * @param event - The event object.
   * @returns The returned status.
   */
  protected _canDelete(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

  /**
   * Actions that should be taken for this Placeable Object when a mouseover event occurs.
   * Hover events on PlaceableObject instances allow event propagation by default.
   * @see `MouseInteractionManager##handlePointerOver`
   * @param event   - The triggering canvas interaction event
   * @param options - Options which customize event handling
   * @remarks {@link Wall._onHoverIn | `Wall#_onHoverIn`} can return `false`, otherwise this is always `void`
   */
  // options: not null (destructured)
  protected _onHoverIn(event: PIXI.FederatedEvent, options?: PlaceableObject.HoverInOptions): false | void;

  /**
   * Actions that should be taken for this Placeable Object when a mouseout event occurs
   * @see `MouseInteractionManager##handlePointerOut`
   * @param event - The triggering canvas interaction event
   */
  protected _onHoverOut(event: PIXI.FederatedEvent): void;

  /**
   * Should the placeable propagate left click downstream?
   * @remarks Unconditionally returns `false` in `PlaceableObject`
   */
  protected _propagateLeftClick(_event: PIXI.FederatedEvent): boolean;

  /**
   * Callback actions which occur on a single left-click event to assume control of the object
   * @see `MouseInteractionManager##handleClickLeft`
   * @param event - The triggering canvas interaction event
   */
  protected _onClickLeft(event: PIXI.FederatedEvent): void;

  /**
   * Callback actions which occur on a single left-unclick event to assume control of the object
   * @param event - The triggering canvas interaction event
   */
  protected _onUnclickLeft(event: PIXI.FederatedEvent): void;

  /**
   * Callback actions which occur on a double left-click event to activate
   * @see `MouseInteractionManager##handleClickLeft2`
   * @param event - The triggering canvas interaction event
   */
  protected _onClickLeft2(event: PIXI.FederatedEvent): void;

  /**
   * Should the placeable propagate right click downstream?
   * @remarks Unconditionally returns `false` in `PlaceableObject`
   */
  protected _propagateRightClick(_event: PIXI.FederatedEvent): boolean;

  /**
   * Callback actions which occur on a single right-click event to configure properties of the object
   * @see `MouseInteractionManager##handleClickRight`
   * @param event - The triggering canvas interaction event
   */
  protected _onClickRight(event: PIXI.FederatedEvent): void;

  /**
   * Callback actions which occur on a single right-unclick event
   * @param event - The triggering canvas interaction event
   */
  protected _onUnclickRight(event: PIXI.FederatedEvent): void;

  /**
   * Callback actions which occur on a double right-click event to configure properties of the object
   * @see `MouseInteractionManager##handleClickRight2`
   * @param event - The triggering canvas interaction event
   */
  protected _onClickRight2(event: PIXI.FederatedEvent): void;

  /**
   * Callback actions which occur when a mouse-drag action is first begun.
   * @see `MouseInteractionManager##handleDragStart`
   * @param event - The triggering canvas interaction event
   */
  protected _onDragLeftStart(event: PIXI.FederatedEvent): void;

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
   * @see `MouseInteractionManager##handleDragMove`
   * @param event - The triggering canvas interaction event
   */
  protected _onDragLeftMove(event: PIXI.FederatedEvent): void;

  /**
   * Callback actions which occur on a mouse-move operation.
   * @see `MouseInteractionManager##handleDragDrop`
   * @param event - The triggering canvas interaction event
   */
  protected _onDragLeftDrop(event: PIXI.FederatedEvent): void;

  /**
   * Perform the database updates that should occur as the result of a drag-left-drop operation.
   * @param event - The triggering canvas interaction event
   * @returns An array of database updates to perform for documents in this collection
   * @remarks `| null` in the return because of the `Wall` override
   */
  protected _prepareDragLeftDropUpdates(event: PIXI.FederatedEvent): PlaceableObject.AnyDragLeftDropUpdate[] | null;

  /**
   * Callback actions which occur on a mouse-move operation.
   * @see `MouseInteractionManager##handleDragCancel`
   * @param event - The triggering mouse click event
   */
  protected _onDragLeftCancel(event: PIXI.FederatedEvent): void;

  /**
   * Callback actions which occur on a right mouse-drag operation.
   * @see `MouseInteractionManager##handleDragStart`
   * @param event - The triggering mouse click event
   */
  protected _onDragRightStart(event: PIXI.FederatedEvent): void;

  /**
   * Callback actions which occur on a right mouse-drag operation.
   * @see `MouseInteractionManager##handleDragMove`
   * @param event - The triggering canvas interaction event
   */
  protected _onDragRightMove(event: PIXI.FederatedEvent): void;

  /**
   * Callback actions which occur on a right mouse-drag operation.
   * @see `MouseInteractionManager##handleDragDrop`
   * @param event - The triggering canvas interaction event
   */
  protected _onDragRightDrop(event: PIXI.FederatedEvent): void;

  /**
   * Callback actions which occur on a right mouse-drag operation.
   * @see `MouseInteractionManager##handleDragDrop`
   * @param event - The triggering mouse click event
   */
  protected _onDragRightCancel(event: PIXI.FederatedEvent): void;

  /**
   * Callback action which occurs on a long press.
   * @see `MouseInteractionManager##handleLongPress`
   * @param event  - The triggering canvas interaction event
   * @param origin - The local canvas coordinates of the mousepress.
   */
  protected _onLongPress(event: PIXI.FederatedEvent, origin: PIXI.Point): void;
}

declare namespace PlaceableObject {
  interface Any extends AnyPlaceableObject {}
  interface AnyConstructor extends Identity<typeof AnyPlaceableObject> {}

  type AnyCanvasDocument = Scene.Embedded;

  type RenderFlags = RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS>;

  interface RENDER_FLAGS {
    /** @defaultValue `{ propagate: ["refresh"] }` */
    redraw: RenderFlag<this, "redraw">;

    /** @defaultValue `{ propagate: ["refreshState"], alias: true }` */
    refresh: RenderFlag<this, "refresh">;

    /** @defaultValue `{}` */
    refreshState: RenderFlag<this, "refreshState">;
  }

  // Note(LukeAbby): Switch back to `GetKeyWithShape` once `TilesLayer` etc. is assignable to `PlaceablesLayer.Any`.
  // There's no clear reason why it isn't but it's breaking this type.
  type Layer<CanvasDocument extends AnyCanvasDocument> = GetKey<
    CanvasDocument,
    "layer"
    // PlaceablesLayer.Any
  >;

  type Sheet<CanvasDocument extends AnyCanvasDocument> = GetKey<
    CanvasDocument,
    "sheet"
    // FormApplication.Any | ApplicationV2.Any | null
  >;

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface DrawOptions {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RefreshOptions {}

  interface ControlOptions {
    /**
     * Release any other controlled objects first
     * @remarks Checked via `!== false`, so no nullish values allowed
     */
    releaseOthers?: boolean;
  }

  /**
   * @privateRemarks `PlaceableObject#_onDelete` is the only place in foundry code that calls `PlaceableObject#release` with any options at all,
   * where it passes `{trigger: false}`. This is passed on to `PlaceableObject#_onRelease`, which does not check for any options, including trigger.
   * `Drawing`, `Region`, and `Token` extend `_onRelease` and pass the options back to `super`, but do no further checks.
   *
   * As it is completely unused and has been removed in v13, it is not included in this interface
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ReleaseOptions {}

  /** @internal */
  type __UpdateRotationOptions = NullishProps<{
    /**
     * An explicit angle, either this or delta must be provided
     * @defaultValue `undefined`
     * @remarks Checked before `delta`. If non-numeric, ignored in favour of `delta`.
     */
    angle: number;
  }> &
    InexactPartial<{
      /**
       * A relative angle delta, either this or the angle must be provided
       * @defaultValue `0`
       * @remarks Can't be `null` as it only has a parameter default.
       *
       * Only used if `angle` is non-numeric.
       */
      delta: number;

      /**
       * A precision (in degrees) to which the resulting angle should snap. Default is 0.
       * @defaultValue `0`
       * @remarks Can't be `null` as it only has a parameter default.
       *
       * @see {@link Number.toNearest | `Number#toNearest`}
       */
      snap: number;
    }>;
  interface UpdateRotationOptions extends __UpdateRotationOptions {}

  /** @internal */
  type _HoverInOptions = NullishProps<{
    /**
     * Trigger hover-out behavior on sibling objects
     * @defaultValue `false`
     */
    hoverOutOthers: boolean;
  }>;

  interface HoverInOptions extends _HoverInOptions {}

  /**
   * @remarks {@link PlaceableObject.can | `PlaceableObject#can`} calls `#titleCase()` on this
   * before prepending `"_can"`, rendering any actions with more than a single capital in their
   * name (e.g `"DragLeftStart"`), including `"HUD"` (as there's no `PlaceableObject#_canHud()`),
   * effectively inert, so they have been omitted here. This also means these are case
   * -insensitive at runtime, but TS doesn't have a good way to type that. Allowing lowercase or
   * title case is the best we can do.
   *
   * While in theory a custom action could be added through a custom `_can*` method method Atropos
   * has indicated that this is not intended to be user-extensible.
   */
  type BaseAction = "configure" | "control" | "view" | "create" | "drag" | "hover" | "update" | "delete";

  type Action = Titlecase<BaseAction> | BaseAction;

  /** @remarks Foundry does some unsound subclassing around {@link PlaceableObject._prepareDragLeftDropUpdates | `PlaceableObject#_prepareDragLeftDropUpdates`} */
  type AnyDragLeftDropUpdate = DragLeftDropUpdate | Token.DragLeftDropUpdate | Wall.DragLeftDropUpdate;

  /**
   * @remarks The type {@link PlaceableObject._prepareDragLeftDropUpdates | `PlaceableObject#_prepareDragLeftDropUpdates`}
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

  type PasteObjectReturn<CanvasDocument extends PlaceableObject.AnyCanvasDocument> = Document.SourceForName<
    CanvasDocument["documentName"]
  >;
}

export default PlaceableObject;

declare abstract class AnyPlaceableObject extends PlaceableObject<PlaceableObject.AnyCanvasDocument> {
  constructor(...args: never);
}
