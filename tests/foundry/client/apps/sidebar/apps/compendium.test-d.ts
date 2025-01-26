import { expectTypeOf } from "vitest";

const compendium = new Compendium({});

expectTypeOf(Compendium.defaultOptions).toEqualTypeOf<Compendium.Options<CompendiumCollection.Metadata>>();
expectTypeOf(compendium.options).toEqualTypeOf<Compendium.Options<CompendiumCollection.Metadata>>();
expectTypeOf(compendium.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(compendium.render(true)).toEqualTypeOf<unknown>();

expectTypeOf(compendium.id).toEqualTypeOf<string>();
expectTypeOf(compendium.title).toEqualTypeOf<string>();
expectTypeOf(compendium.tabName).toEqualTypeOf<string>();
expectTypeOf(compendium.canCreateEntry).toEqualTypeOf<boolean>();
expectTypeOf(compendium.canCreateFolder).toEqualTypeOf<boolean>();
expectTypeOf(compendium.entryType).toEqualTypeOf<
  "Actor" | "Adventure" | "Cards" | "Item" | "JournalEntry" | "Macro" | "Playlist" | "RollTable" | "Scene"
>();
expectTypeOf(Compendium.entryPartial).toEqualTypeOf<string>();

expectTypeOf(compendium.metadata).toEqualTypeOf<(typeof compendium)["collection"]["metadata"]>();
