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

describe("RenderedCanvasGroup tests", () => {
  test("Group name", () => {
    expectTypeOf(RenderedCanvasGroup.groupName).toEqualTypeOf<"rendered">();
  });

  test("Construction", () => {
    new RenderedCanvasGroup();
    new CONFIG.Canvas.groups.rendered.groupClass();
  });

  const myRenderedGroup = new CONFIG.Canvas.groups.rendered.groupClass();

  test("Miscellaneous", () => {
    expectTypeOf(RenderedCanvasGroup.tearDownChildren).toBeBoolean();
  });

  test("Layers", () => {
    expectTypeOf(myRenderedGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"rendered">>();
    // Core provides no layers with this as their group
    expectTypeOf(myRenderedGroup.fakeRenderedLayer).toEqualTypeOf<layers.ControlsLayer>();
  });

  test("Child groups", () => {
    // @ts-expect-error Dynamic child group properties are not implemented yet https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues/3444
    expectTypeOf(myRenderedGroup.visibility).toEqualTypeOf<groups.CanvasVisibility.Implementation>();
    // @ts-expect-error Dynamic child group properties are not implemented yet https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues/3444
    expectTypeOf(myRenderedGroup.interface).toEqualTypeOf<groups.InterfaceCanvasGroup.Implementation>();
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
