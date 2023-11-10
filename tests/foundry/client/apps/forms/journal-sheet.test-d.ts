import { expectTypeOf } from "vitest";

const journalSheet = new JournalSheet(new JournalEntry({ name: "Some Journal Entry" }));
expectTypeOf(journalSheet.object).toEqualTypeOf<JournalEntry>();
expectTypeOf(journalSheet.render(true, { sheetMode: "image" })).toEqualTypeOf<JournalSheet>();
