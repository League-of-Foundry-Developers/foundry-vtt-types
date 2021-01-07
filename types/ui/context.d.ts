declare interface ContextMenuOption {
  callback: (header: any) => {}
  condition: boolean | ((header: any) => boolean)
  icon: string
  name: string
}

/**
 * Display a right-click activated Context Menu which provides a dropdown menu of options
 * A ContextMenu is constructed by designating a parent HTML container and a target selector
 * An Array of menuItems defines the entries of the menu which is displayed
 *
 * @param element - The containing HTML element within which the menu is positioned
 * @param selector - A CSS selector which activates the context menu.
 * @param menuItems - An Array of entries to display in the menu
 * @param eventName - Optionally override the triggering event which can spawn the menu
 * @param menuItem - Menu items in the array can have the following properties
 * @param name - The displayed item name
 * @param icon - An icon glyph HTML string
 * @param condition - A function which returns a Boolean for whether or not to display the item
 * @param callback - A callback function to trigger when the entry of the menu is clicked
 */
declare class ContextMenu {
  /**
   * The target HTMLElement being selected
   */
  element: HTMLElement

  /**
   * An interaction event name which activates the menu
   */
  eventName: string

  /**
   * The array of menu items being rendered
   */
  menuItems: any[]

  /**
   * The target CSS selector which activates the menu
   */
  selector: string

  /**
   * Track which direction the menu is expanded in
   */
  protected _expandUp: boolean

  constructor (
    element: HTMLElement | JQuery,
    selector: string,
    menuItems: any[],
    options?: { eventName?: string }
  );

  /**
   * A convenience accessor to the context menu HTML object
   */
  get menu (): any;

  /**
   * Attach a ContextMenu instance to an HTML selector
   */
  bind (): void;

  /**
   * Animate closing the menu by sliding up and removing from the DOM
   */
  close (): Promise<void>;

  /**
   * Render the Context Menu by iterating over the menuItems it contains
   * Check the visibility of each menu item, and only render ones which are allowed by the item's logical condition
   * Attach a click handler to each item which is rendered
   */
  render (target: any): Promise<any>;

  protected _animateClose (menu: JQuery): Promise<any>;

  protected _animateOpen (menu: JQuery): Promise<any>;
}
