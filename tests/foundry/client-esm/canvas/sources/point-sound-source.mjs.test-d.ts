import { expectTypeOf } from "vitest";
import type PointSoundSource from "../../../../../src/foundry/client-esm/canvas/sources/point-sound-source.d.mts";

const PSS = foundry.canvas.sources.PointSoundSource;

expectTypeOf(PSS.sourceType).toBeString();
expectTypeOf(PSS.defaultData).toEqualTypeOf<PointSoundSource.SourceData>();

const mySource = new PSS();

expectTypeOf(mySource.data).toEqualTypeOf<PointSoundSource.SourceData>();
expectTypeOf(mySource.shape).toEqualTypeOf<PointSourcePolygon>();
expectTypeOf(mySource.effectsCollection).toEqualTypeOf<foundry.utils.Collection<typeof mySource>>();

expectTypeOf(mySource.getVolumeMultiplier({ x: 50, y: 40 })).toBeNumber();
expectTypeOf(mySource.getVolumeMultiplier({ x: 50, y: 40 }, { easing: true })).toBeNumber();
expectTypeOf(mySource.getVolumeMultiplier({ x: 50, y: 40 }, { easing: null })).toBeNumber();
