/**
 * A controller class for managing tabbed navigation within an Application instance.
 * @see {@link Application}
 *
 * @example
 * ```html
 * <!-- Example HTML -->
 * <nav class="tabs" data-group="primary-tabs">
 *   <a class="item" data-tab="tab1">Tab 1</li>
 *   <a class="item" data-tab="tab2">Tab 2</li>
 * </nav>
 *
 * <section class="content">
 *   <div class="tab" data-tab="tab1" data-group="primary-tabs">Content 1</div>
 *   <div class="tab" data-tab="tab2" data-group="primary-tabs">Content 2</div>
 * </section>
 *```
 * @example
 * ```typescript
 * // TypeScript
 * const tabs = new Tabs({navSelector: ".tabs", contentSelector: ".content", initial: "tab1"});
 * tabs.bind(html);
 * ```
 */
declare class Tabs {
  /**
   * @param navSelector     - The CSS selector used to target the navigation element for these tabs
   * @param contentSelector - The CSS selector used to target the content container for these tabs
   * @param initial         - The tab name of the initially active tab
   * @param callback        - An optional callback function that executes when the active tab is changed
   * @remarks
   *
   */
  constructor({ navSelector, contentSelector, initial, callback }: Tabs.Options);

  /**
   * The value of the active tab
   */
  active: string | undefined;

  /**
   * A callback function to trigger when the tab is changed
   */
  callback: ((event: null, tabs: Tabs, tabName: string) => unknown) | null | undefined;

  /**
   * The CSS selector used to target the tab navigation element
   */
  protected _navSelector: string;

  /**
   * A reference to the HTML navigation element the tab controller is bound to
   * @defaultValue `null`
   */
  protected _nav: HTMLElement | null;

  /**
   * The CSS selector used to target the tab content element
   */
  protected _contentSelector: string | undefined;

  /**
   * A reference to the HTML container element of the tab content
   * @defaultValue `null`
   */
  protected _content: HTMLElement | null;

  /**
   * Bind the Tabs controller to an HTML application
   */
  bind(html: HTMLElement): void;

  /**
   * Activate a new tab by name
   * @param tabName         - Name of the tab to activate
   * @param triggerCallback - Whether or not to trigger the callback
   *                          (default: `false`)
   */
  activate(tabName: string, { triggerCallback }?: { triggerCallback?: boolean }): void;

  /**
   * Handle click events on the tab navigation entries
   * @param event - A left click event
   */
  protected _onClickNav(event: MouseEvent): void;
}

declare namespace Tabs {
  interface Options {
    navSelector: string;
    contentSelector?: string;
    initial?: string;
    callback?: ((event: null, tabs: Tabs, tabName: string) => unknown) | null;
  }
}

declare const TabsV2: typeof Tabs;
