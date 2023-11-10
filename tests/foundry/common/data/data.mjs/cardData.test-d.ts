import { expectTypeOf } from "vitest";

interface OldCardDataSourceData {
  condition: "grubby";
}

interface OldCardFlags {
  "my-module": {
    someProp: boolean;
    marked: boolean;
  };
}

interface OldCardDataSource {
  type: "old";
  data: OldCardDataSourceData;
  flags: OldCardFlags;
}

interface UnoCardDataSourceData {
  special: boolean;
}

interface UnoCardFlags {
  "my-module": {
    someProp: boolean;
    folded: boolean;
  };
}

interface UnoCardDataSource {
  type: "uno";
  data: UnoCardDataSourceData;
  flags: UnoCardFlags;
}

interface OldCardDataPropertiesData extends OldCardDataSourceData {
  age: number;
}

interface OldCardDataProperties {
  type: "old";
  data: OldCardDataPropertiesData;
  flags: OldCardFlags;
}

interface UnoCardDataPropertiesData extends UnoCardDataSourceData {
  color: string;
}

interface UnoCardDataProperties {
  type: "uno";
  data: UnoCardDataPropertiesData;
  flags: UnoCardFlags;
}

type MyCardDataSource = OldCardDataSource | UnoCardDataSource;
type MyCardDataProperties = OldCardDataProperties | UnoCardDataProperties;

declare global {
  interface DataConfig {
    Card: MyCardDataProperties;
  }

  interface SourceConfig {
    Card: MyCardDataSource;
  }
}

// @ts-expect-error - CardData requires data.
new foundry.data.CardData();

// @ts-expect-error - CardData requires a name.
new foundry.data.CardData({});

expectTypeOf(new foundry.data.CardData({ name: "Some Card" })).toEqualTypeOf<foundry.data.CardData>();

// @ts-expect-error - "foo" is not a type that's been configured for Cards.
new foundry.data.CardData({ name: "Some Card With Wrong Type", type: "foo" });

const cardData = new foundry.data.CardData({ name: "Some Card", face: 42, type: "old" });

expectTypeOf(cardData).toEqualTypeOf<foundry.data.CardData>();
expectTypeOf(cardData.type).toEqualTypeOf<"old" | "uno">();
if (cardData._source.type === "old") {
  expectTypeOf(cardData._source.data.condition).toEqualTypeOf<"grubby">();

  // @ts-expect-error - age doesn't exist on OldCardDataSourceData
  cardData._source.data.age;
} else {
  expectTypeOf(cardData._source.data.special).toEqualTypeOf<boolean>();

  // @ts-expect-error - color doesn't exist on UnoCardDataSourceData
  cardData._source.data.color;
}

if (cardData.type === "old") {
  expectTypeOf(cardData.data.condition).toEqualTypeOf<"grubby">();
  expectTypeOf(cardData.data.age).toEqualTypeOf<number>();
} else {
  expectTypeOf(cardData.data.special).toEqualTypeOf<boolean>();
  expectTypeOf(cardData.data.color).toEqualTypeOf<string>();
}
