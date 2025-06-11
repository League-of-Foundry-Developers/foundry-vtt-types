import { expectTypeOf } from "vitest";
import { CanvasDarknessEffects, CanvasLayer } from "#client/canvas/layers/_module.mjs";

const layer = new CanvasDarknessEffects();

expectTypeOf(layer.options.baseClass).toEqualTypeOf<typeof CanvasLayer>();
expectTypeOf(layer.draw()).toEqualTypeOf<Promise<CanvasDarknessEffects>>();
expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer.clear()).toBeVoid();
