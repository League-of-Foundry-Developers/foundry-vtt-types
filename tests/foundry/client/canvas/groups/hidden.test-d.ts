import { expectTypeOf } from "vitest";
import { HiddenCanvasGroup } from "#client/canvas/groups/_module.mjs";

expectTypeOf(HiddenCanvasGroup.groupName).toEqualTypeOf<"hidden">();

declare const someDisplayObject: PIXI.DisplayObject;
const myHiddenGroup = new HiddenCanvasGroup();

expectTypeOf(myHiddenGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"hidden">>();
expectTypeOf(myHiddenGroup.masks).toEqualTypeOf<PIXI.Container>();
expectTypeOf(myHiddenGroup.invalidateMasks()).toEqualTypeOf<void>();
expectTypeOf(myHiddenGroup.addMask("foobar", someDisplayObject, 2)).toEqualTypeOf<void>();

Hooks.on("drawHiddenCanvasGroup", (hiddenCanvas) => {
  expectTypeOf(hiddenCanvas).toEqualTypeOf<HiddenCanvasGroup.Any>();
});

Hooks.on("tearDownHiddenCanvasGroup", (hiddenCanvas) => {
  expectTypeOf(hiddenCanvas).toEqualTypeOf<HiddenCanvasGroup.Any>();
});
