interface ContextMenuEntry {
  /**
   * The context menu label. Can be localized.
   */
  name: string;

  /**
   * A string containing an HTML icon element for the menu item
   */
  icon: string;

  /**
   * The function to call when the menu item is clicked. Receives the HTML element of the SidebarTab entry that this context menu is for.
   */
  callback: (target: JQuery) => void;

  /**
   * A function to call to determine if this item appears in the menu. Receives the HTML element of the SidebarTab entry that this context menu is for.
   */
  condition?: boolean | ((target: JQuery) => boolean);
}

/**
 * Display a right-click activated Context Menu which provides a dropdown menu of options
 * A ContextMenu is constructed by designating a parent HTML container and a target selector
 * An Array of menuItems defines the entries of the menu which is displayed
 */
declare class ContextMenu {
  /**
   * @param element   - The containing HTML element within which the menu is positioned
   * @param selector  - A CSS selector which activates the context menu.
   * @param menuItems - An Array of entries to display in the menu
   * @param eventName - Optionally override the triggering event which can spawn the menu
   *                    (default: `"contextmenu"`)
   */
  constructor(
    element: JQuery,
    selector: string | null | undefined,
    menuItems: ContextMenuEntry[],
    { eventName }?: { eventName?: string }
  );

  /**
   * The target HTMLElement being selected
   */
  element: JQuery;

  /**
   * The target CSS selector which activates the menu
   * @defaultValue `element.attr("id")`
   */
  selector: string;

  /**
   * An interaction event name which activates the menu
   */
  eventName: string;

  /**
   * The array of menu items being rendered
   */
  menuItems: ContextMenuEntry[];

  /**
   * Track which direction the menu is expanded in
   * @defaultValue `false`
   */
  protected _expandUp: boolean;

  /**
   * A convenience accessor to the context menu HTML object
   */
  get menu(): JQuery;

  /**
   * Create a ContextMenu for this Application and dispatch hooks.
   * @param app       - The Application this ContextMenu belongs to.
   * @param html      - The Application's rendered HTML.
   * @param selector  - The target CSS selector which activates the menu.
   * @param menuItems - The array of menu items being rendered.
   * @param hookName  - The name of the hook to call.
   *                    (default: `"EntryContext"`)
   */
  static create(
    app: Application,
    html: JQuery,
    selector: string,
    menuItems: ContextMenuEntry[],
    hookName?: string
  ): ContextMenu;

  /**
   * Attach a ContextMenu instance to an HTML selector
   */
  bind(): void;

  /**
   * Closes the menu and removes it from the DOM.
   * @param options - Options to configure the closing behavior.
   */
  close(options?: ContextMenu.CloseOptions | undefined): Promise<void>;

  /** @internal */
  protected _close(): void;

  /** @internal */
  protected _animateOpen(menu: JQuery): Promise<void>;

  /** @internal */
  protected _animateClose(menu: JQuery): Promise<void>;

  /**
   * Render the Context Menu by iterating over the menuItems it contains
   * Check the visibility of each menu item, and only render ones which are allowed by the item's logical condition
   * Attach a click handler to each item which is rendered
   * @param target - The target element to which the context menu is attached
   */
  render(target: JQuery): void | Promise<void>;

  /**
   * Set the position of the context menu, taking into consideration whether the menu should expand upward or downward
   */
  protected _setPosition(html: JQuery, target: JQuery): void;

  static eventListeners(): void;
}

declare namespace ContextMenu {
  interface CloseOptions {
    /**
     * Animate the context menu closing.
     * @defaultValue `true`
     */
    animate?: boolean;
  }
}
