/**
 * An Abstract Base Class which defines a Placeable Object which represents an Entity placed on the Canvas
 * (extends: `PIXI.Container`)
 */
declare abstract class PlaceableObject<D = object> extends PIXI.Container {
  /**
   * An indicator for whether the object is currently controlled
   * @defaultValue `false`
   * @internal
   */
  _controlled: boolean;

  /**
   * An indicator for whether the object is currently a hover target
   * @defaultValue `false`
   * @internal
   */
  _hover: boolean;

  /**
   * A singleton reference to the FormApplication class which configures this object
   * @defaultValue `null`
   * @internal
   */
  _sheet: FormApplication | null;

  /**
   * A control icon for interacting with the object
   * @defaultValue `null`
   */
  controlIcon: ControlIcon | null;

  /**
   * The underlying data object which provides the basis for this placeable object
   */
  data: D;

  /**
   * A mouse interaction manager instance which handles mouse workflows related
   * to this object.
   * @defaultValue `null`
   */
  mouseInteractionManager: MouseInteractionManager | null;

  /**
   * Retain a reference to the Scene within which this Placeable Object resides
   */
  scene: Scene;

  /**
   * Track the field of vision for the placeable object.
   * This is necessary to determine whether a player has line-of-sight towards a
   * placeable object or vice-versa
   * @defaultValue `{ fos: null, los: null }`
   */
  vision: PlaceableObject.Vision;

  /**
   * @param data - The underlying embedded document data for the placeable type
   * @param scene - The parent scene that this object belongs to (if any)
   */
  constructor(data: D, scene: Scene);

  /**
   * Identify the official EmbeddedEntity name for this PlaceableObject class
   * @remarks This getter is abstract in {@link PlaceableObject}.
   */
  static get embeddedName(): never;

  /**
   * Provide a reference to the canvas layer which contains placeable objects of
   * this type
   */
  static get layer(): PlaceablesLayer;

  /**
   * The central coordinate pair of the placeable object based on it's own width
   * and height
   */
  get center(): PIXI.Point;

  /**
   * The field-of-vision polygon for the object, if it has been computed
   */
  get fov(): PIXI.Polygon | null;

  /**
   * The _id of the underlying EmbeddedEntity
   */
  get id(): string;

  /**
   * @see {@link PlaceableObject.layer}
   */
  get layer(): PlaceablesLayer;

  /**
   * The line-of-sight polygon for the object, if it has been computed
   */
  get los(): PIXI.Polygon | null;

  /**
   * A Form Application which is used to configure the properties of this
   * Placeable Object or the EmbeddedEntity it represents.
   */
  get sheet(): FormApplication;

  /**
   * A Universally Unique Identifier (uuid) for this EmbeddedEntity
   */
  get uuid(): string;

  /**
   * The bounding box for this PlaceableObject.
   * This is required if the layer uses a Quadtree, otherwise it is optional
   */
  abstract get bounds(): NormalizedRectangle;

  static create<O>(
    data: O,
    options: any // TODO: type this when Entity is typed
  ): Promise<(O extends Array<infer D> ? Array<PlaceableObject<D>> : PlaceableObject<O>) | null>;

  /**
   * Does the User have permission to configure the Placeable Object?
   * @param event - (unused)
   * @internal
   */
  _canConfigure(user: User, event?: any): boolean;

  /**
   * Does the User have permission to control the Placeable Object?
   * @param event - (unused)
   * @internal
   */
  _canControl(user: User, event?: any): boolean;

  /**
   * Does the User have permission to create the underlying Embedded Entity?
   * @param event - (unused)
   * @internal
   */
  _canCreate(user: User, event?: any): boolean;

  /**
   * Does the User have permission to delete the underlying Embedded Entity?
   * @param event - (unused)
   * @internal
   */
  _canDelete(user: User, event?: any): boolean;

  /**
   * Does the User have permission to drag this Placeable Object?
   * @param event - (unused)
   * @internal
   */
  _canDrag(user: User, event?: any): boolean;

  /**
   * Can the User access the HUD for this Placeable Object?
   * @param user - (unused)
   * @param event - (unused)
   * @internal
   */
  _canHUD(user?: any, event?: any): boolean;

