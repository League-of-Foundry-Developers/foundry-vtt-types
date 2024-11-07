import type { ConstructorOf, InexactPartial } from "../../../../../types/utils.d.mts";

declare global {
  /**
   * The Walls canvas layer which provides a container for Wall objects within the rendered Scene.
   */
  class WallsLayer extends PlaceablesLayer<"Wall"> {
    /**
     * Synthetic Wall instances which represent the outer boundaries of the game canvas.
     */
    outerBounds: Wall[];

    /**
     * Synthetic Wall instances which represent the inner boundaries of the scene rectangle.
     */
    innerBounds: Wall[];

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
      point: Canvas.PointArray | null;
    };

    /**
     * @privateRemarks This is not overridden in foundry but reflects the real behavior.
     */
    static get instance(): Canvas["walls"];

    /**
     * @defaultValue
     * ```js
     * mergeObject(super.layerOptions, {
     *  name: "walls"
     *  controllableObjects: true,
     *  sortActiveTop: true, // TODO this needs to be removed
     *  zIndex: 40
     * })
     * ```
     * @remarks The TODO is foundry internal
     */
    static override get layerOptions(): WallsLayer.LayerOptions;

    /**
     * @privateRemarks This is not overridden in foundry but reflects the real behavior.
     */
    override options: WallsLayer.LayerOptions;

    static override documentName: "Wall";

    override get hookName(): string;

    /**
     * An Array of Wall instances in the current Scene which act as Doors.
     */
    get doors(): Wall.ConfiguredInstance[];

    /**
     * Gate the precision of wall snapping to become less precise for small scale maps.
     * @remarks Returns `1 | 4 | 8 | 16`
     */
    get gridPrecision(): number;

    override _draw(options?: Record<string, unknown>): Promise<void>;

    override _deactivate(): void;

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
    static getClosestEndpoint(point: Canvas.Point, wall: Wall.ConfiguredInstance): Canvas.PointArray;

    override releaseAll(options?: PlaceableObject.ReleaseOptions): number;

    override pasteObjects(
      position: Canvas.Point,
      options?: Record<string, unknown>,
    ): Promise<WallDocument.ConfiguredInstance[]>;

    /**
     * Pan the canvas view when the cursor position gets close to the edge of the frame
     * @param event - The originating mouse movement event
     * @param x     - The x-coordinate
     * @param y     - The y-coordinate
     */
    protected _panCanvasEdge(event: MouseEvent, x: number, y: number): void | ReturnType<Canvas["animatePan"]>;

    /**
     * Get the wall endpoint coordinates for a given point.
     * @param  point - The candidate wall endpoint.
     * @returns The wall endpoint coordinates.
     */
    protected _getWallEndpointCoordinates(
      point: Canvas.Point,
      options?: InexactPartial<{
        /**
         * Snap to the grid?
         * @defaultValue `true`
         */
        snap: boolean;
      }>,
    ): Canvas.PointArray;

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

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): Promise<void>;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftDrop(event: PIXI.FederatedEvent): Promise<void>;

    protected override _onDragLeftCancel(event: PointerEvent): void;

    protected override _onClickRight(event: PIXI.FederatedEvent): void;

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks "WallsLayer#boundaries is deprecated in favor of WallsLayer#outerBounds and WallsLayer#innerBounds"
     */
    get boundaries(): Set<Wall>;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "WallsLayer#checkCollision is obsolete. Prefer calls to testCollision from CONFIG.Canvas.polygonBackends[type]"
     */
    checkCollision(ray: Ray, options: Parameters<(typeof PointSourcePolygon)["testCollision"]>[2]): boolean;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "The WallsLayer#highlightControlledSegments function is deprecated in favor of calling wall.renderFlags.set(\"refreshHighlight\") on individual Wall objects"
     */
    highlightControlledSegments(): void;
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
