import { expectType } from 'tsd';
import '../../../../index';

expectType<Promise<JournalEntry>>(foundry.documents.BaseJournalEntry.create());
expectType<Promise<JournalEntry[]>>(foundry.documents.BaseJournalEntry.createDocuments([]));
expectType<Promise<JournalEntry[]>>(foundry.documents.BaseJournalEntry.updateDocuments([]));
expectType<Promise<JournalEntry[]>>(foundry.documents.BaseJournalEntry.deleteDocuments([]));

const journalEntry = await foundry.documents.BaseJournalEntry.create();
expectType<foundry.data.JournalEntryData>(journalEntry.data);
