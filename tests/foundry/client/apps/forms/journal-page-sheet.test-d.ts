import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

declare const journalEntryPage: JournalEntryPage.Implementation;
const journalPageSheet = new JournalPageSheet(journalEntryPage);

expectTypeOf(journalPageSheet.object).toEqualTypeOf<JournalEntryPage.Implementation>();
expectTypeOf(journalPageSheet.document).toEqualTypeOf<JournalEntryPage.Implementation>();
expectTypeOf(JournalPageSheet.defaultOptions).toEqualTypeOf<JournalPageSheet.Options>();
expectTypeOf(journalPageSheet.options).toEqualTypeOf<JournalPageSheet.Options>();
expectTypeOf(journalPageSheet.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<JournalPageSheet.JournalPageSheetData>>
>();
expectTypeOf(journalPageSheet.render(true)).toEqualTypeOf<JournalPageSheet>();
