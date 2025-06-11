import { expectTypeOf } from "vitest";
import { CanvasBackgroundAlterationEffects, CanvasLayer } from "#client/canvas/layers/_module.mjs";

const layer = new CanvasBackgroundAlterationEffects();

expectTypeOf(layer.options.baseClass).toEqualTypeOf<typeof CanvasLayer>();
expectTypeOf(layer.vision).toEqualTypeOf<PIXI.Container>();
expectTypeOf(layer.visionPreferred).toEqualTypeOf<PIXI.Container>();
expectTypeOf(layer.lighting).toEqualTypeOf<PIXI.Container>();
expectTypeOf(layer.draw()).toEqualTypeOf<Promise<CanvasBackgroundAlterationEffects>>();
expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer.clear()).toBeVoid();

Hooks.on("drawCanvasBackgroundAlterationEffects", (layer) => {
  expectTypeOf(layer).toEqualTypeOf<CanvasBackgroundAlterationEffects.Any>();
});

Hooks.on("tearDownCanvasBackgroundAlterationEffects", (layer) => {
  expectTypeOf(layer).toEqualTypeOf<CanvasBackgroundAlterationEffects.Any>();
});
