import { expectTypeOf } from "vitest";

const journalDirectory = new JournalDirectory();

expectTypeOf(JournalDirectory.defaultOptions).toEqualTypeOf<DocumentDirectoryOptions>();
expectTypeOf(journalDirectory.options).toEqualTypeOf<DocumentDirectoryOptions>();
expectTypeOf(journalDirectory.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(journalDirectory.render(true)).toEqualTypeOf<JournalDirectory>();
