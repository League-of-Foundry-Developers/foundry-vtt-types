/**
 * A controller class for managing tabbed navigation within an Application instance.
 * @see {@linkcode foundry.applications.api.ApplicationV2}
 *
 * @example Configure tab-control for a set of HTML elements
 * ```html
 * <!-- Example HTML -->
 * <nav class="tabs" data-group="primary-tabs">
 *   <a class="item" data-tab="tab1" data-group="primary-tabs">Tab 1</li>
 *   <a class="item" data-tab="tab2" data-group="primary-tabs">Tab 2</li>
 * </nav>
 *
 * <section class="content">
 *   <div class="tab" data-tab="tab1" data-group="primary-tabs">Content 1</div>
 *   <div class="tab" data-tab="tab2" data-group="primary-tabs">Content 2</div>
 * </section>
 * ```
 * Activate tab control in JavaScript
 * ```js
 * const tabs = new foundry.applications.ux.Tabs({navSelector: ".tabs", contentSelector: ".content", initial: "tab1"});
 * tabs.bind(html);
 * ```
 */
declare class Tabs {
  /**
   * @param config - The Tabs Configuration to use for this tabbed container
   */
  constructor(config: Tabs.Configuration);

  /**
   * The name of the tabs group
   */
  group: Tabs.Configuration["group"];

  /**
   * The value of the active tab
   */
  active: Tabs.Configuration["initial"];

  /**
   * A callback function to trigger when the tab is changed
   */
  callback: Tabs.Configuration["callback"];

  /**
   * The CSS selector used to target the tab navigation element
   */
  protected _navSelector: Tabs.Configuration["navSelector"];

  /**
   * A reference to the HTML navigation element the tab controller is bound to
   * @defaultValue `null`
   */
  protected _nav: HTMLElement | null;

  /**
   * The CSS selector used to target the tab content element
   */
  protected _contentSelector: Tabs.Configuration["contentSelector"];

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
   * @param options - (default: `{}`)
   */
  activate(tabName: string, options?: Tabs.ActivateOptions): void;

  /**
   * Handle click events on the tab navigation entries
   * @param event - A left click event
   */
  protected _onClickNav(event: PointerEvent): void;
}

declare namespace Tabs {
  interface Configuration {
    /**
     * The name of the tabs group
     */
    group?: string | undefined;

    /**
     * The CSS selector used to target the navigation element for these tabs
     */
    navSelector: string;

    /**
     * The CSS selector used to target the content container for these tabs
     */
    contentSelector?: string | undefined;

    /**
     * The tab name of the initially active tab
     */
    initial?: string | undefined;

    /**
     * An optional callback function that executes when the active tab is changed
     */
    callback?: ((event: MouseEvent | null, tabs: Tabs, tabName: string) => unknown) | undefined | null;
  }

  interface ActivateOptions {
    /**
     * @defaultValue `false`
     */
    triggerCallback?: boolean | undefined;
  }
}

export default Tabs;
