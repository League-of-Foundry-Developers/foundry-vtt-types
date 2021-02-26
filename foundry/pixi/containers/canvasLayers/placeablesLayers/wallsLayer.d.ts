/**
 * The Walls canvas layer which provides a container for Wall objects within the rendered Scene.
 * @see {@link Wall}
 */
declare class WallsLayer extends PlaceablesLayer<Wall> {
  constructor();

  /**
   * A graphics layer used to display chained Wall selection
   * @defaultValue `null`
   */
  chain: PIXI.Graphics | null;

  /**
   * An array of all the unique perception-blocking endpoints which are present in the layer
   * We keep this array cached for faster sight polygon computations
   * @defaultValue `[]`
   */
  endpoints: PointArray[];

  /**
   * Track whether we are currently within a chained placement workflow
   * @defaultValue `false`
   */
  protected _chain: boolean;

  /**
   * Track whether the layer is currently toggled to snap at exact grid precision
   * @defaultValue `false`
   */
  protected _forceSnap: boolean;

  /**
   * Track the most recently created or updated wall data for use with the clone tool
   * @defaultValue `null`
   */
  protected _cloneType: Wall['data'] | null;

  /**
   * Reference the last interacted wall endpoint for the purposes of chaining
   * @defaultValue
   * ```
   * {
   *   id: null,
   *   point: null,
   * }
   * ```
   */
  protected last: {
    id: string | null;
    point: PointArray | null;
  };

  /**
   * @override
   * @defaultValue
   * ```
   * mergeObject(super.layerOptions, {
   *   controllableObjects: true,
   *   objectClass: Wall,
   *   quadtree: true,
   *   sheetClass: WallConfig,
   *   sortActiveTop: true,
   *   zIndex: 40
   * })
   * ```
   */
  static get layerOptions(): PlaceablesLayer.LayerOptions;

  /**
   * An Array of Wall instances in the current Scene which currently block Token vision.
   * This array includes doors regardless of their current door state.
   */
  get blockVision(): Wall[];

  /**
   * An Array of Wall instances in the current Scene which block Token movement.
   * This array includes doors regardless of their current door state.
   */
  get blockMovement(): Wall[];

  /**
   * An Array of Wall instances in the current Scene which act as Doors.
   */
  get doors(): Wall[];

  /**
   * Gate the precision of wall snapping to become less precise for small scale maps.
   */
  get gridPrecision(): 1 | 4 | 8 | 16;

  /**
   * @override
   * @remarks Returns `Promise<this>`
   */
  draw(): Promise<any>;

  /** @override */
  deactivate(): this;

  initialize(): void;

  /**
   * Given a point and the coordinates of a wall, determine which endpoint is closer to the point
   * @param point - The origin point of the new Wall placement
   * @param wall  - The existing Wall object being chained to
   * @returns The [x,y] coordinates of the starting endpoint
   */
  static getClosestEndpoint(point: Point, wall: Wall): PointArray;

  /**
   * Given an array of Wall instances, identify the unique endpoints across all walls.
   * @param walls         - An array of Wall instances
   * @param bounds        - An optional bounding rectangle within which the endpoint must lie.
   * @param blockMovement - Filter for walls that block movement, default is true.
   *                        (Default value: `true`)
   * @param blockSenses   - Filter for walls that block perception, default is true.
   *                        (Default value: `true`)
   * @returns An array of endpoints
   */
  static getUniqueEndpoints(
    walls: Wall[],
    {
      bounds,
      blockMovement,
      blockSenses
    }?: { bounds?: Rectangle | null; blockMovement?: boolean; blockSenses?: boolean }
  ): PointArray[];

  /**
   * Test whether movement along a given Ray collides with a Wall.
   * @param ray - The attempted movement
   * @returns Does a collision occur?
   */
  checkCollision(
    ray: Ray,
    {
      blockMovement,
      blockSenses,
      mode
    }?: { blockMovement?: boolean; blockSenses?: boolean; mode?: 'all' | 'closest' | 'any' }
  ): boolean;

  /**
   * Highlight the endpoints of Wall segments which are currently group-controlled on the Walls layer
   */
  highlightControlledSegments(): void;

  /** @override */
  releaseAll(): number;

  /** @override */
  pasteObjects(position: Point, options?: {}): Promise<Wall[]>;

  /**
   * Pan the canvas view when the cursor position gets close to the edge of the frame
   * @param event - The originating mouse movement event
   * @param x     - The x-coordinate
   * @param y     - The y-coordinate
   */
  protected _panCanvasEdge(event: MouseEvent, x: number, y: number): void | Promise<void>;

  /**
   * Get the endpoint coordinates for a wall placement, snapping to grid at a specified precision
   * Require snap-to-grid until a redesign of the wall chaining system can occur.
   * @param  point - The initial candidate point
   * @param  snap  - Whether to snap to grid
   *                 (Default value: `true`)
   * @returns The endpoint coordinates [x,y]
   */
  protected _getWallEndpointCoordinates(point: Point, { snap }?: { snap?: boolean }): PointArray;

  /**
   * The Scene Controls tools provide several different types of prototypical Walls to choose from
   * This method helps to translate each tool into a default wall data configuration for that type
   * @param tool - The active canvas tool
   */
  protected _getWallDataFromActiveTool(
    tool: string
  ):
    | {
        move: ValueOf<typeof CONST['WALL_MOVEMENT_TYPES']>;
        sense: ValueOf<typeof CONST['WALL_SENSE_TYPES']>;
        door: ValueOf<typeof CONST['WALL_DOOR_TYPES']>;
      }
    | Wall['data'];

  /** @override */
  protected _onClickLeft(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onDragLeftStart(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onDragLeftMove(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onDragLeftDrop(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onDragLeftCancel(event: PointerEvent): void;

  /** @override */
  protected _onClickRight(event: PIXI.InteractionEvent): void;

  /**
   * Test a single Ray against a single Wall
   * @param ray  - The Ray being cast
   * @param wall - The Wall against which to test
   * @returns An intersection, if one occurred
   */
  static testWall(ray: Ray, wall: Wall): Vector2 | null;

  /**
   * Identify the closest collision point from an array of collisions
   * @param collisions - An array of intersection points
   * @returns The closest blocking intersection
   */
  static getClosestCollision(collisions: RayIntersection[]): RayIntersection | null;

  /**
   * Get the set of wall collisions for a given Ray
   * @param ray           - The Ray being tested
   * @param blockMovement - Test against walls which block movement?
   * @param blockSenses   - Test against walls which block senses?
   * @param mode          - The return mode of the test, one of "all", "closest", or "any"
   * @param _performance  - An internal performance object used for debugging
   * @returns An array of collisions, if mode is "all"; The closest collision, if mode is "closest"; Whether any collision occurred if mode is "any"
   */
  static getRayCollisions(
    ray: Ray,
    {
      blockMovement,
      blockSenses,
      mode
    }?: { blockMovement: boolean; blockSenses: boolean; mode: 'all' | 'closest' | 'any'; _performance: unknown }
  ):
    | Record<`${string},${string}`, { x: number; y: number; t0: number; t1: number }>[]
    | Record<`${string},${string}`, { x: number; y: number; t0: number; t1: number }>
    | boolean;
}
