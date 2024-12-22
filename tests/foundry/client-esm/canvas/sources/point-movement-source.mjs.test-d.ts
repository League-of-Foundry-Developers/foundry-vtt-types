import { expectTypeOf } from "vitest";
import type PointMovementSource from "../../../../../src/foundry/client-esm/canvas/sources/point-movement-source.d.mts";

const mySource = new foundry.canvas.sources.PointMovementSource();

expectTypeOf(mySource.active).toEqualTypeOf<boolean>();
expectTypeOf(mySource.initialize({ x: 3, y: 5, elevation: 7 })).toEqualTypeOf<PointMovementSource>();
expectTypeOf(mySource.shape).toEqualTypeOf<PointSourcePolygon>();
expectTypeOf(mySource.data).toEqualTypeOf<PointMovementSource.SourceData>();
