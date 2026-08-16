import { expectTypeOf } from "vitest";

import JournalEntrySheet = foundry.applications.sheets.journal.JournalEntrySheet;
import JournalEntryPageSheet = foundry.applications.sheets.journal.JournalEntryPageSheet;
import JournalPageSheet = foundry.appv1.sheets.JournalPageSheet;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import ContextMenu = foundry.applications.ux.ContextMenu;
import type { DeepPartial } from "fvtt-types/utils";

declare const sheet: JournalEntrySheet;
declare const page: JournalEntryPage.Implementation;
declare const pageSheet: JournalEntryPageSheet.Any;
declare const element: HTMLElement;
declare const renderOptions: DeepPartial<JournalEntrySheet.RenderOptions>;
declare const partOptions: HandlebarsApplicationMixin.RenderOptions;
declare const partState: HandlebarsApplicationMixin.PartState;
declare const dragEvent: DragEvent;
declare const pointerEvent: PointerEvent;
declare const observer: IntersectionObserver;
declare const observerEntries: IntersectionObserverEntry[];
declare const keyboardEvent: KeyboardEvent;

expectTypeOf(JournalEntrySheet.DEFAULT_OPTIONS).toEqualTypeOf<DocumentSheetV2.DefaultOptions>();
expectTypeOf(JournalEntrySheet.PARTS).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

// Keyed by `CONST.DOCUMENT_OWNERSHIP_LEVELS`; only `NONE`, `OBSERVER`, and `OWNER` are given icons.
expectTypeOf(JournalEntrySheet.OWNERSHIP_ICONS).toEqualTypeOf<Record<number, string>>();
expectTypeOf(JournalEntrySheet.VIEW_MODES).toEqualTypeOf<{ SINGLE: 1; MULTIPLE: 2 }>();
expectTypeOf<JournalEntrySheet.VIEW_MODES>().toEqualTypeOf<1 | 2>();

expectTypeOf(sheet.document).toEqualTypeOf<JournalEntry.Implementation>();
expectTypeOf(sheet.entry).toEqualTypeOf<JournalEntry.Implementation>();
expectTypeOf(sheet.isMultiple).toEqualTypeOf<boolean>();
expectTypeOf(sheet.locked).toEqualTypeOf<boolean>();
expectTypeOf(sheet.mode).toEqualTypeOf<JournalEntrySheet.VIEW_MODES>();
expectTypeOf(sheet.searchMode).toEqualTypeOf<CONST.DIRECTORY_SEARCH_MODES>();
expectTypeOf(sheet.sidebarExpanded).toEqualTypeOf<boolean>();
expectTypeOf(sheet.pagesInView).toEqualTypeOf<HTMLElement[]>();
expectTypeOf(sheet.title).toEqualTypeOf<string>();

// `undefined` until `#_observePages` has run.
expectTypeOf(sheet.observer).toEqualTypeOf<IntersectionObserver | undefined>();

// `undefined` while the entry has no visible pages.
expectTypeOf(sheet.pageId).toEqualTypeOf<string | undefined>();

// `-1` when `#pageId` is not among the prepared pages.
expectTypeOf(sheet.pageIndex).toEqualTypeOf<number>();

expectTypeOf(sheet["_pages"]).toEqualTypeOf<Record<string, JournalEntrySheet.PageContext>>();

/* Public API */

expectTypeOf(sheet.createPageDialog()).toEqualTypeOf<Promise<JournalEntryPage.Stored | null | undefined>>();

// V14 can return either an AppV2 page sheet or a legacy AppV1 one.
expectTypeOf(sheet.getPageSheet(page)).toEqualTypeOf<JournalEntryPageSheet.Any | JournalPageSheet.Any>();
expectTypeOf(sheet.getPageSheet("someId")).toEqualTypeOf<JournalEntryPageSheet.Any | JournalPageSheet.Any>();

expectTypeOf(sheet.goToPage("someId")).toEqualTypeOf<Promise<JournalEntrySheet> | void>();
expectTypeOf(sheet.goToPage("someId", {})).toEqualTypeOf<Promise<JournalEntrySheet> | void>();
expectTypeOf(sheet.goToPage("someId", { anchor: "heading" })).toEqualTypeOf<Promise<JournalEntrySheet> | void>();
expectTypeOf(sheet.goToPage("someId", { anchor: undefined })).toEqualTypeOf<Promise<JournalEntrySheet> | void>();

expectTypeOf(sheet.isPageVisible(page)).toEqualTypeOf<boolean>();
expectTypeOf(sheet.nextPage()).toEqualTypeOf<Promise<JournalEntrySheet> | void>();
expectTypeOf(sheet.previousPage()).toEqualTypeOf<Promise<JournalEntrySheet> | void>();
expectTypeOf(sheet.toggleSearchMode()).toEqualTypeOf<Promise<JournalEntrySheet>>();
expectTypeOf(sheet.toggleSidebar()).toEqualTypeOf<void>();
expectTypeOf(sheet.viewedPageDocuments()).toEqualTypeOf<Generator<JournalEntryPage.Implementation, void, undefined>>();

