import { describe, expectTypeOf, test } from "vitest";

import ControlIcon = foundry.canvas.containers.ControlIcon;
import PreciseText = foundry.canvas.containers.PreciseText;

declare const rendererOptions: PIXI.IDestroyOptions;

describe("ControlIcon tests", () => {
  test("Construction", () => {
    new ControlIcon();
    new ControlIcon({ texture: "path/to/image.webp" });
    new ControlIcon({ texture: PIXI.Texture.EMPTY });
    new ControlIcon({
      texture: "path/to/image.webp",
      borderColor: "#00ff00",
      elevation: 20,
      size: 64,
      tint: [0.2, 0.3, 0.4],
    });
    new ControlIcon({ tint: null });
  });

  const controlIcon = new ControlIcon();

  test("Rendering", () => {
    expectTypeOf(ControlIcon.RENDER_FLAG_PRIORITY).toEqualTypeOf<foundry.canvas.interaction.RenderFlags.Priority>();
    expectTypeOf(ControlIcon.RENDER_FLAGS.refresh).toEqualTypeOf<
      foundry.canvas.interaction.RenderFlag<ControlIcon.RENDER_FLAGS, "refresh">
    >();
    expectTypeOf(controlIcon.renderFlags).toEqualTypeOf<
      foundry.canvas.interaction.RenderFlags<ControlIcon.RENDER_FLAGS>
    >();
    expectTypeOf(controlIcon.renderFlags.clear()).toEqualTypeOf<Partial<Record<"redraw" | "refresh", true>>>();
    controlIcon.renderFlags.set({ redraw: true, refresh: undefined });
    expectTypeOf(controlIcon.renderFlags.handle("refresh")).toBeBoolean();

    // @ts-expect-error An unregistered flag throws at runtime.
    controlIcon.renderFlags.set({ refreshShape: true });

    expectTypeOf(controlIcon.applyRenderFlags()).toBeVoid();
    expectTypeOf(controlIcon.draw()).toEqualTypeOf<Promise<ControlIcon>>();
    expectTypeOf(controlIcon["_draw"]()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(controlIcon["_clear"]()).toBeVoid();
    expectTypeOf(controlIcon["_refresh"]()).toBeVoid();
    expectTypeOf(controlIcon.refresh()).toBeVoid();
    expectTypeOf(controlIcon.destroy(rendererOptions)).toBeVoid();
  });

  test("Properties", () => {
    expectTypeOf(controlIcon.texture).toEqualTypeOf<PIXI.Texture | string>();
    controlIcon.texture = PIXI.Texture.EMPTY;
    controlIcon.texture = "path/to/image.webp";

    expectTypeOf(controlIcon.size).toBeNumber();
    controlIcon.size = 64;

    expectTypeOf(controlIcon.elevation).toBeNumber();
    controlIcon.elevation = 20;

    expectTypeOf(controlIcon.bg).toEqualTypeOf<PIXI.Graphics>();
    expectTypeOf(controlIcon.border).toEqualTypeOf<PIXI.Graphics>();
    expectTypeOf(controlIcon.icon).toEqualTypeOf<PIXI.Sprite>();
    expectTypeOf(controlIcon.tooltip).toEqualTypeOf<PreciseText>();
  });

  test("Deprecated compatibility surface", () => {
    expectTypeOf(
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      controlIcon.refresh({
        visible: true,
        iconColor: null,
        borderColor: 0xff0000,
        borderVisible: true,
      }),
    ).toEqualTypeOf<ControlIcon>();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(controlIcon.rect).toEqualTypeOf<[number, number, number, number]>();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(controlIcon.tintColor).toEqualTypeOf<PIXI.ColorSource>();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(controlIcon.borderColor).toEqualTypeOf<PIXI.ColorSource>();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(controlIcon.iconSrc).toEqualTypeOf<PIXI.Texture | string>();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    controlIcon.iconSrc = PIXI.Texture.EMPTY;
  });
});
