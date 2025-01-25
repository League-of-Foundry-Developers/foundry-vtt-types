import { expectTypeOf } from "vitest";
import type { MaybePromise } from "../../../../../src/utils/index.d.mts";

const journalEntry = new JournalEntry({ name: "Some Journal Entry" });
const journalSheet = new JournalSheet(journalEntry);

expectTypeOf(journalSheet.object).toEqualTypeOf<JournalEntry>();
expectTypeOf(journalSheet.document).toEqualTypeOf<JournalEntry>();
expectTypeOf(JournalSheet.defaultOptions).toEqualTypeOf<JournalSheetOptions>();
expectTypeOf(journalSheet.options).toEqualTypeOf<JournalSheetOptions>();
expectTypeOf(journalSheet.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(journalSheet.render(true)).toEqualTypeOf<JournalSheet>();

expectTypeOf(journalSheet.mode).toEqualTypeOf<(typeof JournalSheet)["VIEW_MODES"] | null>();
expectTypeOf(journalSheet.searchMode).toEqualTypeOf<foundry.CONST.DIRECTORY_SEARCH_MODES>();
expectTypeOf(journalSheet.pagesInView).toEqualTypeOf<HTMLElement[]>();
expectTypeOf(journalSheet.pageIndex).toEqualTypeOf<number>();
expectTypeOf(journalSheet.observer).toEqualTypeOf<IntersectionObserver>();
expectTypeOf(journalSheet.sidebarCollapsed).toEqualTypeOf<boolean>();
