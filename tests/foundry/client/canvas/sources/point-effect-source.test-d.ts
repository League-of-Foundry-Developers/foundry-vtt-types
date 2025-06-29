import { expectTypeOf } from "vitest";

import ClockwiseSweepPolygon = foundry.canvas.geometry.ClockwiseSweepPolygon;
import PointEffectSourceMixin = foundry.canvas.sources.PointEffectSourceMixin;
import PointSourcePolygon = foundry.canvas.geometry.PointSourcePolygon;
import PointSourceMesh = foundry.canvas.containers.PointSourceMesh;
import BaseEffectSource = foundry.canvas.sources.BaseEffectSource;
import Canvas = foundry.canvas.Canvas;

declare class MyPointEffectSource<
  SourceData extends PointEffectSourceMixin.MixedSourceData = PointEffectSourceMixin.MixedSourceData,
  SourceShape extends PointSourcePolygon = ClockwiseSweepPolygon,
> extends PointEffectSourceMixin(BaseEffectSource)<SourceData, SourceShape> {
  static defaultData: PointEffectSourceMixin.MixedSourceData;
  shape: SourceShape | undefined;
}

expectTypeOf(MyPointEffectSource.defaultData).toEqualTypeOf<PointEffectSourceMixin.MixedSourceData>();

declare const object: foundry.canvas.placeables.AmbientLight.Implementation;
new MyPointEffectSource();
new MyPointEffectSource({ object: undefined, sourceId: undefined });
const mySource = new MyPointEffectSource({ object, sourceId: object.sourceId });
// #initialize param tests are with BaseEffectSource
const initializedSource = mySource.initialize();

expectTypeOf(mySource.data).toEqualTypeOf<PointEffectSourceMixin.MixedSourceData>();

expectTypeOf(mySource.shape).toEqualTypeOf<ClockwiseSweepPolygon | undefined>();
// no type param on the mixin, so this is wide as necessary
// narrowing requires an override in the subclass, as the real Point*Source classes have
expectTypeOf(initializedSource.shape).toEqualTypeOf<PointSourcePolygon.Any>();

expectTypeOf(mySource.edges).toEqualTypeOf<foundry.canvas.geometry.edges.Edge[]>();
expectTypeOf(mySource.requiresEdges).toBeBoolean();
expectTypeOf(mySource.radius).toBeNumber();
expectTypeOf(mySource.origin).toEqualTypeOf<Canvas.ElevatedPoint>();
expectTypeOf(mySource.priority).toBeNumber();

// AnyObject until we get Flatten
expectTypeOf(mySource["_configure"]({})).toBeVoid();

expectTypeOf(mySource["_initialize"]({})).toBeVoid();
// only new SourceData keys tested here, thorough tests are on the final Point*Source classes
expectTypeOf(
  mySource["_initialize"]({
    radius: 200,
    externalRadius: 400,
    rotation: 60,
    angle: 270,
    walls: false,
    priority: 2,
  }),
).toBeVoid();

expectTypeOf(mySource["_initializeSoftEdges"]()).toBeVoid();
expectTypeOf(mySource["_getPolygonConfiguration"]()).toEqualTypeOf<PointEffectSourceMixin.PolygonConfig>();
expectTypeOf(mySource["_createShapes"]()).toBeVoid();
expectTypeOf(mySource["_destroy"]()).toBeVoid();
// no type param on the mixin, so any string allowed
expectTypeOf(mySource["_drawMesh"]("foo")).toEqualTypeOf<PointSourceMesh | null>();
expectTypeOf(mySource["_updateGeometry"]()).toBeVoid();
expectTypeOf(mySource["_createEdges"]()).toBeVoid();
expectTypeOf(mySource["_deleteEdges"]()).toBeVoid();
