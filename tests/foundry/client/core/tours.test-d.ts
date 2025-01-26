import { expectTypeOf } from "vitest";

declare const tour: Tour;
const tours = new Tours();

expectTypeOf(tours.register("", "", tour)).toEqualTypeOf<void>();
expectTypeOf(tours.set("", tour)).toEqualTypeOf<Tours>();
