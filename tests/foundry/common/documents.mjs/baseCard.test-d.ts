import { expectTypeOf } from "vitest";
import type { CardFaceDataSource } from "../../../../src/foundry/common/data/data.mjs/cardFaceData.mts";

const baseCard = new foundry.documents.BaseCard();
expectTypeOf(baseCard.data._source.faces[0]).toEqualTypeOf<CardFaceDataSource>();

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

expectTypeOf(baseCard.data.type).toEqualTypeOf<"old" | "uno">();
expectTypeOf(baseCard.parent).toEqualTypeOf<Cards | null>();

if (baseCard.data._source.type === "old") {
  expectTypeOf(baseCard.data._source.data.condition).toEqualTypeOf<"grubby">();

  // @ts-expect-error - "age" is not a property of OldCardDataSourceData.
  baseCard.data._source.data.age;
} else {
  expectTypeOf(baseCard.data._source.data.special).toEqualTypeOf<boolean>();

  // @ts-expect-error - "color" is not a property of UnoCardDataSourceData.
  baseCard.data._source.data.color;
}

if (baseCard.data.type === "old") {
  expectTypeOf(baseCard.data.data.condition).toEqualTypeOf<"grubby">();
  expectTypeOf(baseCard.data.data.age).toEqualTypeOf<number>();
} else {
  expectTypeOf(baseCard.data.data.special).toEqualTypeOf<boolean>();
  expectTypeOf(baseCard.data.data.color).toEqualTypeOf<string>();
}

// Flags for Actor, Items, Card, and Cards documents can be configured via the SourceConfig. This is tested here.
// For configuring flags via FlagConfig please take a look into baseItem.test-d.ts.
// shared flags are available
expectTypeOf(baseCard.getFlag("my-module", "someProp")).toEqualTypeOf<boolean>();
// non shared flags are not available
expectTypeOf(baseCard.getFlag("my-module", "marked")).toEqualTypeOf<never>();
expectTypeOf(baseCard.getFlag("my-module", "folded")).toEqualTypeOf<never>();
// non shared flags are also not available if the type is known
if (baseCard.data._source.type === "old") {
  expectTypeOf(baseCard.getFlag("my-module", "marked")).toEqualTypeOf<never>();
}
if (baseCard.data.type === "uno") {
  expectTypeOf(baseCard.getFlag("my-module", "folded")).toEqualTypeOf<never>();
}
