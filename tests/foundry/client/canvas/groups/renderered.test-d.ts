import { expectTypeOf } from "vitest";
import { RenderedCanvasGroup } from "#client/canvas/groups/_module.mjs";

expectTypeOf(RenderedCanvasGroup.groupName).toEqualTypeOf<"rendered">();

const myRenderedGroup = new RenderedCanvasGroup();

expectTypeOf(myRenderedGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"rendered">>();
