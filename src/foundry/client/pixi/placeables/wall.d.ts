import type {
  ConfiguredDocumentClass,
  ConfiguredDocumentClassForName,
  ConfiguredObjectClassForName
} from "../../../../types/helperTypes";
import type { DocumentModificationOptions } from "../../../common/abstract/document.mjs";
import type { LineIntersection } from "../../../common/utils/geometry.mjs";
import type { HoverInOptions } from "../placeable";

declare global {
  /**
   * A Wall is an implementation of PlaceableObject which represents a physical or visual barrier within the Scene.
   * Walls are used to restrict Token movement or visibility as well as to define the areas of effect for ambient lights
   * and sounds.
   *
   * @see {@link WallDocument}
   * @see {@link WallsLayer}
   * @see {@link WallConfig}
   */
  class Wall extends PlaceableObject<ConcreteWallDocument> {
    /**
     * @remarks Not used for `Wall`
     */
    controlIcon: null;

    /**
     * An reference the Door Control icon associated with this Wall, if any
     * @internal
     * @defaultValue `undefined`
     */
    doorControl: DoorControl | undefined | null;

    /**
     * A reference to an overhead Tile that is a roof, interior to which this wall is contained
     * @defaultValue `undefined`
     */
    roof: InstanceType<ConfiguredObjectClassForName<"Tile">> | undefined;

    /**
     * A set which tracks other Wall instances that this Wall intersects with (excluding shared endpoints)
     */
    intersectsWith: Map<InstanceType<ConfiguredObjectClassForName<"Wall">>, LineIntersection>;

    /**
     * Cached representation of this wall's endpoints as {@link PolygonVertex}es.
     * @defaultValue `null`
     * @internal
     */
    protected _vertices: { a: PolygonVertex; b: PolygonVertex } | null;

    /**
     * Cached representation of the set of this wall's vertices.
     * @defaultValue `null`
     * @internal
     */
    protected _wallKeys: Set<string> | null;

    static override embeddedName: "Wall";

    /**
     * A convenience reference to the coordinates Array for the Wall endpoints, [x0,y0,x1,y1].
     */
    get coords(): Wall["data"]["c"];

    /**
     * The initial endpoint of the Wall
     */
    get A(): Point;

    /**
     * The second endpoint of the Wall
     */
    get B(): Point;

    /**
     * The endpoints of the wall as {@link PolygonVertex}es.
     */
    get vertices(): { a: PolygonVertex; b: PolygonVertex };

    /**
     * The set of keys for this wall's endpoints.
     */
    get wallKeys(): Set<string>;

    override get bounds(): NormalizedRectangle;

    /**
     * A boolean for whether this wall contains a door
     */
    get isDoor(): boolean;

    /**
     * A boolean for whether the wall contains an open door
     */
    get isOpen(): boolean;

    /**
     * Is this Wall interior to a non-occluded roof Tile?
     */
    get hasActiveRoof(): boolean;

    /**
     * Return the coordinates [x,y] at the midpoint of the wall segment
     */
    get midpoint(): PointArray;

    override get center(): PIXI.Point;

    /**
     * Get the direction of effect for a directional Wall
     * @returns The angle of wall effect
     */
    get direction(): number | null;

    /**
     * This helper converts the wall segment to a Ray
     * @returns The wall in Ray representation
     */
    toRay(): Ray;

    override draw(): Promise<this>;

    /**
     * Draw a control icon that is used to manipulate the door's open/closed state
     */
    createDoorControl(): DoorControl;

    /**
     * Determine the orientation of this wall with respect to a reference point
     * @param point - Some reference point, relative to which orientation is determined
     * @returns An orientation in CONST.WALL_DIRECTIONS which indicates whether the Point is left,
     *          right, or collinear (both) with the Wall
     */
    orientPoint(point: Point): number;

    protected override _createInteractionManager(): NonNullable<this["mouseInteractionManager"]>;

    override activateListeners(): void;

    /**
     * Draw a directional prompt icon for one-way walls to illustrate their direction of effect.
     * @returns The drawn icon
     * @internal
     */
    protected _drawDirection(): PIXI.Sprite | null;

    override refresh(): this;

    /**
     * Compute an approximate Polygon which encloses the line segment providing a specific hitArea for the line
     * @param coords - The original wall coordinates
     * @param pad    - The amount of padding to apply
     * @returns A constructed Polygon for the line
     * @internal
     */
    protected _getWallHitPolygon(coords: [number, number, number, number], pad: number): PIXI.Polygon;

    /**
     * Given the properties of the wall - decide upon a color to render the wall for display on the WallsLayer
     * @internal
     */
    protected _getWallColor(): number;

    /**
     * @param chain - (default: `false`)
     */
    protected override _onControl({ chain }?: PlaceableObject.ControlOptions & { chain?: boolean }): void;

    protected override _onRelease(options?: PlaceableObject.ReleaseOptions): void;

    override destroy(options?: Parameters<PlaceableObject["destroy"]>[0]): void;

    /**
     * Test whether the Wall direction lies between two provided angles
     * This test is used for collision and vision checks against one-directional walls
     * @param lower - The lower-bound limiting angle in radians
     * @param upper - The upper-bound limiting angle in radians
     */
    isDirectionBetweenAngles(lower: number, upper: number): boolean;

    /**
     * A simple test for whether a Ray can intersect a directional wall
     * @param ray - The ray to test
     * @returns Can an intersection occur?
     */
    canRayIntersect(ray: Ray): boolean;

    /**
     * Get an Array of Wall objects which are linked by a common coordinate
     * @returns An object reporting ids and endpoints of the linked segments
     */
    getLinkedSegments(): {
      ids: string[];
      walls: WallsLayer["placeables"];
      endpoints: Array<[x: number, y: number]>;
    };

    /**
     * Determine whether this wall is beneath a roof tile, and is considered "interior", or not.
     */
    identifyInteriorState(): void;

    /**
     * Update any intersections with this wall.
     */
    updateIntersections(): void;

    /**
     * Record the intersection points between this wall and another, if any.
     * @param other - The other wall.
     */
    protected _identifyIntersectionsWith(other: InstanceType<ConfiguredDocumentClassForName<"Wall">>): void;

    /**
     * Remove this wall's intersections.
     * @internal
     */
    protected _removeIntersections(): void;

    protected override _onCreate(
      data: foundry.data.WallData["_source"],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected override _onUpdate(
      changed: DeepPartial<foundry.data.WallData["_source"]>,
      options?: DocumentModificationOptions,
      userId?: string
    ): void;

    protected override _onDelete(options: DocumentModificationOptions, userId: string): void;

    /**
     * Callback actions when a wall that contains a door is moved or its state is changed
     * @param doorChange - Update vision and sound restrictions
     *                     (default: `false`)
     * @internal
     */
    protected _onModifyWall(doorChange?: boolean): Promise<void>;

    protected override _canControl(user: InstanceType<ConfiguredDocumentClass<typeof User>>, event?: any): boolean;

    protected override _onHoverIn(event: PIXI.InteractionEvent, options?: HoverInOptions): false | void;

    protected override _onHoverOut(event: PIXI.InteractionEvent): false | void;

    /**
     * Handle mouse-hover events on the line segment itself, pulling the Wall to the front of the container stack
     * @internal
     */
    protected _onMouseOverLine(event: PIXI.InteractionEvent): void;

    protected override _onClickLeft(event: PIXI.InteractionEvent): boolean;

    protected override _onClickLeft2(event: PIXI.InteractionEvent): void;

    protected override _onClickRight2(event: PIXI.InteractionEvent): void;

    protected override _onDragLeftStart(event: PIXI.InteractionEvent): void;

    protected override _onDragLeftMove(event: PIXI.InteractionEvent): void;

    protected override _onDragLeftDrop(event: PIXI.InteractionEvent): Promise<any>;
  }
}

type ConcreteWallDocument = InstanceType<ConfiguredDocumentClass<typeof WallDocument>>;
