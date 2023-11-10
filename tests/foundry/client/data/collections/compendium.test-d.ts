import { expectTypeOf } from "vitest";

const metadata = {
  type: "JournalEntry" as const,
  label: "Important Plotholes",
  name: "plotholes",
  package: "some-package",
  path: "path/to/file",
  private: false,
};

const compendiumCollection = new CompendiumCollection(metadata);
expectTypeOf(compendiumCollection.get("", { strict: true })).toEqualTypeOf<StoredDocument<JournalEntry>>();
expectTypeOf(compendiumCollection.toJSON()).toEqualTypeOf<
  Array<StoredDocument<foundry.documents.BaseJournalEntry>["data"]["_source"]>
>();

expectTypeOf((await compendiumCollection.getIndex()).get("some id", { strict: true })).toEqualTypeOf<
  { _id: string } & Partial<foundry.data.JournalEntryData["_source"]>
>();

const itemCollection = new CompendiumCollection({
  type: "Item",
  label: "Important items",
  name: "items",
  package: "other-package",
  path: "path/to/items",
  private: false,
});
expectTypeOf((await itemCollection.getIndex()).get("some id", { strict: true })).toEqualTypeOf<
  { _id: string } & Partial<foundry.data.ItemData["_source"]>
>();
expectTypeOf(
  (await itemCollection.getIndex({ fields: ["name", "effects", "data"] })).get("some id", { strict: true }),
).toEqualTypeOf<{ _id: string } & Partial<foundry.data.ItemData["_source"]>>();

// @ts-expect-error - "nonExistentField" is not one of the fields declared above
await itemCollection.getIndex({ fields: ["nonExistentField"] });

expectTypeOf(await itemCollection.getDocuments()).toEqualTypeOf<StoredDocument<Item>[]>(); // get all items
expectTypeOf(await itemCollection.getDocuments({})).toEqualTypeOf<StoredDocument<Item>[]>(); // get all items
expectTypeOf(await itemCollection.getDocuments({ name: "foo" })).toEqualTypeOf<StoredDocument<Item>[]>(); // get all items called "foo"
expectTypeOf(
  await itemCollection.getDocuments({ $or: [{ name: "baz" }, { name: "bar" }], effects: { $size: 2 } }), // only get items called "baz" or "bar" that have exactly 2 effects
).toEqualTypeOf<StoredDocument<Item>[]>();
