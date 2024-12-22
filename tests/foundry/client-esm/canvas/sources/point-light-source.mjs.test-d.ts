import { expectTypeOf } from "vitest";

const mySource = new foundry.canvas.sources.PointLightSource();

expectTypeOf(mySource.active).toEqualTypeOf<boolean>();
expectTypeOf(mySource.drawMeshes().background?.visible).toEqualTypeOf<boolean | undefined>();
expectTypeOf(mySource.animateTorch(5)).toEqualTypeOf<void>();
expectTypeOf(mySource.add()).toEqualTypeOf<void>();
expectTypeOf(mySource.shape).toEqualTypeOf<PointSourcePolygon>();
