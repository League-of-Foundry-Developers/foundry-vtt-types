import type { CircleShapeData, EllipseShapeData, PolygonShapeData, RectangleShapeData } from "../../data/_module.d.mts";

declare namespace RegionShape {
  type Any = RegionShape<any>;

  type ShapeData = CircleShapeData | EllipseShapeData | PolygonShapeData | RectangleShapeData;
  type ShapeType = ShapeData["type"];

  type CreatedRegionShape<ShapeData extends RegionShape.ShapeData> = _CreateReturnType<ShapeData, ShapeData["type"]>;

  /** @internal */
  type _CreateReturnType<ShapeData extends RegionShape.ShapeData, ShapeType extends RegionShape.ShapeType> =
    | (ShapeType extends "circle" ? RegionCircle<ShapeData> : never)
    | (ShapeType extends "ellipse" ? RegionEllipse<ShapeData> : never)
    | (ShapeType extends "polygon" ? RegionPolygon<ShapeData> : never)
    | (ShapeType extends "rectangle" ? RegionRectangle<ShapeData> : never);
}

/** A shape of a {@link Region} */
declare abstract class RegionShape<ShapeData extends RegionShape.ShapeData> {
  #regionShape: true;

  /**
   * Create the RegionShape from the shape data.
   * @param data    - The shape data.
   */
  constructor(data: ShapeData);

  /**
   * Create the RegionShape from the shape data.
   * @param data    - The shape data.
   */
  static create<ShapeData extends RegionShape.ShapeData>(data: ShapeData): RegionShape.CreatedRegionShape<ShapeData>;

  /**
   * The data of this shape.
   * It is owned by the shape and must not be modified.
   */
  get data(): ShapeData;

  /** Is this a hole? */
  get isHole(): boolean;

  /**
   * The Clipper paths of this shape.
   * The winding numbers are 1 or 0.
   */
  get clipperPaths(): ReadonlyArray<ReadonlyArray<ClipperLib.IntPoint>>;

  /** The Clipper polygon tree of this shape */
  get clipperPolyTree(): ClipperLib.PolyTree;

  /**
   * Create the Clipper polygon tree of this shape.
   * This function may return a single positively-orientated and non-selfintersecting Clipper path instead of a tree,
   * which is automatically converted to a Clipper polygon tree.
   * This function is called only once. It is not called if the shape is empty.
   */
  protected abstract _createClipperPolyTree(): ClipperLib.PolyTree | ClipperLib.IntPoint[];

  /**
   * Draw shape into the graphics.
   * @param graphics      - The graphics to draw the shape into.
   * @internal
   */
  protected abstract _drawShape(graphics: PIXI.Graphics): void;
}

/**
 * A circle of a {@link Region}
 * @privateRemarks Technically `ShapeData` should extend `CircleShapeData`, but it's easier to instantiate if it's `RegionShape.ShapeData`.
 */
declare class RegionCircle<ShapeData extends RegionShape.ShapeData> extends RegionShape<ShapeData> {
  #regionCircle: true;

  constructor(data: ShapeData);

  protected override _createClipperPolyTree(): ClipperLib.PolyTree | ClipperLib.IntPoint[];

  protected override _drawShape(graphics: PIXI.Graphics): void;
}
/**
 * An ellipse of a {@link Region}
 * @privateRemarks Technically `ShapeData` should extend `EllipseShapeData`, but it's easier to instantiate if it's `RegionShape.ShapeData`.
 */
declare class RegionEllipse<ShapeData extends RegionShape.ShapeData> extends RegionShape<ShapeData> {
  #regionEllipse: true;

  constructor(data: ShapeData);

  protected override _createClipperPolyTree(): ClipperLib.PolyTree | ClipperLib.IntPoint[];

  protected override _drawShape(graphics: PIXI.Graphics): void;
}
/**
 * A polygon of a {@link Region}
 * @privateRemarks Technically `ShapeData` should extend `PolygonShapeData`, but it's easier to instantiate if it's `RegionShape.ShapeData`.
 */
declare class RegionPolygon<ShapeData extends RegionShape.ShapeData> extends RegionShape<ShapeData> {
  constructor(params: ShapeData);

  protected override _createClipperPolyTree(): ClipperLib.PolyTree | ClipperLib.IntPoint[];

  protected override _drawShape(graphics: PIXI.Graphics): void;
}
/**
 * A rectangle of a {@link Region}
 * @privateRemarks Technically `ShapeData` should extend `RectangleShapeData`, but it's easier to instantiate if it's `RegionShape.ShapeData`.
 */
declare class RegionRectangle<ShapeData extends RegionShape.ShapeData> extends RegionShape<ShapeData> {
  constructor(params: ShapeData);

  protected override _createClipperPolyTree(): ClipperLib.PolyTree | ClipperLib.IntPoint[];

  protected override _drawShape(graphics: PIXI.Graphics): void;
}

export default RegionShape;
