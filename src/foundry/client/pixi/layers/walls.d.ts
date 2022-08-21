import { ConfiguredDocumentClass, ConfiguredObjectClassForName } from "../../../../types/helperTypes";
import { PasteOptions } from "../placeables";

declare global {
  /**
   * The Walls canvas layer which provides a container for Wall objects within the rendered Scene.
   * @see {@link WallDocument}
   * @see {@link Wall}
   */
  class WallsLayer extends PlaceablesLayer<"Wall", WallsLayer.LayerOptions> {
    constructor();

    /**
     * An array of Wall objects which represent the boundaries of the canvas.
     * @defaultValue `new Set()`
     */
    boundaries: Set<Wall>;

    /**
     * A graphics layer used to display chained Wall selection
     * @defaultValue `null`
     */
    chain: PIXI.Graphics | null;

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
     * @remarks This is intentional `public` because it is accessed from Wall
     */
    _cloneType: ReturnType<foundry.documents.BaseWall["toJSON"]> | null;

    /**
     * Reference the last interacted wall endpoint for the purposes of chaining
     * @defaultValue
     * ```
     * {
     *   point: null,
     * }
     * ```
     */
    protected last: {
      point: PointArray | null;
    };

    /**
     * @remarks This is not overridden in foundry but reflects the real behavior.
     */
    static get instance(): Canvas["walls"];

    /**
     * @defaultValue
     * ```
     * mergeObject(super.layerOptions, {
     *  name: "walls"
     *  controllableObjects: true,
     *  sortActiveTop: true,
     *  zIndex: 40
     * })
     * ```
     */
    static override get layerOptions(): WallsLayer.LayerOptions;

    static override documentName: "Wall";

    /**
     * An Array of Wall instances in the current Scene which act as Doors.
     */
    get doors(): InstanceType<ConfiguredObjectClassForName<"Wall">>[];

    /**
     * Gate the precision of wall snapping to become less precise for small scale maps.
     * @remarks Returns `1 | 4 | 8 | 16`
     */
    get gridPrecision(): number;

    override draw(): Promise<this>;

    override deactivate(): this;

    /**
     * Perform initialization steps for the WallsLayer whenever the composition of walls in the Scene is changed.
     * Cache unique wall endpoints and identify interior walls using overhead roof tiles.
     */
    initialize(): void;

    /**
     * Initialization to identify all intersections between walls.
     * These intersections are cached and used later when computing point source polygons.
     */
    identifyWallIntersections(): void;

    /**
     * Identify walls which are treated as "interior" because they are contained fully within a roof tile.
     */
    identifyInteriorWalls(): void;

    /**
     * Given a point and the coordinates of a wall, determine which endpoint is closer to the point
     * @param point - The origin point of the new Wall placement
     * @param wall  - The existing Wall object being chained to
     * @returns The [x,y] coordinates of the starting endpoint
     */
    static getClosestEndpoint(point: Point, wall: InstanceType<ConfiguredObjectClassForName<"Wall">>): PointArray;

    /**
     * Test whether movement along a given Ray collides with a Wall.
     * @param ray     - The attempted movement
     * @param options - Options which customize how collision is tested
     * @returns False if there are no Walls
     *          True if the Ray is outside the Canvas
     *          Whether any collision occurred if mode is "any"
     *          An array of collisions, if mode is "all"
     *          The closest collision, if mode is "closest"
     */
    checkCollision(ray: Ray, options: CollisionOptions & { mode: "all" }): boolean | PolygonVertex[];
    checkCollision(ray: Ray, options: CollisionOptions & { mode: "closest" }): boolean | PolygonVertex;
    checkCollision(ray: Ray, options: CollisionOptions & { mode: "any" }): boolean;
    checkCollision(ray: Ray, options: Omit<CollisionOptions, "mode">): boolean;
    checkCollision(ray: Ray, options: CollisionOptions): boolean | PolygonVertex;
    checkCollision(ray: Ray, options?: CollisionOptions): boolean;

    /**
     * Highlight the endpoints of Wall segments which are currently group-controlled on the Walls layer
     */
    highlightControlledSegments(): void;

    override releaseAll(options?: PlaceableObject.ReleaseOptions): number;

    override pasteObjects(
      position: Point,
      options?: PasteOptions
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseWall>>[]>;

    /**
     * Create temporary WallDocument instances which represent the rectangular boundaries of the canvas.
     * @internal
     */
    protected _createBoundaries(): void;

    /**
     * Pan the canvas view when the cursor position gets close to the edge of the frame
     * @param event - The originating mouse movement event
     * @param x     - The x-coordinate
     * @param y     - The y-coordinate
     */
    protected _panCanvasEdge(event: MouseEvent, x: number, y: number): void | ReturnType<Canvas["animatePan"]>;

    /**
     * Get the endpoint coordinates for a wall placement, snapping to grid at a specified precision
     * Require snap-to-grid until a redesign of the wall chaining system can occur.
     * @param  point - The initial candidate point
     * @param  snap  - Whether to snap to grid
     *                 (default: `true`)
     * @returns The endpoint coordinates [x,y]
     */
    protected _getWallEndpointCoordinates(point: Point, { snap }?: { snap?: boolean }): PointArray;

    /**
     * The Scene Controls tools provide several different types of prototypical Walls to choose from
     * This method helps to translate each tool into a default wall data configuration for that type
     * @param tool - The active canvas tool
     */
    protected _getWallDataFromActiveTool(tool: string):
      | {
          light: foundry.CONST.WALL_SENSE_TYPES;
          sight: foundry.CONST.WALL_SENSE_TYPES;
          sound: foundry.CONST.WALL_SENSE_TYPES;
          move: foundry.CONST.WALL_SENSE_TYPES;
          door?: foundry.CONST.WALL_DOOR_TYPES;
        }
      | this["_cloneType"];

    protected override _onDragLeftStart(event: PIXI.InteractionEvent): void;

    protected override _onDragLeftMove(event: PIXI.InteractionEvent): void;

    protected override _onDragLeftDrop(event: PIXI.InteractionEvent): void;

    protected override _onDragLeftCancel(event: PointerEvent): void;

    protected override _onClickRight(event: PIXI.InteractionEvent): void;

    /** @deprecated since v9 */
    computePolygon(
      origin: Point,
      radius: number,
      options?: ComputePolygonOptions
    ): { rays: Ray[]; los: PIXI.Polygon; fov: PIXI.Polygon };

    /** @deprecated since v9 */
    getRayCollisions(ray: Ray, options: RayCollisionsOptions & { mode: "all" }): RayIntersection[];
    getRayCollisions(ray: Ray, options: RayCollisionsOptions & { mode: "closest" }): RayIntersection | null;
    getRayCollisions(ray: Ray, options: RayCollisionsOptions & { mode: "any" }): boolean;
    getRayCollisions(ray: Ray, options?: Partial<Omit<RayCollisionsOptions, "mode">>): RayIntersection[];
    getRayCollisions(ray: Ray, options?: RayCollisionsOptions): RayIntersection[] | RayIntersection | boolean | null;

    /**
     * An array of all the unique perception-blocking endpoints which are present in the layer
     * We keep this array cached for faster sight polygon computations
     * @deprecated since v9
     */
    get endpoints(): PointArray[];

    /**
     * Given an array of Wall instances, identify the unique endpoints across all walls.
     * @param walls   - An array of Wall instances
     * @param options - Additional options which modify the set of endpoints identified
     *                  (defaultValue: `{}`)
     * @returns An array of endpoints
     * @deprecated since v9
     */
    static getUniqueEndpoints(
      walls:
        | InstanceType<ConfiguredObjectClassForName<"Wall">>[]
        | Set<InstanceType<ConfiguredObjectClassForName<"Wall">>>,
      options?: EndpointOptions
    ): PointArray[];
  }

  namespace WallsLayer {
    interface LayerOptions extends PlaceablesLayer.LayerOptions<"Wall"> {
      name: "walls";
      controllableObjects: true;
      objectClass: typeof Wall;
      quadtree: true;
      sheetClass: ConstructorOf<FormApplication>;
      sortActiveTop: boolean;
      zIndex: number;
    }
  }
}

interface EndpointOptions {
  /**
   * An optional bounding rectangle within which the endpoint must lie.
   */
  bounds?: NormalizedRectangle;

  /**
   * The type of polygon being computed: "movement", "sight", or "sound"
   * @defaultValue `"movement"`
   */
  type?: "movement" | "sight" | "sound";
}

interface CollisionOptions {
  /**
   * Which collision type to check: movement, sight, sound
   * @defaultValue `"move"`
   */
  type?: "move" | "sight" | "sound";

  /**
   * Which type of collisions are returned: any, closest, all
   * @defaultValue `"any"`
   */
  mode?: "any" | "closest" | "all";
}

interface ComputePolygonOptions {
  /**
   * The type of polygon being computed: "movement", "sight", or "sound"
   * @defaultValue `"sight"`
   */
  type?: "movement" | "sight" | "sound";

  /**
   * An optional limited angle of emission with which to restrict polygons
   * @defaultValue `360`
   */
  angle?: number;

  /**
   * The desired radial density of emission for rays, in degrees
   * @defaultValue `6`
   */
  density?: number;

  /**
   * The current angle of rotation, used when the angle is limited
   * @defaultValue `0`
   */
  rotation?: number;

  /**
   * Compute sight that is fully unrestricted by walls
   * @defaultValue `false`
   */
  unrestricted?: boolean;
}

interface RayCollisionsOptions {
  /**
   * Which collision type to check: movement, sight, sound
   * @defaultValue `"movement"`
   */
  type?: "movement" | "sight" | "sound";

  /**
   * Which type of collisions are returned: any, closest, all
   * @defaultValue `"all"`
   */
  mode?: `any` | `closest` | `all`;

  /**
   * Internal performance tracking
   */
  _performance?: { tests: number };
}
