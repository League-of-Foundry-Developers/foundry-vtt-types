import type { MaybePromise, InexactPartial } from "fvtt-types/utils";

declare global {
  interface JournalSheetOptions extends DocumentSheetOptions<JournalEntry.ConfiguredInstance> {
    /** The current display mode of the journal. Either "text" or "image". */
    sheetMode?: JournalSheet.SheetMode | null;
  }

  /**
   * The Application responsible for displaying and editing a single JournalEntry document.
   * @typeParam Options - the type of the options object
   */
  class JournalSheet<Options extends JournalSheetOptions = JournalSheetOptions> extends DocumentSheet<
    Options,
    JournalEntry.ConfiguredInstance
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
    static override get defaultOptions(): JournalSheetOptions;

    /**
     * The cached list of processed page entries.
     * This array is populated in the getData method.
     */
    _pages: JournalEntryPage.ConfiguredInstance[];

    /**
     * Get the journal entry's current view mode.
     */
    get mode(): (typeof JournalSheet)["VIEW_MODES"] | null;

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

    override getData(options?: Partial<Options>): MaybePromise<object>; // TODO: implement GetDataReturnType

    /**
     * Prepare pages for display.
     * @returns The sorted list of pages.
     */
    protected _getPageData(): JournalEntryPage.ConfiguredInstance[];

    /**
     * Identify which page of the journal sheet should be currently rendered.
     * This can be controlled by options passed into the render method or by a subclass override.
     * @param options - Sheet rendering options
     */
    protected _getCurrentPage(
      options?: InexactPartial<{
        /** A numbered index of page to render */
        pageIndex: number;

        /** The ID of a page to render */
        pageId: string;
      }>,
    ): number;

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
     * Add headings to the table of contents for the given page node.
     * @param pageNode - The HTML node of the page's rendered contents.
     * @param toc      - The page's table of contents.
     */
    protected _renderHeadings(
      pageNode: HTMLElement,
      toc: Record<string, JournalEntryPage.JournalEntryPageHeading>,
    ): void;

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
    createPage(): Promise<JournalEntryPage.ConfiguredInstance>;

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
    getPageSheet(pageId: string): JournalPageSheet; // Should probably be configured sheet class?

    /**
     * Determine whether a page is visible to the current user.
     * @param page - The Page
     */
    isPageVisible(page: JournalEntryPage): boolean;

    /**
     * Toggle the collapsed or expanded state of the Journal Entry table-of-contents sidebar.
     */
    toggleSidebar(): void;

    /**
     * Update the disabled state of the previous and next page buttons.
     */
    protected _updateButtonState(): void;

    /**
     *  Edit one of this JournalEntry's JournalEntryPages.
     * @param event - The originating page edit event
     */
    protected _onEditPage(event: JQuery.TriggeredEvent): void;

    /**
     * Handle clicking an entry in the sidebar to scroll that heading into view.
     * @param event - The originating click event
     */
    protected _onClickPageLink(event: JQuery.TriggeredEvent): void;

    /**
     * Handle clicking an image to pop it out for fullscreen view.
     * @param event - The click event
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

    protected _contextMenu(html: JQuery<HTMLElement>): void;

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
     */
    protected _getEntryContextOptions(): ContextMenuEntry[];

    protected override _updateObject(event: Event, formData: JournalSheet.FormData): Promise<unknown>;

    /**
     * Handle requests to show the referenced Journal Entry to other Users
     * Save the form before triggering the show request, in case content has changed
     * @param event - The triggering click event
     * @internal
     */
    protected _onShowPlayers(event: Event): Promise<void>;

    protected _canDragStart(selector: string): boolean;

    protected _canDragDrop(selector: string): boolean;

    protected _onDragStart(event: DragEvent): void;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    protected _onDrop(event: DragEvent): Promise<void>;

    protected _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;
  }

  namespace JournalSheet {
    type Any = JournalSheet<any>;

    type SheetMode = "text" | "image";

    type RenderOptions<Options extends JournalSheetOptions = JournalSheetOptions> = Application.RenderOptions<Options> &
      InexactPartial<{
        /** Render the sheet in a given view mode, see {@link JournalSheet.VIEW_MODES}. */
        mode: number;
        /** Render the sheet with the page with the given ID in view. */
        pageId: string;
        /** Render the sheet with the page at the given index in view. */
        pageIndex: number;
        /** Render the sheet with the given anchor for the given page in view. */
        anchor: string;
        /** Whether the journal entry or one of its pages is being shown to players who might otherwise not have permission to view it. */
        tempOwnership: boolean;
        /** Render the sheet with the TOC sidebar collapsed? */
        collapsed?: boolean;
      }>;

    interface FormData {
      content: string;
      folder: string;
      name: string;
    }
  }
}
