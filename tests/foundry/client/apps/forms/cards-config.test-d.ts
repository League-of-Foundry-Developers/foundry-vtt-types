import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "../../../../../src/utils/index.d.mts";

const cards = new Cards({ name: "cardies", type: "hand" });
const cardsConfig = new CardsConfig(cards);

expectTypeOf(cardsConfig.object).toEqualTypeOf<Cards>();
expectTypeOf(cardsConfig.document).toEqualTypeOf<Cards>();
expectTypeOf(CardsConfig.defaultOptions).toEqualTypeOf<CardsConfig.Options>();
expectTypeOf(cardsConfig.options).toEqualTypeOf<CardsConfig.Options>();
expectTypeOf(cardsConfig.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<CardsConfig.CardsConfigData>>>();
expectTypeOf(cardsConfig.render(true)).toEqualTypeOf<CardsConfig>();
