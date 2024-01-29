import { expectTypeOf } from "vitest";

const myControlIcon = new ControlIcon({ texture: "foobar" });

expectTypeOf(myControlIcon.border.visible).toEqualTypeOf<boolean>();
