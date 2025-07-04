import type { Coalesce, HandleEmptyObject, Identity, NullishProps } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { Ray, PointSourcePolygon } from "#client/canvas/geometry/_module.d.mts";
import type { PlaceablesLayer } from "./_module.d.mts";
import type { PlaceableObject, Wall } from "#client/canvas/placeables/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      WallsLayer: WallsLayer.Any;
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
   */
  protected _chain: boolean;

  /**
   * Track the most recently created or updated wall data for use with the clone tool
   * @defaultValue `null`
   * @remarks Foundry marked `@private`, is set via {@link Wall#_onCreate} and {@link Wall#_onUpdate}
   */
  protected _cloneType: WallDocument.Source | null;

  /**
   * Reference the last interacted wall endpoint for the purposes of chaining
   * @defaultValue `{ point: null }`
   * @remarks Foundry marked `@private`, is set via {@link Wall#_onHoverIn}, {@link Wall#_onHoverOut}, and {@link Wall#_prepareDragLeftDropUpdates}
   */
  protected last: {
    point: Canvas.PointTuple | null;
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
   *  zIndex: 700
   * })
   * ```
   */
  static override get layerOptions(): WallsLayer.LayerOptions;

  /** @privateRemarks This is not overridden in foundry but reflects the real behavior. */
  override options: WallsLayer.LayerOptions;

  static override documentName: "Wall";

  override get hookName(): "WallsLayer";

  /**
   * An Array of Wall instances in the current Scene which act as Doors.
   */
  get doors(): Wall.Implementation[];

  override getSnappedPoint(point: Canvas.Point): Canvas.Point;

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

  /**
   * Pan the canvas view when the cursor position gets close to the edge of the frame
   * @param event - The originating mouse movement event
   * @param x     - The x-coordinate
   * @param y     - The y-coordinate
   * @remarks Foundry marked `@private`
   */
  protected _panCanvasEdge(event: MouseEvent, x: number, y: number): Promise<boolean> | void;

  /**
   * Get the wall endpoint coordinates for a given point.
   * @param  point - The candidate wall endpoint.
   * @returns The wall endpoint coordinates.
   * @remarks Foundry marked `@internal`, is called externally in {@link Wall#_onDragLeftMove} and {@link Wall#_prepareDragLeftDropUpdates}
   */
  protected _getWallEndpointCoordinates(
    point: Canvas.Point,
    options?: WallsLayer.GetWallEndpointCoordinatesOptions, // not:null (destructured)
  ): Canvas.PointTuple;

  /**
   * The Scene Controls tools provide several different types of prototypical Walls to choose from
   * This method helps to translate each tool into a default wall data configuration for that type
   * @param tool - The active canvas tool
   * @remarks If a tool is not provided, returns an object with `light`, `sight`, `sound`, and `move` keys, all with the value `CONST.WALL_SENSE_TYPES.NORMAL`
   */
  protected _getWallDataFromActiveTool(tool?: WallsLayer.WallTools | null): WallDocument.Source;

  /**
   * Identify the interior enclosed by the given walls.
   * @param  walls - The walls that enclose the interior.
   * @returns The polygons of the interior.
   * @remarks Foundry marked `@license MIT`
   */
  identifyInteriorArea(walls: Wall.Implementation[]): PIXI.Polygon[];

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  protected override _onDragLeftStart(event: Canvas.Event.Pointer): Promise<Wall.Implementation>;

  protected override _onDragLeftMove(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftDrop(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  protected override _onClickRight(event: Canvas.Event.Pointer): void;

  /**
   * @deprecated since v11, will be removed in v13
   * @remarks "WallsLayer#checkCollision is obsolete. Prefer calls to testCollision from CONFIG.Canvas.polygonBackends[type]"
   */
  checkCollision<Mode extends PointSourcePolygon.CollisionModes | undefined = undefined>(
    ray: Ray,
    options: PointSourcePolygon.TestCollisionOptions<Mode>,
  ): PointSourcePolygon.TestCollision<Coalesce<Mode, "all">>;

  /**
   * @deprecated since v11, will be removed in v13
   * @remarks "The WallsLayer#highlightControlledSegments function is deprecated in favor of calling wall.renderFlags.set(\"refreshHighlight\") on individual Wall objects"
   */
  highlightControlledSegments(): void;

  /**
   * Perform initialization steps for the WallsLayer whenever the composition of walls in the Scene is changed.
   * Cache unique wall endpoints and identify interior walls using overhead roof tiles.
   * @deprecated since v12 until v14
   * @remarks "WallsLayer#initialize is deprecated in favor of Canvas#edges#initialize"
   */
  initialize(): void;

  /**
   * Identify walls which are treated as "interior" because they are contained fully within a roof tile.
   * @deprecated since v12 until v14
   * @remarks "WallsLayer#identifyInteriorWalls has been deprecated. It has no effect anymore and there's no replacement."
   */
  identifyInteriorWalls(): void;

  /**
   * Initialization to identify all intersections between walls.
   * These intersections are cached and used later when computing point source polygons.
   * @deprecated since v12 until v14
   * @remarks "WallsLayer#identifyWallIntersections is deprecated in favor of foundry.canvas.geometry.edges.Edge.identifyEdgeIntersections and has no effect."
   */
  identifyWallIntersections(): void;
}

declare namespace WallsLayer {
  interface Any extends AnyWallsLayer {}
  interface AnyConstructor extends Identity<typeof AnyWallsLayer> {}

  interface DrawOptions extends PlaceablesLayer.DrawOptions {}

  interface LayerOptions extends PlaceablesLayer.LayerOptions<Wall.ImplementationClass> {
    name: "walls";
    controllableObjects: true;
    objectClass: Wall.ImplementationClass;
    zIndex: 700;
  }

  /** @internal */
  type _Snap = NullishProps<{
    /**
     * Snap to the grid?
     * @defaultValue `true`
     */
    snap: boolean;
  }>;

  /** @remarks The types handled by {@link Wall#_getWallDataFromActiveTool} */
  type WallTools = "clone" | "invisible" | "terrain" | "ethereal" | "doors" | "secret" | "window";

  interface GetWallEndpointCoordinatesOptions extends _Snap {}
}

export default WallsLayer;

declare abstract class AnyWallsLayer extends WallsLayer {
  constructor(...args: never);
}
