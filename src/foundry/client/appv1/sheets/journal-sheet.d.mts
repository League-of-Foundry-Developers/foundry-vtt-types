import type { AnyMutableObject, GetDataReturnType, Identity, MaybePromise, InexactPartial, ValueOf } from "#utils";
import type { Application, DocumentSheet, FormApplication } from "../api/_module.d.mts";
import type { ContextMenu } from "#client/applications/ux/_module.d.mts";
import type DocumentSheetV2 from "#client/applications/api/document-sheet.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationConfig {
      JournalSheet: JournalSheet.Any;
    }
  }
}

/**
 * The Application responsible for displaying and editing a single JournalEntry document.
 * @template Options - the type of the options object
 */
declare class JournalSheet<Options extends JournalSheet.Options = JournalSheet.Options> extends DocumentSheet<
  JournalEntry.Implementation,
  Options
> {
  /**
   * @defaultValue
   * ```ts
   * foundry.utils.mergeObject(super.defaultOptions, {
   *   classes: ["sheet", "journal-sheet", "journal-entry"],
   *   template: "templates/journal/sheet.html",
   *   width: 960,
   *   height: 800,
   *   resizable: true,
   *   submitOnChange: true,
   *   submitOnClose: true,
   *   closeOnSubmit: false,
   *   viewPermission: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE,
   *   scrollY: [".scrollable"],
   *   filters: [{inputSelector: 'input[name="search"]', contentSelector: ".directory-list"}],
   *   dragDrop: [{dragSelector: ".directory-item, .heading-link", dropSelector: ".directory-list"}],
   *   pageIndex: undefined,
   *   pageId: undefined
   * })
   * ```
   */
  static override get defaultOptions(): JournalSheet.Options;

  /**
   * The cached list of processed page entries.
   * This array is populated in the getData method.
   */
  protected _pages: JournalSheet.PageData[];

  /**
   * Get the journal entry's current view mode.
   * @see {@linkcode JournalSheet.VIEW_MODES}
   */
  get mode(): JournalSheet.ViewMode;

  /**
   * The current search mode for this journal
   */
  get searchMode(): foundry.CONST.DIRECTORY_SEARCH_MODES;

  /**
   * Toggle the search mode for this journal between "name" and "full" text search
   */
  toggleSearchMode(): void;

  /**
   * The pages that are currently scrolled into view and marked as 'active' in the sidebar.
   */
  get pagesInView(): HTMLElement[];

  /**
   * The index of the currently viewed page.
   */
  get pageIndex(): number;

  /**
   * The currently active IntersectionObserver.
   */
  get observer(): IntersectionObserver;

  /**
   * Is the table-of-contents sidebar currently collapsed?
   */
  get sidebarCollapsed(): boolean;

  /**
   * Available view modes for journal entries.
   */
  static VIEW_MODES: { SINGLE: 1; MULTIPLE: 2 };

  /**
   * The minimum amount of content that must be visible before the next page is marked as in view. Cannot be less than
   * 25% without also modifying the IntersectionObserver threshold.
   * @defaultValue `0.25`
   */
  static INTERSECTION_RATIO: number;

  /**
   * Icons for page ownership.
   */
  static OWNERSHIP_ICONS: Record<foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS, string>;

  override get title(): string;

  protected override _getHeaderButtons(): Application.HeaderButton[];

  override getData(options?: Partial<Options>): MaybePromise<GetDataReturnType<JournalSheet.Data>>;

  /**
   * Prepare pages for display.
   * @returns The sorted list of pages.
   * @privateRemarks Foundry documents this as returning `JournalEntryPage[]`, but the runtime returns each page's
   * source data decorated with display-only properties.
   */
  protected _getPageData(): JournalSheet.PageData[];

  /**
   * Identify which page of the journal sheet should be currently rendered.
   * This can be controlled by options passed into the render method or by a subclass override.
   * @param options - Sheet rendering options
   */
  protected _getCurrentPage(options?: JournalSheet.GetCurrentPageOptions): number;

  override activateListeners(html: JQuery<HTMLElement>): void;

  /**
   * Activate listeners after page content has been injected.
   */
  protected _activatePageListeners(): void;

  protected override _render(force?: boolean, options?: JournalSheet.RenderOptions<Options>): Promise<void>;

  /**
   * Update child views inside the main sheet.
   */
  protected _renderPageViews(): Promise<void>;

  /**
   * Render the page view for an app v1 page sheet.
   * @param element - The existing page element in the journal entry view.
   * @param sheet   - The page sheet.
   */
  protected _renderAppV1PageView(element: HTMLElement, sheet: Application.Any): Promise<void>;

  /**
   * Render the page view for a page sheet.
   * @param element - The existing page element in the journal entry view.
   * @param sheet   - The page sheet.
   */
  protected _renderPageView(element: HTMLElement, sheet: DocumentSheetV2.Any): Promise<void>;

  /**
   * Add headings to the table of contents for the given page node.
   * @param pageNode - The HTML node of the page's rendered contents.
   * @param toc      - The page's table of contents.
   */
  protected _renderHeadings(pageNode: HTMLElement, toc: JournalEntryPage.TOC): Promise<void>;

  /**
   * Create an intersection observer to maintain a list of pages that are in view.
   */
  protected _observePages(): void;

  /**
   * Create an intersection observer to maintain a list of headings that are in view. This is much more performant than
   * calling getBoundingClientRect on all headings whenever we want to determine this list.
   */
  protected _observeHeadings(): void;

  override close(options?: FormApplication.CloseOptions): Promise<void>;

  /**
   * Handle clicking the previous and next page buttons.
   * @param event - The button click event.
   */
  protected _onAction(event: JQuery.TriggeredEvent): void;

  /**
   * Prompt the user with a Dialog for creation of a new JournalEntryPage
   */
  createPage(): Promise<JournalEntryPage.CreateDialogReturn<JournalEntryPage.CreateDialogOptions>>;

  /**
   * Turn to the previous page.
   */
  previousPage(): void;

  /**
   * Turn to the next page.
   */
  nextPage(): void;

  /**
   * Turn to a specific page.
   * @param pageId - The ID of the page to turn to.
   * @param anchor - Optionally an anchor slug to focus within that page.
   */
  goToPage(pageId: string, anchor?: string): void;

  /**
   * Retrieve the sheet instance for rendering this page inline.
   * @param pageId - The ID of the page.
   */
  getPageSheet(pageId: string): Application.Any | DocumentSheetV2.Any;

  /**
   * Determine whether a page is visible to the current user.
   * @param page - The page.
   */
  isPageVisible(page: JournalEntryPage.Implementation): boolean;

  /**
   * Toggle the collapsed or expanded state of the Journal Entry table-of-contents sidebar.
   */
  toggleSidebar(): void;

  /**
   * Update the disabled state of the previous and next page buttons.
   */
  protected _updateButtonState(): void;

  /**
   * Edit one of this JournalEntry's JournalEntryPages.
   * @param event - The originating page edit event.
   */
  protected _onEditPage(event: JQuery.TriggeredEvent): void;

  /**
   * Handle clicking an entry in the sidebar to scroll that heading into view.
   * @param event - The originating click event.
   */
  protected _onClickPageLink(event: JQuery.TriggeredEvent): void;

  /**
   * Handle clicking an image to pop it out for fullscreen view.
   * @param event - The click event.
   */
  protected _onClickImage(event: MouseEvent): void;

  /**
   * Handle new pages scrolling into view.
   * @param entries  - An Array of elements that have scrolled into or out of view.
   * @param observer - The IntersectionObserver that invoked this callback.
   */
  protected _onPageScroll(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void;

  /**
   * Highlights the currently viewed page in the sidebar.
   */
  protected _activatePagesInView(): void;

  /**
   * If the set of active pages has changed, various elements in the sidebar will expand and collapse. For particularly
   * long ToCs, this can leave the scroll position of the sidebar in a seemingly random state. We try to do our best to
   * sync the sidebar scroll position with the current journal viewport.
   */
  protected _synchronizeSidebar(): void;

  protected override _contextMenu(html: JQuery<HTMLElement>): void;

  /**
   * Handle opening the context menu.
   * @param target - The element the context menu has been triggered for.
   */
  protected _onContextMenuOpen(target: HTMLElement): void;

  /**
   * Handle closing the context menu.
   * @param target - The element the context menu has been triggered for.
   */
  protected _onContextMenuClose(target: HTMLElement): void;

  /**
   * Get the set of ContextMenu options which should be used for JournalEntryPages in the sidebar.
   * @returns The Array of context options passed to the ContextMenu instance.
   * @remarks The menu is created with `jQuery: false`, so entries receive `HTMLElement`s.
   */
  // TODO: `ContextMenu.Entry` is still the V13 shape (`name`/`callback`/`condition`). V14 entries use
  // `label`/`onClick(event, li)`/`visible`; migrating that type belongs with `ux/context-menu.d.mts`.
  protected _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  protected override _updateObject(event: Event, formData: AnyMutableObject): Promise<unknown>;

  /**
   * Handle requests to show the referenced Journal Entry to other Users
   * Save the form before triggering the show request, in case content has changed
   * @param event - The triggering click event
   */
  _onShowPlayers(event: Event): Promise<void>;

  protected override _canDragStart(selector: string): boolean;

  protected override _canDragDrop(selector: string): boolean;

  protected override _onDragStart(event: DragEvent): void;

  protected override _onDrop(event: DragEvent): Promise<unknown>;

  protected override _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;

  #JournalSheet: true;
}

declare namespace JournalSheet {
  interface Any extends AnyJournalSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalSheet> {}

  type SheetMode = "text" | "image";

  /**
   * @see {@linkcode JournalSheet.VIEW_MODES}
   */
  type ViewMode = ValueOf<(typeof JournalSheet)["VIEW_MODES"]>;

  interface Options extends DocumentSheet.Options<JournalEntry.Implementation> {
    /** The current display mode of the journal. Either "text" or "image". */
    sheetMode?: JournalSheet.SheetMode | null;

    /**
     * A numbered index of the page to render.
     * @defaultValue `undefined`
     */
    pageIndex?: number | undefined;

    /**
     * The ID of the page to render.
     * @defaultValue `undefined`
     */
    pageId?: string | undefined;
  }

  /**
   * A page's source data, decorated by {@linkcode JournalSheet._getPageData | JournalSheet#_getPageData} with the
   * display-only properties consumed by the sheet template.
   */
  interface PageData extends JournalEntryPage.Source {
    /** CSS classes applied to the page's entry in the table of contents. */
    tocClass: string;

    /** CSS classes applied to the page itself. */
    cssClass: string;

    /** CSS classes applied to the page in view mode, including the page sheet's `viewClasses`. */
    viewClass: string;

    /** Whether the current user may edit this page. */
    editable: boolean;

    /** The page's position among the visible pages. */
    number: number;

    /** The icon representing this page's default ownership level. */
    icon: string;

    /** The lower-cased name of this page's default ownership level. */
    ownershipCls: string;
  }

  /** A labelled toggle rendered in the journal header. */
  interface ModeToggle {
    label: string;
    icon: string;
  }

  interface ViewModeToggle extends ModeToggle {
    cls: string;
  }

  interface Data extends DocumentSheet.Data<JournalSheet.Options, JournalEntry.Implementation> {
    mode: ViewMode;

    toc: PageData[];

    pages: PageData[];

    viewMode: ViewModeToggle;

    sidebarClass: string;

    collapseMode: ModeToggle;

    searchIcon: string;

    searchTooltip: string;
  }

  type RenderOptions<Options extends JournalSheet.Options = JournalSheet.Options> = Application.RenderOptions<Options> &
    InexactPartial<{
      /** Render the sheet in a given view mode, see {@linkcode JournalSheet.VIEW_MODES}. */
      mode: ViewMode;

      /** Render the sheet with the page with the given ID in view. */
      pageId: string;

      /** Render the sheet with the page at the given index in view. */
      pageIndex: number;

      /** Render the sheet with the given anchor for the given page in view. */
      anchor: string;

      /** Whether the journal entry or one of its pages is being shown to players who might otherwise not have permission to view it. */
      tempOwnership: boolean;

      /** Render the sheet with the TOC sidebar collapsed? */
      collapsed: boolean;
    }>;

  interface GetCurrentPageOptions {
    /** A numbered index of page to render */
    pageIndex?: number | undefined;

    /** The ID of a page to render */
    pageId?: string | undefined;
  }
}

declare abstract class AnyJournalSheet extends JournalSheet<JournalSheet.Options> {
  constructor(...args: never);
}

export default JournalSheet;
