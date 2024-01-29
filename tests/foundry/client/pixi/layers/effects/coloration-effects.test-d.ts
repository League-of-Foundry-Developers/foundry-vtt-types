import { expectTypeOf } from "vitest";

const layer = new CanvasColorationEffects();

expectTypeOf(layer.options.baseClass).toEqualTypeOf<typeof CanvasLayer>();
expectTypeOf(layer.draw()).toEqualTypeOf<Promise<CanvasColorationEffects>>();
