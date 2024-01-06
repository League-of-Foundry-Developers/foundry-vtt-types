import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../src/types/utils.mts";

expectTypeOf(foundry.documents.BaseJournalEntry.create({ name: "Some JournalEntry" })).toEqualTypeOf<
  Promise<StoredDocument<JournalEntry> | undefined>
>();
expectTypeOf(foundry.documents.BaseJournalEntry.createDocuments([])).toEqualTypeOf<
  Promise<StoredDocument<JournalEntry>[]>
>();
expectTypeOf(foundry.documents.BaseJournalEntry.updateDocuments([])).toEqualTypeOf<Promise<JournalEntry[]>>();
expectTypeOf(foundry.documents.BaseJournalEntry.deleteDocuments([])).toEqualTypeOf<Promise<JournalEntry[]>>();

const journalEntry = await foundry.documents.BaseJournalEntry.create(
  { name: "Another JournalEntry" },
  { temporary: true },
);
if (journalEntry) {
  expectTypeOf(journalEntry.data).toEqualTypeOf<foundry.data.JournalEntryData>();
}
