import { expectTypeOf } from "vitest";

expectTypeOf(OverlayCanvasGroup.groupName).toEqualTypeOf<string>();

const myOverlayGroup = new OverlayCanvasGroup();

expectTypeOf(myOverlayGroup.layers).toEqualTypeOf<Record<string, CanvasLayer>>();

const myTransform = new PIXI.Transform();

expectTypeOf(myOverlayGroup.transform.updateTransform(myTransform)).toEqualTypeOf<void>();
