import type { InexactPartial } from "#utils";
import type ProseMirrorMenu from "./menu.d.mts";

declare class ProseMirrorDropDown {
  /**
   * A class responsible for rendering a menu drop-down.
   * @param title - The default title.
   * @param items - The configured menu items.
   */
  constructor(title: string, items: ProseMirrorDropDown.Entry[], options?: ProseMirrorDropDown.ConstructionOptions);

  /**
   * The default title for this drop-down.
   * @remarks `defineProperty`'d in construction, explicitly `writable: false`
   */
  readonly title: string;

  /**
   * The items configured for this drop-down.
   * @remarks `defineProperty`'d in construction, explicitly `writable: false`
   */
  readonly items: ProseMirrorDropDown.Entry[];

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
  forEachItem(/** @immediate */ fn: (entry: ProseMirrorDropDown.Entry) => boolean): void;

  /**
   * Render a list of drop-down menu items.
   * @param entries - The menu items.
   * @returns HTML contents as a string.
   */
  protected static _renderMenu(entries: ProseMirrorDropDown.Entry[]): string;

  /**
   * Render an individual drop-down menu item.
   * @param item - The menu item.
   * @returns HTML contents as a string.
   */
  protected static _renderMenuItem(item: ProseMirrorDropDown.Entry): string;

  #ProseMirrorDropDown: true;
}

declare namespace ProseMirrorDropDown {
  /** @internal */
  type _ConstructionOptions = InexactPartial<{
    /** The menu CSS class name. Required if providing an action. */
    cssClass: string;

    /** Use an icon for the dropdown rather than a text label. */
    icon: string;

    /** A callback to fire when a menu item is clicked. */
    onAction: (event: MouseEvent) => void;
  }>;

  interface ConstructionOptions extends _ConstructionOptions {}

  interface Entry extends ProseMirrorMenu.Item {
    /** Any child entries. */
    children?: Entry[];
  }

  interface Config {
    /** The default title of the drop-down. */
    title: string;

    /** The menu CSS class. */
    cssClass: string;

    /**
     * An optional icon to use instead of a text label.
     * @remarks Takes the form of an HTML string, e.g `'<i class="fa-solid fa-table fa-fw"></i>'`
     */
    icon?: string;

    /** The drop-down entries. */
    entries: Entry[];
  }
}

export default ProseMirrorDropDown;
