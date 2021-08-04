import { expectType } from 'tsd';

const doc = new NoteDocument();

expectType<string>(doc.label);
expectType<JournalEntry | undefined>(doc.entry);
