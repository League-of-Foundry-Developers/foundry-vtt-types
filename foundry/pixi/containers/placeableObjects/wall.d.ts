/**
 * A Wall is an implementation of PlaceableObject which represents a physical or visual barrier within the Scene.
 * Walls are used to restrict Token movement or visibility as well as to define the areas of effect for ambient lights
 * and sounds.
 *
 * @see {@link WallsLayer}
 * @see {@link WallConfig}
 *
 * @example
 * ```typescript
 * Wall.create<Wall>({
 *  c = [100, 200, 400, 600],
 *  move: CONST.WALL_MOVEMENT_TYPES.NORMAL,
 *  sense: CONST.WALL_SENSE_TYPES.NORMAL,
 *  dir: CONST.WALL_DIRECTIONS.BOTH,
 *  door: CONST.WALL_DOOR_TYPES.DOOR,
 *  ds: CONST.WALL_DOOR_STATES.CLOSED
 * });
 * ```
 */
declare class Wall extends PlaceableObject<Wall.Data> {
  /** @override */
  static get embeddedName(): 'Wall';

  /**
   * @remarks Not used for `Wall`
   */
  controlIcon: null;

  endpoints: PIXI.Graphics;

  /**
   * @remarks Type is `MouseInteractionManager<this, this['endpoints']>`
   */
  mouseInteractionManager: MouseInteractionManager<this, any> | null;

  /**
   * An reference the Door Control icon associated with this Wall, if any
   */
  protected doorControl: DoorControl | null;

  /** @override */
  get bounds(): NormalizedRectangle;

  /** @override */
  get center(): PIXI.Point;

  /**
   * A convenience reference to the coordinates Array for the Wall endpoints, [x0,y0,x1,y1].
   */
  get coords(): Wall.Data['c'];

  /**
   * Get the direction of effect for a directional Wall
   * @returns The angle of wall effect
   */
  get direction(): number | null;

  /**
   * Return the coordinates [x,y] at the midpoint of the wall segment
   */
  get midpoint(): [number, number];

  /** @override */
  activateListeners(): void;

  /**
   * A simple test for whether a Ray can intersect a directional wall
   * @param ray - The ray to test
   * @returns Can an intersection occur?
   */
  canRayIntersect(ray: Ray): boolean;

  /** @override */
  destroy(options?: { children?: boolean; texture?: boolean; baseTexture?: boolean }): void;

  /** @override */
  draw(): Promise<this>;

  /**
   * Get an Array of Wall objects which are linked by a common coordinate
   * @returns An object reporting ids and endpoints of the linked segments
   */
  getLinkedSegments(): {
    ids: string;
    walls: Wall[];
    endpoints: Array<[number, number]>;
  };

  /**
   * Test whether the Wall direction lies between two provided angles
   * This test is used for collision and vision checks against one-directional walls
   */
  isDirectionBetweenAngles(lower: number, upper: number): boolean;

  /** @override */
  refresh(): this;

  /**
   * This helper converts the wall segment to a Ray
   * @returns The wall in Ray representation
   */
  toRay(): Ray;

  /** @override */
  protected _canControl(user?: User, event?: PIXI.InteractionEvent): boolean;

  /** @override */
  protected _createInteractionManager(): NonNullable<this['mouseInteractionManager']>;

  /**
   * Draw a directional prompt icon for one-way walls to illustrate their direction of effect.
   * @returns The drawn icon
   */
  protected _drawDirection(): PIXI.Sprite | void; // TODO: returning void may be unreachable

  /**
   * Given the properties of the wall - decide upon a color to render the wall for display on the WallsLayer
   */
  protected _getWallColor(): number;

  /**
   * Compute an approximate Polygon which encloses the line segment providing a specific hitArea for the line
   * @param coords - The original wall coordinates
   * @param pad    - The amount of padding to apply
   * @returns A constructed Polygon for the line
   */
  protected _getWallHitPolygon(coords: [number, number, number, number], pad: number): PIXI.Polygon;

  /** @override */
  protected _onClickLeft(event: PIXI.InteractionEvent): boolean;

  /** @override */
  protected _onClickLeft2(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onClickRight2(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onControl({ chain }?: { chain?: boolean }): void;

  /** @override */
  protected _onCreate(): void;

  /** @override */
  protected _onDelete(): void;

  /** @override */
  protected _onDragLeftDrop(event: PIXI.InteractionEvent): Promise<any>;

  /** @override */
  protected _onDragLeftMove(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onDragLeftStart(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onHoverIn(event: PIXI.InteractionEvent, options?: { hoverOutOthers: boolean }): void;

  /** @override */
  protected _onHoverOut(event: PIXI.InteractionEvent): void;

  /**
   * Callback actions when a wall that contains a door is moved or its state is changed
   * @param doorChange - Update vision and sound restrictions
   */
  protected _onModifyWall(doorChange?: boolean): Promise<void>;

  /**
   * Handle mouse-hover events on the line segment itself, pulling the Wall to the front of the container stack
   */
  protected _onMouseOverLine(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onRelease(): void;

  /** @override */
  protected _onUpdate(data: Wall.Data): void;
}

declare namespace Wall {
  interface Data extends PlaceableObject.Data {
    /**
     * Coordinates of the endpoints
     */
    c: [number, number, number, number];
    /**
     * 0 - both
     * 1 - left
     * 2 - right
     */
    dir?: Const.WallDirection;
    /**
     * 0 - wall
     * 1 - door
     * 2 - secret
     */
    door: Const.WallDoorType;
    /**
     * 0 - closed
     * 1 - open
     * 2 - locked
     */
    ds: Const.WallDoorState;
    /**
     * 0 - blocked
     * 1 - allowed
     */
    move: Const.WallMovementType;
    /**
     * 0 - opaque
     * 1 - transparent
     * 2 - terrain
     */
    sense: Const.WallSenseType;
  }
}
