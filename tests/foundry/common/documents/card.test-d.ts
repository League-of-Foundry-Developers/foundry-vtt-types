import { expectTypeOf } from "vitest";

// This exists to make the class non-abstract.
class TestBaseCard extends foundry.documents.BaseCard {}

// @ts-expect-error Name is required
new TestBaseCard();

const baseCard = new TestBaseCard({ name: "foo", type: "base" });
expectTypeOf(baseCard.faces).toEqualTypeOf<Card.FaceData[]>();

// interface OldCardDataSourceData {
//   condition: "grubby";
// }

// interface OldCardFlags {
//   "my-module": {
//     someProp: boolean;
//     marked: boolean;
//   };
// }

// interface OldCardDataSource {
//   type: "old";
//   data: OldCardDataSourceData;
//   flags: OldCardFlags;
// }

// interface UnoCardDataSourceData {
//   special: boolean;
// }

// interface UnoCardFlags {
//   "my-module": {
//     someProp: boolean;
//     folded: boolean;
//   };
// }

// interface UnoCardDataSource {
//   type: "uno";
//   data: UnoCardDataSourceData;
//   flags: UnoCardFlags;
// }

// interface OldCardDataPropertiesData extends OldCardDataSourceData {
//   age: number;
// }

// interface OldCardDataProperties {
//   type: "old";
//   data: OldCardDataPropertiesData;
//   flags: OldCardFlags;
// }

// interface UnoCardDataPropertiesData extends UnoCardDataSourceData {
//   color: string;
// }

// interface UnoCardDataProperties {
//   type: "uno";
//   data: UnoCardDataPropertiesData;
//   flags: UnoCardFlags;
// }

// type MyCardDataSource = OldCardDataSource | UnoCardDataSource;
// type MyCardDataProperties = OldCardDataProperties | UnoCardDataProperties;

// declare global {
//   interface DataConfig {
//     Card: MyCardDataProperties;
//   }

//   interface SourceConfig {
//     Card: MyCardDataSource;
//   }
// }

// expectTypeOf(baseCard.type).toEqualTypeOf<"old" | "uno">();
// expectTypeOf(baseCard.parent).toEqualTypeOf<Cards | null>();

// if (baseCard._source.type === "old") {
//   expectTypeOf(baseCard._source.condition).toEqualTypeOf<"grubby">();

//   // @ts-expect-error - "age" is not a property of OldCardDataSourceData.
//   baseCard._source.age;
// } else {
//   expectTypeOf(baseCard._source.special).toEqualTypeOf<boolean>();

//   // @ts-expect-error - "color" is not a property of UnoCardDataSourceData.
//   baseCard._source.color;
// }

// if (baseCard.type === "old") {
//   expectTypeOf(baseCard.system.condition).toEqualTypeOf<"grubby">();
//   expectTypeOf(baseCard.system.age).toEqualTypeOf<number>();
// } else {
//   expectTypeOf(baseCard.system.special).toEqualTypeOf<boolean>();
//   expectTypeOf(baseCard.system.color).toEqualTypeOf<string>();
// }

// // Flags for Actor, Items, Card, and Cards documents can be configured via the SourceConfig. This is tested here.
// // For configuring flags via FlagConfig please take a look into baseItem.test-d.ts.
// // shared flags are available
// expectTypeOf(baseCard.getFlag("my-module", "someProp")).toEqualTypeOf<boolean>();
// // non shared flags are not available
// expectTypeOf(baseCard.getFlag("my-module", "marked")).toEqualTypeOf<never>();
// expectTypeOf(baseCard.getFlag("my-module", "folded")).toEqualTypeOf<never>();
// // non shared flags are also not available if the type is known
// if (baseCard._source.type === "old") {
//   expectTypeOf(baseCard.getFlag("my-module", "marked")).toEqualTypeOf<never>();
// }
// if (baseCard.type === "uno") {
//   expectTypeOf(baseCard.getFlag("my-module", "folded")).toEqualTypeOf<never>();
// }
