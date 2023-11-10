import { expectTypeOf } from "vitest";

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

// @ts-expect-error - CardsData requires data.
new foundry.data.CardsData();

// @ts-expect-error - CardsData requires a name.
new foundry.data.CardsData({});

expectTypeOf(new foundry.data.CardsData({ name: "Some Cards" })).toEqualTypeOf<foundry.data.CardsData>();

// @ts-expect-error - "foo" is not a configured type for a Card.
new foundry.data.CardsData({ name: "Some Cards With Wrong Type", type: "foo" });

const cardsData = new foundry.data.CardsData({ name: "Some Deck", type: "french" });

expectTypeOf(cardsData).toEqualTypeOf<foundry.data.CardsData>();
expectTypeOf(cardsData.type).toEqualTypeOf<"french" | "german">();
if (cardsData._source.type === "french") {
  expectTypeOf(cardsData._source.data.coolUse).toEqualTypeOf<"throwing cards">();

  // @ts-expect-error - possibleInjuries doesn't exist on FrenchDeckDataSourceData.
  cardsData._source.data.possibleInjuries;
} else {
  expectTypeOf(cardsData._source.data.mostUsedGame).toEqualTypeOf<"Skat">();

  // @ts-expect-error - possibleInjuries doesn't exist on GermanDeckDataSourceData.
  cardsData._source.data.mostUsedBy;
}

if (cardsData.type === "french") {
  expectTypeOf(cardsData.data.coolUse).toEqualTypeOf<"throwing cards">();
  expectTypeOf(cardsData.data.possibleInjuries).toEqualTypeOf<"card stuck in eye">();
} else {
  expectTypeOf(cardsData.data.mostUsedGame).toEqualTypeOf<"Skat">();
  expectTypeOf(cardsData.data.mostUsedBy).toEqualTypeOf<"older players">();
}
