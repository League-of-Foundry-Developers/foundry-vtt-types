import { expectError, expectType } from 'tsd';

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
  expectType<foundry.documents.BaseJournalEntry['data']>(journalEntry.data);
}

expectError(new foundry.documents.BaseJournalEntryData());
expectError(new foundry.documents.BaseJournalEntryData({}));
expectType<foundry.documents.BaseJournalEntryData>(new foundry.documents.BaseJournalEntryData({ name: 'foo' }));
