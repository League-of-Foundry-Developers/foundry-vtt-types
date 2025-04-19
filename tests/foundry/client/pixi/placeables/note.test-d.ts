import { expectTypeOf } from "vitest";

declare const doc: NoteDocument.Implementation;

expectTypeOf(Note.embeddedName).toEqualTypeOf<"Note">();

const note = new CONFIG.Note.objectClass(doc);
expectTypeOf(note.entry).toEqualTypeOf<JournalEntry.Implementation>();
expectTypeOf(note.text).toEqualTypeOf<string>();
expectTypeOf(note.size).toEqualTypeOf<number>();
expectTypeOf(note.draw()).toEqualTypeOf<Promise<Note.Object>>();
