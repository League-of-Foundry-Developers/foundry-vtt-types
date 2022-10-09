import { expectType } from "tsd";

declare const doc: NoteDocument;

expectType<"Note">(Note.embeddedName);

const note = new Note(doc);
expectType<JournalEntry>(note.entry);
expectType<string>(note.text);
expectType<number>(note.size);
expectType<Promise<Note>>(note.draw());
