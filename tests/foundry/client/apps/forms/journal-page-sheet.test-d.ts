import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "../../../../../src/utils/index.d.mts";

declare const journalEntryPage: JournalEntryPage;
const journalPageSheet = new JournalPageSheet(journalEntryPage);

expectTypeOf(journalPageSheet.object).toEqualTypeOf<JournalEntryPage>();
expectTypeOf(journalPageSheet.document).toEqualTypeOf<JournalEntryPage>();
expectTypeOf(JournalPageSheet.defaultOptions).toEqualTypeOf<JournalPageSheet.Options>();
expectTypeOf(journalPageSheet.options).toEqualTypeOf<JournalPageSheet.Options>();
expectTypeOf(journalPageSheet.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<JournalPageSheet.JournalPageSheetData>>
>();
expectTypeOf(journalPageSheet.render(true)).toEqualTypeOf<JournalPageSheet>();
