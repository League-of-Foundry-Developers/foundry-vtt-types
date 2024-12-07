import type { HandleEmptyObject } from "../../../../types/helperTypes.d.mts";
import type { NullishProps, ValueOf } from "../../../../types/utils.d.mts";
import type Edge from "../../../client-esm/canvas/edges/edge.d.mts";
import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";

declare global {
  /**
   * A Wall is an implementation of PlaceableObject which represents a physical or visual barrier within the Scene.
   * Walls are used to restrict Token movement or visibility as well as to define the areas of effect for ambient lights
   * and sounds.
   *
   * @see {@link WallDocument}
   * @see {@link WallsLayer}
   */
  class Wall<
    ControlOptions extends Wall.ControlOptions = Wall.ControlOptions,
    DestroyOptions extends Wall.DestroyOptions | boolean = Wall.DestroyOptions | boolean,
    DrawOptions extends Wall.DrawOptions = Wall.DrawOptions,
    ReleaseOptions extends Wall.ReleaseOptions = Wall.ReleaseOptions,
  > extends PlaceableObject<
    WallDocument.ConfiguredInstance,
    ControlOptions,
    DestroyOptions,
    DrawOptions,
    ReleaseOptions
  > {
    static override embeddedName: "Wall";

    static override RENDER_FLAGS: {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<Partial<Wall.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshState", "refreshLine"], alias: true }` */
      refresh: RenderFlag<Partial<Wall.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshEndpoints", "refreshHighlight"] }` */
      refreshState: RenderFlag<Partial<Wall.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshEndpoints", "refreshHighlight", "refreshDirection"] }` */
      refreshLine: RenderFlag<Partial<Wall.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshEndpoints: RenderFlag<Partial<Wall.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshDirection: RenderFlag<Partial<Wall.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshHighlight: RenderFlag<Partial<Wall.RenderFlags>>;
    };

    /**
     * A reference the Door Control icon associated with this Wall, if any
     */
    doorControl: DoorControl | undefined | null;

    /**
     * The line segment that represents the Wall.
     */
    line: PIXI.Graphics | undefined;

    /**
     * The endpoints of the Wall line segment.
     */
    endpoints: PIXI.Graphics | undefined;

    /**
     * The icon that indicates the direction of the Wall.
     */
    directionIcon: PIXI.Sprite | null | undefined;

    /**
     * A Graphics object used to highlight this wall segment. Only used when the wall is controlled.
     */
    highlight: PIXI.Graphics | undefined;

    /**
     * A convenience reference to the coordinates Array for the Wall endpoints, [x0,y0,x1,y1].
     */
    get coords(): Wall.ConfiguredInstance["document"]["c"];

    /**
     * The Edge instance which represents this Wall.
     * The Edge is re-created when data for the Wall changes.
     */
    get edge(): Edge;

    override get bounds(): PIXI.Rectangle;

    /**
     * A boolean for whether this wall contains a door
     */
    get isDoor(): boolean;

    /**
     * A boolean for whether the wall contains an open door
     */
    get isOpen(): boolean;

    /**
     * Return the coordinates [x,y] at the midpoint of the wall segment
     */
    get midpoint(): Canvas.PointArray;

    override get center(): PIXI.Point;

    /**
     * Get the direction of effect for a directional Wall
     * @returns The angle of wall effect
     */
    get direction(): number | null;

    /**
     * @throws If called at all
     * @remarks "Wall#getSnappedPosition is not supported: WallDocument does not have a (x, y) position"
     */
    override getSnappedPosition(position?: Canvas.Point): Canvas.Point;

    /**
     * Initialize the edge which represents this Wall.
     * @param options - Options which modify how the edge is initialized
     */
    initializeEdge(
      options?: NullishProps<{
        /**
         * Has the edge been deleted?
         * @defaultValue `false`
         */
        deleted: boolean;
      }>,
    ): void;

    /**
     * This helper converts the wall segment to a Ray
     * @returns The wall in Ray representation
     */
    toRay(): Ray;

    protected override _draw(options?: HandleEmptyObject<DrawOptions>): Promise<void>;

    override clear(): this;

    /**
     * Draw a control icon that is used to manipulate the door's open/closed state
     */
    createDoorControl(): InstanceType<typeof CONFIG.Canvas.doorControlClass> | null;

    /**
     * Clear the door control if it exists.
     */
    clearDoorControl(): void;

    override control(options?: ControlOptions): boolean;

    protected override _destroy(options?: DestroyOptions): void;

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
     * Update any intersections with this wall.
     */
    updateIntersections(): void;

    /**
     * Record the intersection points between this wall and another, if any.
     * @param other - The other wall.
     */
    protected _identifyIntersectionsWith(other: WallDocument.ConfiguredInstance): void;

    protected override _applyRenderFlags(flags: Wall.RenderFlags): void;

    /**
     * Given the properties of the wall - decide upon a color to render the wall for display on the WallsLayer
     */
    protected _getWallColor(): number;

    /**
     * @privateRemarks _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    /**
     * Play a door interaction sound.
     * This plays locally, each client independently applies this workflow.
     * @param interaction - The door interaction: "open", "close", "lock", "unlock", or "test".
     * @internal
     */
    protected _playDoorSound(interaction: Wall.DoorInteraction): void;

    protected override _createInteractionManager(): NonNullable<this["mouseInteractionManager"]>;

    override activateListeners(): void;

    protected override _canControl(user: User.ConfiguredInstance, event?: any): boolean;

    protected override _onHoverIn(event: PIXI.FederatedEvent, options?: PlaceableObject.HoverInOptions): false | void;

    protected override _onHoverOut(event: PIXI.FederatedEvent): false | void;

    /**
     * Handle mouse-hover events on the line segment itself, pulling the Wall to the front of the container stack
     * @internal
     */
    protected _onMouseOverLine(event: PIXI.FederatedEvent): void;

    protected override _onClickLeft(event: PIXI.FederatedEvent): boolean;

    protected override _onClickLeft2(event: PIXI.FederatedEvent): void;

    protected override _onClickRight2(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftDrop(event: PIXI.FederatedEvent): Promise<unknown>;

    /**
     * @remarks Not used
     */
    controlIcon: null;

    /**
     * @deprecated since v12, until v14
     * @remarks "Wall#roof has been deprecated. There's no replacement"
     */
    get roof(): null;

    /**
     * Is this Wall interior to a non-occluded roof Tile?
     * @deprecated since v12, until v14
     * @remarks "Wall#hasActiveRoof has been deprecated. There's no replacement"
     */
    get hasActiveRoof(): boolean;

    /**
     * Determine whether this wall is beneath a roof tile, and is considered "interior", or not.
     * @deprecated since v12, until v14
     * @remarks "Wall#identifyInteriorState has been deprecated. It has no effect anymore and there's no replacement."
     */
    identifyInteriorState(): void;

    /**
     * Determine the orientation of this wall with respect to a reference point
     * @param point - Some reference point, relative to which orientation is determined
     * @returns An orientation in CONST.WALL_DIRECTIONS which indicates whether the Point is left,
     *          right, or collinear (both) with the Wall
     * @deprecated since v12, until v14
     * @remarks "Wall#orientPoint has been moved to foundry.canvas.edges.Edge#orientPoint"
     */
    orientPoint(point: Canvas.Point): ValueOf<foundry.CONST.WALL_DIRECTIONS>;

    /**
     * Test whether to apply a configured threshold of this wall.
     * When the proximity threshold is met, this wall is excluded as an edge in perception calculations.
     * @param sourceType     - Sense type for the source
     * @param sourceOrigin   - The origin or position of the source on the canvas
     * @param externalRadius - The external radius of the source
     *                         (default: `0`)
     * @returns True if the wall has a threshold greater than 0 for the source type, and the source type is within that distance.
     * @deprecated since v12, until v14
     * @remarks "Wall#applyThreshold has been moved to foundry.canvas.edges.Edge#applyThreshold"
     */
    applyThreshold(sourceType: string, sourceOrigin: Canvas.Point, externalRadius: number): boolean;

    /**
     * The endpoints of the wall expressed as {@link foundry.canvas.edges.PolygonVertex} instances.
     * @deprecated since v12, until v14
     * @remarks "Wall#vertices is replaced by Wall#edge"
     */
    get vertices(): { a: foundry.canvas.edges.PolygonVertex; b: foundry.canvas.edges.PolygonVertex };

    /**
     * The initial endpoint of the Wall
     * @deprecated since v12, until v14
     * @remarks "Wall#A is replaced by Wall#edge#a"
     */
    get A(): Canvas.Point;

    /**
     * The second endpoint of the Wall
     * @deprecated since v12, until v14
     * @remarks "Wall#A is replaced by Wall#edge#b"
     */
    get B(): Canvas.Point;
  }

  namespace Wall {
    type AnyConstructor = typeof AnyWall;

    interface ControlOptions extends PlaceableObject.ControlOptions {
      /** @defaultValue `false` */
      chain?: boolean | null | undefined;
    }

    interface DestroyOptions extends PlaceableObject.DestroyOptions {}

    interface DrawOptions extends PlaceableObject.DrawOptions {}

    interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}

    type ConfiguredClass = ConfiguredObjectClassOrDefault<typeof Wall>;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;

    interface RenderFlags extends PlaceableObject.RenderFlags {
      refreshLine: boolean;

      refreshEndpoints: boolean;

      refreshDirection: boolean;

      refreshHighlight: boolean;
    }

    type DoorInteraction = "open" | "close" | "lock" | "unlock" | "test";
  }
}

declare abstract class AnyWall extends Wall {
  constructor(arg0: never, ...args: never[]);
}
