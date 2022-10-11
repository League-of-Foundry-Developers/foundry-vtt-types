import type { ConfiguredDocumentClass } from "../../../../types/helperTypes";

declare global {
  /**
   * The Application responsible for displaying and editing a single JournalEntry document.
   * @typeParam ConcreteOptions - the type of the options object
   */
  class JournalSheet<ConcreteOptions extends JournalSheet.Options = JournalSheet.Options> extends DocumentSheet<
    ConcreteOptions,
    ConcreteJournalEntry
  > {
    /**
     * @param object  - The JournalEntry instance which is being edited
     * @param options - Application options
     */
    constructor(object: ConcreteJournalEntry, options?: Partial<ConcreteOptions>);

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
     *   dragDrop: [{dragSelector: ".directory-item, .heading-link", dropSelector: ".directory-list"}]
     * });
     * ```
     */
    static override get defaultOptions(): JournalSheet.Options;

    /**
     * Get the journal entry's current view mode.
     * @see {@link JournalSheet.VIEW_MODES}
     */
    get mode(): ValueOf<typeof JournalSheet.VIEW_MODES>;

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
    static VIEW_MODES: {
      SINGLE: 1;
      MULTIPLE: 2;
    };

    /* -------------------------------------------- */

    /**
     * The minimum amount of content that must be visible before the next page is marked as in view. Cannot be less than
     * 25% without also modifying the IntersectionObserver threshold.
     */
    static INTERSECTION_RATIO: 0.25;

    /* -------------------------------------------- */

    /**
     * Icons for page ownership.
     */
    static OWNERSHIP_ICONS: {
      [CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE]: "fa-solid fa-eye-slash";
      [CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER]: "fa-solid fa-eye";
      [CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER]: "fa-solid fa-feather-pointed";
    };

    get title(): DocumentSheet["title"];

    protected override _getHeaderButtons(): Application.HeaderButton[];

    override getData(options?: Partial<ConcreteOptions>): MaybePromise<object>;

    /**
     * Prepare pages for display.
     * @returns The sorted list of pages.
     */
    protected _getPageData(): JournalEntryPage[];

    activateListeners(html: JQuery<HTMLElement>): void;

    /**
     * Activate listeners after page content has been injected.
     */
    protected _activatePageListeners(): void;

    protected override _render(force?: boolean, options?: JournalSheet.RenderOptions<ConcreteOptions>): Promise<void>;

    /**
     * Update child views inside the main sheet.
     */
    protected _renderPageViews(): Promise<void>;

    /**
     * Add headings to the table of contents for the given page node.
     * @param pageNode - The HTML node of the page's rendered contents.
     * @param toc      - The page's table of contents.
     */
    protected _renderHeadings(pageNode: HTMLElement, toc: Record<string, JournalEntryPage.Heading>): Promise<void>;

    /**
     * Create an intersection observer to maintain a list of headings that are in view. This is much more performant than calling getBoundingClientRect on all headings whenever we want to determine this list.
     */
    protected _observeHeadings(): void;

    close(options?: FormApplication.CloseOptions | undefined): Promise<void>;

    _onAction(
      event: JQuery.TriggeredEvent
    ): ReturnType<
      | typeof this.previousPage
      | typeof this.nextPage
      | typeof this.createPage
      | typeof this.render
      | typeof this.toggleSidebar
    >;

    /**
     * Prompt the user with a Dialog for creation of a new JournalEntryPage
     */
    createPage(): ReturnType<typeof JournalEntryPage.createDialog>;

    /**
     * Turn to the previous page.
     */
    previousPage(): void | undefined | ReturnType<this["render"]>;

    /**
     * Turn to the next page.
     */
    nextPage(): void | undefined | ReturnType<this["render"]>;

    /**
     * Turn to a specific page.
     * @param pageId - The ID of the page to turn to.
     * @param anchor - Optionally an anchor slug to focus within that page.
     */
    goToPage(pageId: string, anchor?: string | undefined): void | undefined | ReturnType<this["render"]>;

    /**
     * Retrieve the sheet instance for rendering this page inline.
     * @param pageId - The ID of the page.
     */
    getPageSheet(pageId: string): JournalPageSheet;

    /**
     * Determine whether a page is visible to the current user.
     * @param page - The page.
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
     * Edit one of this JournalEntry's JournalEntryPages.
     * @param event - The originating page edit event.
     */
    protected _onEditPage(event: JQuery.TriggeredEvent): ReturnType<JournalPageSheet["render"]>;

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

    protected _contextMenu(html: JQuery): void;

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

    protected override _updateObject(
      event: Event,
      formData: JournalSheet.FormData
    ): ReturnType<DocumentSheet["_updateObject"]>;

    /**
     * Handle requests to show the referenced Journal Entry to other Users
     * Save the form before triggering the show request, in case content has changed
     * @param event - The triggering click event
     */
    _onShowPlayers(event: Event): ReturnType<typeof Journal["showDialog"]>;

    protected _canDragStart(selector: string): boolean;

    protected _canDragDrop(selector: string): boolean;

    protected _onDragStart(event: DragEvent): void;

    protected _onDrop(event: DragEvent): void;

    protected _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;
  }

  namespace JournalSheet {
    type RenderOptions<ConcreteOptions extends JournalSheet.Options = JournalSheet.Options> =
      Application.RenderOptions<ConcreteOptions> & {
        /**
         * Render the sheet in a given view mode, see {@link JournalSheet.VIEW_MODES}.
         */
        mode?: ValueOf<typeof JournalSheet.VIEW_MODES> | undefined;
        /**
         * Render the sheet with the page with the given ID in view.
         */
        pageId?: string | undefined;
        /**
         * Render the sheet with the page at the given index in view.
         */
        pageIndex?: number | undefined;
        /**
         * Render the sheet with the given anchor for the given page in view.
         */
        anchor?: string | undefined;
        /**
         * Whether the journal entry or one of its pages is being shown to players who might otherwise not have permission to view it.
         */
        tempOwnership?: boolean | undefined;
        /**
         * Render the sheet with the TOC sidebar collapsed?
         */
        collapsed?: boolean | undefined;
      };

    type Options = DocumentSheetOptions;

    // `sheetMode` intentionally omitted: it is declared in FVTT's source, but not actually used by anything (and its functionality is totally subsumed by v10's JournalPageSheet).

    interface FormData {
      content: string;
      folder: string;
      name: string;
    }
  }
}

type ConcreteJournalEntry = InstanceType<ConfiguredDocumentClass<typeof JournalEntry>>;
