import { expectTypeOf } from "vitest";

expectTypeOf(foundry.documents.BaseJournalEntry.create({ name: "Some JournalEntry" })).toEqualTypeOf<
  Promise<JournalEntry.Stored | undefined>
>();
expectTypeOf(foundry.documents.BaseJournalEntry.createDocuments([])).toEqualTypeOf<Promise<JournalEntry.Stored[]>>();
expectTypeOf(foundry.documents.BaseJournalEntry.updateDocuments([])).toEqualTypeOf<
  Promise<JournalEntry.Implementation[]>
>();
expectTypeOf(foundry.documents.BaseJournalEntry.deleteDocuments([])).toEqualTypeOf<
  Promise<JournalEntry.Implementation[]>
>();

const journalEntry = await foundry.documents.BaseJournalEntry.create(
  { name: "Another JournalEntry" },
  { temporary: true },
);
if (journalEntry) {
  expectTypeOf(journalEntry).toEqualTypeOf<JournalEntry.Implementation>();
}

// Regression test for issue with circular schemas reported by @Eon
// https://tsplay.dev/mpYKXW

class SpeciesSystem extends foundry.abstract.TypeDataModel<any, Item.Implementation> {
  static override defineSchema(): any {}
}

const _actorSystemSchema = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  species: new foundry.data.fields.SchemaField(SpeciesSystem.defineSchema()),
};

class ActorSystem extends foundry.abstract.TypeDataModel<typeof _actorSystemSchema, any> {}

class _PokemonActorSystem extends ActorSystem {
  method() {}
}

declare global {
  interface DataModelConfig {
    JournalEntry: {
      pokemon: typeof _PokemonActorSystem;
    };
  }
}
