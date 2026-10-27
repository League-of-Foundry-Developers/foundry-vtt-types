import type { AnyObject, DeepReadonly, Mixin } from "#utils";
import type { DataModel } from "#common/abstract/data.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type * as data from "#common/data/data.d.mts";
import type { fields } from "#client/data/_module.d.mts";
import type { Ray } from "#client/canvas/geometry/_module.d.mts";
import type { PolygonTree } from "./polygon-tree.d.mts";

declare class ClientShapeData {
  /** @privateRemarks All mixin classes should accept anything for their constructor. */
  constructor(...args: any[]);

  /**
   * Convert a path to a clipper path.
   * @param path - A path
   * @internal
   */
  static _toClipperPath(path: PIXI.Polygon.ClipperPath | Canvas.Point[] | number[]): PIXI.Polygon.ClipperPath;

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
  get clipperPaths(): readonly PIXI.Polygon.ClipperPath[];

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
   * The origin of this shape.
   */
  get origin(): Readonly<Canvas.Point>;

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

  // Mixin override.
  // The composed base supplies the schema-specific signature.
  //
  // protected _updateCommit(
  //   copy: SchemaField.SourceData<Schema>,
  //   diff: SchemaField.UpdateData<Schema>,
  //   options: DataModel.UpdateOptions,
  //   _state: DataField.UpdateState,
  // ): void;
  //
  // clone(data?: SchemaField.UpdateData<Schema>, context?: DataModel.CloneContext<ExtraConstructorOptions>): this;

  /**
   * Called when the shape was changed.
   * This function is not called when just the hole state is changed.
   * This function is not called if grid-based is changed and the grid is gridless.
   */
  protected _onShapeChange(): void;

  /**
   * Called when the grid this shape is placed in changes.
   * @param changed - The changes to the grid.
   */
  protected _onGridChange(changed: AnyObject): void;

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
  protected _createClipperPolyTree(): ClientShapeData.CreateClipperPolyTreeReturn;

  /**
   * Create the origin point of this shape.
   */
  protected _createOrigin(): Canvas.Point;

  /**
   * Create the center point of this shape.
   */
  protected _createCenter(): Canvas.Point;

  /**
   * Calculate the area of this shape.
   */
  protected _calculateArea(): number;

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
  protected _rotate(angle: number): void;

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
  protected _createMeasuredSegments(): ClientShapeData.MeasuredSegment[];

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
   * @param allowZero   - Allow zero size? (default: `false`)
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

  #ClientShapeData: true;
  static #ClientShapeDataStatic: true;
}

declare namespace ClientShapeData {
  type CreateClipperPolyTreeReturn = ClipperLib.PolyTree | PIXI.Polygon.ClipperPath | Canvas.Point[] | number[];

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
 * Mixin a BaseShapeData subclass.
 * @privateRemarks Foundry does not export this function or its inner `ClientShapeData` class.
 * They are declared here to share members across the exported shape classes.
 */
declare function ClientShapeDataMixin<BaseClass extends ClientShapeDataMixin.BaseClass>(
  ShapeData: BaseClass,
): ClientShapeDataMixin.Mix<BaseClass>;

declare namespace ClientShapeDataMixin {
  type BaseClass = data.BaseShapeData.AnyConstructor;
  type Mix<BaseClass extends ClientShapeDataMixin.BaseClass> = Mixin<typeof ClientShapeData, BaseClass>;
}

/**
 * The data model for a rectangle shape.
 */
declare class RectangleShapeData<
  Schema extends RectangleShapeData.Schema = RectangleShapeData.Schema,
> extends ClientShapeDataMixin(data.RectangleShapeData)<Schema> {
  /**
   * Get the rays for both axes.
   * @internal
   */
  _getRays(): RectangleShapeData.Rays;

  override get isEmpty(): boolean;

  override clone(data?: SchemaField.UpdateData<Schema>, context?: DataModel.CloneContext): this;

  protected override _onShapeChange(): void;

  protected override _createClipperPolyTree(): ClientShapeData.CreateClipperPolyTreeReturn;

  protected override _createCenter(): Canvas.Point;

  protected override _calculateArea(): number;

  override sampleInterior(out?: Canvas.Point): Canvas.Point;

  override sampleBoundary(out?: Canvas.Point): Canvas.Point;

  override drawShape(graphics: PIXI.Graphics): void;

  protected override _createMeasuredSegments(): ClientShapeData.MeasuredSegment[];

  override _createControlHandles(): ClientShapeData.ControlHandles;

  override moveControlHandle(
    name: string,
    destination: Canvas.Point,
    options?: ClientShapeData.MoveControlHandleOptions,
  ): void;

  override _onDragMove(event: PIXI.FederatedEvent): void;

  #RectangleShapeData: true;
}

declare namespace RectangleShapeData {
  interface Schema extends data.BaseShapeData.Schema<"rectangle"> {
    /**
     * The x-coordinate of the origin in pixels.
     * @defaultValue `undefined`
     */
    x: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The y-coordinate of the origin in pixels.
     * @defaultValue `undefined`
     */
    y: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The width of the rectangle in pixels.
     * @defaultValue `undefined`
     */
    width: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * The height of the rectangle in pixels.
     * @defaultValue `undefined`
     */
    height: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * The x-coordinate of the anchor.
     * @defaultValue `0`
     */
    anchorX: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

