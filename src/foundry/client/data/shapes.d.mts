import type { AnyObject, DeepReadonly } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type * as data from "#common/data/data.d.mts";
import type { Ray } from "#client/canvas/geometry/_module.d.mts";
import type { PolygonTree } from "./polygon-tree.d.mts";

/**
 * @privateRemarks Foundry declares this class inside the unexported `ClientShapeDataMixin`. Declaration merging is
 * used instead of a mixin call so each shape class keeps its own `Schema` type parameter; since an interface can't
 * merge with `protected`/`private` members, those hooks are public here and a private brand replaces them.
 */
declare class _ClientShapeData {
  /**
   * The scene that this shape is placed in, if any.
   */
  get scene(): Scene.Implementation | null;

  /**
   * The grid that this shape is placed in.
   */
  get grid(): foundry.grid.BaseGrid;

  /**
   * The gridless version of the grid that this shape is placed in.
   */
  get gridlessGrid(): foundry.grid.GridlessGrid;

  /**
   * Is this shape empty?
   */
  get isEmpty(): boolean;

  /**
   * The polygons of this shape.
   *
   * The value of this property must not be mutated.
   */
  get polygons(): readonly PIXI.Polygon[];

  /**
   * The polygon tree of this shape.
   *
   * The value of this property must not be mutated.
   */
  get polygonTree(): PolygonTree;

  /**
   * The Clipper paths of this shape.
   * The winding numbers are 1 or 0.
   *
   * The value of this property must not be mutated.
   */
  get clipperPaths(): DeepReadonly<PIXI.Polygon.ClipperPath[]>;

  /**
   * The Clipper polygon tree of this shape.
   *
   * The value of this property must not be mutated.
   */
  get clipperPolyTree(): ClipperLib.PolyTree;

  /**
   * The triangulation of this shape.
   *
   * The value of this property must not be mutated.
   */
  get triangulation(): PolygonTree.Triangulation;

  /**
   * The bounds of this Region.
   *
   * The value of this property must not be mutated.
   */
  get bounds(): PIXI.Rectangle;

  /**
   * The center point of this shape.
   */
  get center(): Readonly<Canvas.Point>;

  /**
   * The area of this shape.
   */
  get area(): number;

  /**
   * The measured segments of this shape.
   * Each segment consist of a ray, winding order, distance in grid units, and the angle in degrees if it has one.
   * The ray represents the measured segment. If the winding order is ...
   *  - 1, the segment is an edge in positive orientation.
   *  - -1, the segment is an edge in negative orientation.
   *  - 0, the segment is not an edge.
   *
   * The distance is the actual grid distance if the shape is grid-based.
   * Otherwise the distance is the distance in pixels divided by of the ratio of grid distance and grid size.
   */
  get measuredSegments(): DeepReadonly<ClientShapeData.MeasuredSegment[]>;

  /**
   * The control handles of this shape.
   * Each handle has a position and a rotation in radians.
   */
  get controlHandles(): DeepReadonly<ClientShapeData.ControlHandles>;

  /**
   * Called when the shape was changed.
   * This function is not called when just the hole state is changed.
   * This function is not called if grid-based is changed and the grid is gridless.
   */
  _onShapeChange(): void;

  /**
   * Called when the grid this shape is placed in changes.
   * @param changed - The changes to the grid.
   */
  _onGridChange(changed: AnyObject): void;

  /**
   * Is this shape currently affected by the grid?
   */
  get isAffectedByGrid(): boolean;

  /**
   * Whether the shape is identical to itself after a rotation around its origin.
   */
  get hasRotationalSymmetry(): boolean;

  /**
   * Create a ray.
   * @param x         - The x-coordinate of the origin of the ray.
   * @param y         - The y-coordinate of the origin of the ray.
   * @param direction - The direction of the ray in degrees.
   * @param length    - The length of the ray in pixels.
   * @param alignment - The alignment to ray.
   *                    (default: `0`)
   * @internal
   */
  _createRay(x: number, y: number, direction: number, length: number, alignment?: number): Ray;

