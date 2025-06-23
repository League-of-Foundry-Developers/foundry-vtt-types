import { expectTypeOf } from "vitest";

import PointSoundSource = foundry.canvas.sources.PointSoundSource;
import PointSourcePolygon = foundry.canvas.geometry.PointSourcePolygon;

expectTypeOf(PointSoundSource.sourceType).toBeString();
expectTypeOf(PointSoundSource.defaultData).toEqualTypeOf<PointSoundSource.SourceData>();

const mySource = new PointSoundSource();

expectTypeOf(mySource.data).toEqualTypeOf<PointSoundSource.SourceData>();
expectTypeOf(mySource.shape).toEqualTypeOf<PointSourcePolygon>();
expectTypeOf(mySource.effectsCollection).toEqualTypeOf<foundry.utils.Collection<typeof mySource>>();

// Every property of SourceData represented for testing, not all necessarily actually used by this type
expectTypeOf(
  mySource.initialize({
    angle: 90,
    disabled: false,
    elevation: 20,
    externalRadius: 2000,
    radius: 300,
    rotation: 270,
    walls: true,
    x: 50,
    y: 50,
  }),
).toEqualTypeOf<typeof mySource>();

expectTypeOf(mySource.getVolumeMultiplier({ x: 50, y: 40 })).toBeNumber();
expectTypeOf(mySource.getVolumeMultiplier({ x: 50, y: 40 }, { easing: true })).toBeNumber();
expectTypeOf(mySource.getVolumeMultiplier({ x: 50, y: 40 }, { easing: null })).toBeNumber();