/* Render lifecycle */

expectTypeOf(sheet["_configureRenderOptions"](renderOptions)).toEqualTypeOf<void>();
expectTypeOf(sheet["_configureRenderParts"](partOptions)).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(sheet["_initializeApplicationOptions"]({})).toEqualTypeOf<JournalEntrySheet.Configuration>();
expectTypeOf(sheet["_getHeaderControls"]()).toEqualTypeOf<ApplicationV2.HeaderControlsEntry[]>();
expectTypeOf(sheet["_preparePageData"]()).toEqualTypeOf<Record<string, JournalEntrySheet.PageContext>>();
expectTypeOf(sheet["_preparePartContext"]).returns.toEqualTypeOf<
  Promise<ApplicationV2.RenderContextOf<JournalEntrySheet>>
>();
expectTypeOf(sheet["_preparePagesContext"]).returns.toEqualTypeOf<Promise<void>>();
expectTypeOf(sheet["_prepareSidebarContext"]).returns.toEqualTypeOf<Promise<void>>();
expectTypeOf(sheet["_prepareTableOfContents"]()).toEqualTypeOf<Promise<JournalEntrySheet.TableOfContentsEntry[]>>();
expectTypeOf(sheet["_preSyncPartState"]("pages", element, element, partState)).toEqualTypeOf<void>();
expectTypeOf(sheet["_replaceHTML"]({}, element, renderOptions)).toEqualTypeOf<void>();
expectTypeOf(sheet["_renderHeadings"](element, undefined)).toEqualTypeOf<Promise<void>>();
expectTypeOf(sheet["_renderPageViews"]).returns.toEqualTypeOf<Promise<void>>();
expectTypeOf(sheet["_renderPageView"](element, pageSheet)).toEqualTypeOf<Promise<void>>();
expectTypeOf(sheet["_setCurrentPage"]()).toEqualTypeOf<void>();
expectTypeOf(sheet["_setCurrentPage"](renderOptions)).toEqualTypeOf<void>();
expectTypeOf(sheet["_activatePagesInView"]()).toEqualTypeOf<void>();
expectTypeOf(sheet["_synchronizeSidebar"]()).toEqualTypeOf<void>();
expectTypeOf(sheet["_updateButtonState"]()).toEqualTypeOf<void>();
expectTypeOf(sheet["_observeHeadings"]()).toEqualTypeOf<void>();
expectTypeOf(sheet["_observePages"]()).toEqualTypeOf<void>();

/* Event handling */

// The runtime passes `jQuery: false`, so entries are typed against `HTMLElement`.
expectTypeOf(sheet["_getEntryContextOptions"]()).toEqualTypeOf<ContextMenu.Entry<HTMLElement>[]>();

expectTypeOf(sheet["_onClickImage"](pointerEvent)).toEqualTypeOf<void>();
expectTypeOf(sheet["_onContextMenuOpen"](element)).toEqualTypeOf<void>();
expectTypeOf(sheet["_onContextMenuClose"](element)).toEqualTypeOf<void>();
expectTypeOf(sheet["_onEditPage"](pointerEvent, element)).toEqualTypeOf<
  Promise<ApplicationV2.Any> | JournalPageSheet.Any | void
>();
expectTypeOf(sheet["_onEditPage"](null, element)).toEqualTypeOf<
  Promise<ApplicationV2.Any> | JournalPageSheet.Any | void
>();
expectTypeOf(sheet["_onPageScroll"](observerEntries, observer)).toEqualTypeOf<void>();
expectTypeOf(sheet["_onSearchFilter"](keyboardEvent, "query", /query/, element)).toEqualTypeOf<void>();
expectTypeOf(sheet["_onShowPlayers"]()).toEqualTypeOf<void>();

expectTypeOf(sheet["_canDragDrop"](".page")).toEqualTypeOf<boolean>();
expectTypeOf(sheet["_canDragStart"](".page")).toEqualTypeOf<boolean>();
expectTypeOf(sheet["_onDragStart"](dragEvent)).toEqualTypeOf<void>();
expectTypeOf(sheet["_onDrop"](dragEvent)).toEqualTypeOf<
  Promise<JournalEntryPage.Implementation | JournalEntry.Implementation | void>
>();

/* Render context */

expectTypeOf<JournalEntrySheet.RenderContext["mode"]>().toEqualTypeOf<JournalEntrySheet.VIEW_MODES>();
expectTypeOf<JournalEntrySheet.RenderContext["viewMode"]>().toEqualTypeOf<JournalEntrySheet.ViewModeContext>();

