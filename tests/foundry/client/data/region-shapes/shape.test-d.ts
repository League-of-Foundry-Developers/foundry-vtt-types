import { expectTypeOf } from "vitest";
import type {
  CircleShapeData,
  EllipseShapeData,
  PolygonShapeData,
  RectangleShapeData,
} from "../../../../../src/foundry/common/data/data.d.mts";
import { RegionShape } from "#client/data/region-shapes/_module.mjs";

declare const cData: CircleShapeData;
declare const eData: EllipseShapeData;
declare const rData: RectangleShapeData;
declare const pData: PolygonShapeData;
declare const someGraphics: PIXI.Graphics;

const rCircle = RegionShape.create(cData);
const rEllipse = RegionShape.create(eData);
const rRect = RegionShape.create(rData);
const rPoly = RegionShape.create(pData);

expectTypeOf(rCircle.data.type).toEqualTypeOf<"circle">();
expectTypeOf(rCircle.data.x).toBeNumber();
expectTypeOf(rCircle.data.y).toBeNumber();
expectTypeOf(rCircle.data.radius).toBeNumber();
expectTypeOf(rCircle.isHole).toBeBoolean();
expectTypeOf(rCircle.clipperPaths).toEqualTypeOf<ClipperLib.Paths>();
expectTypeOf(rCircle.clipperPolyTree).toEqualTypeOf<ClipperLib.PolyTree>();
expectTypeOf(rCircle["_createClipperPolyTree"]()).toEqualTypeOf<ClipperLib.Path>();
expectTypeOf(rCircle["_drawShape"](someGraphics)).toBeVoid();

expectTypeOf(rEllipse.data.type).toEqualTypeOf<"ellipse">();
expectTypeOf(rEllipse.data.x).toBeNumber();
expectTypeOf(rEllipse.data.y).toBeNumber();
expectTypeOf(rEllipse.data.radiusX).toBeNumber();
expectTypeOf(rEllipse.data.radiusY).toBeNumber();
expectTypeOf(rEllipse.data.rotation).toBeNumber();
expectTypeOf(rEllipse.isHole).toBeBoolean();
expectTypeOf(rEllipse.clipperPaths).toEqualTypeOf<ClipperLib.Paths>();
expectTypeOf(rEllipse.clipperPolyTree).toEqualTypeOf<ClipperLib.PolyTree>();
expectTypeOf(rEllipse["_createClipperPolyTree"]()).toEqualTypeOf<ClipperLib.Path>();
expectTypeOf(rEllipse["_drawShape"](someGraphics)).toBeVoid();

expectTypeOf(rPoly.data.type).toEqualTypeOf<"polygon">();
expectTypeOf(rPoly.data.points).toEqualTypeOf<number[]>();
expectTypeOf(rPoly.clipperPaths).toEqualTypeOf<ClipperLib.Paths>();
expectTypeOf(rPoly.clipperPolyTree).toEqualTypeOf<ClipperLib.PolyTree>();
expectTypeOf(rPoly["_createClipperPolyTree"]()).toEqualTypeOf<ClipperLib.Path>();
expectTypeOf(rPoly["_drawShape"](someGraphics)).toBeVoid();

expectTypeOf(rRect.data.type).toEqualTypeOf<"rectangle">();
expectTypeOf(rRect.data.x).toBeNumber();
expectTypeOf(rRect.data.y).toBeNumber();
expectTypeOf(rRect.data.width).toBeNumber();
expectTypeOf(rRect.data.height).toBeNumber();
expectTypeOf(rRect.data.rotation).toBeNumber();
expectTypeOf(rRect.isHole).toBeBoolean();
expectTypeOf(rRect.clipperPaths).toEqualTypeOf<ClipperLib.Paths>();
expectTypeOf(rRect.clipperPolyTree).toEqualTypeOf<ClipperLib.PolyTree>();
expectTypeOf(rRect["_createClipperPolyTree"]()).toEqualTypeOf<ClipperLib.Path>();
expectTypeOf(rRect["_drawShape"](someGraphics)).toBeVoid();
