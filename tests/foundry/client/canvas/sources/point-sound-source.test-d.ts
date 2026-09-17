import { expectTypeOf } from "vitest";

import PointSoundSource = foundry.canvas.sources.PointSoundSource;
import PointSourcePolygon = foundry.canvas.geometry.PointSourcePolygon;
import Edge = foundry.canvas.geometry.edges.Edge;

expectTypeOf(PointSoundSource.sourceType).toEqualTypeOf<"sound">();
expectTypeOf(PointSoundSource.defaultData).toEqualTypeOf<PointSoundSource.SourceData>();

declare const object: foundry.canvas.placeables.AmbientSound.Implementation;
new PointSoundSource();
new PointSoundSource({ object: undefined, sourceId: undefined });
const mySource = new PointSoundSource({ object, sourceId: object.sourceId });
// Every property of SourceData represented for testing, not all necessarily actually used by this type
const initializedSource = mySource.initialize({
  angle: 90,
  disabled: false,
  elevation: 20,
  externalRadius: 2000,
  radius: 300,
  rotation: 270,
  walls: true,
  x: 50,
  y: 50,
  path: "sounds/drums.wav",
  volume: 0.5,
  easing: false,
  effects: { base: { type: "lowpass", intensity: 5 }, muffled: {} },
});

expectTypeOf(mySource.data).toEqualTypeOf<PointSoundSource.SourceData>();

expectTypeOf(mySource.shape).toEqualTypeOf<PointSoundSource.ImplementationPolygon | undefined>();
expectTypeOf(initializedSource.shape).toEqualTypeOf<PointSoundSource.ImplementationPolygon>();
const _shape: foundry.canvas.geometry.PointSourcePolygon = initializedSource.shape;

expectTypeOf(mySource.effectsCollection).toEqualTypeOf<Collection<typeof mySource>>();

expectTypeOf(mySource.sound).toEqualTypeOf<foundry.audio.Sound | null>();
expectTypeOf(mySource.data.path).toEqualTypeOf<string | null>();
expectTypeOf(mySource.data.effects).toEqualTypeOf<PointSoundSource.Effects>();
expectTypeOf(mySource.applyEffects()).toBeVoid();
expectTypeOf(mySource.applyEffects({ muffled: true })).toBeVoid();
expectTypeOf(mySource.resetEffects()).toBeVoid();
expectTypeOf(mySource.sync(true, 0.8)).toEqualTypeOf<Promise<void>>();
expectTypeOf(mySource.sync(false, 0, { fade: 500, muffled: undefined })).toEqualTypeOf<Promise<void>>();

expectTypeOf(mySource.getVolumeMultiplier({ x: 50, y: 40, elevation: 10 })).toBeNumber();
expectTypeOf(mySource.getVolumeMultiplier({ x: 50, y: 40, elevation: 10 }, { easing: true })).toBeNumber();
expectTypeOf(mySource.getVolumeMultiplier({ x: 50, y: 40, elevation: 10 }, { easing: undefined })).toBeNumber();

// deprecated since v13, until v15 (passing a point without elevation)
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(mySource.getVolumeMultiplier({ x: 50, y: 40 }, { easing: true })).toBeNumber();

expectTypeOf(mySource["_getPolygonBackend"]()).toEqualTypeOf<PointSourcePolygon.AnyConstructor>();
expectTypeOf(mySource["_getEdgeCreationOptions"]()).toEqualTypeOf<Edge.ConstructorOptions>();
