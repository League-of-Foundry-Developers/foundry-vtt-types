/**
 * An Abstract Base Class which defines a Placeable Object which represents an Entity placed on the Canvas
 */
declare abstract class PlaceableObject<D extends PlaceableObject.Data = PlaceableObject.Data> extends PIXI.Container {
  /**
   * @param data  - The underlying embedded document data for the placeable type
   * @param scene - The parent scene that this object belongs to (if any)
   */
  constructor(data?: DeepPartial<D>, scene?: PlaceableObject['scene']);

  /**
   * The underlying data object which provides the basis for this placeable object
   */
  data: D;

  /**
   * Retain a reference to the Scene within which this Placeable Object resides
   */
  scene: Scene;

  /**
   * Track the field of vision for the placeable object.
   * This is necessary to determine whether a player has line-of-sight towards a placeable object or vice-versa
   * @defaultValue `{ fov: null, los: null }`
   */
  vision: PlaceableObject.Vision;

  /**
   * A control icon for interacting with the object
   * @defaultValue `null`
   */
  controlIcon: ControlIcon | null;

  /**
   * A mouse interaction manager instance which handles mouse workflows related to this object.
   * @defaultValue `null`
   */
  mouseInteractionManager: MouseInteractionManager | null;

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
   * A singleton reference to the FormApplication class which configures this object
   * @defaultValue `null`
   */
  protected _sheet: FormApplication | null;

  /**
   * The bounding box for this PlaceableObject.
   * This is required if the layer uses a Quadtree, otherwise it is optional
   */
  abstract get bounds(): NormalizedRectangle;

  /**
   * The central coordinate pair of the placeable object based on it's own width and height
   */
  get center(): PIXI.Point;

  /**
   * The _id of the underlying EmbeddedEntity
   */
  get id(): string;

  /**
   * The field-of-vision polygon for the object, if it has been computed
   */
  get fov(): PIXI.Polygon | null;

  /**
   * Identify the official EmbeddedEntity name for this PlaceableObject class
   * @remarks This getter is abstract in {@link PlaceableObject}.
   */
  static get embeddedName(): never;

  /**
   * Provide a reference to the canvas layer which contains placeable objects of this type
   */
  static get layer(): PlaceablesLayer;

  /**
   * @see {@link PlaceableObject.layer}
   */
  get layer(): PlaceablesLayer;

  /**
   * The line-of-sight polygon for the object, if it has been computed
   */
  get los(): PIXI.Polygon | null;

  /**
   * A Form Application which is used to configure the properties of this Placeable Object or the EmbeddedEntity
   * it represents.
   */
  get sheet(): FormApplication;

  /**
   * A Universally Unique Identifier (uuid) for this EmbeddedEntity
   */
  get uuid(): string;

  /**
   * Test whether a user can perform a certain interaction with regards to a Placeable Object
   * @param user   - The User performing the action
   * @param action - The named action being attempted
   * @returns Does the User have rights to perform the action?
   */
  can(user: User, action: string): boolean;

  /**
   * Can the User access the HUD for this Placeable Object?
   * @param user  - (unused)
   * @param event - (unused)
   */
  protected _canHUD(user?: any, event?: any): boolean;

  /**
   * Does the User have permission to configure the Placeable Object?
   * @param event - (unused)
   */
  protected _canConfigure(user: User, event?: any): boolean;

  /**
   * Does the User have permission to control the Placeable Object?
   * @param event - (unused)
   */
  protected _canControl(user: User, event?: any): boolean;

  /**
   * Does the User have permission to view details of the Placeable Object?
   * @param event - (unused)
   */
  protected _canView(user: User, event?: any): boolean;

  /**
   * Does the User have permission to create the underlying Embedded Entity?
   * @param event - (unused)
   */
  protected _canCreate(user: User, event?: any): boolean;

  /**
   * Does the User have permission to drag this Placeable Object?
   * @param event - (unused)
   */
  protected _canDrag(user: User, event?: any): boolean;

  /**
   * Does the User have permission to hover on this Placeable Object?
   * @param event - (unused)
   */
  protected _canHover(user: User, event?: any): boolean;

  /**
   * Does the User have permission to update the underlying Embedded Entity?
   * @param event - (unused)
   */
  protected _canUpdate(user: User, event?: any): boolean;

  /**
   * Does the User have permission to delete the underlying Embedded Entity?
   * @param event - (unused)
   */
  protected _canDelete(user: User, event?: any): boolean;

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
  clone(): PlaceableObject<D>;

  /**
   * Draw the placeable object into its parent container
   * @returns The drawn object
   */
  abstract draw(): Promise<PlaceableObject<D>>;

  /**
   * Draw the primary Sprite for the PlaceableObject
   */
  protected _drawPrimarySprite(texture: PIXI.Texture): PIXI.Sprite | null;

  /**
   * Refresh the current display state of the Placeable Object
   * @returns The refreshed object
   */
  abstract refresh(): PlaceableObject<D>;

  static create<T extends PlaceableObject>(
    data: DeepPartial<T['data']>,
    options?: Entity.CreateOptions
  ): Promise<T | void>;
  static create<T extends PlaceableObject>(
    data: DeepPartial<T['data']>[],
    options?: Entity.CreateOptions
  ): Promise<T[] | void>;

  update(data: DeepPartial<D>, options?: Entity.UpdateOptions): Promise<this>;

  delete(options?: Entity.DeleteOptions): Promise<this>;

