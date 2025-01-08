import type { BaseShapeData, CircleShapeData, EllipseShapeData, PolygonShapeData, RectangleShapeData } from "../../data/_module.d.mts";

declare namespace RegionShape {
  type Any = RegionShape<any>;
}

/** A shape of a {@link Region} */
declare class RegionShape<ShapeData extends BaseShapeData> {}
/** A circle of a {@link Region} */
declare class RegionCircle extends RegionShape<CircleShapeData> {}
/** An ellipse of a {@link Region} */
declare class RegionEllipse extends RegionShape<EllipseShapeData> {}
/** A polygon of a {@link Region} */
declare class RegionPolygon extends RegionShape<PolygonShapeData> {}
/** A rectangle of a {@link Region} */
declare class RegionRectangle extends RegionShape<RectangleShapeData> {}

export default RegionShape;