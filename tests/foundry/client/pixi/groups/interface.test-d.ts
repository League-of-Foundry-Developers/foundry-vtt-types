import { expectTypeOf } from "vitest";

expectTypeOf(InterfaceCanvasGroup.groupName).toMatchTypeOf<keyof CONFIG.Canvas.Groups>();

const myInterfaceGroup = new InterfaceCanvasGroup();

expectTypeOf(myInterfaceGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"interface">>();

expectTypeOf(myInterfaceGroup.createScrollingText({ x: 0, y: 0 }, "foobar")).toEqualTypeOf<
  Promise<PreciseText | null>
>();
