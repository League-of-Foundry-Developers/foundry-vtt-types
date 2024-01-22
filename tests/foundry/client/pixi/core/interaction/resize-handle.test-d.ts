import { expectTypeOf } from "vitest";

const myResizeHandler = new ResizeHandle([2, 3]);

expectTypeOf(myResizeHandler.visible).toEqualTypeOf<boolean>();