  /**
   * Snap the given point.
   * @param point - The point that is to be snapped.
   * @returns The snapped point.
   * @internal
   */
  _getSnappedPoint(point: Canvas.Point): Canvas.Point;

  /**
   * Get the size for the given ray defined by a length and direction.
   * @param length    - The length of the ray in pixels.
   * @param direction - The direction of the ray in radians.
   * @param options   - Additional options.
   * @returns The snapped size in pixels.
   * @internal
   */
  _calculateSize(length: number, direction: number, options?: ClientShapeData.CalculateSizeOptions): number;

  /**
   * Snap the given rotation.
   * @param rotation - The rotation to be snapped in degrees.
   * @returns The snapped rotation in degrees.
   * @internal
   */
  _getSnappedRotation(rotation: number): number;

  /**
   * Test whether given point is contained within this shape.
   * @param point - The point.
   */
  testPoint(point: Canvas.Point): boolean;

  /**
   * Create the Clipper polygon tree of this shape.
   * This function may return a single positively-orientated and non-selfintersecting Clipper path instead of a tree,
   * which is automatically converted to a Clipper polygon tree.
   * This function is called only once. It is not called if the shape is empty.
   * @remarks
   * @throws If not overridden.
   */
  _createClipperPolyTree(): ClipperLib.PolyTree | PIXI.Polygon.ClipperPath | Canvas.Point[] | number[];

  /**
   * Create the origin point of this shape.
   */
  _createOrigin(): Canvas.Point;

  /**
   * Create the center point of this shape.
   */
  _createCenter(): Canvas.Point;

  /**
   * Calculate the area of this shape.
   */
  _calculateArea(): number;

  /**
   * Move the shape to the given origin.
   * @param origin  - The (unsnapped) origin.
   * @param options - Additional options.
   */
  move(origin: Canvas.Point, options?: ClientShapeData.MoveOptions): void;

  /**
   * Rotate the shape by the given angle in degrees around the origin (or pivot).
   * @param angle   - The angle in degrees.
   * @param options - Additional options.
   */
  rotate(angle: number, options?: ClientShapeData.RotateOptions): void;

  /**
   * Rotate the shape by the given angle in degrees around the origin.
   * @param angle - The angle in degrees.
   */
  _rotate(angle: number): void;

  /**
   * Draw the shape into the Graphics element.
   * @param graphics - The Graphics element
   */
  drawShape(graphics: PIXI.Graphics): void;

  /**
   * Draw reference lines of the shape into the Graphics element, if it has any.
   * @param graphics - The Graphics element
   */
  drawReferenceLines(graphics: PIXI.Graphics): void;

  /**
   * Create a measured segment.
   * @param x         - The x-coordinate of the origin of the ray.
   * @param y         - The y-coordinate of the origin of the ray.
   * @param direction - The direction of the ray in degrees.
   * @param length    - The length of the ray in pixels.
   * @param alignment - The alignment of the ray.
   * @param winding   - The winding order.
   * @param angle     - The angle in degrees.
   * @internal
   */
  _createMeasuredSegment(
    x: number,
    y: number,
    direction: number,
    length: number,
    alignment: number,
    winding: ClientShapeData.Winding,
    angle?: number,
  ): ClientShapeData.MeasuredSegment;

  /**
   * Create the measured segments of this shape.
   * @remarks
   * @throws If not overridden.
   */
  _createMeasuredSegments(): ClientShapeData.MeasuredSegment[];

  /**
   * Get the control handles for this shape.
   * @returns The position, rotation in radians, and visible state for each handle.
   * @remarks
   * @throws If not overridden.
   */
  _createControlHandles(): ClientShapeData.ControlHandles;

