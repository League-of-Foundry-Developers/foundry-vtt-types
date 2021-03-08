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
 */

declare class Hotbar extends Application {
  constructor(options: Application.Options);

  /**
   * The currently viewed macro page
   * @defaultValue `1`
   */
  page: number;

  /**
   * The currently displayed set of macros
   * @defaultValue `[]`
   */
  macros: Macro[];

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
   * @override
   * @defaultValue
   * ```
   * mergeObject(super.defaultOptions, {
   *   id: "hotbar",
   *   template: "templates/hud/hotbar.html",
   *   popOut: false,
   *   dragDrop: [{ dragSelector: ".macro-icon", dropSelector: "#macro-list" }]
   * })
   * ```
   */
  static get defaultOptions(): Application.Options;

  /** @override */
  getData(options?: Application.RenderOptions): { page: number; macros: Macro[]; barClass: 'collapsed' | '' };

  /**
   * Get the Array of Macro (or null) values that should be displayed on a numbered page of the bar
   * @param page -
   */
  protected _getMacrosByPage(page: number): Macro[];

  /**
   * Collapse the Hotbar, minimizing its display.
   * @returns A promise which resolves once the collapse animation completes
   */
  collapse(): Promise<boolean>;

  /**
   * Expand the Hotbar, displaying it normally.
   * @returns A promise which resolves once the expand animation completes
   */
  expand(): Promise<boolean> | boolean;

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
  cyclePage(direction: number): void;

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * Create a Context Menu attached to each Macro button
   * @param html -
   */
  protected _contextMenu(html: JQuery): void;

  /**
   * Handle left-click events to
   * @param event -
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

  /** @override */
  protected _canDragStart(selector: string | null): boolean;

  /** @override */
  protected _canDragDrop(selector: string | null): boolean;

  /** @override */
  protected _onDrop(event: DragEvent): void;

  /**
   * Get the Macro entity being dropped in the Hotbar. If the data comes from a non-World source, create the Macro
   * @param data - The data transfer attached to the DragEvent
   * @returns A Promise which returns the dropped Macro, or null
   */
  protected _getDropMacro(data: { type: string; id: string; slot: number }): Promise<Macro | null>;

  /**
   * Handle click events to toggle display of the macro bar
   * @param event -
   */
  protected _onToggleBar(event: JQuery.ClickEvent): void;
}
