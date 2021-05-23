/**
 * Render the Sidebar container, and after rendering insert Sidebar tabs
 * @typeParam P - the type of the options object
 */
declare class Sidebar<P extends Sidebar.Options = Sidebar.Options> extends Application<P> {
  /**
   * @override
   */
  static get defaultOptions(): Sidebar.Options;

  /**
   * Sidebar application instances
   * @defaultValue `[]`
   */
  apps: Application[];

  /**
   * Track whether the sidebar container is currently collapsed
   * @defaultValue `false`
   */
  protected _collapsed: boolean;

  /**
   * Return the name of the active Sidebar tab
   */
  get activeTab(): string;

  /**
   * Return an Array of pop-out sidebar tab Application instances
   */
  get popouts(): Application[];

  /**
   * @override
   */
  activateListeners(html: JQuery): void;

  /**
   * Activate a Sidebar tab by it's name
   * @param tabName - The tab name corresponding to it's "data-tab" attribute
   */
  activateTab(tabName: string): void;

  /**
   * Collapse the sidebar to a minimized state.
   * Take no action if the sidebar is already collapsed.
   */
  collapse(): void;

  /**
   * Expand the Sidebar container from a collapsed state.
   * Take no action if the sidebar is already expanded.
   */
  expand(): void;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): Sidebar.Data;

  /**
   * @param event - (unused)
   * @param tabs - (unused)
   * @override
   */
  protected _onChangeTab(event: MouseEvent | null, tabs: Tabs, active: string): void;

  /**
   * Handle right-click events on tab controls to trigger pop-out containers for each tab
   * @param event - The originating contextmenu event
   */
  protected _onRightClickTab(event: MouseEvent): void;

  /**
   * Handle toggling of the Sidebar container's collapsed or expanded state
   */
  protected _onToggleCollapse(event: MouseEvent): void;

  /**
   * @override
   */
  protected _render(force?: boolean, options?: Application.RenderOptions): Promise<void>;
}

declare namespace Sidebar {
  interface Data {
    coreUpdate: string | false;
    user: User;
  }

  interface Options extends Application.Options {
    /**
     * @defaultValue `'sidebar'`
     */
    id: string;

    /**
     * @defaultValue `false`
     */
    popOut: boolean;

    tabs: Array<
      Tabs.Options & {
        /**
         * @defaultValue `'.tabs'`
         */
        navSelector: string;

        /**
         * @defaultValue `'#sidebar'`
         */
        contentSelector: string;

        /**
         * @defaultValue `'chat'`
         */
        initial: string;
      }
    >;

    /**
     * @defaultValue `'templates/sidebar/sidebar.html'`
     */
    template: string;

    /**
     * @defaultValue `300`
     */
    width: number;
  }
}
