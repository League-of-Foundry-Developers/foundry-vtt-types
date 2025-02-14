import type ApplicationV2 from "../api/application.d.mts";

/**
 * Display a right-click activated Context Menu which provides a dropdown menu of options.
 * A ContextMenu is constructed by designating a parent HTML container and a target selector.
 * An Array of menuItems defines the entries of the menu which is displayed.
 */
declare class ContextMenu<Element extends JQuery | HTMLElement, Fixed extends boolean = false> {
  /**
   * @param element   - The containing HTML element within which the menu is positioned
   * @param selector  - A CSS selector which activates the context menu.
   * @param menuItems - An Array of entries to display in the menu
   * @param options   - Additional options to configure the context menu.
   */
  constructor(
    element: Element,
    selector: string | null | undefined,
    menuItems: ContextMenu.Entry<Element>[],
    options?: ContextMenu.ConstructorOptions<Element, Fixed>,
  );

  /**
   * Create a ContextMenu for this Application and dispatch hooks.
   * @param app       - The Application this ContextMenu belongs to.
   * @param html      - The Application's rendered HTML.
   * @param selector  - The target CSS selector which activates the menu.
   * @param menuItems - The array of menu items being rendered.
   * @param options   - Additional options to configure context menu initialization.
   *                    (default: `"EntryContext"`)
   */
  static create<Element extends JQuery | HTMLElement, Fixed extends boolean = false>(
    app: Application.Any,
    html: Element,
    selector: string,
    menuItems: ContextMenu.Entry<Element>[],
    options?: ContextMenu.ConstructorOptions<Element, Fixed>,
  ): ContextMenu<Element, Fixed>;
  /**
   * @deprecated - `ContextMenu.create` no longer accepts the menuItems argument for ApplicationV2 applications.
   * Instead it calls the `_get${hookName}Options` function, which defaults to `_getEntryContextOptions`
   */
  static create<Element extends JQuery | HTMLElement, Fixed extends boolean = false>(
    app: ApplicationV2.Any,
    html: Element,
    selector: string,
    menuItems: ContextMenu.Entry<Element>[],
    options?: ContextMenu.ConstructorOptions<Element, Fixed>,
  ): ContextMenu<Element, Fixed>;
  static create<Element extends JQuery | HTMLElement, Fixed extends boolean = false>(
    app: ApplicationV2.Any,
    html: Element,
    selector: string,
    options?: ContextMenu.ConstructorOptions<Element, Fixed>,
  ): ContextMenu<Element, Fixed>;

  /**
   * The menu element.
   */
  get element(): HTMLElement;

  /**
   * A CSS selector to identify context menu targets.
   */
  get selector(): string;

  /**
   * The event name to listen for.
   */
  get eventName(): string;

  /**
   * The array of menu items to render.
   */
  menuItems: ContextMenu.Entry<Element>[];

  /**
   * A function to call when the context menu is opened.
   */
  onOpen: ContextMenu.ContextMenuCallback | null | undefined;

  /**
   * A function to call when the context menu is closed.
   */
  onClose: ContextMenu.ContextMenuCallback | null | undefined;

  /**
   * Check which direction the menu is expanded in.
   * @defaultValue `false`
   */
  get expandUp(): boolean;

  /**
   * Whether to position the context menu as a fixed element, or inject it into the target.
   */
  get fixed(): Fixed;

  /**
   * The parent HTML element to which the context menu is attached
   */
  get target(): HTMLElement;

  /**
   * Animate the context menu's height when opening or closing.
   * @param open - Whether the menu is opening or closing.
   * @returns A Promise that resolves when the animation completes.
   */
  protected _animate(open?: boolean): Promise<void>;

  /**
   * Closes the menu and removes it from the DOM.
   * @param options - Options to configure the closing behavior.
   */
  close(options?: ContextMenu.CloseOptions): Promise<void>;

  /**
   * Close the menu and remove it from the DOM.
   */
  protected _close(): void;

  /**
   * Called before the context menu begins rendering.
   * @param target - The context target
   * @param options - (default: `{}`)
   */
  protected _preRender(target: HTMLElement, options?: ContextMenu.RenderOptions): Promise<void>;

  /**
   * Render the Context Menu by iterating over the menuItems it contains
   * Check the visibility of each menu item, and only render ones which are allowed by the item's logical condition
   * Attach a click handler to each item which is rendered
   * @param target  - The target element to which the context menu is attached
   * @param options - (default: `{}`)
   */
  render(target: HTMLElement, options?: ContextMenu.RenderOptions): void | Promise<JQuery | void>;

