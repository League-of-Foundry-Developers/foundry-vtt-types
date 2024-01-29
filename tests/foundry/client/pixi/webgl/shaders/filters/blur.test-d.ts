import { expectTypeOf } from "vitest";

const myFilter = new AlphaBlurFilterPass(true);

expectTypeOf(myFilter.blur).toEqualTypeOf<number>();
