import { expectTypeOf } from "vitest";

const layer = new CanvasBackgroundAlterationEffects();

expectTypeOf(layer.options.baseClass).toEqualTypeOf<typeof CanvasLayer>();
expectTypeOf(layer.draw()).toEqualTypeOf<Promise<CanvasBackgroundAlterationEffects>>();
