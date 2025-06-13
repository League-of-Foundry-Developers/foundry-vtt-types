import { expectTypeOf } from "vitest";
import { Journal } from "#client/documents/collections/_module.mjs";

const journal = new Journal([]);
expectTypeOf(journal.get("", { strict: true })).toEqualTypeOf<JournalEntry.Stored>();
expectTypeOf(journal.toJSON()).toEqualTypeOf<JournalEntry.Stored["_source"][]>();
expectTypeOf(journal.directory).toEqualTypeOf<JournalDirectory>();
