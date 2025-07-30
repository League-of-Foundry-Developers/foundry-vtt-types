import { expectTypeOf } from "vitest";

import CanvasGroupMixin = foundry.canvas.groups.CanvasGroupMixin;
import HiddenCanvasGroup = foundry.canvas.groups.HiddenCanvasGroup;
import CanvasOcclusionMask = foundry.canvas.layers.CanvasOcclusionMask;

expectTypeOf(HiddenCanvasGroup.groupName).toEqualTypeOf<"hidden">();

declare const graphics: PIXI.LegacyGraphics;
declare const occlusionMask: CanvasOcclusionMask;
const myHiddenGroup = new HiddenCanvasGroup();

expectTypeOf(myHiddenGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"hidden">>();
expectTypeOf(myHiddenGroup.masks).toEqualTypeOf<HiddenCanvasGroup.MasksContainer>();
expectTypeOf(myHiddenGroup.invalidateMasks()).toEqualTypeOf<void>();
expectTypeOf(myHiddenGroup.addMask("foobar", graphics)).toEqualTypeOf<void>();
expectTypeOf(myHiddenGroup.addMask("foobar", occlusionMask, 2)).toEqualTypeOf<void>();

Hooks.on("drawHiddenCanvasGroup", (hiddenCanvas) => {
  expectTypeOf(hiddenCanvas).toEqualTypeOf<HiddenCanvasGroup.Any>();
});

Hooks.on("tearDownHiddenCanvasGroup", (hiddenCanvas) => {
  expectTypeOf(hiddenCanvas).toEqualTypeOf<HiddenCanvasGroup.Any>();
});
