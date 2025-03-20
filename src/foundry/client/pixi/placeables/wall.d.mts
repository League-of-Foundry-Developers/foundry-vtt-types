import type { FixedInstanceType, HandleEmptyObject, NullishProps } from "fvtt-types/utils";
import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";
import Edge = foundry.canvas.edges.Edge;

declare global {
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
     * @remarks Only undefined prior to first draw. {@link Wall.clearDoorControl | `Wall#clearDoorControl`} sets it `null`.
     */
    doorControl: DoorControl.ConfiguredInstance | undefined | null;

    /**
     * The line segment that represents the Wall.
     */
    line: PIXI.Graphics | undefined;

    /**
     * The endpoints of the Wall line segment.
     * @defaultValue `undefined`
     * @remarks Only undefined prior to first draw.
     */
    endpoints: PIXI.Graphics | undefined;

    /**
     * The icon that indicates the direction of the Wall.
     * @defaultValue `undefined`
     * @remarks Only undefined prior to first draw. Foundry types this as `| null` as well,
     * but it is never set that in practice
     */
    directionIcon: PIXI.Sprite | undefined;

    /**
     * A Graphics object used to highlight this wall segment. Only used when the wall is controlled.
     * @defaultValue `undefined`
     * @remarks This is both not initialized to a value at construction *and* conditionally set
     * explicitly `undefined` in {@link Wall._refreshHighlight | `Wall#_refreshHighlight`}
     */
    highlight: PIXI.Graphics | undefined;

    /**
     * A convenience reference to the coordinates Array for the Wall endpoints, [x0,y0,x1,y1].
     */
    get coords(): WallDocument.Coordinates;

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
    get midpoint(): Canvas.PointTuple;

    override get center(): PIXI.Point;

    /**
     * Get the direction of effect for a directional Wall
     * @returns The angle of wall effect
     * @remarks In radians
     */
    get direction(): number | null;

    /**
     * @throws "Wall#getSnappedPosition is not supported: WallDocument does not have a (x, y) position"
     */
    override getSnappedPosition(position: never): never;

    /**
     * Initialize the edge which represents this Wall.
     * @param options - Options which modify how the edge is initialized
     */
    // options: not null (destructured)
    initializeEdge(options?: Wall.InitializeEdgeOptions): void;

    /**
     * This helper converts the wall segment to a Ray
     * @returns The wall in Ray representation
     */
    toRay(): Ray;

    protected override _draw(options: HandleEmptyObject<Wall.DrawOptions> | undefined): Promise<void>;

    override clear(): this;

    /**
     * Draw a control icon that is used to manipulate the door's open/closed state
     */
    createDoorControl(): DoorControl.ConfiguredInstance;

    /**
     * Clear the door control if it exists.
     */
    clearDoorControl(): void;

    override control(options?: Wall.ControlOptions): boolean;

    /** @remarks `options` is unused */
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
    getLinkedSegments(): Wall.GetLinkedSegmentsReturn;

    protected override _applyRenderFlags(flags: Wall.RenderFlags): void;

    /**
     * Refresh the displayed position of the wall which refreshes when the wall coordinates or type changes.
     */
    protected _refreshLine(): void;

    /**
     * Refresh the display of wall endpoints which refreshes when the wall position or state changes.
     */
    protected _refreshEndpoints(): void;

    /**
     * Draw a directional prompt icon for one-way walls to illustrate their direction of effect.
     */
    protected _refreshDirection(): void;

    /**
     * Refresh the appearance of the wall control highlight graphic. Occurs when wall control or position changes.
     */
    protected _refreshHighlight(): void;

    /**
     * Refresh the displayed state of the Wall.
     */
    protected _refreshState(): void;

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
     * @remarks Foundry marked `@internal`
     */
    protected _playDoorSound(interaction: Wall.DoorInteraction): void;

    /**
     * Customize the audible radius of sounds emitted by this wall, for example when a door opens or closes.
     * @defaultValue `canvas.dimensions.distance * 12; // 60 feet on a 5ft grid`
     */
    get soundRadius(): number;

    protected override _canControl(user: User.Implementation, event?: PIXI.FederatedEvent): boolean;

    protected override _onHoverIn(event: PIXI.FederatedEvent, options?: PlaceableObject.HoverInOptions): false | void;

    protected override _onHoverOut(event: PIXI.FederatedEvent): void;

    protected override _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

    protected override _onClickLeft(event: PIXI.FederatedEvent): boolean;

    protected override _onClickLeft2(event: PIXI.FederatedEvent): void;

    protected override _onClickRight2(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _prepareDragLeftDropUpdates(event: PIXI.FederatedEvent): Wall.DragLeftDropUpdate[] | null;
    /**
     * @deprecated since v12, until v14
     * @remarks "`Wall#roof` has been deprecated. There's no replacement"
     */
    get roof(): null;

    /**
     * @deprecated since v12, until v14
     * @remarks "`Wall#hasActiveRoof` has been deprecated. There's no replacement"
     */
    get hasActiveRoof(): boolean;

    /**
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
     * @remarks "`Wall#orientPoint` has been moved to `foundry.canvas.edges.Edge#orientPoint`"
     */
    orientPoint(point: Canvas.Point): CONST.WALL_DIRECTIONS;

    /**
     * Test whether to apply a configured threshold of this wall.
     * When the proximity threshold is met, this wall is excluded as an edge in perception calculations.
     * @param sourceType     - Sense type for the source
     * @param sourceOrigin   - The origin or position of the source on the canvas
     * @param externalRadius - The external radius of the source
     *                         (default: `0`)
     * @returns True if the wall has a threshold greater than 0 for the source type, and the source type is within that distance.
     * @deprecated since v12, until v14
     * @remarks "Wall#applyThreshold has been moved to `foundry.canvas.edges.Edge#applyThreshold`"
     */
    applyThreshold(
      sourceType: Edge.AttenuationTypes,
      sourceOrigin: Canvas.Point,
      externalRadius?: number | null,
    ): boolean;

    /**
     * @deprecated since v12, until v14
     * @remarks "`Wall#vertices` is replaced by `Wall#edge`"
     */
    get vertices(): this["edge"];

    /**
     * The initial endpoint of the Wall
     * @deprecated since v12, until v14
     * @remarks "`Wall#A` is replaced by `Wall#edge#a`"
     */
    get A(): this["edge"]["a"];

    /**
     * The second endpoint of the Wall
     * @deprecated since v12, until v14
     * @remarks "`Wall#B` is replaced by `Wall#edge#b`"
     */
    get B(): this["edge"]["b"];
  }
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

    type DoorInteraction = "open" | "close" | "lock" | "unlock" | "test";

    interface DrawOptions extends PlaceableObject.DrawOptions {}

    interface RefreshOptions extends PlaceableObject.RefreshOptions {}

    /** @internal */
    type _ControlOptions = NullishProps<{
      /** @defaultValue `false` */
      chain: boolean;
    }>;
    interface ControlOptions extends _ControlOptions, PlaceableObject.ControlOptions {}

    interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}

    /** @internal */
    type _InitializeEdgeOptions = NullishProps<{
      /**
       * Has the edge been deleted?
       * @defaultValue `false`
       */
      deleted: boolean;
    }>;
    interface InitializeEdgeOptions extends _InitializeEdgeOptions {}

    interface GetLinkedSegmentsReturn {
      /** @remarks IDs of the Walls in `walls` */
      ids: string[];

      /** @remarks All the Walls connected to this one */
      walls: Wall.Object[];

      /** @remarks `walls.length + 1` endpoints */
      endpoints: Canvas.PointTuple[];
    }

    interface DragLeftDropUpdate {
      _id: string;
      c: WallDocument.Coordinates;
    }
  }
}

declare abstract class AnyWall extends Wall {
  constructor(arg0: never, ...args: never[]);
}
