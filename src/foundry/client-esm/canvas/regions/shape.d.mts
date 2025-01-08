import type {
  BaseShapeData,
  CircleShapeData,
  EllipseShapeData,
  PolygonShapeData,
  RectangleShapeData,
} from "../../data/_module.d.mts";

declare namespace RegionShape {
  type Any = RegionShape<any>;
}

/** A shape of a {@link Region} */
declare abstract class RegionShape<ShapeData extends BaseShapeData> {
  /**
   * Create the RegionShape from the shape data.
   * @param data    - The shape data.
   */
  constructor(data: ShapeData);

  /**
   * Create the RegionShape from the shape data.
   * @param data    - The shape data.
   */
  static create<ShapeData extends BaseShapeData>(data: ShapeData): RegionShape<ShapeData>;

  /**
   * The data of this shape.
   * It is owned by the shape and must not be modified.
   */
  get data(): ShapeData;
  #data: ShapeData;

  /** Is this a hole? */
  get isHole(): boolean;

  /**
   * The Clipper paths of this shape.
   * The winding numbers are 1 or 0.
   */
  get clipperPaths(): ReadonlyArray<ReadonlyArray<ClipperLib.IntPoint>>;
  #clipperPaths: ReadonlyArray<ReadonlyArray<ClipperLib.IntPoint>>;

  /** The Clipper polygon tree of this shape */
  get clipperPolyTree(): ClipperLib.PolyTree;
  #clipperPolyTree: ClipperLib.PolyTree;

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

// TODO(Eon): Is this even necessary? It's unexported in core.

/** A circle of a {@link Region} */
declare class RegionCircle extends RegionShape<CircleShapeData> {
  constructor(data: CircleShapeData);

  /** The vertex density epsilon used to create a polygon approximation of the circle. */
  static #VERTEX_DENSITY_EPSILON: number;

  protected override _createClipperPolyTree(): ClipperLib.PolyTree | ClipperLib.IntPoint[];

  protected override _drawShape(graphics: PIXI.Graphics): void;
}
/** An ellipse of a {@link Region} */
declare class RegionEllipse extends RegionShape<EllipseShapeData> {
  constructor(data: EllipseShapeData);

  /** The vertex density epsilon used to create a polygon approximation of the ellipse. */
  static #VERTEX_DENSITY_EPSILON: number;

  protected override _createClipperPolyTree(): ClipperLib.PolyTree | ClipperLib.IntPoint[];

  protected override _drawShape(graphics: PIXI.Graphics): void;
}
/** A polygon of a {@link Region} */
declare class RegionPolygon extends RegionShape<PolygonShapeData> {
  constructor(params: PolygonShapeData);

  protected override _createClipperPolyTree(): ClipperLib.PolyTree | ClipperLib.IntPoint[];

  protected override _drawShape(graphics: PIXI.Graphics): void;
}
/** A rectangle of a {@link Region} */
declare class RegionRectangle extends RegionShape<RectangleShapeData> {
  constructor(params: RectangleShapeData);

  protected override _createClipperPolyTree(): ClipperLib.PolyTree | ClipperLib.IntPoint[];

  protected override _drawShape(graphics: PIXI.Graphics): void;
}

export default RegionShape;
