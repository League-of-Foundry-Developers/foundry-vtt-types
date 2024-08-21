import { expectTypeOf } from "vitest";

const doc = new NoteDocument();

expectTypeOf(doc.page).toEqualTypeOf<JournalEntryPage | undefined>();
expectTypeOf(doc.label).toEqualTypeOf<string>();
expectTypeOf(doc.entry).toEqualTypeOf<JournalEntry | undefined>();
