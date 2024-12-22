import type { GetDataReturnType, MaybePromise } from "../../../../utils/index.d.mts";

declare global {
  /**
   * The global action bar displayed at the bottom of the game view.
   * The Hotbar is a UI element at the bottom of the screen which contains Macros as interactive buttons.
   * The Hotbar supports 5 pages of global macros which can be dragged and dropped to organize as you wish.
   *
   * Left-clicking a Macro button triggers its effect.
   * Right-clicking the button displays a context menu of Macro options.
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
    macros: Macro.ConfiguredInstance[];

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

    override getData(options?: Partial<Options>): MaybePromise<GetDataReturnType<Hotbar.HotbarData>>;

    /**
     * Whether the hotbar is locked.
     */
    get locked(): boolean;

    /**
     * Get the Array of Macro (or null) values that should be displayed on a numbered page of the bar
     * @param page -
     */
    protected _getMacrosByPage(page: number): Macro.ConfiguredInstance[];

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
     * Handle pagination controls
     * @param event - The originating click event
     */
    protected _onClickPageControl(event: JQuery.ClickEvent): void;

    protected override _canDragStart(selector: string): boolean;

    protected override _onDragStart(event: DragEvent): false | void;

    protected override _canDragDrop(selector: string): boolean;

    protected override _onDrop(event: DragEvent): void;

    /**
     * Create a Macro which rolls a RollTable when executed
     * @param table - The RollTable document
     */
    protected _createRollTableRollMacro(table: RollTable): Promise<Macro.ConfiguredInstance>;

    /**
     * Create a Macro document which can be used to toggle display of a Journal Entry.
     * @param doc - A Document which should be toggled
     * @returns A created Macro document to add to the bar
     */
    protected _createDocumentSheetToggle(doc: ClientDocument): Promise<Macro.ConfiguredInstance>;

    /**
     * Handle click events to toggle display of the macro bar
     */
    protected _onToggleBar(event: JQuery.ClickEvent): void;

    /**
     * Toggle the hotbar's lock state
     */
    protected _toggleHotBarLock(): Promise<this>;

    /**
     * Handle toggling a document sheet.
     * @param uuid - The Document UUID to display
     * @remarks Returns a ui notification number if doc could not be found
     */
    static toggleDocumentSheet(uuid: string): Promise<void> | Application | number;
  }

  namespace Hotbar {
    type Any = Hotbar<any>;

    interface HotbarData {
      page: Hotbar["page"];
      macros: Hotbar["macros"];
      barClass: "collapsed" | "";
      locked: boolean;
    }
  }
}
