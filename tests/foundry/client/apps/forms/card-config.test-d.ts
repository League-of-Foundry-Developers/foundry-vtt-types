import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

declare const card: Card;
const cardConfig = new CardConfig(card);

expectTypeOf(cardConfig.object).toEqualTypeOf<Card>();
expectTypeOf(cardConfig.document).toEqualTypeOf<Card>();
expectTypeOf(CardConfig.defaultOptions).toEqualTypeOf<DocumentSheet.Options<Card.ConfiguredInstance>>();
expectTypeOf(cardConfig.options).toEqualTypeOf<DocumentSheet.Options<Card.ConfiguredInstance>>();
expectTypeOf(cardConfig.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<CardConfig.CardConfigData>>>();
expectTypeOf(cardConfig.render(true)).toEqualTypeOf<CardConfig>();
