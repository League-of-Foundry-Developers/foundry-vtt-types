import { expectTypeOf } from "vitest";

import PointSoundSource = foundry.canvas.sources.PointSoundSource;

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
});

expectTypeOf(mySource.data).toEqualTypeOf<PointSoundSource.SourceData>();

expectTypeOf(mySource.shape).toEqualTypeOf<PointSoundSource.ImplementationPolygon | undefined>();
expectTypeOf(initializedSource.shape).toEqualTypeOf<PointSoundSource.ImplementationPolygon>();
const _shape: foundry.canvas.geometry.PointSourcePolygon = initializedSource.shape;

expectTypeOf(mySource.effectsCollection).toEqualTypeOf<Collection<typeof mySource>>();

expectTypeOf(mySource.getVolumeMultiplier({ x: 50, y: 40, elevation: 10 })).toBeNumber();
expectTypeOf(mySource.getVolumeMultiplier({ x: 50, y: 40, elevation: 10 }, { easing: true })).toBeNumber();
expectTypeOf(mySource.getVolumeMultiplier({ x: 50, y: 40, elevation: 10 }, { easing: undefined })).toBeNumber();

// deprecated since v13, until v15 (passing a point without elevation)
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(mySource.getVolumeMultiplier({ x: 50, y: 40 }, { easing: true })).toBeNumber();
