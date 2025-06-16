import { expectTypeOf } from "vitest";

import ClockwiseSweepPolygon = foundry.canvas.geometry.ClockwiseSweepPolygon;
import PointEffectSourceMixin = foundry.canvas.sources.PointEffectSourceMixin;
import PointSourcePolygon = foundry.canvas.geometry.PointSourcePolygon;
import PointSourceMesh = foundry.canvas.containers.PointSourceMesh;

declare class MyPointEffectSource<
  SourceData extends PointEffectSourceMixin.MixedSourceData = PointEffectSourceMixin.MixedSourceData,
  SourceShape extends PointSourcePolygon = ClockwiseSweepPolygon,
> extends PointEffectSourceMixin(foundry.canvas.sources.BaseEffectSource)<SourceData, SourceShape> {
  static defaultData: PointEffectSourceMixin.MixedSourceData;
  shape: SourceShape;
}

expectTypeOf(MyPointEffectSource.defaultData).toEqualTypeOf<PointEffectSourceMixin.MixedSourceData>();

const mySource = new MyPointEffectSource();

expectTypeOf(mySource.data).toEqualTypeOf<PointEffectSourceMixin.MixedSourceData>();
expectTypeOf(mySource.shape).toEqualTypeOf<ClockwiseSweepPolygon>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(mySource.radius).toBeNumber();

expectTypeOf(mySource["_initialize"]({})).toBeVoid();
// only new SourceData keys tested here, thorough tests are on the final Point*Source classes
expectTypeOf(
  mySource["_initialize"]({
    radius: 200,
    externalRadius: 400,
    rotation: 60,
    angle: 270,
    walls: false,
  }),
).toBeVoid();

expectTypeOf(mySource["_initializeSoftEdges"]()).toBeVoid();
expectTypeOf(mySource["_getPolygonConfiguration"]()).toEqualTypeOf<PointEffectSourceMixin.PolygonConfig>();
expectTypeOf(mySource["_createShapes"]()).toBeVoid();
expectTypeOf(mySource["_drawMesh"]("background")).toEqualTypeOf<PointSourceMesh | null>();
expectTypeOf(mySource["_updateGeometry"]()).toBeVoid();

// eslint-disable-next-line @typescript-eslint/no-deprecated
mySource.radius = 5;

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(mySource.los).toEqualTypeOf<ClockwiseSweepPolygon>();
