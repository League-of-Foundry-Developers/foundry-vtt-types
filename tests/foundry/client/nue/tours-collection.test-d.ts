import { expectTypeOf } from "vitest";

import Tour = foundry.nue.Tour;
import ToursCollection = foundry.nue.ToursCollection;

declare const tour: Tour;
new ToursCollection();
const tours = new foundry.nue.ToursCollection();

expectTypeOf(tours.register("", "", tour)).toEqualTypeOf<void>();
expectTypeOf(tours.set("", tour)).toEqualTypeOf<ToursCollection>();
