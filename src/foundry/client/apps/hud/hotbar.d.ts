import { ConfiguredDocumentClass } from "../../../../types/helperTypes";

declare global {
  /**
   * The global action bar displayed at the bottom of the game view.
   * The Hotbar is a UI element at the bottom of the screen which contains Macros as interactive buttons.
   * The Hotbar supports 5 pages of global macros which can be dragged and dropped to organize as you wish.
   *
   * Left clicking a Macro button triggers its effect.
   * Right clicking the button displays a context menu of Macro options.
   * The number keys 1 through 0 activate numbered hotbar slots.
   * Pressing the delete key while hovering over a Macro will remove it from the bar.
   *
   * @see {@link Macros}
   * @see {@link Macro}
   *
   * @typeParam Options - the type of the options object
   */
  class Hotbar<Options extends ApplicationOptions = ApplicationOptions> extends Application<Options> {
    constructor(options?: Partial<Options>);

    /**
     * The currently viewed macro page
     * @defaultValue `1`
     */
    page: number;

    /**
     * The currently displayed set of macros
     * @defaultValue `[]`
     */
    macros: InstanceType<ConfiguredDocumentClass<typeof Macro>>[];

    /**
     * Track collapsed state
     * @defaultValue `false`
     */
    protected _collapsed: boolean;

    /**
     * Track which hotbar slot is the current hover target, if any
     * @defaultValue `null`
     */
    protected _hover: number | null;

    /**
     * @defaultValue
     * ```typescript
     * mergeObject(super.defaultOptions, {
     *   id: "hotbar",
     *   template: "templates/hud/hotbar.html",
     *   popOut: false,
     *   dragDrop: [{ dragSelector: ".macro-icon", dropSelector: "#macro-list" }]
     * })
     * ```
     */
    static override get defaultOptions(): ApplicationOptions;

    override getData(options?: Partial<Options>): MaybePromise<object>;

    /**
     * Get the Array of Macro (or null) values that should be displayed on a numbered page of the bar
     * @param page -
     */
    protected _getMacrosByPage(page: number): InstanceType<ConfiguredDocumentClass<typeof Macro>>[];

    /**
     * Collapse the Hotbar, minimizing its display.
     * @returns A promise which resolves once the collapse animation completes
     */
    collapse(): Promise<boolean>;

    /**
     * Expand the Hotbar, displaying it normally.
     * @returns A promise which resolves once the expand animation completes
     */
    expand(): Promise<boolean>;

    /**
     * Change to a specific numbered page from 1 to 5
     * @param page - The page number to change to.
     *               (default: `1` )
     */
    changePage(page?: number): void;

    /**
     * Change the page of the hotbar by cycling up (positive) or down (negative)
     * @param direction - The direction to cycle
     */
    cyclePage(direction?: number): void;

    override activateListeners(html: JQuery): void;

    protected override _contextMenu(html: JQuery): void;

    /**
     * Get the Macro entry context options
     * @returns The Macro entry context options
     * @internal
     */
    protected _getEntryContextOptions(): ContextMenuEntry[];

    /**
     * Handle left-click events to
     * @param event - The originating click event
     */
    protected _onClickMacro(event: JQuery.ClickEvent): Promise<void>;

    /**
     * Handle hover events on a macro button to track which slot is the hover target
     * @param event - The originating mouseover or mouseleave event
     */
    protected _onHoverMacro(event: JQuery.MouseEnterEvent | JQuery.MouseLeaveEvent): void;

    /**
     * Handle pagination controls
     * @param event - The originating click event
     */
    protected _onClickPageControl(event: JQuery.ClickEvent): void;

    protected override _canDragStart(selector: string): boolean;

    protected override _onDragStart(event: DragEvent): false | void;

    protected override _canDragDrop(selector: string): boolean;

    protected override _onDrop(event: DragEvent): void;

    /**
     * Handle click events to toggle display of the macro bar
     * @param event -
     */
    protected _onToggleBar(event: JQuery.ClickEvent): void;
  }
}