  /**
   * Move the control handle to the destination position.
   * @param name        - The handle name.
   * @param destination - The destination of the handle.
   * @param options     - Additional options.
   * @remarks
   * @throws If not overridden.
   */
  moveControlHandle(name: string, destination: Canvas.Point, options?: ClientShapeData.MoveControlHandleOptions): void;

  /**
   * Transform this shape by moving a scale handle.
   * @param fieldName   - The field name of the axis that is scaled.
   * @param origin      - The origin.
   * @param direction   - The direction of the axis in degrees.
   * @param alignment   - The alignment of the axis.
   * @param destination - The handle destination.
   * @param snap        - Snap?
   * @param allowZero   - Allow zero size?
   *                      (default: `false`)
   * @param max         - The maximum value.
   * @internal
   */
  _moveScaleHandle(
    fieldName: string,
    origin: Canvas.Point,
    direction: number,
    alignment: number,
    destination: Canvas.Point,
    snap: boolean,
    allowZero?: boolean,
    max?: number,
  ): void;

  /**
   * Transform this shape by moving a rotation handle.
   * @param direction   - The direction of the rotation handle in degrees.
   * @param destination - The handle destination.
   * @param snap        - Snap?
   * @internal
   */
  _moveRotationHandle(direction: number, destination: Canvas.Point, snap: boolean): void;

  /**
   * Transform this shape by moving the sweep handle.
   * @param maxAngle    - The maximum angle possible.
   * @param destination - The handle destination.
   * @param snap        - Snap?
   * @internal
   */
  _moveSweepHandle(maxAngle: number, destination: Canvas.Point, snap: boolean): void;

  /**
   * Handle the drag start event for the creation of this shape.
   * @param event - The pointer event.
   * @internal
   */
  _onDragStart(event: PIXI.FederatedEvent): void;

  /**
   * Handle the drag move event for the creation of this shape.
   * @param event - The pointer event.
   * @internal
   * @remarks
   * @throws If not overridden.
   */
  _onDragMove(event: PIXI.FederatedEvent): void;

  /**
   * Sample a point from the shape interior.
   * @param out - A point to write to.
   * @returns The sampled point.
   * @throws If the shape is empty.
   */
  sampleInterior(out?: Canvas.Point): Canvas.Point;

  /**
   * Sample a point from the shape boundary.
   * @param out - A point to write to.
   * @returns The sampled point.
   * @throws If the shape is empty.
   */
  sampleBoundary(out?: Canvas.Point): Canvas.Point;
}

/**
 * @privateRemarks Split from {@linkcode _ClientShapeData} because {@linkcode PolygonShapeData} and
 * {@linkcode GridShapeData} register an `origin` schema field that the mixin's getter shadows with a narrower type.
 */
declare class ClientShapeData extends _ClientShapeData {
  /**
   * The origin of this shape.
   */
  get origin(): Readonly<Canvas.Point>;
}

declare namespace ClientShapeData {
  /**
   * Convert a path to a clipper path.
   * @param path - A path
   * @internal
   */
  type ToClipperPath = (path: PIXI.Polygon.ClipperPath | Canvas.Point[] | number[]) => PIXI.Polygon.ClipperPath;

  /**
   * The winding order of a measured segment. If the winding order is ...
   *  - 1, the segment is an edge in positive orientation.
   *  - -1, the segment is an edge in negative orientation.
   *  - 0, the segment is not an edge.
   */
  type Winding = -1 | 0 | 1;

  interface MeasuredSegment {
    ray: Ray;

    winding: Winding;

    /**
     * @remarks The actual grid distance if the shape is grid-based, otherwise the distance in pixels divided by the
     * ratio of grid distance and grid size.
     */
    distance: number;

    /** @remarks In degrees. Only present for shapes that have an angle. */
    angle?: number;
  }

  interface ControlHandle {
    position: Canvas.Point;

    /** @remarks In radians. */
    rotation: number;

    visible: boolean;
  }

  interface ControlHandles {
    [name: string]: ControlHandle;
  }

