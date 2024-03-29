import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../../src/types/utils.d.mts";

const doc = new NoteDocument();

expectTypeOf(doc.label).toEqualTypeOf<string>();
expectTypeOf(doc.entry).toEqualTypeOf<StoredDocument<JournalEntry> | undefined>();
