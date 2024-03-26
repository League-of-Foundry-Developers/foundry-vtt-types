import { expectTypeOf } from "vitest";

expectTypeOf(RenderedCanvasGroup.groupName).toEqualTypeOf<string>();

const myRenderedGroup = new RenderedCanvasGroup();

expectTypeOf(myRenderedGroup.layers).toEqualTypeOf<Record<string, CanvasLayer>>();
