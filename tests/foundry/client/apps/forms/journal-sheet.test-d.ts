import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

declare const journalEntry: JournalEntry.Implementation;
const journalSheet = new JournalSheet(journalEntry);

expectTypeOf(journalSheet.object).toEqualTypeOf<JournalEntry.Implementation>();
expectTypeOf(journalSheet.document).toEqualTypeOf<JournalEntry.Implementation>();
expectTypeOf(JournalSheet.defaultOptions).toEqualTypeOf<JournalSheet.Options>();
expectTypeOf(journalSheet.options).toEqualTypeOf<JournalSheet.Options>();
expectTypeOf(journalSheet.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(journalSheet.render(true)).toEqualTypeOf<JournalSheet>();

expectTypeOf(journalSheet.mode).toEqualTypeOf<(typeof JournalSheet)["VIEW_MODES"] | null>();
expectTypeOf(journalSheet.searchMode).toEqualTypeOf<foundry.CONST.DIRECTORY_SEARCH_MODES>();
expectTypeOf(journalSheet.pagesInView).toEqualTypeOf<HTMLElement[]>();
expectTypeOf(journalSheet.pageIndex).toEqualTypeOf<number>();
expectTypeOf(journalSheet.observer).toEqualTypeOf<IntersectionObserver>();
expectTypeOf(journalSheet.sidebarCollapsed).toEqualTypeOf<boolean>();
