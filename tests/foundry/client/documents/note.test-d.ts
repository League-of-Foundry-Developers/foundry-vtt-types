import { expectTypeOf } from "vitest";

const doc = new NoteDocument.implementation();

expectTypeOf(doc.hidden).toEqualTypeOf<false>();
expectTypeOf(doc.page).toEqualTypeOf<JournalEntryPage.Stored | undefined>();
expectTypeOf(doc.label).toEqualTypeOf<string>();
expectTypeOf(doc.entry).toEqualTypeOf<JournalEntry.Stored | undefined>();

const _x = await NoteDocument.createDialog(undefined, { parent: canvas!.scene! });

declare const someNote: NoteDocument.Stored;

expectTypeOf(someNote.author).toEqualTypeOf<User.Stored | null>();
expectTypeOf(someNote.levels).toEqualTypeOf<Set<string>>();
expectTypeOf(someNote.locked).toBeBoolean();
expectTypeOf(someNote.isAuthor).toBeBoolean();
expectTypeOf(someNote.prepareDerivedData()).toEqualTypeOf<void>();
