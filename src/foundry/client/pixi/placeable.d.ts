import { ConfiguredDocumentClass } from "../../../types/helperTypes";
import { DocumentModificationOptions } from "../../common/abstract/document.mjs";
import { Document } from "../../common/abstract/module.mjs";

declare global {
  /**
   * An Abstract Base Class which defines a Placeable Object which represents a Document placed on the Canvas
   */
  abstract class PlaceableObject<
    D extends Document<any, InstanceType<ConfiguredDocumentClass<typeof Scene>>> = Document<
      any,
      InstanceType<ConfiguredDocumentClass<typeof Scene>>
    >
  > extends PIXI.Container {
    /**
     * @param document - The Document instance which is represented by this object
     */
    constructor(document: D);

    /** @internal */
    protected _original?: this | undefined;

    /**
     * Retain a reference to the Scene within which this Placeable Object resides
     */
    scene: InstanceType<ConfiguredDocumentClass<typeof Scene>>;

    /**
     * A reference to the Scene embedded Document instance which this object represents
     */
    document: D;

    /**
     * The underlying data object which provides the basis for this placeable object
     */
    data: D["data"];

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
     * An indicator for whether the object is currently controlled
     * @defaultValue `false`
     */
    protected _controlled: boolean;

    /**
     * An indicator for whether the object is currently a hover target
     * @defaultValue `false`
     */
    protected _hover: boolean;

    /**
     * Identify the official Document name for this PlaceableObject class
     * @remarks This is abstract in {@link PlaceableObject}.
     */
    static embeddedName: string;

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
     * Test whether a user can perform a certain interaction with regards to a Placeable Object
     * @param user   - The User performing the action
     * @param action - The named action being attempted
     * @returns Does the User have rights to perform the action?
     */
    can(
      user: InstanceType<ConfiguredDocumentClass<typeof User>>,
      action: "HUD" | "configure" | "control" | "view" | "create" | "drag" | "hover" | "update" | "delete" | string
    ): boolean;

    /**
     * Can the User access the HUD for this Placeable Object?
     */
    protected _canHUD(user: InstanceType<ConfiguredDocumentClass<typeof User>>, event?: any): boolean;

    /**
     * Does the User have permission to configure the Placeable Object?
     */
    protected _canConfigure(user: InstanceType<ConfiguredDocumentClass<typeof User>>, event?: any): boolean;

    /**
     * Does the User have permission to control the Placeable Object?
     */
    protected _canControl(user: InstanceType<ConfiguredDocumentClass<typeof User>>, event?: any): boolean;

    /**
     * Does the User have permission to view details of the Placeable Object?
     */
    protected _canView(user: InstanceType<ConfiguredDocumentClass<typeof User>>, event?: any): boolean;

    /**
     * Does the User have permission to create the underlying Document?
     */
    protected _canCreate(user: InstanceType<ConfiguredDocumentClass<typeof User>>, event?: any): boolean;

    /**
     * Does the User have permission to drag this Placeable Object?
     */
    protected _canDrag(user: InstanceType<ConfiguredDocumentClass<typeof User>>, event?: any): boolean;

    /**
     * Does the User have permission to hover on this Placeable Object?
     */
    protected _canHover(user: InstanceType<ConfiguredDocumentClass<typeof User>>, event?: any): boolean;

    /**
     * Does the User have permission to update the underlying Document?
     */
    protected _canUpdate(user: InstanceType<ConfiguredDocumentClass<typeof User>>, event?: any): boolean;

    /**
     * Does the User have permission to delete the underlying Document?
     */
    protected _canDelete(user: InstanceType<ConfiguredDocumentClass<typeof User>>, event?: any): boolean;

    /**
     * Clear the display of the existing object
     * @returns The cleared object
     */
    clear(): this;

    /**
     * Clone the placeable object, returning a new object with identical attributes
     * The returned object is non-interactive, and has no assigned ID
     * If you plan to use it permanently you should call the create method
     *
     * @returns A new object with identical data
     */
    clone(): this;

    override destroy(options?: Parameters<PIXI.Container["destroy"]>[0]): void;

    /**
     * Draw the placeable object into its parent container
     * @returns The drawn object
     */
    abstract draw(): Promise<this>;

    /**
     * Refresh the current display state of the Placeable Object
     * @returns The refreshed object
     * @remarks `void` has been added because of `Drawing.refresh`
     */
    abstract refresh(): this | void;

    /**
     * Register pending canvas operations which should occur after a new PlaceableObject of this type is created
     */
    protected _onCreate(data: D["data"]["_source"], options: DocumentModificationOptions, userId: string): void;

    /**
     * Define additional steps taken when an existing placeable object of this type is updated with new data
     * @remarks Called without options and userId in Drowing._onUpdate
     */
    protected _onUpdate(
      changed: DeepPartial<D["data"]["_source"]>,
      options?: DocumentModificationOptions,
      userId?: string
    ): void;

    /**
     * Define additional steps taken when an existing placeable object of this type is deleted
     */
    protected _onDelete(options: DocumentModificationOptions, userId: string): void;

    /**
     * Assume control over a PlaceableObject, flagging it as controlled and enabling downstream behaviors
     * @param options - Additional options which modify the control request
     *                  (default: `{}`)
     * @returns A flag denoting whether or not control was successful
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
    protected _updateRotation({ angle, delta, snap }?: RotationOptions): number;

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
     * Actions that should be taken for this Placeable Object when a mouseover event occurs
     * @see MouseInteractionManager#_handleMouseOver
     * @param event   - The triggering canvas interaction event
     * @param options - Options which customize event handling
     *                  (default: `{}`)
     */
    protected _onHoverIn(event: PIXI.InteractionEvent, options?: HoverInOptions): false | void;

    /**
     * Actions that should be taken for this Placeable Object when a mouseout event occurs
     * @param event - The triggering canvas interaction event
     */
    protected _onHoverOut(event: PIXI.InteractionEvent): false | void;

    /**
     * Callback actions which occur on a single left-click event to assume control of the object
     * @see MouseInteractionManager#_handleClickLeft
     * @param event - The triggering canvas interaction event
     */
    protected _onClickLeft(event: PIXI.InteractionEvent): boolean | void;

    /**
     * Callback actions which occur on a double left-click event to activate
     * @see MouseInteractionManager#_handleClickLeft2
     * @param event - The triggering canvas interaction event
     */
    protected _onClickLeft2(event: PIXI.InteractionEvent): void;

    /**
     * Callback actions which occur on a single right-click event to configure properties of the object
     * @see MouseInteractionManager#_handleClickRight
     * @param event - The triggering canvas interaction event
     */
    protected _onClickRight(event: PIXI.InteractionEvent): void;

    /**
     * Callback actions which occur on a double right-click event to configure properties of the object
     * @see MouseInteractionManager#_handleClickRight2
     * @param event - The triggering canvas interaction event
     */
    protected _onClickRight2(event: PIXI.InteractionEvent): void;

    /**
     * Callback actions which occur when a mouse-drag action is first begun.
     * @see MouseInteractionManager#_handleDragStart
     * @param event - The triggering canvas interaction event
     */
    protected _onDragLeftStart(event: PIXI.InteractionEvent): void;

    /**
     * Callback actions which occur on a mouse-move operation.
     * @see MouseInteractionManager#_handleDragMove
     * @param event - The triggering canvas interaction event
     */
    protected _onDragLeftMove(event: PIXI.InteractionEvent): void;

    /**
     * Callback actions which occur on a mouse-move operation.
     * @see MouseInteractionManager#_handleDragDrop
     * @param event - The triggering canvas interaction event
     */
    protected _onDragLeftDrop(event: PIXI.InteractionEvent): unknown;

    /**
     * Callback actions which occur on a mouse-move operation.
     * @see MouseInteractionManager#_handleDragCancel
     * @param event - The triggering mouse click event
     */
    protected _onDragLeftCancel(event: MouseEvent): void;
  }

  namespace PlaceableObject {
    interface ControlOptions {
      /**
       * Release any other controlled objects first
       */
      releaseOthers?: boolean;
    }

    interface ReleaseOptions {
      trigger?: boolean;
    }
  }
}

interface Vision {
  /**
   * @remarks
   * This is required but has been set to optional because of PointSource
   */
  fov?: PIXI.Circle | undefined;

  /**
   * @remarks
   * This is required but has been set to optional because of PointSource
   */
  los?: PointSourcePolygon | undefined;
}

interface RotationOptions {
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
}

interface HoverInOptions {
  /**
   * Trigger hover-out behavior on sibling objects
   *
   * @defaultValue `true`
   */
  hoverOutOthers: boolean;
}
