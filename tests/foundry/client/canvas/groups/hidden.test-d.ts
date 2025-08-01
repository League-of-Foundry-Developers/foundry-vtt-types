import { describe, expectTypeOf, test } from "vitest";

import HiddenCanvasGroup = foundry.canvas.groups.HiddenCanvasGroup;
import CanvasGroupMixin = foundry.canvas.groups.CanvasGroupMixin;
import layers = foundry.canvas.layers;

declare global {
  namespace CONFIG.Canvas {
    interface Layers {
      fakeHiddenLayer: CONFIG.Canvas.LayerDefinition<typeof layers.ControlsLayer, "hidden">;
    }
  }
}

declare const graphics: PIXI.LegacyGraphics;
declare const occlusionMask: layers.CanvasOcclusionMask;

describe("HiddenCanvasGroup Tests", () => {
  test("Group name", () => {
    expectTypeOf(HiddenCanvasGroup.groupName).toEqualTypeOf<"hidden">();
  });

  test("Construction", () => {
    new HiddenCanvasGroup();
    new CONFIG.Canvas.groups.hidden.groupClass();
  });

  const myHiddenGroup = new CONFIG.Canvas.groups.hidden.groupClass();

  test("Uncategorized", () => {
    expectTypeOf(myHiddenGroup.eventMode).toEqualTypeOf<PIXI.EventMode>();
    expectTypeOf(myHiddenGroup["_draw"]({})).toEqualTypeOf<Promise<void>>();
    expectTypeOf(myHiddenGroup["_tearDown"]({})).toEqualTypeOf<Promise<void>>();
  });

  test("Masks", () => {
    expectTypeOf(myHiddenGroup.masks).toEqualTypeOf<HiddenCanvasGroup.MasksContainer>();
    expectTypeOf(myHiddenGroup.masks.occlusion).toEqualTypeOf<layers.CanvasOcclusionMask>();

    expectTypeOf(myHiddenGroup.addMask("foo", occlusionMask)).toBeVoid();
    expectTypeOf(myHiddenGroup.addMask("foo", occlusionMask, 2)).toBeVoid();

    expectTypeOf(myHiddenGroup.invalidateMasks()).toBeVoid();
  });

  test("Layers", () => {
    expectTypeOf(myHiddenGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"hidden">>();
    // Core provides no layers with this as their group
    expectTypeOf(myHiddenGroup.fakeHiddenLayer).toEqualTypeOf<layers.ControlsLayer>();
  });

  test("Child groups", () => {
    // Core provides none
    // TODO: once group dynamic properties are typed, add and test a fake group with this as parent
  });

  test("Hooks", () => {
    Hooks.on("drawHiddenCanvasGroup", (group) => {
      expectTypeOf(group).toEqualTypeOf<HiddenCanvasGroup.Implementation>();
    });

    Hooks.on("tearDownHiddenCanvasGroup", (group) => {
      expectTypeOf(group).toEqualTypeOf<HiddenCanvasGroup.Implementation>();
    });
  });
});

const myHiddenGroup = new HiddenCanvasGroup();

expectTypeOf(myHiddenGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"hidden">>();
expectTypeOf(myHiddenGroup.masks).toEqualTypeOf<HiddenCanvasGroup.MasksContainer>();
expectTypeOf(myHiddenGroup.invalidateMasks()).toEqualTypeOf<void>();
expectTypeOf(myHiddenGroup.addMask("foobar", graphics)).toEqualTypeOf<void>();
expectTypeOf(myHiddenGroup.addMask("foobar", occlusionMask, 2)).toEqualTypeOf<void>();
