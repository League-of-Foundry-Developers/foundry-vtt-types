import { expectTypeOf } from "vitest";

declare const tour: Tour;
new Tours();
const tours = new foundry.nue.ToursCollection();

expectTypeOf(tours.register("", "", tour)).toEqualTypeOf<void>();
expectTypeOf(tours.set("", tour)).toEqualTypeOf<Tours>();
