import type {
  Identity,
  InterfaceToObject,
  HandleEmptyObject,
  InexactPartial,
  MakeConform,
  NullishProps,
} from "fvtt-types/utils";
import type ApplicationV2 from "../../client-esm/applications/api/application.d.mts";
import type { Document } from "../../common/abstract/module.d.mts";
import type {
  DatabaseCreateOperation,
  DatabaseDeleteOperation,
  DatabaseUpdateOperation,
} from "../../common/abstract/_types.d.mts";

// Gets a key with a required shape to conform to which is also used as a fallback when the key doesn't exist.
type GetKeyWithShape<T, K, S> = K extends keyof T ? MakeConform<T[K], S> : S;

declare global {
  /**
   * An Abstract Base Class which defines a Placeable Object which represents a Document placed on the Canvas
   */
  abstract class PlaceableObject<
    D extends PlaceableObject.CanvasDocument = PlaceableObject.CanvasDocument,
  > extends RenderFlagsMixin(PIXI.Container) {
    /**
     * @param document - The Document instance which is represented by this object
     */
    constructor(document: D);

    /**
     * Retain a reference to the Scene within which this Placeable Object resides
     */
    scene: Scene.Implementation;

    /**
     * A reference to the Scene embedded Document instance which this object represents
     */
    document: D;

    /**
     * A control icon for interacting with the object
     * @defaultValue `null`
     * @remarks `undefined` is returned by subclasses only
     */
    controlIcon: ControlIcon | null | undefined;

    /**
     * A mouse interaction manager instance which handles mouse workflows related to this object.
     * @defaultValue `null`
     */
    mouseInteractionManager: MouseInteractionManager<this> | null;

    /**
     * Allow objects to be culled when off-screen
     * @defaultValue `false`
     */
    override cullable: boolean;

    /**
     * Identify the official Document name for this PlaceableObject class
     * @remarks This is abstract in {@link PlaceableObject | `PlaceableObject`}.
     */
    static embeddedName: string;

    /**
     * The flags declared here are required for all PlaceableObject subclasses to also support.
     */
    static override RENDER_FLAGS: InterfaceToObject<PlaceableObject.RENDER_FLAGS>;

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
    get layer(): PlaceableObject.Layer<D>;

    /**
     * A Form Application which is used to configure the properties of this Placeable Object or the Document it
     * represents.
     */
    get sheet(): PlaceableObject.Sheet<D>;

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
     * @remarks Calls the titular method of `this.layer`. If `position` is not provided or nullish, passes `this.document` instead
     */
    getSnappedPosition(position?: Canvas.Point | null): Canvas.Point;

    override applyRenderFlags(): void;

    /**
     * Apply render flags before a render occurs.
     * @param flags - The render flags which must be applied
     */
    protected _applyRenderFlags(flags: PlaceableObject.RenderFlags): void;

    /**
     * Clear the display of the existing object
     * @returns The cleared object
     * @remarks Some subclasses return void
     */
    clear(): this | void;

    override destroy(options?: PIXI.IDestroyOptions | boolean): void;

    /**
     * The inner _destroy method which may optionally be defined by each PlaceableObject subclass.
     * @param options - Options passed to the initial destroy call
     */
    protected _destroy(options?: PIXI.IDestroyOptions | boolean): void;

    /**
     * Draw the placeable object into its parent container
     * @returns The drawn object
     */
    draw(options?: HandleEmptyObject<PlaceableObject.DrawOptions>): Promise<this>;

    /**
     * The inner _draw method which must be defined by each PlaceableObject subclass.
     * @param options - Options which may modify the draw workflow
     * @remarks The options passed to {@link PlaceableObject.draw | `PlaceableObject#draw`} get forwarded here
     */
    protected abstract _draw(options: undefined): Promise<void>;

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
    protected _onCreate(
      data: foundry.data.fields.SchemaField.AssignmentData<D["schema"]["fields"]>,
      options: Document.Database.CreateOptions<DatabaseCreateOperation>,
      userId: string,
    ): void;

    /**
     * Define additional steps taken when an existing placeable object of this type is updated with new data
     * @remarks Called without options and userId in Drawing._onUpdate
     */
    protected _onUpdate(
      changed: foundry.data.fields.SchemaField.AssignmentData<D["schema"]["fields"]>,
      options?: Document.Database.UpdateOptions<DatabaseUpdateOperation>,
      userId?: string,
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
    protected _onControl(options: PlaceableObject.ControlOptions | undefined): void;

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
    protected _onRelease(options: HandleEmptyObject<PlaceableObject.ReleaseOptions> | undefined): void;

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
    rotate(angle: number, snap: number): Promise<this>;

    /**
     * Determine a new angle of rotation for a PlaceableObject either from an explicit angle or from a delta offset.
     * @param options - An object which defines the rotation update parameters
     * @returns The new rotation angle for the object
     */
    protected _updateRotation({ angle, delta, snap }?: PlaceableObject.UpdateRotationOptions): number;

    /**
     * Obtain a shifted position for the Placeable Object
     * @param dx - The number of grid units to shift along the X-axis
     * @param dy - The number of grid units to shift along the Y-axis
     * @returns The shifted target coordinates
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
     */
    can(user: User.Implementation, action: PlaceableObject.Action): boolean;

    /**
     * Can the User access the HUD for this Placeable Object?
     * @param user  - The User performing the action.
     * @param event - The event object.
     * @returns The returned status.
     */
    protected _canHUD(user: User.Implementation, event?: PIXI.FederatedEvent): boolean;

    /**
     * Does the User have permission to configure the Placeable Object?
     * @param user  - The User performing the action.
     * @param event - The event object.
     * @returns The returned status.
     */
    protected _canConfigure(user: User.Implementation, event?: PIXI.FederatedEvent): boolean;

    /**
     * Does the User have permission to control the Placeable Object?
     * @param user  - The User performing the action.
     * @param event - The event object.
     * @returns The returned status.
     */
    protected _canControl(user: User.Implementation, event?: PIXI.FederatedEvent): boolean;

    /**
     * Does the User have permission to view details of the Placeable Object?
     * @param user  - The User performing the action.
     * @param event - The event object.
     * @returns The returned status.
     */
    protected _canView(user: User.Implementation, event?: PIXI.FederatedEvent): boolean;

    /**
     * Does the User have permission to create the underlying Document?
     * @param user  - The User performing the action.
     * @param event - The event object.
     * @returns The returned status.
     */
    protected _canCreate(user: User.Implementation, event?: PIXI.FederatedEvent): boolean;

    /**
     * Does the User have permission to drag this Placeable Object?
     * @param user  - The User performing the action.
     * @param event - The event object.
     * @returns The returned status.
     */
    protected _canDrag(user: User.Implementation, event?: PIXI.FederatedEvent): boolean;

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
    protected _canHover(user: User.Implementation, event?: PIXI.FederatedEvent): boolean;

    /**
     * Does the User have permission to update the underlying Document?
     * @param user  - The User performing the action.
     * @param event - The event object.
     * @returns The returned status.
     */
    protected _canUpdate(user: User.Implementation, event?: PIXI.FederatedEvent): boolean;

    /**
     * Does the User have permission to delete the underlying Document?
     * @param user  - The User performing the action.
     * @param event - The event object.
     * @returns The returned status.
     */
    protected _canDelete(user: User.Implementation, event?: PIXI.FederatedEvent): boolean;

    /**
     * Actions that should be taken for this Placeable Object when a mouseover event occurs.
     * Hover events on PlaceableObject instances allow event propagation by default.
     * @see `MouseInteractionManager##handlePointerOver`
     * @param event   - The triggering canvas interaction event
     * @param options - Options which customize event handling
     *                  (default: `{}`)
     */
    //options: not null (destructured)
    protected _onHoverIn(event: PIXI.FederatedEvent, options?: PlaceableObject.HoverInOptions): false | void;

    /**
     * Actions that should be taken for this Placeable Object when a mouseout event occurs
     * @see `MouseInteractionManager##handlePointerOut`
     * @param event - The triggering canvas interaction event
     * @returns True if the event was handled, otherwise false
     */
    protected _onHoverOut(event: PIXI.FederatedEvent): boolean | void;

    /**
     * Should the placeable propagate left click downstream?
     */
    protected _propagateLeftClick(event: PIXI.FederatedEvent): boolean;

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
     */
    protected _propagateRightClick(event: PIXI.FederatedEvent): boolean;

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
    protected _prepareDragLeftDropUpdates(event: PIXI.FederatedEvent): PlaceableObject.DragLeftDropUpdate[] | null;

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

  namespace PlaceableObject {
    interface Any extends AnyPlaceableObject {}
    interface AnyConstructor extends Identity<typeof AnyPlaceableObject> {}

    type CanvasDocument = Document.ImplementationInstanceFor<Document.PlaceableType>;

    interface RENDER_FLAGS {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<this>;

      /** @defaultValue `{ propagate: ["refreshState"], alias: true }` */
      refresh: RenderFlag<this>;

      /** @defaultValue `{}` */
      refreshState: RenderFlag<this>;
    }

    type Layer<Doc extends CanvasDocument> = GetKeyWithShape<Doc, "layer", InteractionLayer>;

    type Sheet<Doc extends CanvasDocument> = GetKeyWithShape<
      Doc,
      "sheet",
      FormApplication.Any | ApplicationV2.Any | null
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
     * */
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ReleaseOptions {}

    /** @internal */
    type __UpdateRotationOptions = NullishProps<{
      /**
       * An explicit angle, either this or delta must be provided
       * @defaultValue `undefined`
       * @remarks Checked first. If non-numeric, ignored in favour of `delta`
       */
      angle: number;
    }> &
      InexactPartial<{
        /**
         * A relative angle delta, either this or the angle must be provided
         * @defaultValue `0`
         * @remarks Can't be null as it only has a parameter default.
         *
         * Only used if `angle` is non-numeric
         */
        delta: number;

        /**
         * A precision (in degrees) to which the resulting angle should snap. Default is 0.
         * @defaultValue `0`
         * @remarks Can't be null as it only has a parameter default.
         *
         * @see {@link Number.toNearest | `Number#toNearest`}
         */
        snap: number;
      }>;
    interface UpdateRotationOptions extends __UpdateRotationOptions {}

    interface HoverInOptions {
      /**
       * Trigger hover-out behavior on sibling objects
       * @defaultValue `false`
       */
      hoverOutOthers: boolean;
    }

    /**
     * @remarks {@link PlaceableObject.can | `PlaceableObject#can`} calls `#titleCase()` on this before
     * prepending `"_can"`, rendering `"HUD"` (as there's no `PlaceableObject#_canHud()`), and any
     * actions with more than a single capital in their name (e.g `"DragLeftStart"`) inert, so they
     * have been omitted here.
     */
    type Action = "configure" | "control" | "view" | "create" | "drag" | "hover" | "update" | "delete" | (string & {});

    interface DragLeftDropUpdate {
      _id: string;
      x: number;
      y: number;
      rotation: number | undefined;
    }
  }
}

interface Vision {
  /**
   * @privateRemarks Documentation says PIXI.Circle, but determined by Atropos to be out of date.
   * Likely to be removed in future version as it's no longer used generally.
   */
  fov?: PIXI.Polygon | undefined;

  /**
   * @remarks
   * This is required but has been set to optional because of PointSource
   */
  los?: PointSourcePolygon | undefined;
}

declare abstract class AnyPlaceableObject extends PlaceableObject<PlaceableObject.CanvasDocument> {
  constructor(arg0: never, ...args: never[]);
}