  interface CalculateSizeOptions {
    /**
     * Snap the size to with defined grid snapping precision?
     * @defaultValue `false`
     */
    snap?: boolean | undefined;

    /**
     * Round the size to integer?
     * @defaultValue `!snap`
     */
    round?: boolean | undefined;

    /**
     * Allow the size to be zero?
     * @defaultValue `false`
     */
    allowZero?: boolean | undefined;
  }

  interface MoveOptions {
    /**
     * Snap the origin?
     * @defaultValue `false`
     */
    snap?: boolean | undefined;
  }

  interface RotateOptions {
    /**
     * The pivot of rotation. Default: origin.
     */
    pivot?: Canvas.Point | undefined;
  }

  interface MoveControlHandleOptions {
    /**
     * Snapping?
     * @defaultValue `false`
     */
    snap?: boolean | undefined;

    /**
     * Unlinked scaling?
     * @defaultValue `false`
     * @remarks Only {@linkcode RectangleShapeData} reads this; the other shapes ignore it.
     */
    unlinked?: boolean | undefined;
  }
}

/**
 * The data model for a rectangle shape.
 */
declare class RectangleShapeData<
  Schema extends data.RectangleShapeData.Schema = data.RectangleShapeData.Schema,
> extends data.RectangleShapeData<Schema> {
  /**
   * Convert a path to a clipper path.
   * @internal
   */
  static _toClipperPath: ClientShapeData.ToClipperPath;

  /**
   * Get the rays for both axes.
   * @internal
   */
  _getRays(): RectangleShapeData.Rays;

  #RectangleShapeData: true;
}

declare interface RectangleShapeData<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Schema extends data.RectangleShapeData.Schema = data.RectangleShapeData.Schema,
> extends ClientShapeData {}

declare namespace RectangleShapeData {
  type Schema = data.RectangleShapeData.Schema;
  type Source = data.RectangleShapeData.Source;
  type CreateData = data.RectangleShapeData.CreateData;
  type UpdateData = data.RectangleShapeData.UpdateData;
  type InitializedData = data.RectangleShapeData.InitializedData;

  interface Rays {
    axisX: Ray;

    axisY: Ray;
  }
}

/**
 * The data model for a circle shape.
 */
declare class CircleShapeData<
  Schema extends data.CircleShapeData.Schema = data.CircleShapeData.Schema,
> extends data.CircleShapeData<Schema> {
  /**
   * Convert a path to a clipper path.
   * @internal
   */
  static _toClipperPath: ClientShapeData.ToClipperPath;
}

declare interface CircleShapeData<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Schema extends data.CircleShapeData.Schema = data.CircleShapeData.Schema,
> extends ClientShapeData {}

declare namespace CircleShapeData {
  type Schema = data.CircleShapeData.Schema;
  type Source = data.CircleShapeData.Source;
  type CreateData = data.CircleShapeData.CreateData;
  type UpdateData = data.CircleShapeData.UpdateData;
  type InitializedData = data.CircleShapeData.InitializedData;
}

/**
 * The data model for an ellipse shape.
 */
declare class EllipseShapeData<
  Schema extends data.EllipseShapeData.Schema = data.EllipseShapeData.Schema,
> extends data.EllipseShapeData<Schema> {
  /**
   * Convert a path to a clipper path.
   * @internal
   */
  static _toClipperPath: ClientShapeData.ToClipperPath;

  /**
   * Get the rays for both axes.
   * @internal
   */
  _getRays(): EllipseShapeData.Rays;

  #EllipseShapeData: true;
}

declare interface EllipseShapeData<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Schema extends data.EllipseShapeData.Schema = data.EllipseShapeData.Schema,
> extends ClientShapeData {}

declare namespace EllipseShapeData {
  type Schema = data.EllipseShapeData.Schema;
  type Source = data.EllipseShapeData.Source;
  type CreateData = data.EllipseShapeData.CreateData;
  type UpdateData = data.EllipseShapeData.UpdateData;
  type InitializedData = data.EllipseShapeData.InitializedData;

