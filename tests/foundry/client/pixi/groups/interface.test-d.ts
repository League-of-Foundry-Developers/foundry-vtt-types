import { expectTypeOf } from "vitest";

expectTypeOf(InterfaceCanvasGroup.groupName).toEqualTypeOf<string>();

const myInterfaceGroup = new InterfaceCanvasGroup();

expectTypeOf(myInterfaceGroup.layers).toEqualTypeOf<Record<string, CanvasLayer>>();

expectTypeOf(myInterfaceGroup.createScrollingText({ x: 0, y: 0 }, "foobar")).toEqualTypeOf<
  Promise<PreciseText | null>
>();
