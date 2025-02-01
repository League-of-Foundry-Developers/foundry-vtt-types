import { expectTypeOf } from "vitest";

expectTypeOf(RenderedCanvasGroup.groupName).toEqualTypeOf<"rendered">();

const myRenderedGroup = new RenderedCanvasGroup();

expectTypeOf(myRenderedGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"rendered">>();
