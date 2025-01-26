import { expectTypeOf } from "vitest";

const cardsDirectory = new CardsDirectory();

expectTypeOf(CardsDirectory.defaultOptions).toEqualTypeOf<DocumentDirectoryOptions>();
expectTypeOf(cardsDirectory.options).toEqualTypeOf<DocumentDirectoryOptions>();
expectTypeOf(cardsDirectory.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(cardsDirectory.render(true)).toEqualTypeOf<CardsDirectory>();