    /**
     * The y-coordinate of the anchor.
     * @defaultValue `0`
     */
    anchorY: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

    /**
     * The rotation around the origin of the rectangle in degrees.
     * @defaultValue `0`
     */
    rotation: fields.AngleField;

    /**
     * If the shape is grid-based, its dimensions are converted into grid units by dividing each by the grid size and
     * multiplying by the grid distance. The shape is then constructed using these dimensions conforming to the
     * grid's metric.
     * @defaultValue `false`
     */
    gridBased: fields.BooleanField;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}

  interface Rays {
    axisX: Ray;

    axisY: Ray;
  }
}

/**
 * The data model for a circle shape.
 */
declare class CircleShapeData<
  Schema extends CircleShapeData.Schema = CircleShapeData.Schema,
> extends ClientShapeDataMixin(data.CircleShapeData)<Schema> {
  override get isEmpty(): boolean;

  protected override _createClipperPolyTree(): ClientShapeData.CreateClipperPolyTreeReturn;

  protected override _calculateArea(): number;

  override sampleInterior(out?: Canvas.Point): Canvas.Point;

  override sampleBoundary(out?: Canvas.Point): Canvas.Point;

  protected override _rotate(angle: number): void;

  override drawShape(graphics: PIXI.Graphics): void;

  protected override _createMeasuredSegments(): ClientShapeData.MeasuredSegment[];

  override _createControlHandles(): ClientShapeData.ControlHandles;

  override moveControlHandle(
    name: string,
    destination: Canvas.Point,
    options?: ClientShapeData.MoveControlHandleOptions,
  ): void;

  override _onDragMove(event: PIXI.FederatedEvent): void;
}

declare namespace CircleShapeData {
  interface Schema extends data.BaseShapeData.Schema<"circle"> {
    /**
     * The x-coordinate of the center point in pixels.
     * @defaultValue `undefined`
     */
    x: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The y-coordinate of the center point in pixels.
     * @defaultValue `undefined`
     */
    y: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The radius of the circle in pixels.
     * @defaultValue `undefined`
     */
    radius: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * If the shape is grid-based, its dimensions are converted into grid units by dividing each by the grid size and
     * multiplying by the grid distance. The shape is then constructed using these dimensions conforming to the
     * grid's metric.
     * @defaultValue `false`
     */
    gridBased: fields.BooleanField;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/**
 * The data model for an ellipse shape.
 */
declare class EllipseShapeData<
  Schema extends EllipseShapeData.Schema = EllipseShapeData.Schema,
> extends ClientShapeDataMixin(data.EllipseShapeData)<Schema> {
  /**
   * Get the rays for both axes.
   * @internal
   */
  _getRays(): EllipseShapeData.Rays;

  override get isEmpty(): boolean;

  override clone(data?: SchemaField.UpdateData<Schema>, context?: DataModel.CloneContext): this;

  protected override _onShapeChange(): void;

  protected override _createClipperPolyTree(): ClientShapeData.CreateClipperPolyTreeReturn;

  protected override _calculateArea(): number;

  override sampleInterior(out?: Canvas.Point): Canvas.Point;

  override drawShape(graphics: PIXI.Graphics): void;

  protected override _createMeasuredSegments(): ClientShapeData.MeasuredSegment[];

  override _createControlHandles(): ClientShapeData.ControlHandles;

  override moveControlHandle(
    name: string,
    destination: Canvas.Point,
    options?: ClientShapeData.MoveControlHandleOptions,
  ): void;

  override _onDragMove(event: PIXI.FederatedEvent): void;

  #EllipseShapeData: true;
}

declare namespace EllipseShapeData {
  interface Schema extends data.BaseShapeData.Schema<"ellipse"> {
    /**
     * The x-coordinate of the center point in pixels.
     * @defaultValue `undefined`
     */
    x: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The y-coordinate of the center point in pixels.
     * @defaultValue `undefined`
     */
    y: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The x-radius of the circle in pixels.
     * @defaultValue `undefined`
     */
    radiusX: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * The y-radius of the circle in pixels.
     * @defaultValue `undefined`
     */
    radiusY: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * The rotation around the center of the rectangle in degrees.
     * @defaultValue `0`
     */
    rotation: fields.AngleField;

