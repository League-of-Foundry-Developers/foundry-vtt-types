import { expectTypeOf } from "vitest";

const mySource = new foundry.canvas.sources.PointDarknessSource();

expectTypeOf(mySource.active).toEqualTypeOf<boolean>();
expectTypeOf(mySource.drawMeshes().background.visible).toEqualTypeOf<boolean>();
expectTypeOf(mySource.animateTorch(5)).toEqualTypeOf<void>();
expectTypeOf(mySource.add()).toEqualTypeOf<void>();
expectTypeOf(mySource.shape).toEqualTypeOf<PointSourcePolygon>();
expectTypeOf(mySource.layers.darkness.suppressed).toEqualTypeOf<boolean>();
