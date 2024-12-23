import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

expectTypeOf(foundry.documents.BaseJournalEntry.create({ name: "Some JournalEntry" })).toEqualTypeOf<
  Promise<Document.Stored<JournalEntry> | undefined>
>();
expectTypeOf(foundry.documents.BaseJournalEntry.createDocuments([])).toEqualTypeOf<
  Promise<Document.Stored<JournalEntry>[]>
>();
expectTypeOf(foundry.documents.BaseJournalEntry.updateDocuments([])).toEqualTypeOf<Promise<JournalEntry[]>>();
expectTypeOf(foundry.documents.BaseJournalEntry.deleteDocuments([])).toEqualTypeOf<Promise<JournalEntry[]>>();

const journalEntry = await foundry.documents.BaseJournalEntry.create(
  { name: "Another JournalEntry" },
  { temporary: true },
);
if (journalEntry) {
  expectTypeOf(journalEntry).toEqualTypeOf<JournalEntry>();
}
