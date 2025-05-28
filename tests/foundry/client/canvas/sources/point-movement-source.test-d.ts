import { expectTypeOf } from "vitest";
import type PointMovementSource from "../../../../../src/foundry/client/canvas/sources/point-movement-source.d.mts";

const PMS = foundry.canvas.sources.PointMovementSource;

expectTypeOf(PMS.sourceType).toBeString();
expectTypeOf(PMS.defaultData).toEqualTypeOf<PointMovementSource.SourceData>();

const mySource = new PMS();

expectTypeOf(mySource.data).toEqualTypeOf<PointMovementSource.SourceData>();
expectTypeOf(mySource.shape).toEqualTypeOf<PointSourcePolygon>();

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
