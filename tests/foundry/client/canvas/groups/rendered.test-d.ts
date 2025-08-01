import { describe, expectTypeOf, test } from "vitest";

import CanvasGroupMixin = foundry.canvas.groups.CanvasGroupMixin;
import RenderedCanvasGroup = foundry.canvas.groups.RenderedCanvasGroup;
import layers = foundry.canvas.layers;

declare global {
  namespace CONFIG.Canvas {
    interface Layers {
      fakeRenderedLayer: CONFIG.Canvas.LayerDefinition<typeof layers.ControlsLayer, "rendered">;
    }
  }
}

describe("RenderedCanvasGroup Tests", () => {
  test("Group name", () => {
    expectTypeOf(RenderedCanvasGroup.groupName).toEqualTypeOf<"rendered">();
  });

  const myRenderedGroup = new CONFIG.Canvas.groups.rendered.groupClass();

  test("Uncategorized", () => {
    expectTypeOf(RenderedCanvasGroup.tearDownChildren).toBeBoolean();
  });

  test("Layers", () => {
    expectTypeOf(myRenderedGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"rendered">>();
    // Core provides no layers with this as their group
    expectTypeOf(myRenderedGroup.fakeRenderedLayer).toEqualTypeOf<layers.ControlsLayer>();
  });

  test("Hooks", () => {
    Hooks.on("drawRenderedCanvasGroup", (group) => {
      expectTypeOf(group).toEqualTypeOf<RenderedCanvasGroup.Implementation>();
    });

    Hooks.on("tearDownRenderedCanvasGroup", (group) => {
      expectTypeOf(group).toEqualTypeOf<RenderedCanvasGroup.Implementation>();
    });
  });
});
