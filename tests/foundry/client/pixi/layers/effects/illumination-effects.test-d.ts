import { expectTypeOf } from "vitest";

const layer = new CanvasIlluminationEffects();

expectTypeOf(layer.options.baseClass).toEqualTypeOf<typeof CanvasLayer>();
expectTypeOf(layer.draw()).toEqualTypeOf<Promise<CanvasIlluminationEffects>>();
