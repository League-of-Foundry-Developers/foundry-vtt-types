import { expectTypeOf } from "vitest";
import type PointMovementSource from "../../../../../src/foundry/client-esm/canvas/sources/point-movement-source.d.mts";

const PMS = foundry.canvas.sources.PointMovementSource;

expectTypeOf(PMS.sourceType).toBeString();
expectTypeOf(PMS.defaultData).toEqualTypeOf<PointMovementSource.SourceData>();

const mySource = new PMS();

expectTypeOf(mySource.data).toEqualTypeOf<PointMovementSource.SourceData>();
expectTypeOf(mySource.shape).toEqualTypeOf<PointSourcePolygon>();
