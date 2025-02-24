import { expectTypeOf } from "vitest";

const cardsDirectory = new CardsDirectory();

expectTypeOf(CardsDirectory.defaultOptions).toEqualTypeOf<DocumentDirectory.Options>();
expectTypeOf(cardsDirectory.options).toEqualTypeOf<DocumentDirectory.Options>();
expectTypeOf(cardsDirectory.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(cardsDirectory.render(true)).toEqualTypeOf<CardsDirectory>();