  interface Rays {
    axisX: Ray;

    axisY: Ray;
  }
}

/**
 * The data model for a cone shape.
 */
declare class ConeShapeData<
  Schema extends data.ConeShapeData.Schema = data.ConeShapeData.Schema,
> extends data.ConeShapeData<Schema> {
  /**
   * Convert a path to a clipper path.
   * @internal
   */
  static _toClipperPath: ClientShapeData.ToClipperPath;

  /**
   * Get the left, center, and right rays of this cone.
   * @internal
   */
  _getRays(): ConeShapeData.Rays;

  #ConeShapeData: true;
}

declare interface ConeShapeData<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Schema extends data.ConeShapeData.Schema = data.ConeShapeData.Schema,
> extends ClientShapeData {}

declare namespace ConeShapeData {
  type Schema = data.ConeShapeData.Schema;
  type Source = data.ConeShapeData.Source;
  type CreateData = data.ConeShapeData.CreateData;
  type UpdateData = data.ConeShapeData.UpdateData;
  type InitializedData = data.ConeShapeData.InitializedData;

  interface Rays {
    left: Ray;

    center: Ray;

    right: Ray;
  }
}

/**
 * The data model for a ring shape.
 */
declare class RingShapeData<
  Schema extends data.RingShapeData.Schema = data.RingShapeData.Schema,
> extends data.RingShapeData<Schema> {
  /**
   * Convert a path to a clipper path.
   * @internal
   */
  static _toClipperPath: ClientShapeData.ToClipperPath;

  #RingShapeData: true;
}

declare interface RingShapeData<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Schema extends data.RingShapeData.Schema = data.RingShapeData.Schema,
> extends ClientShapeData {}

declare namespace RingShapeData {
  type Schema = data.RingShapeData.Schema;
  type Source = data.RingShapeData.Source;
  type CreateData = data.RingShapeData.CreateData;
  type UpdateData = data.RingShapeData.UpdateData;
  type InitializedData = data.RingShapeData.InitializedData;
}

/**
 * The data model for a line shape.
 */
declare class LineShapeData<
  Schema extends data.LineShapeData.Schema = data.LineShapeData.Schema,
> extends data.LineShapeData<Schema> {
  /**
   * Convert a path to a clipper path.
   * @internal
   */
  static _toClipperPath: ClientShapeData.ToClipperPath;

  /**
   * Get the rays for both axes.
   * @internal
   */
  _getRays(): LineShapeData.Rays;

  #LineShapeData: true;
}

declare interface LineShapeData<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Schema extends data.LineShapeData.Schema = data.LineShapeData.Schema,
> extends ClientShapeData {}

declare namespace LineShapeData {
  type Schema = data.LineShapeData.Schema;
  type Source = data.LineShapeData.Source;
  type CreateData = data.LineShapeData.CreateData;
  type UpdateData = data.LineShapeData.UpdateData;
  type InitializedData = data.LineShapeData.InitializedData;

  interface Rays {
    axisX: Ray;

    axisY: Ray;
  }
}

/**
 * The data model for an emanation shape.
 */
declare class EmanationShapeData<
  Schema extends data.EmanationShapeData.Schema = data.EmanationShapeData.Schema,
> extends data.EmanationShapeData<Schema> {
  /**
   * Convert a path to a clipper path.
   * @internal
   */
  static _toClipperPath: ClientShapeData.ToClipperPath;

  #EmanationShapeData: true;
}

declare interface EmanationShapeData<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Schema extends data.EmanationShapeData.Schema = data.EmanationShapeData.Schema,
> extends ClientShapeData {}

declare namespace EmanationShapeData {
  type Schema = data.EmanationShapeData.Schema;
  type Source = data.EmanationShapeData.Source;
  type CreateData = data.EmanationShapeData.CreateData;
  type UpdateData = data.EmanationShapeData.UpdateData;
  type InitializedData = data.EmanationShapeData.InitializedData;
}

