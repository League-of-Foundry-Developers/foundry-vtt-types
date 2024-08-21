import type { ValueOf } from "../../../types/utils.d.mts";
import type {
  DocumentOnCreateOptions,
  DocumentOnDeleteOptions,
  DocumentOnUpdateOptions,
} from "../../common/abstract/document.d.mts";
import type { Document } from "../../common/abstract/module.d.mts";

declare global {
  /**
   * An Abstract Base Class which defines a Placeable Object which represents a Document placed on the Canvas
   */
  abstract class PlaceableObject<
    D extends Document<any, any, Scene.ConfiguredInstance | null> = Document<any, any, Scene.ConfiguredInstance | null>,
  > extends RenderFlagsMixin(PIXI.Container) {
    /**
     * @param document - The Document instance which is represented by this object
     */
    constructor(document: D);

    /** @internal */
    protected _original?: this | undefined;

    /**
     * Retain a reference to the Scene within which this Placeable Object resides
     */
    scene: Scene.ConfiguredInstance;

    /**
     * A reference to the Scene embedded Document instance which this object represents
     */
    document: D;

    /**
     * The underlying data object which provides the basis for this placeable object
     * @deprecated since v10, will be removed in v12
     * @remarks `"You are accessing PlaceableObject#data which is no longer used and instead the Document class should be referenced directly as PlaceableObject#document."`
     */
    data: D;

    /**
     * Track the field of vision for the placeable object.
     * This is necessary to determine whether a player has line-of-sight towards a placeable object or vice-versa
     * @defaultValue `{ fov: undefined, los: undefined }`
     */
    vision: Vision;

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
    cullable: boolean;

    /**
     * Identify the official Document name for this PlaceableObject class
     * @remarks This is abstract in {@link PlaceableObject}.
     */
    static embeddedName: string;

    /**
     * The flags declared here are required for all PlaceableObject subclasses to also support.
     */
    static override RENDER_FLAGS: {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<PlaceableObject.RenderFlags>;

      /** @defaultValue `{ propagate: ["refreshState"], alias: true }` */
      refresh: RenderFlag<PlaceableObject.RenderFlags>;

      /** @defaultValue `{}` */
      refreshState: RenderFlag<PlaceableObject.RenderFlags>;
    };

    /**
     * Passthrough certain drag operations on locked objects.
     * @defaultValue `false`
     */
    protected _dragPassthrough: boolean;

    /**
     * Know if a placeable is in the hover-in state.
     * @defaultValue `false`
     */
    protected _isHoverIn: boolean;

    /**
     * The mouse interaction state of this placeable.
     */
    get interactionState(): ValueOf<typeof MouseInteractionManager.INTERACTION_STATES> | undefined;

    /**
     * The bounding box for this PlaceableObject.
     * This is required if the layer uses a Quadtree, otherwise it is optional
     */
    abstract get bounds(): Rectangle;

    /**
     * The central coordinate pair of the placeable object based on it's own width and height
     * @remarks `{ x: number, y: number }` has been added because of `Token.center`
     */
    get center(): PIXI.Point | { x: number; y: number };

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
     * The field-of-vision polygon for the object, if it has been computed
     */
    get fov(): this["vision"]["fov"];

    /**
     * Provide a reference to the CanvasLayer which contains this PlaceableObject.
     */
    get layer(): "layer" extends keyof D ? D["layer"] : PIXI.Container;

    /**
     * The line-of-sight polygon for the object, if it has been computed
     */
    get los(): this["vision"]["los"];

    /**
     * A Form Application which is used to configure the properties of this Placeable Object or the Document it
     * represents.
     */
    get sheet(): "sheet" extends keyof D ? D["sheet"] : FormApplication | null;

    /**
     * An indicator for whether the object is currently controlled
     */
    get controlled(): boolean;

    /**
     * An indicator for whether the object is currently a hover target
     */
    get hover(): boolean;

    set hover(state);

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

    override destroy(options?: Parameters<PIXI.Container["destroy"]>[0]): void;

    /**
     * The inner _destroy method which may optionally be defined by each PlaceableObject subclass.
     * @param options - Options passed to the initial destroy call
     */
    protected _destroy(options?: PIXI.IDestroyOptions | boolean): void;

    /**
     * Draw the placeable object into its parent container
     * @returns The drawn object
     */
    draw(options?: Record<string, unknown>): Promise<this>;

    /**
     * The inner _draw method which must be defined by each PlaceableObject subclass.
     * @param options - Options which may modify the draw workflow
     */
    protected abstract _draw(options?: Record<string, unknown>): Promise<void>;

    /**
     * Refresh all incremental render flags for the PlaceableObject.
     * This method is no longer used by the core software but provided for backwards compatibility.
     * @param options - Options which may modify the refresh workflow
     * @returns The refreshed object
     */
    refresh(options?: Record<string, unknown>): this;

    /**
     * Update the quadtree.
     */
    protected _updateQuadtree(): void;

    /* -------------------------------------------- */

    /**
     * Get the target opacity that should be used for a Placeable Object depending on its preview state.
     */
    protected _getTargetAlpha(): number;

    /**
     * Register pending canvas operations which should occur after a new PlaceableObject of this type is created
     */
    protected _onCreate(
      data: foundry.data.fields.SchemaField.InnerAssignmentType<D["schema"]["fields"]>,
      options: DocumentOnCreateOptions<D["documentName"]>,
      userId: string,
    ): void;

    /**
     * Define additional steps taken when an existing placeable object of this type is updated with new data
     * @remarks Called without options and userId in Drawing._onUpdate
     */
    protected _onUpdate(
      changed: foundry.data.fields.SchemaField.InnerAssignmentType<D["schema"]["fields"]>,
      options?: DocumentOnUpdateOptions<D["documentName"]>,
      userId?: string,
    ): void;

    /**
     * Define additional steps taken when an existing placeable object of this type is deleted
     */
    protected _onDelete(options: DocumentOnDeleteOptions<D["documentName"]>, userId: string): void;

    /**
     * Assume control over a PlaceableObject, flagging it as controlled and enabling downstream behaviors
     * @param options - Additional options which modify the control request
     *                  (default: `{}`)
     * @returns A flag denoting whether control was successful
     */
    control(options?: PlaceableObject.ControlOptions): boolean;

    /**
     * Additional events which trigger once control of the object is established
     * @param options - Optional parameters which apply for specific implementations
     */
    protected _onControl(options?: PlaceableObject.ControlOptions): void;

    /**
     * Release control over a PlaceableObject, removing it from the controlled set
     * @param options - Options which modify the releasing workflow
     *                  (default: `{}`)
     * @returns A Boolean flag confirming the object was released.
     */
    release(options?: PlaceableObject.ReleaseOptions): boolean;

    /**
     * Additional events which trigger once control of the object is released
     * @param options - Options which modify the releasing workflow
     */
    protected _onRelease(options?: PlaceableObject.ReleaseOptions): void;

    /**
     * Clone the placeable object, returning a new object with identical attributes.
     * The returned object is non-interactive, and has no assigned ID.
     * If you plan to use it permanently you should call the create method.
     * @returns A new object with identical data
     */
    clone(): PlaceableObject;

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
     * @param angle - An explicit angle, either this or delta must be provided
     *                (default: `null`)
     * @param delta - A relative angle delta, either this or the angle must be provided
     *                (default: `0`)
     * @param snap  - A precision (in degrees) to which the resulting angle should snap.
     *                (default: `0`)
     * @returns The new rotation angle for the object
     */
    protected _updateRotation({
      angle,
      delta,
      snap,
    }?: {
      /**
       * An explicit angle, either this or delta must be provided
       * @defaultValue `undefined`
       */
      angle?: number;

      /**
       * A relative angle delta, either this or the angle must be provided
       * @defaultValue `0`
       */
      delta?: number;

      /**
       * A precision (in degrees) to which the resulting angle should snap. Default is 0.
       * @defaultValue `0`
       */
      snap?: number;
    }): number;

    /**
     * Obtain a shifted position for the Placeable Object
     * @param dx - The number of grid units to shift along the X-axis
     * @param dy - The number of grid units to shift along the Y-axis
     * @returns The shifted target coordinates
     */
    protected _getShiftedPosition(dx: number, dy: number): { x: number; y: number };

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
    can(
      user: User.ConfiguredInstance,
      action: "HUD" | "configure" | "control" | "view" | "create" | "drag" | "hover" | "update" | "delete" | string,
    ): boolean;

    /**
     * Can the User access the HUD for this Placeable Object?
     * @param user  - The User performing the action.
     * @param event - The event object.
     * @returns The returned status.
     */
    protected _canHUD(user: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    /**
     * Does the User have permission to configure the Placeable Object?
     * @param user  - The User performing the action.
     * @param event - The event object.
     * @returns The returned status.
     */
    protected _canConfigure(user: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    /**
     * Does the User have permission to control the Placeable Object?
     * @param user  - The User performing the action.
     * @param event - The event object.
     * @returns The returned status.
     */
    protected _canControl(user: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    /**
     * Does the User have permission to view details of the Placeable Object?
     * @param user  - The User performing the action.
     * @param event - The event object.
     * @returns The returned status.
     */
    protected _canView(user: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    /**
     * Does the User have permission to create the underlying Document?
     * @param user  - The User performing the action.
     * @param event - The event object.
     * @returns The returned status.
     */
    protected _canCreate(user: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    /**
     * Does the User have permission to drag this Placeable Object?
     * @param user  - The User performing the action.
     * @param event - The event object.
     * @returns The returned status.
     */
    protected _canDrag(user: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    /**
     * Does the User have permission to hover on this Placeable Object?
     * @param user  - The User performing the action.
     * @param event - The event object.
     * @returns The returned status.
     */
    protected _canHover(user: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    /**
     * Does the User have permission to update the underlying Document?
     * @param user  - The User performing the action.
     * @param event - The event object.
     * @returns The returned status.
     */
    protected _canUpdate(user: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    /**
     * Does the User have permission to delete the underlying Document?
     * @param user  - The User performing the action.
     * @param event - The event object.
     * @returns The returned status.
     */
    protected _canDelete(user: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    /**
     * Actions that should be taken for this Placeable Object when a mouseover event occurs.
     * Hover events on PlaceableObject instances allow event propagation by default.
     * @see MouseInteractionManager##handleMouseOver
     * @param event   - The triggering canvas interaction event
     * @param options - Options which customize event handling
     *                  (default: `{}`)
     * @returns True if the event was handled, otherwise false
     */
    protected _onHoverIn(event: PIXI.FederatedEvent, options?: PlaceableObject.HoverInOptions): false | void;

    /**
     * Actions that should be taken for this Placeable Object when a mouseout event occurs
     * @see MouseInteractionManager##handleMouseOut
     * @param event - The triggering canvas interaction event
     * @returns True if the event was handled, otherwise false
     */
    protected _onHoverOut(event: PIXI.FederatedEvent): boolean | void;

    /**
     * Should the placeable propagate left click downstream?
     * @defaultValue `false`
     */
    protected _propagateLeftClick(event: PIXI.FederatedEvent): boolean;

    /**
     * Callback actions which occur on a single left-click event to assume control of the object
     * @see MouseInteractionManager##handleClickLeft
     * @param event - The triggering canvas interaction event
     */
    protected _onClickLeft(event: PIXI.FederatedEvent): void;

    /**
     * Callback actions which occur on a double left-click event to activate
     * @see MouseInteractionManager##handleClickLeft2
     * @param event - The triggering canvas interaction event
     */
    protected _onClickLeft2(event: PIXI.FederatedEvent): void;

    /**
     * Callback actions which occur on a single right-click event to configure properties of the object
     * @see MouseInteractionManager##handleClickRight
     * @param event - The triggering canvas interaction event
     */
    protected _onClickRight(event: PIXI.FederatedEvent): void;

    /**
     * Callback actions which occur on a double right-click event to configure properties of the object
     * @see MouseInteractionManager##handleClickRight2
     * @param event - The triggering canvas interaction event
     */
    protected _onClickRight2(event: PIXI.FederatedEvent): void;

    /**
     * Callback actions which occur when a mouse-drag action is first begun.
     * @see MouseInteractionManager##handleDragStart
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
     * @see MouseInteractionManager##handleDragMove
     * @param event - The triggering canvas interaction event
     */
    protected _onDragLeftMove(event: PIXI.FederatedEvent): void;

    /**
     * Callback actions which occur on a mouse-move operation.
     * @see MouseInteractionManager##handleDragDrop
     * @param event - The triggering canvas interaction event
     */
    protected _onDragLeftDrop(event: PIXI.FederatedEvent): Promise<unknown>;

    /**
     * Callback actions which occur on a mouse-move operation.
     * @see MouseInteractionManager##handleDragCancel
     * @param event - The triggering mouse click event
     */
    protected _onDragLeftCancel(event: PIXI.FederatedEvent): void;

    /**
     * Callback action which occurs on a long press.
     * @see MouseInteractionManager##handleLongPress
     * @param event  - The triggering canvas interaction event
     * @param origin - The local canvas coordinates of the mousepress.
     */
    protected _onLongPress(event: PIXI.FederatedEvent, origin: PIXI.Point): void;
  }

  namespace PlaceableObject {
    interface RenderFlags {
      redraw: boolean;

      refresh: boolean;

      refreshState: boolean;
    }

    interface ControlOptions {
      /**
       * Release any other controlled objects first
       */
      releaseOthers?: boolean;
    }

    interface ReleaseOptions {
      trigger?: boolean;
    }

    interface HoverInOptions {
      /**
       * Trigger hover-out behavior on sibling objects
       * @defaultValue `false`
       */
      hoverOutOthers: boolean;
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
