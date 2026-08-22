import { expectTypeOf } from "vitest";
import type { DeepReadonly } from "#utils";
import type { Ray } from "#client/canvas/geometry/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";

import RectangleShapeData = foundry.data.RectangleShapeData;
import CircleShapeData = foundry.data.CircleShapeData;
import EllipseShapeData = foundry.data.EllipseShapeData;
import ConeShapeData = foundry.data.ConeShapeData;
import RingShapeData = foundry.data.RingShapeData;
import LineShapeData = foundry.data.LineShapeData;
import EmanationShapeData = foundry.data.EmanationShapeData;
import PolygonShapeData = foundry.data.PolygonShapeData;
import TokenShapeData = foundry.data.TokenShapeData;
import GridShapeData = foundry.data.GridShapeData;

declare const rectangle: RectangleShapeData;
declare const circle: CircleShapeData;
declare const ellipse: EllipseShapeData;
declare const cone: ConeShapeData;
declare const ring: RingShapeData;
declare const line: LineShapeData;
declare const emanation: EmanationShapeData;
declare const polygon: PolygonShapeData;
declare const tokenShape: TokenShapeData;
declare const gridShape: GridShapeData;

declare const graphics: PIXI.Graphics;
declare const point: Canvas.Point;

// The shared surface `ClientShapeDataMixin` adds is visible on every shape class.
expectTypeOf(rectangle.scene).toEqualTypeOf<Scene.Implementation | null>();
expectTypeOf(rectangle.grid).toEqualTypeOf<foundry.grid.BaseGrid>();
expectTypeOf(rectangle.gridlessGrid).toEqualTypeOf<foundry.grid.GridlessGrid>();
expectTypeOf(rectangle.isEmpty).toBeBoolean();
expectTypeOf(rectangle.polygons).toEqualTypeOf<readonly PIXI.Polygon[]>();
expectTypeOf(rectangle.polygonTree).toEqualTypeOf<foundry.data.PolygonTree>();
expectTypeOf(rectangle.clipperPaths).toEqualTypeOf<DeepReadonly<PIXI.Polygon.ClipperPath[]>>();
expectTypeOf(rectangle.clipperPolyTree).toEqualTypeOf<ClipperLib.PolyTree>();
expectTypeOf(rectangle.triangulation).toEqualTypeOf<foundry.data.PolygonTree.Triangulation>();
expectTypeOf(rectangle.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(rectangle.origin).toEqualTypeOf<Readonly<Canvas.Point>>();
expectTypeOf(rectangle.center).toEqualTypeOf<Readonly<Canvas.Point>>();
expectTypeOf(rectangle.area).toBeNumber();
expectTypeOf(rectangle.isAffectedByGrid).toBeBoolean();
expectTypeOf(rectangle.hasRotationalSymmetry).toBeBoolean();
expectTypeOf(rectangle.testPoint(point)).toBeBoolean();
expectTypeOf(rectangle.drawShape(graphics)).toBeVoid();
expectTypeOf(rectangle.drawReferenceLines(graphics)).toBeVoid();
expectTypeOf(rectangle.move(point)).toBeVoid();
expectTypeOf(rectangle.move(point, { snap: true })).toBeVoid();
expectTypeOf(rectangle.rotate(90)).toBeVoid();
expectTypeOf(rectangle.rotate(90, { pivot: point })).toBeVoid();
expectTypeOf(rectangle.moveControlHandle("width", point, { snap: true, unlinked: true })).toBeVoid();
expectTypeOf(rectangle.sampleInterior()).toEqualTypeOf<Canvas.Point>();
expectTypeOf(rectangle.sampleBoundary(point)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(RectangleShapeData._toClipperPath([0, 0, 1, 1])).toEqualTypeOf<PIXI.Polygon.ClipperPath>();

// Each `measuredSegments` entry is deeply frozen.
expectTypeOf(rectangle.measuredSegments[0]!.winding).toEqualTypeOf<-1 | 0 | 1>();
expectTypeOf(rectangle.measuredSegments[0]!.distance).toBeNumber();
expectTypeOf(rectangle.controlHandles["rotation"]!.visible).toBeBoolean();

// The schema-derived surface still comes from the `common/` declaration.
expectTypeOf(rectangle.width).toBeNumber();
expectTypeOf(rectangle.anchorX).toBeNumber();
expectTypeOf(rectangle.gridBased).toBeBoolean();
expectTypeOf(rectangle.type).toEqualTypeOf<"rectangle">();

// Per-shape additions.
expectTypeOf(rectangle._getRays()).toEqualTypeOf<RectangleShapeData.Rays>();
expectTypeOf(rectangle._getRays().axisX).toEqualTypeOf<Ray>();
expectTypeOf(ellipse._getRays()).toEqualTypeOf<EllipseShapeData.Rays>();
expectTypeOf(line._getRays()).toEqualTypeOf<LineShapeData.Rays>();
expectTypeOf(cone._getRays()).toEqualTypeOf<ConeShapeData.Rays>();
expectTypeOf(cone._getRays().center).toEqualTypeOf<Ray>();
expectTypeOf(tokenShape._getTokenShape()).toEqualTypeOf<TokenShapeData.ResolvedShape>();

expectTypeOf(circle.radius).toBeNumber();
expectTypeOf(ring.innerWidth).toBeNumber();
expectTypeOf(emanation.radius).toBeNumber();
expectTypeOf(gridShape.isEmpty).toBeBoolean();

// `PolygonShapeData` and `GridShapeData` shadow their nullable `origin` schema field with the mixin's getter.
expectTypeOf(polygon.origin).toEqualTypeOf<Readonly<Canvas.Point>>();
expectTypeOf(polygon._source.origin).toEqualTypeOf<{ x: number; y: number } | null>();
expectTypeOf(gridShape.origin).toEqualTypeOf<Readonly<Canvas.Point>>();

// The `Schema` type parameter survives, so a system can extend a shape with its own fields.
declare namespace MyRingShapeData {
  interface Schema extends RingShapeData.Schema {
    glow: foundry.data.fields.BooleanField;
  }
}

declare class MyRingShapeData extends RingShapeData<MyRingShapeData.Schema> {}

declare const myRing: MyRingShapeData;
expectTypeOf(myRing.glow).toBeBoolean();
expectTypeOf(myRing.innerWidth).toBeNumber();
expectTypeOf(myRing.polygonTree).toEqualTypeOf<foundry.data.PolygonTree>();

// `BaseShapeData.TYPES` registers the client subclasses, not the `common/` ones.
expectTypeOf(foundry.data.BaseShapeData.TYPES.token).toEqualTypeOf<typeof TokenShapeData>();