// Each part context member is only set for the one part that consumes it.
expectTypeOf<JournalEntrySheet.RenderContext["pages"]>().toEqualTypeOf<JournalEntrySheet.PageContext[] | undefined>();
expectTypeOf<JournalEntrySheet.RenderContext["toc"]>().toEqualTypeOf<
  JournalEntrySheet.TableOfContentsEntry[] | undefined
>();
expectTypeOf<JournalEntrySheet.RenderContext["expandMode"]>().toEqualTypeOf<
  JournalEntrySheet.ToggleContext | undefined
>();
expectTypeOf<JournalEntrySheet.RenderContext["searchMode"]>().toEqualTypeOf<
  JournalEntrySheet.SearchModeContext | undefined
>();
expectTypeOf<JournalEntrySheet.RenderContext["lockMode"]>().toEqualTypeOf<
  JournalEntrySheet.ToggleContext | undefined
>();

// A page's own part context is the shared context with that page's descriptor merged in.
expectTypeOf<JournalEntrySheet.PagePartContext>().toExtend<JournalEntrySheet.RenderContext>();
expectTypeOf<JournalEntrySheet.PagePartContext>().toExtend<JournalEntrySheet.PageContext>();

expectTypeOf<JournalEntrySheet.PageContext["id"]>().toEqualTypeOf<string>();
expectTypeOf<JournalEntrySheet.PageContext["editable"]>().toEqualTypeOf<boolean>();
expectTypeOf<JournalEntrySheet.PageContext["hidden"]>().toEqualTypeOf<boolean>();
expectTypeOf<JournalEntrySheet.PageContext["number"]>().toEqualTypeOf<number>();
expectTypeOf<JournalEntrySheet.PageContext["ownershipClass"]>().toEqualTypeOf<string>();
expectTypeOf<JournalEntrySheet.PageContext["category"]>().toEqualTypeOf<string | undefined>();
expectTypeOf<JournalEntrySheet.PageContext["uncategorized"]>().toEqualTypeOf<boolean | undefined>();

// Foundry documents the ToC as page contexts intersected with category contexts, but the runtime pushes the two
// alternately, so `isCategory` discriminates a union instead.
expectTypeOf<JournalEntrySheet.TableOfContentsEntry>().toEqualTypeOf<
  JournalEntrySheet.PageContext | JournalEntrySheet.TableOfContentsCategory
>();
expectTypeOf<JournalEntrySheet.TableOfContentsCategory["isCategory"]>().toEqualTypeOf<true>();
expectTypeOf<JournalEntrySheet.TableOfContentsCategory>().toExtend<JournalEntrySheet.CategoryContext>();

expectTypeOf<JournalEntrySheet.ViewModeContext["cls"]>().toEqualTypeOf<string>();
expectTypeOf<JournalEntrySheet.ViewModeContext>().toExtend<JournalEntrySheet.ToggleContext>();
expectTypeOf<JournalEntrySheet.SearchModeContext["placeholder"]>().toEqualTypeOf<string>();

/* Render options */

expectTypeOf<JournalEntrySheet.RenderOptions["pageIndex"]>().toEqualTypeOf<number | undefined>();
expectTypeOf<JournalEntrySheet.RenderOptions["pageId"]>().toEqualTypeOf<string | undefined>();
expectTypeOf<JournalEntrySheet.RenderOptions["mode"]>().toEqualTypeOf<JournalEntrySheet.VIEW_MODES | undefined>();
expectTypeOf<JournalEntrySheet.RenderOptions["anchor"]>().toEqualTypeOf<string | undefined>();
expectTypeOf<JournalEntrySheet.RenderOptions["tempOwnership"]>().toEqualTypeOf<boolean | undefined>();
expectTypeOf<JournalEntrySheet.RenderOptions["expanded"]>().toEqualTypeOf<boolean | undefined>();
expectTypeOf<JournalEntrySheet.RenderOptions["modeChanged"]>().toEqualTypeOf<boolean | undefined>();
expectTypeOf<JournalEntrySheet.RenderOptions["pageChanged"]>().toEqualTypeOf<boolean | undefined>();

expectTypeOf<JournalEntrySheet.GoToPageOptions["anchor"]>().toEqualTypeOf<string | undefined>();

/* Overridable hooks */

class TestJournalEntrySheet extends JournalEntrySheet {
  protected override _observePages(): void {
    super._observePages();
  }

  protected override _observeHeadings(): void {
    super._observeHeadings();
  }

  protected override async _renderPageView(element: HTMLElement, sheet: JournalEntryPageSheet.Any): Promise<void> {
    await super._renderPageView(element, sheet);
  }

  protected override _canDragStart(selector: string): boolean {
    return super._canDragStart(selector);
  }
}

declare const testSheet: TestJournalEntrySheet;
expectTypeOf(testSheet.entry).toEqualTypeOf<JournalEntry.Implementation>();
