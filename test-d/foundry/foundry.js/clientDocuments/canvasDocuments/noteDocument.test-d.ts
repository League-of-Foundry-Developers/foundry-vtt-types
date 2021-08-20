import { expectType } from 'tsd';

const doc = new NoteDocument();

expectType<string>(doc.label);
expectType<StoredDocument<JournalEntry> | undefined>(doc.entry);
