import { expectTypeOf } from "vitest";
import type { DeepPartial } from "../../../../../src/types/utils.d.mts";
import type Document from "../../../../../src/foundry/common/abstract/document.d.mts";

const metadata = {
  type: "JournalEntry" as const,
  label: "Important Plotholes",
  id: "world.plotholes",
  name: "plotholes",
  package: "some-package",
  path: "path/to/file",
  private: false,
};

const compendiumCollection = new CompendiumCollection(metadata);
expectTypeOf(compendiumCollection.get("", { strict: true })).toEqualTypeOf<Document.Stored<JournalEntry>>();
// expectTypeOf(compendiumCollection.toJSON()).toEqualTypeOf<
//   Array<Document.Stored<foundry.documents.BaseJournalEntry>["_source"]>
// >();

// @ts-expect-error - "_initialize" is a protected method.
// This is interesting to check because `CompendiumCollection` uses a novel approach for its mixin and comparable strategies strip away visibility modifiers.
compendiumCollection._initialize();

type CompendiumCollectionType = typeof compendiumCollection;

if (compendiumCollection instanceof DocumentCollection) {
  // This test makes sure the mixin doesn't destroy the inheritance chain.
  expectTypeOf(compendiumCollection).toMatchTypeOf<CompendiumCollectionType>();
}

expectTypeOf((await compendiumCollection.getIndex()).get("some id", { strict: true })).toEqualTypeOf<
  { _id: string; uuid: string } & DeepPartial<foundry.documents.BaseJournalEntry["_source"]>
>();

expectTypeOf(compendiumCollection.documentClass).toEqualTypeOf<typeof JournalEntry>();

const itemCollection = new CompendiumCollection({
  type: "Item",
  label: "Important items",
  id: "world.items",
  name: "items",
  package: "other-package",
  path: "path/to/items",
  private: false,
});
expectTypeOf((await itemCollection.getIndex()).get("some id", { strict: true })).toEqualTypeOf<
  { _id: string; uuid: string } & DeepPartial<foundry.documents.BaseItem["_source"]>
>();
expectTypeOf(
  (await itemCollection.getIndex({ fields: ["name", "effects", "system"] })).get("some id", { strict: true }),
).toEqualTypeOf<{ _id: string; uuid: string } & DeepPartial<foundry.documents.BaseItem["_source"]>>();

expectTypeOf(await itemCollection.getDocuments()).toEqualTypeOf<Document.Stored<Item>[]>(); // get all items
expectTypeOf(await itemCollection.getDocuments({})).toEqualTypeOf<Document.Stored<Item>[]>(); // get all items
expectTypeOf(await itemCollection.getDocuments({ name: "foo" })).toEqualTypeOf<Document.Stored<Item>[]>(); // get all items called "foo"
expectTypeOf(
  await itemCollection.getDocuments({ $or: [{ name: "baz" }, { name: "bar" }], effects: { $size: 2 } }), // only get items called "baz" or "bar" that have exactly 2 effects
).toEqualTypeOf<Document.Stored<Item>[]>();
