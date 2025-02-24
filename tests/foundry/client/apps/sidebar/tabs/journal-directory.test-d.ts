import { expectTypeOf } from "vitest";

const journalDirectory = new JournalDirectory();

expectTypeOf(JournalDirectory.defaultOptions).toEqualTypeOf<DocumentDirectory.Options>();
expectTypeOf(journalDirectory.options).toEqualTypeOf<DocumentDirectory.Options>();
expectTypeOf(journalDirectory.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(journalDirectory.render(true)).toEqualTypeOf<JournalDirectory>();