  /**
   * Called after the context menu has finished rendering and animating open.
   * @param options - (default: `{}`)
   */
  protected _onRender(options?: ContextMenu.RenderOptions): Promise<void>;

  /**
   * Set the position of the context menu, taking into consideration whether the menu should expand upward or downward
   * @param html    - The context menu element.
   * @param target  - The element that the context menu was spawned on.
   * @param options - (default: `{}`)
   */
  protected _setPosition(html: HTMLElement, target: HTMLElement, options?: ContextMenu.RenderOptions): void;

  /**
   * Inject the menu inside the target.
   * @param menu   - The menu element.
   * @param target - The context target.
   */
  protected _injectMenu(menu: HTMLElement, target: HTMLElement): void;

  /**
   * Set the context menu at a fixed position in the viewport.
   * @param html    - The menu element.
   * @param target  - The context target.
   * @param options - (default: `{}`)
   */
  protected _setFixedPosition(menu: HTMLElement, target: HTMLElement, options?: ContextMenu.RenderOptions): void;

  /**
   * Local listeners which apply to each ContextMenu instance which is created.
   * @param html - The context menu element.
   */
  activateListeners(html: HTMLElement): void;

  /**
   * Handle context menu activation.
   * @param event - The triggering event.
   */
  protected _onActivate(event: PointerEvent): Promise<void>;

  /**
   * Global listeners which apply once only to the document.
   */
  static eventListeners(): void;

  /**
   * @deprecated since v13 until v15
   * @remarks "ContextMenu#menu is deprecated. Please use ContextMenu#element instead."
   */
  get menu(): JQuery;

  /**
   * @deprecated since v13 until v15
   * @remarks ""ContextMenu#_expandUp is deprecated. Please use ContextMenu#expandUp instead."
   */
  get _expandUp(): boolean;

  #private: true;
}

declare namespace ContextMenu {
  interface Entry<Element extends JQuery | HTMLElement> {
    /**
     * The context menu label. Can be localized.
     */
    name: string;

    /**
     * A string containing an HTML icon element for the menu item
     */
    icon?: string;

    /**
     * An identifier for a group this entry belongs to.
     * @defaultValue `_none`
     */
    group?: string | null | undefined;

    /**
     * The element that the context menu has been triggered for. Will
     * either be a jQuery object or an HTMLElement instance, depending
     * on how the ContextMenu was configured.
     */
    callback: (target: Element) => void;

    /**
     * A function to call or boolean value to determine if this entry
     * appears in the menu.
     * @remarks `null` equivalent to `false`
     */
    condition?: boolean | Condition<Element> | null | undefined;
  }

  /**
   * @param html - The element of the context menu entry.
   * @returns Whether the entry should be rendered in the context menu.
   * @remarks `null` equivalent to `false`
   */
  type Condition<Element extends JQuery | HTMLElement> = (target: Element) => boolean | null;

  interface RenderOptions {
    /**
     * The event that triggered the context menu opening.
     */
    event?: PointerEvent | undefined | null;

    /**
     * Animate the context menu opening
     * @defaultValue `true`
     * @remarks No null because an explicit check for `options.animate !== false` would treat null as truthy
     */
    animate?: boolean | undefined;
  }

  interface CloseOptions {
    /**
     * Animate the context menu closing.
     * @defaultValue `true`
     * @remarks `null` equivalent to `false`
     */
    animate?: boolean | null;
  }

  type ContextMenuCallback =
    /**
     * @param target - The element that the context menu has been triggered for.
     */
    (target: HTMLElement) => void;

  interface ConstructorOptions<Element extends JQuery | HTMLElement, Fixed> {
    /**
     * The name of the hook to call
     * @defaultValue `EntryContext`
     */
    hookName?: string;

    /**
     * A function to call when the context menu is opened.
     */
    onOpen?: ContextMenuCallback | null | undefined;

    /**
     * A function to call when the context menu is closed.
     */
    onClose?: ContextMenuCallback | null | undefined;

    /**
     * If true, callbacks will be passed jQuery objects instead of HTMLElement instances
     * @defaultValue `true`
     */
    jQuery?: (Element extends JQuery ? true : never) | (Element extends HTMLElement ? false : never);

    /**
     * If true, the context menu is given a fixed position rather than being injected into the target.
     * @defaultValue `false`
     */
    fixed?: Fixed;
  }
}

export default ContextMenu;