    /**
     * If the shape is grid-based, its dimensions are converted into grid units by dividing each by the grid size and
     * multiplying by the grid distance. The shape is then constructed using these dimensions conforming to the
     * grid's metric.
     * @defaultValue `false`
     */
    gridBased: fields.BooleanField;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}

  interface Rays {
    axisX: Ray;

    axisY: Ray;
  }
}

/**
 * The data model for a cone shape.
 */
declare class ConeShapeData<Schema extends ConeShapeData.Schema = ConeShapeData.Schema> extends ClientShapeDataMixin(
  data.ConeShapeData,
)<Schema> {
  /**
   * Get the left, center, and right rays of this cone.
   * @internal
   */
  _getRays(): ConeShapeData.Rays;

  override get isEmpty(): boolean;

  override clone(data?: SchemaField.UpdateData<Schema>, context?: DataModel.CloneContext): this;

  protected override _onShapeChange(): void;

  protected override _createClipperPolyTree(): ClientShapeData.CreateClipperPolyTreeReturn;

  protected override _createCenter(): Canvas.Point;

  protected override _calculateArea(): number;

  protected override _createMeasuredSegments(): ClientShapeData.MeasuredSegment[];

  override _createControlHandles(): ClientShapeData.ControlHandles;

  override moveControlHandle(
    name: string,
    destination: Canvas.Point,
    options?: ClientShapeData.MoveControlHandleOptions,
  ): void;

  override _onDragMove(event: PIXI.FederatedEvent): void;

  #ConeShapeData: true;
}

declare namespace ConeShapeData {
  interface Schema extends data.BaseShapeData.Schema<"cone"> {
    /**
     * The x-coordinate of the center point in pixels.
     * @defaultValue `undefined`
     */
    x: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The y-coordinate of the center point in pixels.
     * @defaultValue `undefined`
     */
    y: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The radius of the cone in pixels.
     * @defaultValue `undefined`
     */
    radius: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * The angle of the cone in degrees.
     * @defaultValue `undefined`
     */
    angle: fields.AngleField<{ initial: undefined; min: 0; normalize: false }>;

    /**
     * The direction of the cone in degrees.
     * @defaultValue `0`
     */
    rotation: fields.AngleField;

    /**
     * The curvature.
     * @defaultValue `"round"`
     */
    curvature: fields.StringField<{
      required: true;
      initial: "round";
      choices: {
        round: "SHAPE.TYPES.cone.CURVATURES.round.label";
        flat: "SHAPE.TYPES.cone.CURVATURES.flat.label";
        semicircle: "SHAPE.TYPES.cone.CURVATURES.semicircle.label";
      };
    }>;

    /**
     * If the shape is grid-based, its dimensions are converted into grid units by dividing each by the grid size and
     * multiplying by the grid distance. The shape is then constructed using these dimensions conforming to the
     * grid's metric.
     * @defaultValue `false`
     */
    gridBased: fields.BooleanField;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}

  interface Rays {
    left: Ray;

    center: Ray;

