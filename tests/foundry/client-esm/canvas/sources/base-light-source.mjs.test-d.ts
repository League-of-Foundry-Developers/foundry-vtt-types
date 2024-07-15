import { expectTypeOf } from "vitest";

const mySource = new foundry.canvas.sources.BaseLightSource();

expectTypeOf(mySource.active).toEqualTypeOf<boolean>();
expectTypeOf(mySource.drawMeshes().background.visible).toEqualTypeOf<boolean>();
expectTypeOf(mySource.animateTorch(5)).toEqualTypeOf<void>();
