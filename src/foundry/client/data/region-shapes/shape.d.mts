/* eslint-disable @typescript-eslint/no-deprecated */
import type { DeepReadonly, Identity } from "#utils";
import type { BaseShapeData } from "#common/data/data.d.mts";
import type {
  CircleShapeData,
  EllipseShapeData,
  PolygonShapeData,
  RectangleShapeData,
} from "#client/data/shapes.d.mts";

/**
 * A shape of a {@linkcode foundry.documents.RegionDocument}.
 * @deprecated "`RegionShape` is deprecated. Use BaseShapeData subclasses instead." (since v14, until v16)
 */
declare class RegionShape<ShapeData extends BaseShapeData.Any = BaseShapeData.Any> {
  /**
   * Create a RegionShape.
   * @param data - The shape data.
   * @internal
   */
  constructor(data: ShapeData);

  /**
   * Create the RegionShape from the shape data.
   * @param data - The shape data.
   */
  static create<ShapeData extends RegionShape.ShapeData>(data: ShapeData): RegionShape<ShapeData>;

  static _create<ShapeData extends BaseShapeData.Any>(data: ShapeData): RegionShape<ShapeData>;

  /**
   * The data of this shape.
   * It is owned by the shape and must not be modified.
   */
  get data(): ShapeData;

  /**
   * Is this a hole?
   */
  get isHole(): boolean;

  /**
   * The Clipper paths of this shape.
   * The winding numbers are 1 or 0.
   */
  get clipperPaths(): DeepReadonly<PIXI.Polygon.ClipperPath[]>;

  /**
   * The Clipper polygon tree of this shape.
   */
  get clipperPolyTree(): ClipperLib.PolyTree;

  #RegionShape: true;
}

declare namespace RegionShape {
  interface Any extends AnyRegionShape {}

  interface AnyConstructor extends Identity<typeof AnyRegionShape> {}

  /** @remarks The shape data {@linkcode RegionShape.create} accepts. */
  type ShapeData = CircleShapeData | EllipseShapeData | PolygonShapeData | RectangleShapeData;
}

/**
 * A circle of a {@linkcode foundry.documents.RegionDocument}.
 * @deprecated since v14
 */
declare class RegionCircleShape extends RegionShape<CircleShapeData> {}

/**
 * An ellipse of a {@linkcode foundry.documents.RegionDocument}.
 * @deprecated since v14
 */
declare class RegionEllipseShape extends RegionShape<EllipseShapeData> {}

/**
 * A polygon of a {@linkcode foundry.documents.RegionDocument}.
 * @deprecated since v14
 */
declare class RegionPolygonShape extends RegionShape<PolygonShapeData> {}

/**
 * A rectangle of a {@linkcode foundry.documents.RegionDocument}.
 * @deprecated since v14
 */
declare class RegionRectangleShape extends RegionShape<RectangleShapeData> {}

declare abstract class AnyRegionShape extends RegionShape<BaseShapeData.Any> {
  constructor(...args: never);
}

export { RegionShape, RegionCircleShape, RegionEllipseShape, RegionPolygonShape, RegionRectangleShape };