/**
 * The data model for a polygon shape.
 */
declare class PolygonShapeData<
  Schema extends data.PolygonShapeData.Schema = data.PolygonShapeData.Schema,
> extends data.PolygonShapeData<Schema> {
  /**
   * Convert a path to a clipper path.
   * @internal
   */
  static _toClipperPath: ClientShapeData.ToClipperPath;

  /**
   * The origin of this shape.
   * @remarks Shadows the `origin` schema field: the getter returns `_source.origin` when it is set and
   * the polygon's centre of mass otherwise, so it is never `null`.
   */
  override readonly origin: Readonly<Canvas.Point>;

  #PolygonShapeData: true;
  static #PolygonShapeDataStatic: true;
}

declare interface PolygonShapeData<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Schema extends data.PolygonShapeData.Schema = data.PolygonShapeData.Schema,
> extends _ClientShapeData {}

declare namespace PolygonShapeData {
  type Schema = data.PolygonShapeData.Schema;
  type Source = data.PolygonShapeData.Source;
  type CreateData = data.PolygonShapeData.CreateData;
  type UpdateData = data.PolygonShapeData.UpdateData;
  type InitializedData = data.PolygonShapeData.InitializedData;
}

/**
 * The data model for a token shape.
 */
declare class TokenShapeData<
  Schema extends data.TokenShapeData.Schema = data.TokenShapeData.Schema,
> extends data.TokenShapeData<Schema> {
  /**
   * Convert a path to a clipper path.
   * @internal
   */
  static _toClipperPath: ClientShapeData.ToClipperPath;

  /**
   * Get the token shape.
   * @internal
   * @privateRemarks Foundry's `@type` omits {@linkcode RectangleShapeData}, which the runtime creates for square
   * grids and for non-elliptical gridless tokens.
   */
  _getTokenShape(): TokenShapeData.ResolvedShape;

  #TokenShapeData: true;
}

declare interface TokenShapeData<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Schema extends data.TokenShapeData.Schema = data.TokenShapeData.Schema,
> extends ClientShapeData {}

declare namespace TokenShapeData {
  type Schema = data.TokenShapeData.Schema;
  type Source = data.TokenShapeData.Source;
  type CreateData = data.TokenShapeData.CreateData;
  type UpdateData = data.TokenShapeData.UpdateData;
  type InitializedData = data.TokenShapeData.InitializedData;

  type ResolvedShape = CircleShapeData | EllipseShapeData | RectangleShapeData | PolygonShapeData;
}

/**
 * The data model for a grid shape.
 */
declare class GridShapeData<
  Schema extends data.GridShapeData.Schema = data.GridShapeData.Schema,
> extends data.GridShapeData<Schema> {
  /**
   * Convert a path to a clipper path.
   * @internal
   */
  static _toClipperPath: ClientShapeData.ToClipperPath;

  /**
   * The origin of this shape.
   * @remarks Shadows the `origin` schema field: the getter returns `_source.origin` when it is set and
   * the centre of the first grid offset otherwise, so it is never `null`.
   */
  override readonly origin: Readonly<Canvas.Point>;

  #GridShapeData: true;
}

declare interface GridShapeData<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Schema extends data.GridShapeData.Schema = data.GridShapeData.Schema,
> extends _ClientShapeData {}

declare namespace GridShapeData {
  type Schema = data.GridShapeData.Schema;
  type Source = data.GridShapeData.Source;
  type CreateData = data.GridShapeData.CreateData;
  type UpdateData = data.GridShapeData.UpdateData;
  type InitializedData = data.GridShapeData.InitializedData;
}

export {
  RectangleShapeData,
  CircleShapeData,
  EllipseShapeData,
  ConeShapeData,
  RingShapeData,
  LineShapeData,
  EmanationShapeData,
  PolygonShapeData,
  TokenShapeData,
  GridShapeData,
};
