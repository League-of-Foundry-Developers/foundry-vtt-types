import { expectTypeOf } from "vitest";
import type PointEffectSourceMixin from "../../../../../src/foundry/client-esm/canvas/sources/point-effect-source.d.mts";

declare class MyPointEffectSource<
  SourceData extends PointEffectSourceMixin.MixedSourceData = PointEffectSourceMixin.MixedSourceData,
  SourceShape extends PointSourcePolygon = ClockwiseSweepPolygon,
> extends PointEffectSourceMixin(foundry.canvas.sources.BaseEffectSource)<SourceData, SourceShape> {
  static defaultData: PointEffectSourceMixin.MixedSourceData;
  shape: SourceShape;
}

expectTypeOf(MyPointEffectSource.defaultData).toEqualTypeOf<PointEffectSourceMixin.MixedSourceData>();

const mySource = new MyPointEffectSource();

expectTypeOf(mySource.shape).toEqualTypeOf<ClockwiseSweepPolygon>();
expectTypeOf(mySource.radius).toBeNumber();

expectTypeOf(mySource["_initialize"]({})).toBeVoid();
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

// deprecated since v11, until v13
expectTypeOf((mySource.radius = 5)).toBeNumber();
expectTypeOf(mySource.los).toEqualTypeOf<ClockwiseSweepPolygon>();
