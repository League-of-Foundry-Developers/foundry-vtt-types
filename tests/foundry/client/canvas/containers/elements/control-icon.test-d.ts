import { expectTypeOf } from "vitest";
import { ControlIcon } from "#client/canvas/containers/_module.mjs";

const myControlIcon = new ControlIcon({
  texture: "foobar",
  borderColor: 0x00ff00,
  elevation: 20,
  size: 64,
  tint: 0x373964,
});

expectTypeOf(myControlIcon.draw()).toEqualTypeOf<Promise<ControlIcon>>();
expectTypeOf(
  myControlIcon.refresh({
    visible: true,
    iconColor: 0xdeadea,
    borderColor: 0xff0000,
    borderVisible: true,
  }),
).toEqualTypeOf<ControlIcon>();
