import { describe, expectTypeOf, test } from "vitest";

import ControlIcon = foundry.canvas.containers.ControlIcon;
import PreciseText = foundry.canvas.containers.PreciseText;

describe("ControlIcon tests", () => {
  test("Construction", () => {
    // @ts-expect-error Must pass at least `options.texture`
    new ControlIcon();
    new ControlIcon({ texture: "path/to/image.webp" });
    new ControlIcon({
      texture: "path/to/image.webp",
      borderColor: 0x00ff00,
      elevation: 20,
      size: 64,
      tint: 0x373964,
    });
  });

  const myControlIcon = new ControlIcon({
    texture: "path/to/image.webp",
    borderColor: 0x00ff00,
    elevation: 20,
    size: 64,
    tint: 0x373964,
  });

  test("Miscellaneous", () => {
    expectTypeOf(myControlIcon.iconSrc).toBeString();
    expectTypeOf(myControlIcon.size).toBeNumber();
    expectTypeOf(myControlIcon.rect).toEqualTypeOf<[number, number, number, number]>();
    expectTypeOf(myControlIcon.borderColor).toBeNumber();
    expectTypeOf(myControlIcon.tintColor).toEqualTypeOf<number | null>();

    expectTypeOf(myControlIcon.eventMode).toEqualTypeOf<PIXI.EventMode>();
    expectTypeOf(myControlIcon.interactiveChildren).toBeBoolean();
    expectTypeOf(myControlIcon.hitArea).toEqualTypeOf<PIXI.Rectangle>();
    expectTypeOf(myControlIcon.cursor).toBeString();

    expectTypeOf(myControlIcon.bg).toEqualTypeOf<PIXI.Graphics>();
    expectTypeOf(myControlIcon.icon).toEqualTypeOf<PIXI.Sprite>();
    expectTypeOf(myControlIcon.border).toEqualTypeOf<PIXI.Graphics>();
    expectTypeOf(myControlIcon.tooltip).toEqualTypeOf<PreciseText>();

    expectTypeOf(myControlIcon.elevation).toBeNumber();
    myControlIcon.elevation = 20; // Setter

    expectTypeOf(myControlIcon.draw()).toEqualTypeOf<Promise<ControlIcon>>();
    expectTypeOf(myControlIcon.refresh()).toEqualTypeOf<ControlIcon>();
    expectTypeOf(
      myControlIcon.refresh({
        visible: true,
        iconColor: 0xdeadea,
        borderColor: 0xff0000,
        borderVisible: true,
      }),
    ).toEqualTypeOf<ControlIcon>();
    expectTypeOf(
      myControlIcon.refresh({
        visible: undefined,
        iconColor: undefined,
        borderColor: undefined,
        borderVisible: undefined,
      }),
    ).toEqualTypeOf<ControlIcon>();
  });
});
