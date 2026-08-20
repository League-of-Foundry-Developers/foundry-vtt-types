import type { FixedInstanceType, HandleEmptyObject, InexactPartial } from "#utils";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import type { RenderFlagsMixin, RenderFlags, RenderFlag } from "#client/canvas/interaction/_module.d.mts";
import type { DoorControl, DoorMesh } from "#client/canvas/containers/_module.d.mts";
import type { Ray } from "#client/canvas/geometry/_module.d.mts";
import type { Edge } from "#client/canvas/geometry/edges/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceableObjectConfig {
      Wall: Wall.Implementation;
    }
  }
}

/**
 * A Wall is an implementation of PlaceableObject which represents a physical or visual barrier within the Scene.
 * Walls are used to restrict Token movement or visibility as well as to define the areas of effect for ambient lights
 * and sounds.
 * @see {@linkcode foundry.documents.WallDocument}
 * @see {@linkcode foundry.canvas.layers.WallsLayer}
 */
declare class Wall extends PlaceableObject<WallDocument.Implementation> {
  constructor(document: WallDocument.Implementation);

  // fake type override
  static override get implementation(): Wall.ImplementationClass;

  static override embeddedName: "Wall";

  static override RENDER_FLAGS: Wall.RENDER_FLAGS;

  // fake type override
  renderFlags: RenderFlags<Wall.RENDER_FLAGS>;

  // fake override; super has to type as if this could be a ControlIcon, but Walls don't use one
  override controlIcon: null;

  /**
   * A reference the Door Control icon associated with this Wall, if any
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw. {@linkcode Wall.clearDoorControl | Wall#clearDoorControl} sets it `null`.
   */
  doorControl: DoorControl.Implementation | null | undefined;

  /**
   * A set of optional DoorMesh instances used to render a door animation for this Wall.
   */
  get doorMeshes(): Set<DoorMesh>;

  /**
   * The line segment that represents the Wall.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw.
   */
  line: PIXI.Graphics | undefined;

  /**
   * The endpoints of the Wall line segment.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw.
   */
  endpoints: PIXI.Graphics | undefined;

  /**
   * The icon that indicates the direction of the Wall.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw. `null` after a redraw, because
   * {@linkcode Wall._clear | Wall#_clear} destroys the sprite without clearing this property.
   */
  directionIcon: PIXI.Sprite | null | undefined;

  /**
   * A Graphics object used to highlight this wall segment. Only used when the wall is controlled.
   * @defaultValue `undefined`
   * @remarks This is both not initialized to a value at construction *and* conditionally set
   * explicitly `undefined` in {@linkcode Wall._refreshHighlight | Wall#_refreshHighlight}
   */
  highlight: PIXI.Graphics | undefined;

  /**
   * A convenience reference to the coordinates Array for the Wall endpoints, [x0,y0,x1,y1].
   */
  get coords(): Wall.Coordinates;

  /**
   * The Edge instance which represents this Wall.
   */
  get edge(): Edge | null;

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
   * @remarks In radians. Returns `null` if the document's {@linkcode WallDocument.dir | dir} is falsey/not set
   */
  get direction(): number | null;

  /**
   * @remarks
   * @throws "`Wall#getSnappedPosition` is not supported: WallDocument does not have a (x, y) position"
   */
  override getSnappedPosition(position: never): never;

  override _pasteObject(offset: Canvas.Point, options?: PlaceableObject.PasteObjectOptions): Wall.PasteObjectData;

  /**
   * This helper converts the wall segment to a Ray
   * @returns The wall in Ray representation
   */
  toRay(): Ray;

  // fake type override
  override draw(options?: HandleEmptyObject<Wall.DrawOptions>): Promise<this>;

  protected override _draw(options: HandleEmptyObject<Wall.DrawOptions>): Promise<void>;

  protected override _clear(): void;

  override control(options?: Wall.ControlOptions): boolean;

  protected override _destroy(options: PIXI.IDestroyOptions | boolean | undefined): void;

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
   * Given the properties of the wall - decide upon a color to render the wall for display on the WallsLayer
   */
  protected _getWallColor(): number;

  protected override _onUpdate(
    changed: WallDocument.UpdateData,
    options: WallDocument.Database.OnUpdateOptions,
    userId: string,
  ): void;

  /**
   * Should this Wall have a corresponding {@linkcode DoorMesh}?
   */
  get hasDoorMesh(): boolean;

  /**
   * Create and add a {@linkcode DoorMesh} to the {@linkcode PrimaryCanvasContainer}.
   */
  createDoorMeshes(): Promise<void>;

  /**
   * Remove and destroy a {@linkcode DoorMesh} from the {@linkcode PrimaryCanvasContainer}.
   */
  destroyDoorMeshes(): void;

  /**
   * Play a door interaction sound.
   * This plays locally, each client independently applies this workflow.
   * @param interaction - The door interaction: "open", "close", "lock", "unlock", or "test".
   */
  protected _playDoorSound(interaction: Wall.DoorInteraction): void;

