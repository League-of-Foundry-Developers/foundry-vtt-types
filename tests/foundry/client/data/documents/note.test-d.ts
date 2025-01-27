import { expectTypeOf } from "vitest";

const doc = new NoteDocument();

expectTypeOf(doc.page).toEqualTypeOf<JournalEntryPage.Implementation | undefined>();
expectTypeOf(doc.label).toEqualTypeOf<string>();
expectTypeOf(doc.entry).toEqualTypeOf<JournalEntry.Implementation | undefined>();
