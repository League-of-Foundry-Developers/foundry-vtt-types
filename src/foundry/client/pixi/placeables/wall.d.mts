import type { FixedInstanceType } from "fvtt-types/utils";
import type { LineIntersection } from "../../../common/utils/geometry.d.mts";
import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";

declare global {
  namespace Wall {
    type ObjectClass = ConfiguredObjectClassOrDefault<typeof Wall>;
    type Object = FixedInstanceType<ObjectClass>;

    /**
     * @deprecated {@link Wall.ObjectClass | `Wall.ObjectClass`}
     */
    type ConfiguredClass = ObjectClass;

    /**
     * @deprecated {@link Wall.Object | `Wall.Object`}
     */
    type ConfiguredInstance = Object;

    /**
     * This type will permanently exist but is marked deprecated. The reason it exists is because
     * the confusion between `Wall` (the `PlaceableObject` that appears on the canvas) and
     * `WallDocument` (the `Document` that represents the data for a `Wall`) is so common that
     * it is useful to have type to forward to `WallDocument`.
     *
     * @deprecated {@link WallDocument.Implementation | `WallDocument.Implementation`}
     */
    type Implementation = WallDocument.Implementation;

    /**
     * This type will permanently exist but is marked deprecated. The reason it exists is because
     * the confusion between `Wall` (the `PlaceableObject` that appears on the canvas) and
     * `WallDocument` (the `Document` that represents the data for a `Wall`) is so common that
     * it is useful to have type to forward to `WallDocument`.
     *
     * @deprecated {@link WallDocument.ImplementationClass | `WallDocument.ImplementationClass`}
     */
    type ImplementationClass = WallDocument.ImplementationClass;

    interface RENDER_FLAGS {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<this>;

      /** @defaultValue `{ propagate: ["refreshState", "refreshLine"], alias: true }` */
      refresh: RenderFlag<this>;

      /** @defaultValue `{ propagate: ["refreshEndpoints", "refreshHighlight"] }` */
      refreshState: RenderFlag<this>;

      /** @defaultValue `{ propagate: ["refreshEndpoints", "refreshHighlight", "refreshDirection"] }` */
      refreshLine: RenderFlag<this>;

      /** @defaultValue `{}` */
      refreshEndpoints: RenderFlag<this>;

      /** @defaultValue `{}` */
      refreshDirection: RenderFlag<this>;

      /** @defaultValue `{}` */
      refreshHighlight: RenderFlag<this>;
    }

    interface RenderFlags extends RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS> {}

    interface ControlOptions extends PlaceableObject.ControlOptions {
      /** @defaultValue `false` */
      chain: boolean;
    }

    type DoorInteraction = "open" | "close" | "lock" | "unlock" | "test";
  }

  /**
   * A Wall is an implementation of PlaceableObject which represents a physical or visual barrier within the Scene.
   * Walls are used to restrict Token movement or visibility as well as to define the areas of effect for ambient lights
   * and sounds.
   *
   * @see {@link WallDocument | `WallDocument`}
   * @see {@link WallsLayer | `WallsLayer`}
   */
  class Wall extends PlaceableObject<WallDocument.Implementation> {
    static override embeddedName: "Wall";

    static override RENDER_FLAGS: Wall.RENDER_FLAGS;

    /**
     * A reference the Door Control icon associated with this Wall, if any
     * @defaultValue `undefined`
     */
    protected doorControl: DoorControl | undefined | null;

    /**
     * A reference to an overhead Tile that is a roof, interior to which this wall is contained
     * @defaultValue `undefined`
     */
    roof: Tile.Object | undefined;

    /**
     * A Graphics object used to highlight this wall segment. Only used when the wall is controlled.
     */
    highlight: PIXI.Graphics | undefined;

    /**
     * A set which tracks other Wall instances that this Wall intersects with (excluding shared endpoints)
     */
    intersectsWith: Map<Wall.Object, LineIntersection>;

    /**
     * A convenience reference to the coordinates Array for the Wall endpoints, [x0,y0,x1,y1].
     */
    get coords(): Wall["document"]["c"];

    /**
     * The endpoints of the wall expressed as {@link foundry.canvas.edges.PolygonVertex | `foundry.canvas.edges.PolygonVertex`} instances.
     */
    get vertices(): { a: foundry.canvas.edges.PolygonVertex; b: foundry.canvas.edges.PolygonVertex };

    /**
     * The initial endpoint of the Wall
     */
    get A(): Canvas.Point;

    /**
     * The second endpoint of the Wall
     */
    get B(): Canvas.Point;

    /**
     * A set of vertex sort keys which identify this Wall's endpoints.
     */
    get wallKeys(): Set<number>;

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
     * Is this Wall interior to a non-occluded roof Tile?
     */
    get hasActiveRoof(): boolean;

    /**
     * Return the coordinates [x,y] at the midpoint of the wall segment
     */
    get midpoint(): Canvas.PointTuple;

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

    protected override _draw(): Promise<void>;

    override clear(): this;

    /**
     * Draw a control icon that is used to manipulate the door's open/closed state
     */
    createDoorControl(): DoorControl;

    /**
     * Clear the door control if it exists.
     */
    clearDoorControl(): void;

    /**
     * Determine the orientation of this wall with respect to a reference point
     * @param point - Some reference point, relative to which orientation is determined
     * @returns An orientation in CONST.WALL_DIRECTIONS which indicates whether the Point is left,
     *          right, or collinear (both) with the Wall
     */
    orientPoint(point: Canvas.Point): number;

    /**
     * Test whether to apply a configured threshold of this wall.
     * When the proximity threshold is met, this wall is excluded as an edge in perception calculations.
     * @param sourceType     - Sense type for the source
     * @param sourceOrigin   - The origin or position of the source on the canvas
     * @param externalRadius - The external radius of the source
     *                         (default: `0`)
     * @returns True if the wall has a threshold greater than 0 for the source type, and the source type is within that distance.
     */
    applyThreshold(sourceType: string, sourceOrigin: Canvas.Point, externalRadius: number): boolean;

    override control(options?: Wall.ControlOptions): boolean;

    protected override _destroy(options?: PIXI.IDestroyOptions | boolean): void;

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
    protected _identifyIntersectionsWith(other: WallDocument.Implementation): void;

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

    protected override _canControl(user: User.Implementation, event?: any): boolean;

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

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    protected override _onDragLeftDrop(event: PIXI.FederatedEvent): Promise<unknown>;

    /**
     * @remarks Not used
     */
    controlIcon: null;
  }
}