  /**
   * Customize the audible radius of sounds emitted by this wall, for example when a door opens or closes.
   * @defaultValue `canvas.dimensions.distance * 12; // 60 feet on a 5ft grid`
   */
  get soundRadius(): number;

  /**
   * Draw a control icon that is used to manipulate the door's open/closed state
   */
  createDoorControl(): DoorControl.Implementation | null;

  /**
   * Clear the door control if it exists.
   */
  clearDoorControl(): void;

  protected override _canControl(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  protected override _onHoverIn(event: Canvas.Event.Pointer, options?: PlaceableObject.HoverInOptions): false | void;

  protected override _onHoverOut(event?: Canvas.Event.Pointer | Event, options?: PlaceableObject.HoverOutOptions): void;

  protected override _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

  protected override _onClickLeft(event: Canvas.Event.Pointer): boolean;

  protected override _onClickLeft2(event: Canvas.Event.Pointer): void;

  protected override _onClickRight2(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftStart(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftMove(event: Canvas.Event.Pointer): void;

  protected override _prepareDragLeftDropUpdates(event: Canvas.Event.Pointer): Wall.DragLeftDropUpdate[] | null;

  /**
   * @deprecated "`Wall#initializeEdge` has been deprecated. Use
   * {@linkcode WallDocument.initializeEdge | WallDocument#initializeEdge} instead." (since v14, until v16)
   * @privateRemarks Foundry's JSDoc says `since v14`, but the `logCompatibilityWarning` call passes `{since: 15}`.
   */
  initializeEdge(options?: Wall.InitializeEdgeOptions): void;

  #Wall: true;
}

declare namespace Wall {
  /**
   * The implementation of the `Wall` placeable configured through `CONFIG.Wall.objectClass`
   * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
   *
   * Not to be confused with {@linkcode WallDocument.Implementation}
   * which refers to the implementation for the Wall document.
   */
  type Implementation = FixedInstanceType<ImplementationClass>;

  /**
   * The implementation of the `Wall` placeable configured through `CONFIG.Wall.objectClass`
   * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
   *
   * Not to be confused with {@linkcode WallDocument.ImplementationClass}
   * which refers to the implementation for the Wall document.
   */
  type ImplementationClass = PlaceableObject.ImplementationClassFor<"Wall">;

  interface RENDER_FLAGS extends PlaceableObject.RENDER_FLAGS {
    /** @defaultValue `{ propagate: ["refresh"] }` */
    redraw: RenderFlag<this, "redraw">;

    /** @defaultValue `{ propagate: ["refreshState", "refreshLine"], alias: true }` */
    refresh: RenderFlag<this, "refresh">;

    /** @defaultValue `{ propagate: ["refreshVisibility", "refreshEndpoints", "refreshHighlight"] }` */
    refreshState: RenderFlag<this, "refreshState">;

    /** @defaultValue `{}` */
    refreshVisibility: RenderFlag<this, "refreshVisibility">;

    /** @defaultValue `{ propagate: ["refreshEndpoints", "refreshHighlight", "refreshDirection"] }` */
    refreshLine: RenderFlag<this, "refreshLine">;

    /** @defaultValue `{}` */
    refreshEndpoints: RenderFlag<this, "refreshEndpoints">;

    /** @defaultValue `{}` */
    refreshDirection: RenderFlag<this, "refreshDirection">;

    /** @defaultValue `{}` */
    refreshHighlight: RenderFlag<this, "refreshHighlight">;
  }

  interface RenderFlags extends RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS> {}

  interface PasteObjectData {
    c: WallDocument.Coordinates;
    levels: string[];
  }

  type Coordinates = WallDocument.Coordinates;

  type DoorInteraction = "open" | "close" | "lock" | "unlock" | "test";

  interface DrawOptions extends PlaceableObject.DrawOptions {}

  interface RefreshOptions extends PlaceableObject.RefreshOptions {}

  /** @internal */
  interface _ControlOptions {
    /** @defaultValue `false` */
    chain: boolean;
  }

  interface ControlOptions extends InexactPartial<_ControlOptions>, PlaceableObject.ControlOptions {}

  interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}

  /** @internal */
  interface _InitializeEdgeOptions {
    /**
     * Has the edge been deleted?
     * @defaultValue `false`
     */
    deleted: boolean;
  }

  interface InitializeEdgeOptions extends InexactPartial<_InitializeEdgeOptions> {}

  interface GetLinkedSegmentsReturn {
    /** @remarks IDs of the Walls in `walls` */
    ids: string[];

    /** @remarks All the Walls connected to this one */
    walls: Wall.Implementation[];

    /** @remarks `walls.length + 1` endpoints */
    endpoints: Canvas.PointTuple[];
  }

  interface DragLeftDropUpdate {
    _id: string;
    c: WallDocument.Coordinates;
  }
}

export default Wall;
