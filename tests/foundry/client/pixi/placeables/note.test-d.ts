import { expectTypeOf } from "vitest";

declare const doc: NoteDocument;

expectTypeOf(Note.embeddedName).toEqualTypeOf<"Note">();

const note = new Note(doc);
expectTypeOf(note.entry).toEqualTypeOf<JournalEntry>();
expectTypeOf(note.text).toEqualTypeOf<string>();
expectTypeOf(note.size).toEqualTypeOf<number>();
expectTypeOf(note.draw()).toEqualTypeOf<Promise<Note>>();