  /**
   * Does the User have permission to hover on this Placeable Object?
   * @param event - (unused)
   * @internal
   */
  _canHover(user: User, event?: any): boolean;

  /**
   * Does the User have permission to update the underlying Embedded Entity?
   * @param event - (unused)
   * @internal
   */
  _canUpdate(user: User, event?: any): boolean;

  /**
   * Does the User have permission to view details of the Placeable Object?
   * @param event - (unused)
   * @internal
   */
  _canView(user: User, event?: any): boolean;

  /**
   * Create a standard MouseInteractionManager for the PlaceableObject
   * @internal
   */
  _createInteractionManager(): MouseInteractionManager;

  /**
   * Draw the primary Sprite for the PlaceableObject
   * @internal
   */
  _drawPrimarySprite(texture: PIXI.Texture): PIXI.Sprite | null;

  /**
   * Obtain a shifted position for the Placeable Object
   * @param dx - The number of grid units to shift along the X-axis
   * @param dy - The number of grid units to shift along the Y-axis
   * @returns The shifted target coordinates
   * @internal
   */
  _getShiftedPosition(dx: number, dy: number): { x: number; y: number };

  /**
   * Callback actions which occur on a single left-click event to assume control
   * of the object
   * @internal
   */
  _onClickLeft(event: PIXI.InteractionEvent): boolean | null;

  /**
   * Callback actions which occur on a double left-click event to activate
   * @internal
   */
  _onClickLeft2(event: PIXI.InteractionEvent): void;

  /**
   * Callback actions which occur on a single right-click event to configure
   * properties of the object
   * @internal
   */
  _onClickRight(event: PIXI.InteractionEvent): void;

  /**
   * Callback actions which occur on a double right-click event to configure
   * properties of the object
   * @internal
   */
  _onClickRight2(event: PIXI.InteractionEvent): void;

  /**
   * Additional events which trigger once control of the object is established
   * @param options - Optional parameters which apply for specific
   *                  implementations
   *                  (unused)
   * @internal
   */
  _onControl(options?: any): void;

  /**
   * Register pending canvas operations which should occur after a new
   * PlaceableObject of this type is created
   * @internal
   */
  _onCreate(): Promise<PlaceableObject<D>>;

  /**
   * Define additional steps taken when an existing placeable object of this
   * type is deleted
   * @internal
   */
  _onDelete(): void;

  /**
   * Callback actions which occur on a mouse-move operation.
   * @internal
   */
  _onDragLeftCancel(event: PIXI.InteractionEvent): void;

  /**
   * Callback actions which occur on a mouse-move operation.
   * @internal
   */
  _onDragLeftDrop(event: PIXI.InteractionEvent): boolean | Promise<PlaceableObject<D>>;

  /**
   * Callback actions which occur on a mouse-move operation.
   * @internal
   */
  _onDragLeftMove(event: PIXI.InteractionEvent): void;

  /**
   * Callback actions which occur when a mouse-drag action is first begun.
   * @internal
   */
  _onDragLeftStart(event: PIXI.InteractionEvent): void;

  /**
   * Actions that should be taken for this Placeable Object when a mouseover
   * event occurs
   * @param options - (default: `{}`)
   * @param hoverOutOthers - (default: `true`)
   * @internal
   */
  _onHoverIn(event: PIXI.InteractionEvent, options?: { hoverOutOthers: boolean }): boolean | null;

  /**
   * Actions that should be taken for this Placeable Object when a mouseout
   * event occurs
   * @internal
   */
  _onHoverOut(event: PIXI.InteractionEvent): boolean | null;

  /**
   * Additional events which trigger once control of the object is released
   * @param options - Options which modify the releasing workflow
   *                  (unused)
   * @internal
   */
  _onRelease(options?: any): void;

  /**
   * Define additional steps taken when an existing placeable object of this
   * type is updated with new data
   * @internal
   */
  _onUpdate(data: D): void;

