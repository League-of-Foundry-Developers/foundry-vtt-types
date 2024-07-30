import { expectTypeOf } from "vitest";

const mySource = new foundry.canvas.sources.RenderedEffectSource();

expectTypeOf(mySource.active).toEqualTypeOf<boolean>();
expectTypeOf(mySource.drawMeshes().background.visible).toEqualTypeOf<boolean>();
