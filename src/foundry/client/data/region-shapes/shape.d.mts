import type { CircleShapeData, EllipseShapeData, PolygonShapeData, RectangleShapeData } from "../_module.d.mts";

/** A shape of a {@linkcode Region} */
declare abstract class RegionShape<ShapeData extends RegionShape.ShapeData> {
  /**
   * Create the RegionShape from the shape data.
   * @param data - The shape data.
   */
  constructor(data: ShapeData);

  /**
   * Create the RegionShape from the shape data.
   * @param data - The shape data.
   */
  static create<ShapeData extends RegionShape.ShapeData>(data: ShapeData): RegionShape.CreatedRegionShape<ShapeData>;

  /**
   * The data of this shape.
   *
   * It is owned by the shape and must not be modified.
   */
  get data(): ShapeData;

  /** Is this a hole? */
  get isHole(): boolean;

  /**
   * The Clipper paths of this shape.
   *
   * The winding numbers are 1 or 0.
   * @remarks Foundry types this as `ReadonlyArray<>`, but does nothing to prevent writes
   * at runtime, just returning a reference to `this.#clipperPaths`
   */
  get clipperPaths(): ClipperLib.Paths;

  /** The Clipper polygon tree of this shape */
  get clipperPolyTree(): ClipperLib.PolyTree;

  /**
   * Create the Clipper polygon tree of this shape.
   *
   * This function may return a single positively-orientated and non-self-intersecting Clipper path instead of a tree,
   * which is automatically converted to a Clipper polygon tree.
   *
   * This function is called only once. It is not called if the shape is empty.
   * @remarks Despite Foundry typing this as possibly returning a `PolyTree`, all four core subclasses return `Path`s,
   * relying on the {@link RegionShape.clipperPolyTree | `#clipperPolyTree`} getter to convert and cache it.
   */
  protected abstract _createClipperPolyTree(): ClipperLib.PolyTree | ClipperLib.Path;

  /**
   * Draw shape into the graphics.
   * @param graphics  - The graphics to draw the shape into.
   * @remarks Foundry marked `@internal` but not `@abstract`, despite it throwing if not overridden
   */
  protected abstract _drawShape(graphics: PIXI.Graphics): void;
}

declare namespace RegionShape {
  interface Any extends AnyRegionShape {}
  type AnyConstructor = typeof AnyRegionShape;

  type ShapeData = CircleShapeData | EllipseShapeData | PolygonShapeData | RectangleShapeData;

  type CreatedRegionShape<ShapeData extends RegionShape.ShapeData> =
    | (ShapeData extends CircleShapeData ? RegionCircle<ShapeData> : never)
    | (ShapeData extends EllipseShapeData ? RegionEllipse<ShapeData> : never)
    | (ShapeData extends PolygonShapeData ? RegionPolygon<ShapeData> : never)
    | (ShapeData extends RectangleShapeData ? RegionRectangle<ShapeData> : never);
}

/**
 * A circle of a {@linkcode Region}
 * @privateRemarks Technically `ShapeData` should extend `CircleShapeData`, but it's easier to instantiate if it's `RegionShape.ShapeData`.
 */
declare class RegionCircle<ShapeData extends RegionShape.ShapeData> extends RegionShape<ShapeData> {
  #regionCircle: true;

  constructor(data: ShapeData);

  protected override _createClipperPolyTree(): ClipperLib.Path;

  protected override _drawShape(graphics: PIXI.Graphics): void;
}

/**
 * An ellipse of a {@linkcode Region}
 * @privateRemarks Technically `ShapeData` should extend `EllipseShapeData`, but it's easier to instantiate if it's `RegionShape.ShapeData`.
 */
declare class RegionEllipse<ShapeData extends RegionShape.ShapeData> extends RegionShape<ShapeData> {
  #regionEllipse: true;

  constructor(data: ShapeData);

  protected override _createClipperPolyTree(): ClipperLib.Path;

  protected override _drawShape(graphics: PIXI.Graphics): void;
}

/**
 * A polygon of a {@linkcode Region}
 * @privateRemarks Technically `ShapeData` should extend `PolygonShapeData`, but it's easier to instantiate if it's `RegionShape.ShapeData`.
 */
declare class RegionPolygon<ShapeData extends RegionShape.ShapeData> extends RegionShape<ShapeData> {
  constructor(params: ShapeData);

  protected override _createClipperPolyTree(): ClipperLib.Path;

  protected override _drawShape(graphics: PIXI.Graphics): void;
}

/**
 * A rectangle of a {@linkcode Region}
 * @privateRemarks Technically `ShapeData` should extend `RectangleShapeData`, but it's easier to instantiate if it's `RegionShape.ShapeData`.
 */
declare class RegionRectangle<ShapeData extends RegionShape.ShapeData> extends RegionShape<ShapeData> {
  constructor(params: ShapeData);

  protected override _createClipperPolyTree(): ClipperLib.Path;

  protected override _drawShape(graphics: PIXI.Graphics): void;
}

// Only RegionShape is exported, so `Any_` classes and types for the subclasses have been omitted
declare abstract class AnyRegionShape extends RegionShape<RegionShape.ShapeData> {
  constructor(...args: never);
}

export { RegionShape, RegionCircle, RegionEllipse, RegionPolygon, RegionRectangle };
