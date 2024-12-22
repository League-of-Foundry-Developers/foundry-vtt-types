import { expectTypeOf } from "vitest";

const mySource = new foundry.canvas.sources.PointDarknessSource();

expectTypeOf(mySource.data).toEqualTypeOf<foundry.canvas.sources.PointDarknessSource.SourceData>();
expectTypeOf(mySource.active).toEqualTypeOf<boolean>();
expectTypeOf(mySource.drawMeshes().darkness).toEqualTypeOf<PIXI.Mesh | null>();
expectTypeOf(mySource.drawMeshes().darkness?.visible).toEqualTypeOf<boolean | undefined>();
expectTypeOf(mySource.animateTorch(5)).toEqualTypeOf<void>();
expectTypeOf(mySource.add()).toEqualTypeOf<void>();
expectTypeOf(mySource.shape).toEqualTypeOf<PointSourcePolygon>();
expectTypeOf(mySource.layers.darkness.suppressed).toEqualTypeOf<boolean>();
