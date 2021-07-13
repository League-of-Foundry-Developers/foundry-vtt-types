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
   *                    (default: `'contextmenu'`)
   */
  constructor(
    element: JQuery,
    selector: string | null | undefined,
    menuItems: ContextMenu.Item[],
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
  menuItems: ContextMenu.Item[];

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
   * Attach a ContextMenu instance to an HTML selector
   */
  bind(): void;

  /**
   * Animate closing the menu by sliding up and removing from the DOM
   */
  close(): Promise<void>;

  protected _animateOpen(menu: JQuery): Promise<void>;

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
  interface Item {
    /**
     * The displayed item name
     */
    name: string;

    /**
     * An icon glyph HTML string
     */
    icon: string;

    /**
     * A function which returns a Boolean for whether or not to display the item
     */
    condition?: boolean | ((target: JQuery) => boolean);

    /**
     * A callback function to trigger when the entry of the menu is clicked
     */
    callback: (target: JQuery) => void;
  }
}