  /**
   * Get the value of a "flag" for this PlaceableObject
   * See the setFlag method for more details on flags
   *
   * @param scope - The flag scope which namespaces the key
   * @param key   - The flag key
   * @returns The flag value
   */
  getFlag(scope: string, key: string): unknown;

  /**
   * Assign a "flag" to this Entity.
   * Flags represent key-value type data which can be used to store flexible or arbitrary data required by either
   * the core software, game systems, or user-created modules.
   *
   * Each flag should be set using a scope which provides a namespace for the flag to help prevent collisions.
   *
   * Flags set by the core software use the "core" scope.
   * Flags set by game systems or modules should use the canonical name attribute for the module
   * Flags set by an individual world should "world" as the scope.
   *
   * Flag values can assume almost any data type. Setting a flag value to null will delete that flag.
   *
   * @param scope - The flag scope which namespaces the key
   * @param key   - The flag key
   * @param value - The flag value
   *
   * @returns A Promise resolving to the updated PlaceableObject
   */
  setFlag(scope: string, key: string, value: any): Promise<this>;

  /**
   * Remove a flag assigned to the Entity
   * @param scope - The flag scope which namespaces the key
   * @param key   - The flag key
   * @returns A Promise resolving to the updated Entity
   */
  unsetFlag(scope: string, key: string): Promise<this>;

  /**
   * Register pending canvas operations which should occur after a new PlaceableObject of this type is created
   */
  protected _onCreate(): void;

  /**
   * Define additional steps taken when an existing placeable object of this type is updated with new data
   */
  protected _onUpdate(data: D): void;

  /**
   * Define additional steps taken when an existing placeable object of this type is deleted
   */
  protected _onDelete(): void;

  /**
   * Assume control over a PlaceableObject, flagging it as controlled and enabling downstream behaviors
   * @param options       - Additional options which modify the control request
   *                        (default: `{}`)
   * @param releaseOthers - Release any other controlled objects first
   * @returns A flag denoting whether or not control was successful
   */
  control(options?: PlaceableObject.ControlOptions): boolean;

  /**
   * Additional events which trigger once control of the object is established
   * @param options - Optional parameters which apply for specific implementations
   *                  (unused)
   */
  protected _onControl(options?: any): void;

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
   *                  (unused)
   */
  protected _onRelease(options?: any): void;

  /**
   * Rotate the PlaceableObject to a certain angle of facing
   * @param angle - The desired angle of rotation
   * @param snap  - Snap the angle of rotation to a certain target degree increment
   * @returns A Promise which resolves once the rotation has completed
   */
  rotate(angle: number, snap: number): Promise<this>;

  /**
   * Determine a new angle of rotation for a PlaceableObject either from an explicit angle or from a delta offset.
   * @param angle - An explicit angle, either this or delta must be provided
   *                (default: `null`)
   * @param delta - A relative angle delta, either this or the angle must be provided
   *                (default: `0`)
   * @param snap  - A precision (in degrees) to which the resulting angle should snap.
   *                (default: `0`)
   * @returns The new rotation angle for the object
   */
  protected _updateRotation({ angle, delta, snap }?: { angle: number; delta: number; snap: number }): number;

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
  protected _createInteractionManager(): MouseInteractionManager;

  /**
   * Actions that should be taken for this Placeable Object when a mouseover event occurs
   * @param options - (default: `{}`)
   * @param hoverOutOthers - (default: `true`)
   */
  protected _onHoverIn(event: PIXI.InteractionEvent, options?: { hoverOutOthers: boolean }): boolean | void;

  /**
   * Actions that should be taken for this Placeable Object when a mouseout event occurs
   */
  protected _onHoverOut(event: PIXI.InteractionEvent): boolean | void;

  /**
   * Callback actions which occur on a single left-click event to assume control of the object
   */
  protected _onClickLeft(event: PIXI.InteractionEvent): boolean | null;

  /**
   * Callback actions which occur on a double left-click event to activate
   */
  protected _onClickLeft2(event: PIXI.InteractionEvent): void;

  /**
   * Callback actions which occur on a single right-click event to configure properties of the object
   */
  protected _onClickRight(event: PIXI.InteractionEvent): void;

  /**
   * Callback actions which occur on a double right-click event to configure properties of the object
   */
  protected _onClickRight2(event: PIXI.InteractionEvent): void;

  /**
   * Callback actions which occur when a mouse-drag action is first begun.
   */
  protected _onDragLeftStart(event: PIXI.InteractionEvent): void;

  /**
   * Callback actions which occur on a mouse-move operation.
   */
  protected _onDragLeftMove(event: PIXI.InteractionEvent): void;

  /**
   * Callback actions which occur on a mouse-move operation.
   */
  protected _onDragLeftDrop(event: PIXI.InteractionEvent): boolean | Promise<PlaceableObject<D>>;

  /**
   * Callback actions which occur on a mouse-move operation.
   */
  protected _onDragLeftCancel(event: PIXI.InteractionEvent): void;
}

declare namespace PlaceableObject {
  interface ControlOptions {
    releaseOthers: boolean;
  }

  interface ReleaseOptions {
    trigger: boolean;
  }

  interface Vision {
    /**
     * @remarks
     * This is required but has ben set to optional because of pointsource
     */
    fov?: PIXI.Polygon | null;

    /**
     * @remarks
     * This is required but has ben set to optional because of pointsource
     */
    los?: PIXI.Polygon | null;
  }

  interface Data {
    _id: string;
    flags: Record<string, unknown>;
  }
}
