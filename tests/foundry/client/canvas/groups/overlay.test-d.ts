import { expectTypeOf } from "vitest";

import CanvasGroupMixin = foundry.canvas.groups.CanvasGroupMixin;
import OverlayCanvasGroup = foundry.canvas.groups.OverlayCanvasGroup;

expectTypeOf(OverlayCanvasGroup.groupName).toEqualTypeOf<"overlay">();

const myOverlayGroup = new OverlayCanvasGroup();

expectTypeOf(myOverlayGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"overlay">>();

const myTransform = new PIXI.Transform();

expectTypeOf(myOverlayGroup.transform.updateTransform(myTransform)).toEqualTypeOf<void>();
