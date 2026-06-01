import type { Identity, FixedInstanceType, InexactPartial, HandleEmptyObject } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PlaceablesLayer } from "./_module.d.mts";
import type { PlaceableObject, Wall } from "#client/canvas/placeables/_module.d.mts";
import type { SceneControls } from "#client/applications/ui/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      WallsLayer: WallsLayer.Implementation;
    }
  }
}

/**
 * The Walls canvas layer which provides a container for Wall objects within the rendered Scene.
 */
declare class WallsLayer extends PlaceablesLayer<"Wall"> {
  /**
   * A graphics layer used to display chained Wall selection
   * @defaultValue `null`
   * @remarks Only `null` prior to first draw
   */
  chain: PIXI.Graphics | null;

  /**
   * Track whether we are currently within a chained placement workflow
   * @defaultValue `false`
   * @internal
   */
  _chain: boolean;

  /**
   * Track the most recently created or updated wall data for use with the clone tool
   * @defaultValue `null`
   * @internal
   */
  _cloneType: WallDocument.Source | null;

  /**
   * Reference the last interacted wall endpoint for the purposes of chaining
   * @defaultValue `{ point: null }`
   * @internal
   */
  _last: WallsLayer.LastPoint;

  /** @deprecated Foundry replaced with {@linkcode _last} in v13. This warning will be removed in v14. */
  last: never;

  // Fake type override
  static get instance(): Canvas["walls"];

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.layerOptions, {
   *  name: "walls"
   *  controllableObjects: true,
   *  zIndex: 700
   * })
   * ```
   */
  static override get layerOptions(): WallsLayer.LayerOptions;

  // Fake type override
  override options: WallsLayer.LayerOptions;

  static override documentName: "Wall";

  override get hookName(): "WallsLayer";

  /**
   * An Array of Wall instances in the current Scene which act as Doors.
   */
  get doors(): Wall.Implementation[];

  override getSnappedPoint(point: Canvas.Point): Canvas.Point;

  // fake type override
  override draw(options?: HandleEmptyObject<WallsLayer.DrawOptions>): Promise<this>;

  protected override _draw(options: HandleEmptyObject<WallsLayer.DrawOptions>): Promise<void>;

  protected override _deactivate(): void;

  /**
   * Given a point and the coordinates of a wall, determine which endpoint is closer to the point
   * @param point - The origin point of the new Wall placement
   * @param wall  - The existing Wall object being chained to
   * @returns The [x,y] coordinates of the starting endpoint
   */
  static getClosestEndpoint(point: Canvas.Point, wall: Wall.Implementation): Canvas.PointTuple;

  override releaseAll(options?: PlaceableObject.ReleaseOptions): number;

  /**  @deprecated Removed without replacement in v13. This warning will be removed in v14. */
  protected _panCanvasEdge(...args: never): never;

  /**
   * Get the wall endpoint coordinates for a given point.
   * @param  point - The candidate wall endpoint.
   * @returns The wall endpoint coordinates.
   * @internal
   */
  _getWallEndpointCoordinates(
    point: Canvas.Point,
    options?: WallsLayer.GetWallEndpointCoordinatesOptions,
  ): Canvas.PointTuple;

  /** @deprecated Made hard private in v13. This warning will be removed in v14.*/
  protected _getWallDataFromActiveTool(tool?: never): never;

  /**
   * Identify the interior enclosed by the given walls.
   * @param  walls - The walls that enclose the interior.
   * @returns The polygons of the interior.
   * @remarks Foundry marked `@license MIT`
   */
  identifyInteriorArea(walls: Wall.Implementation[]): PIXI.Polygon[];

  static override prepareSceneControls(): SceneControls.Control;

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  protected override _onDragLeftStart(event: Canvas.Event.Pointer): Promise<Wall.Implementation>;

  protected override _onDragLeftMove(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftDrop(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  /**
   * Custom undo for wall creation while chaining is active.
   */
  protected override _onUndoCreate(event: PlaceablesLayer.CreationHistoryEntry<"Wall">): Promise<WallDocument.Stored[]>;

  protected override _onClickRight(event: Canvas.Event.Pointer): void;

  /**
   * Perform initialization steps for the WallsLayer whenever the composition of walls in the Scene is changed.
   * Cache unique wall endpoints and identify interior walls using overhead roof tiles.
   * @deprecated "`WallsLayer#initialize` is deprecated in favor of
   * {@linkcode foundry.canvas.geometry.edges.CanvasEdges.initialize | Canvas#edges#initialize}" (since v12, until v14)
   */
  initialize(): void;

  /**
   * Identify walls which are treated as "interior" because they are contained fully within a roof tile.
   * @deprecated "`WallsLayer#identifyInteriorWalls` has been deprecated. It has no effect anymore and there's no replacement."
   * (since v12, until v14)
   */
  identifyInteriorWalls(): void;

  /**
   * Initialization to identify all intersections between walls.
   * These intersections are cached and used later when computing point source polygons.
   * @deprecated "`WallsLayer#identifyWallIntersections` is deprecated in favor of
   * {@linkcode foundry.canvas.geometry.edges.Edge.identifyEdgeIntersections} and has no effect." (since v12, until v14)
   */
  identifyWallIntersections(): void;

  #WallsLayer: true;
}

declare namespace WallsLayer {
  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode Implementation} instead. This type will be removed in v15.
   */
  type Any = Internal.Any;

  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode ImplementationClass} instead. This type will be removed in v15.
   */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyWallsLayer {}
    interface AnyConstructor extends Identity<typeof AnyWallsLayer> {}
  }

  interface ImplementationClass extends Identity<CONFIG["Canvas"]["layers"]["walls"]["layerClass"]> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface LayerOptions extends PlaceablesLayer.LayerOptions<Wall.ImplementationClass> {
    name: "walls";
    controllableObjects: true;
    objectClass: Wall.ImplementationClass;

    /** @defaultValue `700` */
    zIndex: number;
  }

  interface DrawOptions extends PlaceablesLayer.DrawOptions {}

  // `WallsLayer` has no `_tearDown` override, this exists for consistency
  interface TearDownOptions extends PlaceablesLayer.TearDownOptions {}

  interface LastPoint {
    point: Canvas.PointTuple | null;
  }

  /** @internal */
  interface _Snap {
    /**
     * Snap to the grid?
     * @defaultValue `true`
     */
    snap: boolean;
  }

  interface GetWallEndpointCoordinatesOptions extends InexactPartial<_Snap> {}
}

export default WallsLayer;

declare abstract class AnyWallsLayer extends WallsLayer {
  constructor(...args: never);
}
