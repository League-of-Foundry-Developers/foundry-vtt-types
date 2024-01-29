import { expectTypeOf } from "vitest";

expectTypeOf(HiddenCanvasGroup.groupName).toEqualTypeOf<string>();

const myHiddenGroup = new HiddenCanvasGroup();

expectTypeOf(myHiddenGroup.layers).toEqualTypeOf<Record<string, CanvasLayer>>();

const myDisplayObject = new PIXI.LegacyGraphics();

expectTypeOf(myHiddenGroup.addMask("foobar", myDisplayObject)).toEqualTypeOf<void>();