    right: Ray;
  }
}

/**
 * The data model for a ring shape.
 */
declare class RingShapeData<Schema extends RingShapeData.Schema = RingShapeData.Schema> extends ClientShapeDataMixin(
  data.RingShapeData,
)<Schema> {
  override get isEmpty(): boolean;

  override clone(data?: SchemaField.UpdateData<Schema>, context?: DataModel.CloneContext): this;

  protected override _onShapeChange(): void;

  protected override _createClipperPolyTree(): ClientShapeData.CreateClipperPolyTreeReturn;

  protected override _calculateArea(): number;

  override sampleInterior(out?: Canvas.Point): Canvas.Point;

  override sampleBoundary(out?: Canvas.Point): Canvas.Point;

  protected override _rotate(angle: number): void;

  override drawShape(graphics: PIXI.Graphics): void;

  override drawReferenceLines(graphics: PIXI.Graphics): void;

  protected override _createMeasuredSegments(): ClientShapeData.MeasuredSegment[];

  override _createControlHandles(): ClientShapeData.ControlHandles;

  override moveControlHandle(
    name: string,
    destination: Canvas.Point,
    options?: ClientShapeData.MoveControlHandleOptions,
  ): void;

  override _onDragMove(event: PIXI.FederatedEvent): void;

  #RingShapeData: true;
}

declare namespace RingShapeData {
  interface Schema extends data.BaseShapeData.Schema<"ring"> {
    /**
     * The x-coordinate of the origin in pixels.
     * @defaultValue `undefined`
     */
    x: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The y-coordinate of the origin in pixels.
     * @defaultValue `undefined`
     */
    y: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The radius of the ring in pixels.
     * @defaultValue `undefined`
     */
    radius: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * The inner width of the ring in pixels.
     * @defaultValue `undefined`
     */
    innerWidth: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * The inner width of the ring in pixels.
     * @defaultValue `undefined`
     */
    outerWidth: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * If the shape is grid-based, its dimensions are converted into grid units by dividing each by the grid size and
     * multiplying by the grid distance. The shape is then constructed using these dimensions conforming to the
     * grid's metric.
     * @defaultValue `false`
     */
    gridBased: fields.BooleanField;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/**
 * The data model for a line shape.
 */
declare class LineShapeData<Schema extends LineShapeData.Schema = LineShapeData.Schema> extends ClientShapeDataMixin(
  data.LineShapeData,
)<Schema> {
  /**
   * Get the rays for both axes.
   * @internal
   */
  _getRays(): LineShapeData.Rays;

  override get isEmpty(): boolean;

  override clone(data?: SchemaField.UpdateData<Schema>, context?: DataModel.CloneContext): this;

  protected override _onShapeChange(): void;

  protected override _createClipperPolyTree(): ClientShapeData.CreateClipperPolyTreeReturn;

  protected override _createCenter(): Canvas.Point;

  protected override _calculateArea(): number;

  override sampleInterior(out?: Canvas.Point): Canvas.Point;

  override sampleBoundary(out?: Canvas.Point): Canvas.Point;

  protected override _createMeasuredSegments(): ClientShapeData.MeasuredSegment[];

  override _createControlHandles(): ClientShapeData.ControlHandles;

  override moveControlHandle(
    name: string,
    destination: Canvas.Point,
    options?: ClientShapeData.MoveControlHandleOptions,
  ): void;

  override _onDragMove(event: PIXI.FederatedEvent): void;

  #LineShapeData: true;
}

declare namespace LineShapeData {
  interface Schema extends data.BaseShapeData.Schema<"line"> {
    /**
     * The x-coordinate of the origin in pixels.
     * @defaultValue `undefined`
     */
    x: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The y-coordinate of the origin in pixels.
     * @defaultValue `undefined`
     */
    y: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The length of the line in pixels.
     * @defaultValue `undefined`
     */
    length: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * The width of the line in pixels.
     * @defaultValue `undefined`
     */
    width: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * The rotation around the origin of the line in degrees.
     * @defaultValue `0`
     */
    rotation: fields.AngleField;

    /**
     * If the shape is grid-based, its dimensions are converted into grid units by dividing each by the grid size and
     * multiplying by the grid distance. The shape is then constructed using these dimensions conforming to the
     * grid's metric.
     * @defaultValue `false`
     */
    gridBased: fields.BooleanField;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}

  interface Rays {
    axisX: Ray;

