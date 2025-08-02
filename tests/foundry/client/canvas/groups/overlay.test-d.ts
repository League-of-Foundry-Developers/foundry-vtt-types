import { describe, expectTypeOf, test } from "vitest";

import CanvasGroupMixin = foundry.canvas.groups.CanvasGroupMixin;
import OverlayCanvasGroup = foundry.canvas.groups.OverlayCanvasGroup;
import layers = foundry.canvas.layers;

declare global {
  namespace CONFIG.Canvas {
    interface Layers {
      fakeOverlayLayer: CONFIG.Canvas.LayerDefinition<typeof layers.ControlsLayer, "overlay">;
    }
  }
}

describe("OverlayCanvasGroup tests", () => {
  test("Group name", () => {
    expectTypeOf(OverlayCanvasGroup.groupName).toEqualTypeOf<"overlay">();
  });

  test("Construction", () => {
    new OverlayCanvasGroup();
    new CONFIG.Canvas.groups.overlay.groupClass();
  });

  const myOverlayGroup = new CONFIG.Canvas.groups.overlay.groupClass();

  test("Miscellaneous", () => {
    expectTypeOf(OverlayCanvasGroup.tearDownChildren).toBeBoolean();
  });

  test("Layers", () => {
    expectTypeOf(myOverlayGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"overlay">>();
    // Core provides no layers with this as their group
    expectTypeOf(myOverlayGroup.fakeOverlayLayer).toEqualTypeOf<layers.ControlsLayer>();
  });

  test("Hooks", () => {
    Hooks.on("drawOverlayCanvasGroup", (group) => {
      expectTypeOf(group).toEqualTypeOf<OverlayCanvasGroup.Implementation>();
    });

    Hooks.on("tearDownOverlayCanvasGroup", (group) => {
      expectTypeOf(group).toEqualTypeOf<OverlayCanvasGroup.Implementation>();
    });
  });
});
