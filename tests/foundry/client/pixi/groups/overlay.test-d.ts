import { expectTypeOf } from "vitest";

expectTypeOf(OverlayCanvasGroup.groupName).toEqualTypeOf<string>();

const myOverlayGroup = new OverlayCanvasGroup();

expectTypeOf(myOverlayGroup.layers).toEqualTypeOf<Record<string, CanvasLayer>>();
