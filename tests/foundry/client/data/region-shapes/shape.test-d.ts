import { expectTypeOf } from "vitest";
import type { DeepReadonly } from "#utils";

// eslint-disable-next-line @typescript-eslint/no-deprecated
import RegionShape = foundry.data.regionShapes.RegionShape;

declare const cData: foundry.data.CircleShapeData;
declare const eData: foundry.data.EllipseShapeData;
declare const rData: foundry.data.RectangleShapeData;
declare const pData: foundry.data.PolygonShapeData;

/* eslint-disable @typescript-eslint/no-deprecated */
const rCircle = RegionShape.create(cData);
const rEllipse = RegionShape.create(eData);
const rRect = RegionShape.create(rData);
const rPoly = RegionShape.create(pData);
/* eslint-enable @typescript-eslint/no-deprecated */

expectTypeOf(rCircle.data.type).toEqualTypeOf<"circle">();
expectTypeOf(rCircle.data.x).toBeNumber();
expectTypeOf(rCircle.data.y).toBeNumber();
expectTypeOf(rCircle.data.radius).toBeNumber();
expectTypeOf(rCircle.isHole).toBeBoolean();
expectTypeOf(rCircle.clipperPaths).toEqualTypeOf<DeepReadonly<PIXI.Polygon.ClipperPath[]>>();
expectTypeOf(rCircle.clipperPolyTree).toEqualTypeOf<ClipperLib.PolyTree>();

expectTypeOf(rEllipse.data.type).toEqualTypeOf<"ellipse">();
expectTypeOf(rEllipse.data.x).toBeNumber();
expectTypeOf(rEllipse.data.y).toBeNumber();
expectTypeOf(rEllipse.data.radiusX).toBeNumber();
expectTypeOf(rEllipse.data.radiusY).toBeNumber();
expectTypeOf(rEllipse.data.rotation).toBeNumber();
expectTypeOf(rEllipse.isHole).toBeBoolean();

expectTypeOf(rPoly.data.type).toEqualTypeOf<"polygon">();
expectTypeOf(rPoly.data.points).toEqualTypeOf<number[]>();

expectTypeOf(rRect.data.type).toEqualTypeOf<"rectangle">();
expectTypeOf(rRect.data.width).toBeNumber();
expectTypeOf(rRect.data.height).toBeNumber();
expectTypeOf(rRect.data.rotation).toBeNumber();

// `_create` is the non-deprecating path and accepts every registered shape type.
declare const gData: foundry.data.GridShapeData;
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(RegionShape._create(gData)).toEqualTypeOf<RegionShape<foundry.data.GridShapeData>>();
