import { expectType } from 'tsd';

expectType<Promise<StoredDocument<JournalEntry> | undefined>>(
  foundry.documents.BaseJournalEntry.create({ name: 'Some JournalEntry' })
);
expectType<Promise<StoredDocument<JournalEntry>[]>>(foundry.documents.BaseJournalEntry.createDocuments([]));
expectType<Promise<JournalEntry[]>>(foundry.documents.BaseJournalEntry.updateDocuments([]));
expectType<Promise<JournalEntry[]>>(foundry.documents.BaseJournalEntry.deleteDocuments([]));

const journalEntry = await foundry.documents.BaseJournalEntry.create(
  { name: 'Another JournalEntry' },
  { temporary: true }
);
if (journalEntry) {
  expectType<foundry.data.JournalEntryData>(journalEntry.data);
}
