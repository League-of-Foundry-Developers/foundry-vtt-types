import { expectTypeOf } from "vitest";
import type PointSoundSource from "../../../../../src/foundry/client-esm/canvas/sources/point-sound-source.d.mts";

const mySource = new foundry.canvas.sources.PointSoundSource();

expectTypeOf(mySource.active).toEqualTypeOf<boolean>();
expectTypeOf(mySource.initialize({ radius: 5, walls: true, disabled: false })).toEqualTypeOf<PointSoundSource>();
expectTypeOf(mySource.shape).toEqualTypeOf<PointSourcePolygon>();
expectTypeOf(mySource.data).toEqualTypeOf<PointSoundSource.SourceData>();
