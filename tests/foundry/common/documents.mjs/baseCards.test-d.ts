import { expectTypeOf } from "vitest";

import type EmbeddedCollection from "../../../../src/foundry/common/abstract/embedded-collection.mjs.js";
import type { CardDataSource } from "../../../../src/foundry/common/data/data.mjs/cardData.js";
import type { CardFaceDataSource } from "../../../../src/foundry/common/data/data.mjs/cardFaceData.js";

const baseCards = new foundry.documents.BaseCards();
expectTypeOf(baseCards.cards).toEqualTypeOf<EmbeddedCollection<typeof Card, foundry.data.CardsData>>();
expectTypeOf(baseCards.data._source.cards[0]).toEqualTypeOf<CardDataSource>();
expectTypeOf(baseCards.data._source.cards[0].faces[0]).toEqualTypeOf<CardFaceDataSource>();

interface GermanDeckDataSourceData {
  mostUsedGame: "Skat";
}

interface GermanDeckDataSource {
  type: "german";
  data: GermanDeckDataSourceData;
}

interface FrenchDeckDataSourceData {
  coolUse: "throwing cards";
}

interface FrenchDeckDataSource {
  type: "french";
  data: FrenchDeckDataSourceData;
}

interface GermanDeckDataPropertiesData extends GermanDeckDataSourceData {
  mostUsedBy: "older players";
}

interface GermanDeckDataProperties {
  type: "german";
  data: GermanDeckDataPropertiesData;
}

interface FrenchDeckDataPropertiesData extends FrenchDeckDataSourceData {
  possibleInjuries: "card stuck in eye";
}

interface FrenchDeckDataProperties {
  type: "french";
  data: FrenchDeckDataPropertiesData;
}

type MyCardsDataSource = GermanDeckDataSource | FrenchDeckDataSource;
type MyCardsDataProperties = GermanDeckDataProperties | FrenchDeckDataProperties;

declare global {
  interface DataConfig {
    Cards: MyCardsDataProperties;
  }

  interface SourceConfig {
    Cards: MyCardsDataSource;
  }
}

expectTypeOf(baseCards.data.type).toEqualTypeOf<"french" | "german">();
expectTypeOf(baseCards.type).toEqualTypeOf<"french" | "german">();
expectTypeOf(baseCards.parent).toEqualTypeOf<null>();

if (baseCards.data._source.type === "french") {
  expectTypeOf(baseCards.data._source.data.coolUse).toEqualTypeOf<"throwing cards">();

  // @ts-expect-error - "possibleInjuries" is not a property of FrenchDeckDataSourceData.
  baseCards.data._source.data.possibleInjuries;
} else {
  expectTypeOf(baseCards.data._source.data.mostUsedGame).toEqualTypeOf<"Skat">();

  // @ts-expect-error - "mostUsedBy" is not a property of GermanDeckDataSourceData.
  baseCards.data._source.data.mostUsedBy;
}

if (baseCards.data.type === "french") {
  expectTypeOf(baseCards.data.data.coolUse).toEqualTypeOf<"throwing cards">();
  expectTypeOf(baseCards.data.data.possibleInjuries).toEqualTypeOf<"card stuck in eye">();
} else {
  expectTypeOf(baseCards.data.data.mostUsedGame).toEqualTypeOf<"Skat">();
  expectTypeOf(baseCards.data.data.mostUsedBy).toEqualTypeOf<"older players">();
}
