import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

const journal = new Journal([]);
expectTypeOf(journal.get("", { strict: true })).toEqualTypeOf<JournalEntry.Stored>();
expectTypeOf(journal.toJSON()).toEqualTypeOf<JournalEntry.Stored["_source"][]>();
expectTypeOf(journal.directory).toEqualTypeOf<JournalDirectory>();
