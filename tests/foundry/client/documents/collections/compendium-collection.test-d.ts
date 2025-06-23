import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";
import { CompendiumCollection } from "#client/documents/collections/_module.mjs";

import DocumentCollection = foundry.documents.abstract.DocumentCollection;

const compendiumCollection = await foundry.documents.collections.CompendiumCollection.createCompendium({
  type: "JournalEntry",
  label: "Important Plotholes",
  name: "plotholes",
});

expectTypeOf(compendiumCollection).toEqualTypeOf<CompendiumCollection<"JournalEntry">>();
expectTypeOf(compendiumCollection.metadata).toEqualTypeOf<CompendiumCollection.Metadata>();

const metadata = {
  name: "plotholes",
  type: "JournalEntry",
  label: "Important Plotholes",
  flags: {},
  id: "plotholes",
  system: "core",
  package: "plotholes",
  packageName: "plotholes",
  packageType: "module",
  path: "path",
  ownership: {
    NONE: "NONE",
    PLAYER: "NONE",
    TRUSTED: "LIMITED",
    ASSISTANT: "INHERIT",
    GAMEMASTER: "OWNER",
  },
} satisfies foundry.documents.collections.CompendiumCollection.Metadata;

const constructorMetadata = {
  ...metadata,
  index: new foundry.utils.Collection(),
  folders: [],
} satisfies foundry.documents.collections.CompendiumCollection.ConstructorMetadata<"JournalEntry">;

const compendium2 = new CompendiumCollection(constructorMetadata);

expectTypeOf(compendium2).toEqualTypeOf<CompendiumCollection<"JournalEntry">>();
expectTypeOf(compendium2.metadata).toEqualTypeOf<CompendiumCollection.Metadata>();

expectTypeOf(compendiumCollection.get("", { strict: true })).toEqualTypeOf<JournalEntry.Stored>();
// expectTypeOf(compendiumCollection.toJSON()).toEqualTypeOf<
//   Array<Document.Stored<foundry.documents.BaseJournalEntry>["_source"]>
// >();

// @ts-expect-error - "_initialize" is a protected method.
// This is interesting to check because `CompendiumCollection` uses a novel approach for its mixin and comparable strategies strip away visibility modifiers.
compendiumCollection._initialize();

type CompendiumCollectionType = typeof compendiumCollection;

if (compendiumCollection instanceof DocumentCollection) {
  // This test makes sure the mixin doesn't destroy the inheritance chain.
  expectTypeOf(compendiumCollection).toExtend<CompendiumCollectionType>();
}

expectTypeOf(
  (await foundry.documents.collections.CompendiumCollection.getIndex()).get("some id", { strict: true }),
).toEqualTypeOf<{ _id: string; uuid: string } & DeepPartial<foundry.documents.BaseJournalEntry["_source"]>>();

expectTypeOf(compendiumCollection.documentClass).toEqualTypeOf<JournalEntry.ImplementationClass>();

const itemCollection = new CompendiumCollection({
  ...metadata,
  type: "Item",
  index: new foundry.utils.Collection(),
  folders: [],
});
expectTypeOf((await itemCollection.getIndex()).get("some id", { strict: true })).toEqualTypeOf<
  { _id: string; uuid: string } & DeepPartial<foundry.documents.BaseItem["_source"]>
>();
expectTypeOf(
  (await itemCollection.getIndex({ fields: ["name", "effects", "system"] })).get("some id", { strict: true }),
).toEqualTypeOf<{ _id: string; uuid: string } & DeepPartial<foundry.documents.BaseItem["_source"]>>();

expectTypeOf(await itemCollection.getDocuments()).toEqualTypeOf<Item.Implementation[]>(); // get all items
expectTypeOf(await itemCollection.getDocuments({})).toEqualTypeOf<Item.Implementation[]>(); // get all items
expectTypeOf(await itemCollection.getDocuments({ name: "foo" })).toEqualTypeOf<Item.Implementation[]>(); // get all items called "foo"

await itemCollection.getDocuments({
  name__in: ["baz", "bar"],
});

await itemCollection.getDocuments({
  system: {
    attack: 1,
  },
});

await itemCollection.getDocuments({
  // @ts-expect-error - Excess keys should not be allowed.
  excessKey: 123,
});
