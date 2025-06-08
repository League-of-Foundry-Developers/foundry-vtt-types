import { expectTypeOf } from "vitest";
import { ResizeHandle } from "#client/canvas/containers/_module.mjs";

declare const someRect: Canvas.Rectangle;

const myResizeHandle = new ResizeHandle([2, 3], { canDrag: () => true });

expectTypeOf(myResizeHandle.offset).toEqualTypeOf<[number, number]>();
expectTypeOf(
  myResizeHandle.updateDimensions(someRect, someRect, someRect, { aspectRatio: 2 }),
).toEqualTypeOf<Canvas.Rectangle>();