  /**
   * Determine a new angle of rotation for a PlaceableObject either from an
   * explicit angle or from a delta offset.
   * @param options - (default: `{}`)
   * @param angle - An explicit angle, either this or delta must be provided
   *                (default: `null`)
   * @param delta - A relative angle delta, either this or the angle must be
   *                provided
   *                (default: `0`)
   * @param snap - A precision (in degrees) to which the resulting angle should
   *               snap.
   *               (default: `0`)
   * @returns The new rotation angle for the object
   */
  _updateRotation(options?: { angle: number; delta: number; snap: number }): number;

  /**
   * Activate interactivity for the Placeable Object
   */
  activateListeners(): void;

  /**
   * Test whether a user can perform a certain interaction with regards to a
   * Placeable Object
   * @param user - The User performing the action
   * @param action - The named action being attempted
   * @returns Does the User have rights to perform the action?
   */
  can(user: User, action: string): boolean;

  /**
   * Clear the display of the existing object
   * @returns The cleared object
   */
  clear(): this;

  /**
   * Clone the placeable object, returning a new object with identical
   * attributes
   * The returned object is non-interactive, and has no assigned ID
   * If you plan to use it permanently you should call the create method
   * @returns A new object with identical data
   */
  clone(): PlaceableObject<D>;

  /**
   * Assume control over a PlaceableObject, flagging it as controlled and
   * enabling downstream behaviors
   * @param options - Additional options which modify the control request
   *                  (default: `{}`)
   * @param releaseOthers - Release any other controlled objects first
   * @returns A flag denoting whether or not control was successful
   */
  control(options?: PlaceableObject.ControlOptions): boolean;

  delete(options: any): Promise<this>; // TODO: type this when Entity is typed

  /**
   * Get the value of a "flag" for this PlaceableObject
   * See the setFlag method for more details on flags
   * @param scope - The flag scope which namespaces the key
   * @param key - The flag key
   * @returns The flag value
   */
  getFlag(scope: string, key: string): unknown;

  /**
   * Release control over a PlaceableObject, removing it from the controlled set
   * @param options - Options which modify the releasing workflow
   *                  (default: `{}`)
   * @returns A Boolean flag confirming the object was released.
   */
  release(options?: PlaceableObject.ReleaseOptions): boolean;

  /**
   * Rotate the PlaceableObject to a certain angle of facing
   * @param angle - The desired angle of rotation
   * @param snap - Snap the angle of rotation to a certain target degree
   *               increment
   * @returns A Promise which resolves once the rotation has completed
   */
  rotate(angle: number, snap: number): Promise<this>;

  /**
   * Assign a "flag" to this Entity.
   * Flags represent key-value type data which can be used to store flexible or
   * arbitrary data required by either the core software, game systems, or
   * user-created modules.
   * Each flag should be set using a scope which provides a namespace for the
   * flag to help prevent collisions.
   * Flags set by the core software use the "core" scope.
   * Flags set by game systems or modules should use the canonical name
   * attribute for the module
   * Flags set by an individual world should "world" as the scope.
   * Flag values can assume almost any data type. Setting a flag value to null
   * will delete that flag.
   * @param scope - The flag scope which namespaces the key
   * @param key - The flag key
   * @param value - The flag value
   * @returns A Promise resolving to the updated PlaceableObject
   */
  setFlag(scope: string, key: string, value: any): Promise<this>;

  /**
   * Remove a flag assigned to the Entity
   * @param scope - The flag scope which namespaces the key
   * @param key - The flag key
   * @returns A Promise resolving to the updated Entity
   */
  unsetFlag(scope: string, key: string): Promise<this>;

  // TODO: type this when Entity is typed
  update(data: D, options: any): Promise<this>;

  /**
   * Draw the placeable object into its parent container
   * @returns The drawn object
   */
  abstract draw(): Promise<PlaceableObject<D>>;

  /**
   * Refresh the current display state of the Placeable Object
   * @returns The refreshed object
   */
  abstract refresh(): PlaceableObject<D>;
}

declare namespace PlaceableObject {
  interface ControlOptions {
    releaseOthers: boolean;
  }

  interface ReleaseOptions {
    trigger: boolean;
  }

  interface Vision {
    fos: PIXI.Polygon | null;

    los: PIXI.Polygon | null;
  }
}
