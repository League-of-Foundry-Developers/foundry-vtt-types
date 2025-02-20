import type { InexactPartial } from "fvtt-types/utils";
import type ApplicationV2 from "../../client-esm/applications/api/application.d.mts";

export {};

declare global {
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
     * An identifier for a group this entry belongs to.
     * @defaultValue `_none`
     */
    group?: string | undefined;

    /**
     * The function to call when the menu item is clicked. Receives the HTML element
     * of the entry that this context menu is for.
     */
    callback: (target: JQuery) => void;

    /**
     * A function to call or boolean value to determine if this entry
     * appears in the menu.
     */
    condition?: boolean | ((target: JQuery) => boolean) | undefined;
  }

  /**
   * @param html      - The HTML element of the context menu entry.
   * @returns         whether the entry should be rendered in the context menu.
   */
  type ContextMenuCondition = (html: JQuery) => boolean;

  namespace ContextMenu {
    interface RenderOptions {
      /** The event that triggered the context menu opening. */
      event: PointerEvent;
    }
  }

  /**
   * Display a right-click activated Context Menu which provides a dropdown menu of options
   * A ContextMenu is constructed by designating a parent HTML container and a target selector
   * An Array of menuItems defines the entries of the menu which is displayed
   */
  class ContextMenu {
    /**
     * @param element   - The containing HTML element within which the menu is positioned
     * @param selector  - A CSS selector which activates the context menu.
     * @param menuItems - An Array of entries to display in the menu
     * @param eventName - Optionally override the triggering event which can spawn the menu
     *                    (default: `"contextmenu"`)
     * @param onOpen    - A function to call when the context menu is opened.
     * @param onClose   - A function to call when the context menu is closed.
     */
    constructor(
      element: JQuery,
      selector: string | null | undefined,
      menuItems: ContextMenuEntry[],
      { hookName, onOpen, onClose }?: ContextMenu.ConstructorOptions,
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
     * A function to call when the context menu is opened.
     */
    onOpen: ContextMenu.ContextMenuCallback;

    /**
     * A function to call when the context menu is closed.
     */
    onClose: ContextMenu.ContextMenuCallback;

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
     * @param options   - Additional options to configure context menu initialization.
     *                    (default: `"EntryContext"`)
     */
    static create(
      app: Application.Any | ApplicationV2.Any,
      html: JQuery | HTMLElement,
      selector: string,
      menuItems: ContextMenuEntry[],
      options?: ContextMenu.ConstructorOptions,
    ): ContextMenu;

    /**
     * Attach a ContextMenu instance to an HTML selector
     */
    bind(): void;

    /**
     * Closes the menu and removes it from the DOM.
     * @param options - Options to configure the closing behavior.
     */
    close(options?: ContextMenu.CloseOptions): Promise<void>;

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
     * @param target        - The target element to which the context menu is attached
     * @param options       - (default: `{}`)
     */
    render(target: JQuery, options?: InexactPartial<ContextMenu.RenderOptions>): void | Promise<JQuery | void>;

    /**
     * Set the position of the context menu, taking into consideration whether the menu should expand upward or downward
     * @param html            - The context menu element.
     * @param target          - The element that the context menu was spawned on.
     * @param options         - (default: `{}`)
     */
    protected _setPosition(html: JQuery, target: JQuery, options?: InexactPartial<ContextMenu.RenderOptions>): void;

    /**
     * Local listeners which apply to each ContextMenu instance which is created.
     * @param html - The ContextMenu
     */
    activateListeners(html: JQuery): void;

    /**
     * Global listeners which apply once only to the document.
     */
    static eventListeners(): void;
  }

  namespace ContextMenu {
    interface CloseOptions {
      /**
       * Animate the context menu closing.
       * @defaultValue `true`
       */
      animate?: boolean;
    }

    type ContextMenuCallback =
      /**
       * @param target - The element that the context menu has been triggered for.
       */
      (target: HTMLElement) => void;

    interface ConstructorOptions {
      /**
       * The name of the hook to call
       * @defaultValue `EntryContext`
       */
      hookName?: string;

      /**
       * A function to call when the context menu is opened.
       */
      onOpen?: ContextMenuCallback;

      /**
       * A function to call when the context menu is closed.
       */
      onClose?: ContextMenuCallback;
    }
  }
}
