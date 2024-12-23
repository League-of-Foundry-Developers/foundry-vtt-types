import { expectTypeOf } from "vitest";

import EmbeddedCollection = foundry.abstract.EmbeddedCollection;
import CardData = foundry.documents.CardData;
import CardFaceData = foundry.types.CardFaceData;

// @ts-expect-error data argument is non-optional
const baseCards = new foundry.documents.BaseCards();
expectTypeOf(baseCards.cards).toEqualTypeOf<EmbeddedCollection<Card.ConfiguredInstance, Cards.ConfiguredInstance>>();
expectTypeOf(baseCards._source.cards[0]._id).toEqualTypeOf<CardData["_id"]>();
expectTypeOf(baseCards._source.cards[0].faces[0]).toEqualTypeOf<CardFaceData>();

// interface GermanDeckDataSourceData {
//   mostUsedGame: "Skat";
// }

// interface GermanDeckDataSource {
//   type: "german";
//   data: GermanDeckDataSourceData;
// }

// interface FrenchDeckDataSourceData {
//   coolUse: "throwing cards";
// }

// interface FrenchDeckDataSource {
//   type: "french";
//   data: FrenchDeckDataSourceData;
// }

// interface GermanDeckDataPropertiesData extends GermanDeckDataSourceData {
//   mostUsedBy: "older players";
// }

// interface GermanDeckDataProperties {
//   type: "german";
//   data: GermanDeckDataPropertiesData;
// }

// interface FrenchDeckDataPropertiesData extends FrenchDeckDataSourceData {
//   possibleInjuries: "card stuck in eye";
// }

// interface FrenchDeckDataProperties {
//   type: "french";
//   data: FrenchDeckDataPropertiesData;
// }

// type MyCardsDataSource = GermanDeckDataSource | FrenchDeckDataSource;
// type MyCardsDataProperties = GermanDeckDataProperties | FrenchDeckDataProperties;

// declare global {
//   interface DataConfig {
//     Cards: MyCardsDataProperties;
//   }

//   interface SourceConfig {
//     Cards: MyCardsDataSource;
//   }
// }

// expectTypeOf(baseCards.type).toEqualTypeOf<"french" | "german">();
// expectTypeOf(baseCards.type).toEqualTypeOf<"french" | "german">();
// expectTypeOf(baseCards.parent).toEqualTypeOf<null>();

// if (baseCards._source.type === "french") {
//   expectTypeOf(baseCards._source.coolUse).toEqualTypeOf<"throwing cards">();

//   // @ts-expect-error - "possibleInjuries" is not a property of FrenchDeckDataSourceData.
//   baseCards._source.possibleInjuries;
// } else {
//   expectTypeOf(baseCards._source.mostUsedGame).toEqualTypeOf<"Skat">();

//   // @ts-expect-error - "mostUsedBy" is not a property of GermanDeckDataSourceData.
//   baseCards._source.mostUsedBy;
// }

// if (baseCards.type === "french") {
//   expectTypeOf(baseCards.system.coolUse).toEqualTypeOf<"throwing cards">();
//   expectTypeOf(baseCards.system.possibleInjuries).toEqualTypeOf<"card stuck in eye">();
// } else {
//   expectTypeOf(baseCards.system.mostUsedGame).toEqualTypeOf<"Skat">();
//   expectTypeOf(baseCards.system.mostUsedBy).toEqualTypeOf<"older players">();
// }
