import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "../../../../../src/utils/index.d.mts";

const card = new Card({ name: "cardy" });
const cardConfig = new CardConfig(card);

expectTypeOf(cardConfig.object).toEqualTypeOf<Card>();
expectTypeOf(cardConfig.document).toEqualTypeOf<Card>();
expectTypeOf(CardConfig.defaultOptions).toEqualTypeOf<DocumentSheetOptions<Card.ConfiguredInstance>>();
expectTypeOf(cardConfig.options).toEqualTypeOf<DocumentSheetOptions<Card.ConfiguredInstance>>();
expectTypeOf(cardConfig.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<CardConfig.CardConfigData>>>();
expectTypeOf(cardConfig.render(true)).toEqualTypeOf<CardConfig>();