    axisY: Ray;
  }
}

/**
 * The data model for an emanation shape.
 */
declare class EmanationShapeData<
  Schema extends EmanationShapeData.Schema = EmanationShapeData.Schema,
> extends ClientShapeDataMixin(data.EmanationShapeData)<Schema> {
  override get isEmpty(): boolean;

  protected override _onShapeChange(): void;

  override get isAffectedByGrid(): boolean;

  override get hasRotationalSymmetry(): boolean;

  protected override _createClipperPolyTree(): ClientShapeData.CreateClipperPolyTreeReturn;

  protected override _createOrigin(): Canvas.Point;

  override move(origin: Canvas.Point, options?: ClientShapeData.MoveOptions): void;

  protected override _rotate(angle: number): void;

  override drawReferenceLines(graphics: PIXI.Graphics): void;

  protected override _createMeasuredSegments(): ClientShapeData.MeasuredSegment[];

  override _createControlHandles(): ClientShapeData.ControlHandles;

  override moveControlHandle(
    name: string,
    destination: Canvas.Point,
    options?: ClientShapeData.MoveControlHandleOptions,
  ): void;

  override _onDragMove(event: PIXI.FederatedEvent): void;

  #EmanationShapeData: true;
}

declare namespace EmanationShapeData {
  interface Schema extends data.BaseShapeData.Schema<"emanation"> {
    /**
     * The base shape of the emanation.
     */
    base: fields.TypedSchemaField<data.BaseShapeData.EmanationBaseTypes>;

    /**
     * The radius of the emanation in pixels.
     * @defaultValue `undefined`
     */
    radius: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * If the shape is grid-based, its dimensions are converted into grid units by dividing each by the grid size and
     * multiplying by the grid distance. The shape is then constructed using these dimensions conforming to the
     * grid's metric.
     * @defaultValue `false`
     */
    gridBased: fields.BooleanField;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/**
 * The data model for a polygon shape.
 */
declare class PolygonShapeData<
  Schema extends PolygonShapeData.Schema = PolygonShapeData.Schema,
> extends ClientShapeDataMixin(data.PolygonShapeData)<Schema> {
  /**
   * The origin of this shape.
   * @remarks Shadows the `origin` schema field: the getter returns `_source.origin` when it is set and
   * the polygon's centre of mass otherwise, so it is never `null`.
   */
  // fake type override
  override readonly origin: Readonly<Canvas.Point>;

  override get hasRotationalSymmetry(): boolean;

  protected override _createClipperPolyTree(): ClientShapeData.CreateClipperPolyTreeReturn;

  protected override _createOrigin(): Canvas.Point;

  override _getSnappedPoint(point: Canvas.Point): Canvas.Point;

  override _calculateSize(length: number, direction: number, options?: ClientShapeData.CalculateSizeOptions): number;

  override move(origin: Canvas.Point, options?: ClientShapeData.MoveOptions): void;

  protected override _rotate(angle: number): void;

  protected override _createMeasuredSegments(): ClientShapeData.MeasuredSegment[];

  override _createControlHandles(): ClientShapeData.ControlHandles;

  override moveControlHandle(
    name: string,
    destination: Canvas.Point,
    options?: ClientShapeData.MoveControlHandleOptions,
  ): void;

  override _onDragStart(event: PIXI.FederatedEvent): void;

  override _onDragMove(event: PIXI.FederatedEvent): void;

  #PolygonShapeData: true;
}

declare namespace PolygonShapeData {
  interface OriginSchema extends fields.DataSchema {
    x: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    y: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;
  }

  interface Schema extends data.BaseShapeData.Schema<"polygon"> {
    /**
     * The points of the polygon ([x0, y0, x1, y1, ...]).
     * The polygon must not be self-intersecting if it is supposed to be filled.
     * The polygon must not contained zero-length edges except for the edge from the last to the first point.
     * @defaultValue `[]`
     */
    points: fields.ArrayField<
      fields.NumberField<{ required: true; nullable: false; initial: undefined }>,
      { min: 4; validate: (value: number[]) => void }
    >;

