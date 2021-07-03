import { ConfiguredDocumentClass } from '../../../../../../types/helperTypes';
import { PasteOptions } from '../placeablesLayer';

declare global {
  /**
   * The Walls canvas layer which provides a container for Wall objects within the rendered Scene.
   * @see {@link WallDocument}
   * @see {@link Wall}
   */
  class WallsLayer extends PlaceablesLayer<'Wall', WallsLayer.LayerOptions> {
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
     * @remarks This is intentional `public` because it is accessed from Wall
     */
    _cloneType: ReturnType<foundry.documents.BaseWall['toJSON']> | null;

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
     * @remarks This is not overridden in foundry but reflects the real behavior.
     */
    static get instance(): WallsLayer;

    /**
     * @override
     * @defaultValue
     * ```
     * mergeObject(super.layerOptions, {
     *  name: "walls"
     *  controllableObjects: true,
     *  objectClass: Wall,
     *  quadtree: true,
     *  sheetClass: WallConfig,
     *  sortActiveTop: true,
     *  zIndex: 40
     * })
     * ```
     */
    static get layerOptions(): WallsLayer.LayerOptions;

    /** @override */
    static documentName: 'Wall';

    /**
     * An Array of Wall instances in the current Scene which act as Doors.
     */
    get doors(): Wall[];

    /**
     * Gate the precision of wall snapping to become less precise for small scale maps.
     * @remarks Returns `1 | 4 | 8 | 16`
     */
    get gridPrecision(): number;

    /**
     * @override
     */
    draw(): Promise<this>;

    /** @override */
    deactivate(): this;

    /**
     * Perform initialization steps for the WallsLayer whenever the composition of walls in the Scene is changed.
     * Cache unique wall endpoints and identify interior walls using overhead roof tiles.
     */
    initialize(): void;

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
    static getClosestEndpoint(point: Point, wall: Wall): PointArray;

    /**
     * Given an array of Wall instances, identify the unique endpoints across all walls.
     * @param walls   - An array of Wall instances
     * @param options - Additional options which modify the set of endpoints identified
     *                  (defaultValue: `{}`)
     * @returns An array of endpoints
     */
    static getUniqueEndpoints(walls: Wall[] | Set<Wall>, options?: EndpointOptions): PointArray[];

    /**
     * Test whether movement along a given Ray collides with a Wall.
     * @param ray     - The attempted movement
     * @param options - Options which customize how collision is tested
     * @returns Does a collision occur?
     */
    checkCollision(ray: Ray, options: CollisionOptions & { mode: 'all' }): boolean | RayIntersection[];
    checkCollision(ray: Ray, options: CollisionOptions & { mode: 'closest' }): boolean | RayIntersection | null;
    checkCollision(ray: Ray, options: CollisionOptions & { mode: 'any' }): boolean;
    checkCollision(ray: Ray, options: Omit<CollisionOptions, 'mode'>): boolean;
    checkCollision(ray: Ray, options: CollisionOptions): boolean | RayIntersection | null;
    checkCollision(ray: Ray, options?: CollisionOptions): boolean;

    /**
     * Highlight the endpoints of Wall segments which are currently group-controlled on the Walls layer
     */
    highlightControlledSegments(): void;

    /** @override */
    releaseAll(options?: PlaceableObject.ReleaseOptions): number;

    /**
     * @override
     * @param options - (unused)
     */
    pasteObjects(
      position: Point,
      options?: PasteOptions
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseWall>>[]>;

    /**
     * Pan the canvas view when the cursor position gets close to the edge of the frame
     * @param event - The originating mouse movement event
     * @param x     - The x-coordinate
     * @param y     - The y-coordinate
     */
    protected _panCanvasEdge(event: MouseEvent, x: number, y: number): void | ReturnType<Canvas['animatePan']>;

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
          move: foundry.CONST.WallMovementType;
          sense: foundry.CONST.WallSenseType;
          door?: foundry.CONST.WallDoorType;
        }
      | this['_cloneType'];

    /** @override */
    protected _onClickLeft(event: PIXI.InteractionEvent): void;

    /** @override */
    protected _onDragLeftStart(event: PIXI.InteractionEvent): Promise<Wall>;

    /** @override */
    protected _onDragLeftMove(event: PIXI.InteractionEvent): void;

    /** @override */
    protected _onDragLeftDrop(event: PIXI.InteractionEvent): void;

    /** @override */
    protected _onDragLeftCancel(event: PointerEvent): void;

    /** @override */
    protected _onClickRight(event: PIXI.InteractionEvent): void;

    /**
     * Compute source polygons of a requested type for a given origin position and maximum radius.
     * This method returns two polygons, one which is unrestricted by the provided radius, and one that is constrained
     * by the maximum radius.
     *
     * @param origin  - An point with coordinates x and y representing the origin of the test
     * @param radius  - A distance in canvas pixels which reflects the visible range
     * @param options - Additional options which modify the sight computation
     *                  (default: `{}`)
     * @returns The computed rays and polygons
     */
    computePolygon(
      origin: Point,
      radius: number,
      options?: ComputePolygonOptions
    ): { rays: Ray[]; los: PIXI.Polygon; fov: PIXI.Polygon };

    /**
     * Get the set of wall collisions for a given Ray
     * @param ray     - The Ray being tested
     * @param options - Options which customize how collision is tested
     *                  (default: `{}`)
     * @returns An array of collisions, if mode is "all"
     *          The closest collision, if mode is "closest"
     *          Whether any collision occurred if mode is "any"
     */
    getRayCollisions(ray: Ray, options: RayCollisionsOptions & { mode: 'all' }): RayIntersection[];
    getRayCollisions(ray: Ray, options: RayCollisionsOptions & { mode: 'closest' }): RayIntersection | null;
    getRayCollisions(ray: Ray, options: RayCollisionsOptions & { mode: 'any' }): boolean;
    getRayCollisions(ray: Ray, options?: Partial<Omit<RayCollisionsOptions, 'mode'>>): RayIntersection[];
    getRayCollisions(ray: Ray, options?: RayCollisionsOptions): RayIntersection[] | RayIntersection | boolean | null;

    /**
     * A helper method responsible for casting rays at wall endpoints.
     * Rays are restricted by limiting angles.
     *
     * @param x          - The origin x-coordinate
     * @param y          - The origin y-coordinate
     * @param distance   - The ray distance
     * @param density    - The desired radial density
     *                     (default: `4`)
     * @param endpoints  - An array of endpoints to target
     * @param limitAngle - Whether the rays should be cast subject to a limited angle of emission
     *                     (default: `false`)
     * @param aMin       - The minimum bounding angle
     * @param aMax       - The maximum bounding angle
     *
     * @returns An array of Ray objects
     */
    static castRays(
      x: number,
      y: number,
      distance: number,
      {
        density,
        endpoints,
        limitAngle,
        aMin,
        aMax
      }?: { density?: number; endpoints?: PointArray[]; limitAngle?: boolean; aMin?: number; aMax?: number }
    ): Ray[];

    /**
     * Test a single Ray against a single Wall
     * @param ray  - The Ray being tested
     * @param wall - The Wall against which to test
     * @returns A RayIntersection if a collision occurred, or null
     */
    static testWall(ray: Ray, wall: Wall): RayIntersection | null;

    /**
     * Identify the closest collision point from an array of collisions
     * @param collisions - An array of intersection points
     * @returns The closest blocking intersection or null if no collision occurred
     */
    static getClosestCollision(collisions: RayIntersection[]): RayIntersection | null;

    /**
     * Normalize an angle to ensure it is baselined to be the smallest angle that is greater than a minimum.
     * @param aMin  - The lower-bound minimum angle
     * @param angle - The angle to adjust
     * @returns The adjusted angle which is greater than or equal to aMin.
     */
    protected static _normalizeAngle(aMin: number, angle: number): number;

    /**
     * Map source types to wall collision types
     * @param type - The source polygon type
     * @returns The wall collision attribute
     */
    protected static _mapCollisionType(type: 'movement'): 'move';
    protected static _mapCollisionType(type: 'light'): 'sense';
    protected static _mapCollisionType(type: 'sight'): 'sense';
    protected static _mapCollisionType(type: 'sound'): 'sound';

    /**
     * @deprecated since 0.8.0
     */
    get blockVision(): Wall[];

    /**
     * @deprecated since 0.8.0
     */
    get blockMovement(): Wall[];
  }

  namespace WallsLayer {
    interface LayerOptions extends PlaceablesLayer.LayerOptions<'Wall'> {
      name: 'walls';
      controllableObjects: true;
      objectClass: ConstructorOf<Wall>;
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
   * @defaultValue `'movement'`
   */
  type?: 'movement' | 'sight' | 'sound';
}

interface CollisionOptions {
  /**
   * Which collision type to check: movement, sight, sound
   * @defaultValue `'movement'`
   */
  type?: 'movement' | 'sight' | 'sound';

  /**
   * Which type of collisions are returned: any, closest, all
   * @defaultValue `'any'`
   */
  mode?: 'any' | 'closest' | 'all';
}

interface ComputePolygonOptions {
  /**
   * The type of polygon being computed: "movement", "sight", or "sound"
   * @defaultValue `'sight'`
   */
  type?: 'movement' | 'sight' | 'sound';

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
   * @defaultValue `'movement'`
   */
  type?: 'movement' | 'sight' | 'sound';

  /**
   * Which type of collisions are returned: any, closest, all
   * @defaultValue `'all'`
   */
  mode?: `any` | `closest` | `all`;

  /**
   * Internal performance tracking
   */
  _performance?: { tests: number };
}
