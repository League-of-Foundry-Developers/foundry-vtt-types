import { ProseMirrorDropDown as ProseMirrorDropDownMenu } from "./menu.mjs";

export namespace ProseMirrorDropDown {
  export interface Options {
    /** The menu CSS class name. Required if providing an action. */
    cssClass?: string;
    /** A callback to fire when a menu item is clicked. */
    onAction?: (event: MouseEvent) => void;
  }
}

export default class ProseMirrorDropDown {
  /**
   * A class responsible for rendering a menu drop-down.
   * @param title - The default title.
   * @param items - The configured menu items.
   */
  constructor(title: string, items: ProseMirrorDropDownMenu.Entry[], options?: ProseMirrorDropDown.Options);

  /**
   * The default title for this drop-down.
   */
  readonly title: string;

  /**
   * The items configured for this drop-down.
   */
  readonly items: ProseMirrorDropDownMenu.Entry[];

  /**
   * Attach event listeners.
   * @param html - The root menu element.
   */
  activateListeners(html: HTMLMenuElement): void;

  /**
   * Construct the drop-down menu's HTML.
   * @returns HTML contents as a string.
   */
  render(): string;

  /**
   * Recurse through the menu structure and apply a function to each item in it.
   * @param fn - The function to call on each item. Return false to prevent iterating over any further items.
   */
  forEachItem(fn: (entry: ProseMirrorDropDownMenu.Entry) => boolean): void;

  /**
   * Render a list of drop-down menu items.
   * @param entries - The menu items.
   * @returns HTML contents as a string.
   */
  protected static _renderMenu(entries: ProseMirrorDropDownMenu.Entry[]): string;

  /**
   * Render an individual drop-down menu item.
   * @param item - The menu item.
   * @returns HTML contents as a string.
   */
  protected static _renderMenuItem(item: ProseMirrorDropDownMenu.Entry): string;
}