    /**
     * The origin of the polygon. If null, it defaults to the center-of-mass.
     * @defaultValue `null`
     */
    origin: fields.SchemaField<OriginSchema, { nullable: true }>;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/**
 * The data model for a token shape.
 */
declare class TokenShapeData<Schema extends TokenShapeData.Schema = TokenShapeData.Schema> extends ClientShapeDataMixin(
  data.TokenShapeData,
)<Schema> {
  /**
   * Get the token shape.
   * @internal
   * @privateRemarks Foundry's `@type` omits {@linkcode RectangleShapeData}, which the runtime creates for square
   * grids and for non-elliptical gridless tokens.
   */
  _getTokenShape(): TokenShapeData.ResolvedShape;

  override get isEmpty(): boolean;

  override get polygonTree(): PolygonTree;

  override sampleInterior(out?: Canvas.Point): Canvas.Point;

  override sampleBoundary(out?: Canvas.Point): Canvas.Point;

  protected override _onShapeChange(): void;

  override get isAffectedByGrid(): boolean;

  protected override _createClipperPolyTree(): ClientShapeData.CreateClipperPolyTreeReturn;

  protected override _createOrigin(): Canvas.Point;

  override move(origin: Canvas.Point, options?: ClientShapeData.MoveOptions): void;

  protected override _rotate(angle: number): void;

  protected override _createMeasuredSegments(): ClientShapeData.MeasuredSegment[];

  override _createControlHandles(): ClientShapeData.ControlHandles;

  override moveControlHandle(
    name: string,
    destination: Canvas.Point,
    options?: ClientShapeData.MoveControlHandleOptions,
  ): void;

  override _onDragMove(event: PIXI.FederatedEvent): void;

  #TokenShapeData: true;
}

declare namespace TokenShapeData {
  interface Schema extends data.BaseShapeData.Schema<"token"> {
    /**
     * The top-left x-coordinate in pixels (integer).
     * @defaultValue `undefined`
     */
    x: fields.NumberField<{ required: true; nullable: false; integer: true; initial: undefined }>;

    /**
     * The top-left y-coordinate in pixels (integer).
     * @defaultValue `undefined`
     */
    y: fields.NumberField<{ required: true; nullable: false; integer: true; initial: undefined }>;

    /**
     * The width in grid spaces (positive).
     * @defaultValue `undefined`
     */
    width: fields.NumberField<{ required: true; nullable: false; positive: true; initial: undefined }>;

    /**
     * The height in grid spaces (positive).
     * @defaultValue `undefined`
     */
    height: fields.NumberField<{ required: true; nullable: false; positive: true; initial: undefined }>;

    /**
     * The shape type (see {@linkcode CONST.TOKEN_SHAPES}).
     * @defaultValue `undefined`
     */
    shape: fields.NumberField<{ required: true; choices: CONST.TOKEN_SHAPES[]; initial: undefined }>;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}

  type ResolvedShape = CircleShapeData | EllipseShapeData | RectangleShapeData | PolygonShapeData;
}

/**
 * The data model for a grid shape.
 */
declare class GridShapeData<Schema extends GridShapeData.Schema = GridShapeData.Schema> extends ClientShapeDataMixin(
  data.GridShapeData,
)<Schema> {
  /**
   * The origin of this shape.
   * @remarks Shadows the `origin` schema field: the getter returns `_source.origin` when it is set and
   * the centre of the first grid offset otherwise, so it is never `null`.
   */
  // fake type override
  override readonly origin: Readonly<Canvas.Point>;

  override get isEmpty(): boolean;

  override get isAffectedByGrid(): boolean;

  override get hasRotationalSymmetry(): boolean;

  protected override _onShapeChange(): void;

  override testPoint(point: Canvas.Point): boolean;

  protected override _createClipperPolyTree(): ClientShapeData.CreateClipperPolyTreeReturn;

  protected override _createOrigin(): Canvas.Point;

  override move(origin: Canvas.Point, options?: ClientShapeData.MoveOptions): void;

  /**
   * @see {@link https://www.redblobgames.com/grids/hexagons/implementation.html#rotation}
   */
  protected override _rotate(angle: number): void;

  protected override _createMeasuredSegments(): ClientShapeData.MeasuredSegment[];

  override _createControlHandles(): ClientShapeData.ControlHandles;

  override moveControlHandle(
    name: string,
    destination: Canvas.Point,
    options?: ClientShapeData.MoveControlHandleOptions,
  ): void;

  override _onDragMove(event: PIXI.FederatedEvent): void;

  #GridShapeData: true;
}

declare namespace GridShapeData {
  interface OriginSchema extends fields.DataSchema {
    x: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    y: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;
  }

  interface Schema extends data.BaseShapeData.Schema<"grid"> {
    /**
     * The grid offsets covered by this shape
     * @defaultValue `[]`
     */
    offsets: fields.GridOffsetsField;

    /**
     * The optional grid space origin, which is by default the center point of the first grid space in `offsets`
     * @defaultValue `null`
     */
    origin: fields.SchemaField<OriginSchema, { nullable: true }>;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
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
