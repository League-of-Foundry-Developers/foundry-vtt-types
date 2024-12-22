import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

const journal = new Journal([]);
expectTypeOf(journal.get("", { strict: true })).toEqualTypeOf<Document.Stored<JournalEntry>>();
expectTypeOf(journal.toJSON()).toEqualTypeOf<Document.Stored<JournalEntry>["_source"][]>();
expectTypeOf(journal.directory).toEqualTypeOf<JournalDirectory>();
