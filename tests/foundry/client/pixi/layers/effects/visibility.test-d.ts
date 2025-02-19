import { expectTypeOf } from "vitest";
import type { ValueOf } from "fvtt-types/utils";

const layer = new CanvasVisibility();

expectTypeOf(layer.options.baseClass).toEqualTypeOf<typeof CanvasLayer>();
expectTypeOf(layer.draw()).toEqualTypeOf<Promise<CanvasVisibility>>();

expectTypeOf(layer.lightingVisibility.illumination).toEqualTypeOf<ValueOf<typeof VisionMode.LIGHTING_VISIBILITY>>();

expectTypeOf(layer.testVisibility({ x: 0, y: 0 })).toEqualTypeOf<boolean>();
