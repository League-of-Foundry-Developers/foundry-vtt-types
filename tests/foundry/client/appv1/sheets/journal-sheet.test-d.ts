import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";
import type DocumentSheetV2 from "../../../../../src/foundry/client/applications/api/document-sheet.d.mts";

import JournalSheet = foundry.appv1.sheets.JournalSheet;
import Application = foundry.appv1.api.Application;

declare const journalEntry: JournalEntry.Implementation;
const journalSheet = new JournalSheet(journalEntry);

expectTypeOf(journalSheet.object).toEqualTypeOf<JournalEntry.Implementation>();
expectTypeOf(journalSheet.document).toEqualTypeOf<JournalEntry.Implementation>();
expectTypeOf(JournalSheet.defaultOptions).toEqualTypeOf<JournalSheet.Options>();
expectTypeOf(journalSheet.options).toEqualTypeOf<JournalSheet.Options>();
expectTypeOf(journalSheet.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<JournalSheet.Data>>>();
expectTypeOf(journalSheet.render(true)).toEqualTypeOf<JournalSheet>();

expectTypeOf(journalSheet.mode).toEqualTypeOf<JournalSheet.ViewMode>();
expectTypeOf(journalSheet.searchMode).toEqualTypeOf<foundry.CONST.DIRECTORY_SEARCH_MODES>();
expectTypeOf(journalSheet.pagesInView).toEqualTypeOf<HTMLElement[]>();
expectTypeOf(journalSheet.pageIndex).toEqualTypeOf<number>();
expectTypeOf(journalSheet.observer).toEqualTypeOf<IntersectionObserver>();
expectTypeOf(journalSheet.sidebarCollapsed).toEqualTypeOf<boolean>();

// The rendered inline sheet's exact class is whatever `CONFIG.JournalEntryPage.sheetClasses` registers for the
// page's type (falling back to `foundry.applications.sheets.BaseSheet`), so only the framework split is known.
expectTypeOf(journalSheet.getPageSheet("someId")).toEqualTypeOf<Application.Any | DocumentSheetV2.Any>();

// Options registered by `defaultOptions` but previously missing from the interface.
expectTypeOf(journalSheet.options.pageIndex).toEqualTypeOf<number | undefined>();
expectTypeOf(journalSheet.options.pageId).toEqualTypeOf<string | undefined>();

// `_getPageData` returns decorated source data, not documents.
declare const pageData: JournalSheet.PageData;
expectTypeOf(pageData.viewClass).toEqualTypeOf<string>();
expectTypeOf(pageData.ownershipCls).toEqualTypeOf<string>();

// Subclasses can override the page-view hooks added in V14.
class CustomJournalSheet extends JournalSheet {
  protected override _observePages(): void {}
  protected override async _renderPageView(_element: HTMLElement, _sheet: DocumentSheetV2.Any): Promise<void> {}
  protected override async _renderAppV1PageView(_element: HTMLElement, _sheet: Application.Any): Promise<void> {}
}
void CustomJournalSheet;
