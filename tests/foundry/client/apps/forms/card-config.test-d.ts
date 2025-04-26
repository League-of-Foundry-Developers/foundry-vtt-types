import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

declare const card: Card.Implementation;
const cardConfig = new CardConfig(card);

expectTypeOf(cardConfig.object).toEqualTypeOf<Card.Implementation>();
expectTypeOf(cardConfig.document).toEqualTypeOf<Card.Implementation>();
expectTypeOf(CardConfig.defaultOptions).toEqualTypeOf<DocumentSheet.Options<Card.Implementation>>();
expectTypeOf(cardConfig.options).toEqualTypeOf<DocumentSheet.Options<Card.Implementation>>();
expectTypeOf(cardConfig.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<CardConfig.CardConfigData>>>();
expectTypeOf(cardConfig.render(true)).toEqualTypeOf<CardConfig>();
