import { expectTypeOf } from "vitest";

const doc = new NoteDocument.implementation();

expectTypeOf(doc.page).toEqualTypeOf<JournalEntryPage.Stored | undefined>();
expectTypeOf(doc.label).toEqualTypeOf<string>();
expectTypeOf(doc.entry).toEqualTypeOf<JournalEntry.Stored | undefined>();

const _x = await NoteDocument.createDialog(undefined, { parent: canvas!.scene! });
