import { expectTypeOf } from "vitest";

expectTypeOf(OverlayCanvasGroup.groupName).toEqualTypeOf<"overlay">();

const myOverlayGroup = new OverlayCanvasGroup();

expectTypeOf(myOverlayGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"overlay">>();

const myTransform = new PIXI.Transform();

expectTypeOf(myOverlayGroup.transform.updateTransform(myTransform)).toEqualTypeOf<void>();
