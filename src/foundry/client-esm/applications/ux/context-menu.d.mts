import type { InexactPartial } from "fvtt-types/utils";

declare global {
  /**
   * @deprecated Use {@link foundry.applications.ux.ContextMenu.Entry | `foundry.applications.ux.ContextMenu.Entry`}
   */
  type ContextMenuEntry = ContextMenu.Entry<JQuery>;
}

/**
 * Display a right-click activated Context Menu which provides a dropdown menu of options.
 * A ContextMenu is constructed by designating a parent HTML container and a target selector.
 * An Array of menuItems defines the entries of the menu which is displayed.
 */
declare class ContextMenu<UsesJQuery extends boolean = true> {
  /**
   * @param container   - The containing HTML element within which the menu is positioned
   * @param selector  - A CSS selector which activates the context menu.
   * @param menuItems - An Array of entries to display in the menu
   * @param options   - Additional options to configure the context menu.
   */
  constructor(
    container: HTMLElement,
    selector: string | null | undefined,
    menuItems: ContextMenu.Entry<ContextMenu.JQueryOrHTML<UsesJQuery>>[],
    options: ContextMenu.ConstructorOptions<UsesJQuery>,
  );

  /**
   * @deprecated "ContextMenu is changing to no longer transact jQuery objects.
   * You may temporarily pass the jQuery option to nominate a behavior.
   * In v14 the default will become false."
   */
  constructor(
    element: JQuery | HTMLElement,
    selector: string | null | undefined,
    menuItems: ContextMenu.Entry<ContextMenu.JQueryOrHTML<UsesJQuery>>[],
    options?: InexactPartial<ContextMenu.ConstructorOptions<UsesJQuery>, "jQuery">,
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
  static create<UsesJQuery extends boolean = true>(
    app: Application.Any,
    html: HTMLElement,
    selector: string,
    menuItems: ContextMenu.Entry<ContextMenu.JQueryOrHTML<UsesJQuery>>[],
    options: ContextMenu.CreateOptions<UsesJQuery>,
  ): ContextMenu<UsesJQuery>;

  /**
   * @deprecated "ContextMenu is changing to no longer transact jQuery objects.
   * You may temporarily pass the jQuery option to nominate a behavior.
   * In v14 the default will become false."
   */
  static create(
    app: Application.Any,
    html: HTMLElement,
    selector: string,
    menuItems: ContextMenu.Entry<ContextMenu.JQueryOrHTML<true>>[],
    options?: InexactPartial<ContextMenu.CreateOptions<true>, "jQuery">,
  ): ContextMenu<true>;

  /**
   * @deprecated "ContextMenu is changing to no longer transact jQuery objects. You must begin passing an HTMLElement instead."
   */
  static create<UsesJQuery extends boolean = true>(
    app: Application.Any,
    html: JQuery,
    selector: string,
    menuItems: ContextMenu.Entry<ContextMenu.JQueryOrHTML<UsesJQuery>>[],
    options: ContextMenu.CreateOptions<UsesJQuery>,
  ): ContextMenu<UsesJQuery>;

  /**
   * @deprecated "ContextMenu is changing to no longer transact jQuery objects.
   * You may temporarily pass the jQuery option to nominate a behavior.
   * In v14 the default will become false."
   * @deprecated "ContextMenu is changing to no longer transact jQuery objects. You must begin passing an HTMLElement instead."
   */
  static create(
    app: Application.Any,
    html: JQuery,
    selector: string,
    menuItems: ContextMenu.Entry<ContextMenu.JQueryOrHTML<true>>[],
    options?: InexactPartial<ContextMenu.CreateOptions<true>, "jQuery">,
  ): ContextMenu<true>;

  /**
   * The menu element.
   */
  get element(): HTMLElement;

  /**
   * A CSS selector to identify context menu targets.
   * @defaultValue `container.attr("id")`
   */
  get selector(): string;

  /**
   * The event name to listen for.
   * @defaultValue `"contextmenu"`
   */
  get eventName(): string;

  /**
   * The array of menu items to render.
   */
  menuItems: ContextMenu.Entry<ContextMenu.JQueryOrHTML<UsesJQuery>>[];

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
  get fixed(): boolean;

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
  render(target: HTMLElement, options?: ContextMenu.RenderOptions): Promise<void>;

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
   * @remarks ""ContextMenu#_expandUp is deprecated. Please use ContextMenu#expandUp instead."
   */
  get _expandUp(): boolean;

  /**
   * @deprecated since v13 until v15
   * @remarks "ContextMenu#menu is deprecated. Please use ContextMenu#element instead."
   */
  get menu(): JQuery;

  #private: true;
}

declare namespace ContextMenu {
  interface Entry<ElementType extends JQuery | HTMLElement> {
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
    callback: (target: ElementType) => void;

    /**
     * A function to call or boolean value to determine if this entry
     * appears in the menu.
     * @remarks `null` equivalent to `false`
     */
    condition?: boolean | Condition<ElementType> | null | undefined;
  }

  /**
   * @param html - The element of the context menu entry.
   * @returns Whether the entry should be rendered in the context menu.
   * @remarks `null` equivalent to `false`
   */
  type Condition<ElementType extends JQuery | HTMLElement> = (target: ElementType) => boolean | null;

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

  interface ConstructorOptions<IsJQuery extends boolean = true> {
    /**
     * Optionally override the triggering event which can spawn the menu. If the menu is using a fixed position, this event must be a MouseEvent
     * @defaultValue `"contextmenu"`
     */
    eventName?: string;

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
    jQuery: IsJQuery;

    /**
     * If true, the context menu is given a fixed position rather than being injected into the target.
     * @defaultValue `false`
     */
    fixed?: boolean | undefined;
  }

  interface CreateOptions<IsJQuery extends boolean = true> extends ConstructorOptions<IsJQuery> {
    /**
     * The name of the hook to call
     * @defaultValue `EntryContext`
     */
    hookName?: string;
  }

  type JQueryOrHTML<IsJQuery extends boolean | undefined> = IsJQuery extends false ? HTMLElement : JQuery;
}

export default ContextMenu;
