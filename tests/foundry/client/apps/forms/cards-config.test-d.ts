import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

declare const cards: Cards;
const cardsConfig = new CardsConfig(cards);

expectTypeOf(cardsConfig.object).toEqualTypeOf<Cards>();
expectTypeOf(cardsConfig.document).toEqualTypeOf<Cards>();
expectTypeOf(CardsConfig.defaultOptions).toEqualTypeOf<CardsConfig.Options>();
expectTypeOf(cardsConfig.options).toEqualTypeOf<CardsConfig.Options>();
expectTypeOf(cardsConfig.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<CardsConfig.CardsConfigData>>>();
expectTypeOf(cardsConfig.render(true)).toEqualTypeOf<CardsConfig>();
