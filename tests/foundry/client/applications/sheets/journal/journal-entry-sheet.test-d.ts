import { expectTypeOf } from "vitest";

declare const doc: JournalEntry.Implementation;
const sheet = new foundry.applications.sheets.journal.JournalEntrySheet({ document: doc });

expectTypeOf(sheet.document).toEqualTypeOf<JournalEntry.Implementation>();
expectTypeOf(sheet.entry).toEqualTypeOf<JournalEntry.Implementation>();
expectTypeOf(sheet.isMultiple).toEqualTypeOf<boolean>();
expectTypeOf(sheet.locked).toEqualTypeOf<boolean>();
expectTypeOf(sheet.mode).toEqualTypeOf<foundry.applications.sheets.journal.JournalEntrySheet.VIEW_MODES>();
expectTypeOf(sheet.pageId).toEqualTypeOf<string | undefined>();
expectTypeOf(sheet.pageIndex).toEqualTypeOf<number>();
expectTypeOf(sheet.pagesInView).toEqualTypeOf<HTMLElement[]>();
expectTypeOf(sheet.searchMode).toEqualTypeOf<CONST.DIRECTORY_SEARCH_MODES>();
expectTypeOf(sheet.sidebarExpanded).toEqualTypeOf<boolean>();
expectTypeOf(sheet.title).toEqualTypeOf<string>();

expectTypeOf(
  foundry.applications.sheets.journal.JournalEntrySheet.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(foundry.applications.sheets.journal.JournalEntrySheet.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.sheets.journal.JournalEntrySheet.VIEW_MODES).toEqualTypeOf<{
  SINGLE: 1;
  MULTIPLE: 2;
}>();

declare const page: JournalEntryPage.Implementation;
expectTypeOf(sheet.getPageSheet(page)).toEqualTypeOf<
  foundry.applications.sheets.journal.JournalEntryPageSheet.Any | foundry.appv1.api.Application.Any
>();
expectTypeOf(sheet.isPageVisible(page)).toEqualTypeOf<boolean>();
expectTypeOf(sheet.createPageDialog()).toEqualTypeOf<Promise<JournalEntryPage.Stored | null | undefined>>();
expectTypeOf(sheet.goToPage("page-id")).toEqualTypeOf<Promise<typeof sheet> | void>();
expectTypeOf(sheet.nextPage()).toEqualTypeOf<Promise<typeof sheet> | void>();
expectTypeOf(sheet.previousPage()).toEqualTypeOf<Promise<typeof sheet> | void>();
expectTypeOf(sheet.toggleSearchMode()).toEqualTypeOf<Promise<typeof sheet>>();

for (const viewedPage of sheet.viewedPageDocuments()) {
  expectTypeOf(viewedPage).toEqualTypeOf<JournalEntryPage.Implementation>();
}

declare class _TestJournalEntrySheetSubclass extends foundry.applications.sheets.journal.JournalEntrySheet {
  protected override _canDragDrop(selector: string): boolean;
  protected override _canDragStart(selector: string): boolean;
  protected override _onDrop(event: DragEvent): Promise<void>;
  protected override _onEditPage(
    event: PointerEvent | null,
    target: HTMLElement,
  ): Promise<foundry.applications.api.ApplicationV2.Any> | foundry.appv1.api.Application.Any | void;
  protected override _onShowPlayers(): void;
}
