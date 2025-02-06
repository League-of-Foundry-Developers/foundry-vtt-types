import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";
import Document = foundry.abstract.Document;

const compendiumCollection = await CompendiumCollection.createCompendium({
  type: "JournalEntry" as const,
  label: "Important Plotholes",
  name: "plotholes",
});

expectTypeOf(compendiumCollection).toEqualTypeOf<CompendiumCollection<CompendiumCollection.Metadata>>();
expectTypeOf(compendiumCollection.metadata).toEqualTypeOf<CompendiumCollection.Metadata>();

const metadata: CompendiumCollection.Metadata = {
  name: "plotholes",
  type: "JournalEntry" as const,
  label: "Important Plotholes",
  flags: {},
  id: "plotholes",
  system: "core",
  package: "plotholes",
  packageName: "plotholes",
  packageType: "module",
  path: "path",
  ownership: {
    PLAYER: "OWNER",
  },
};

const constructorMetadata: CompendiumCollection.ConstructorMetadata<typeof metadata> = {
  ...metadata,
  index: new foundry.utils.Collection(),
  folders: [],
};

const compendium2 = new CompendiumCollection(constructorMetadata);

expectTypeOf(compendium2).toEqualTypeOf<CompendiumCollection<CompendiumCollection.Metadata>>();
expectTypeOf(compendium2.metadata).toEqualTypeOf<CompendiumCollection.Metadata>();

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
  ...metadata,
  type: "Item" as const,
  index: new foundry.utils.Collection(),
  folders: [],
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
