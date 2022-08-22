/**
 * Render the Sidebar container, and after rendering insert Sidebar tabs.
 * @typeParam Options - the type of the options object
 */
declare class Sidebar<Options extends ApplicationOptions = ApplicationOptions> extends Application<Options> {
  /**
   * Singleton application instances for each sidebar tab
   * @defaultValue `{}`
   */
  tabs: Partial<Record<string, SidebarTab>>;

  /**
   * Track whether the sidebar container is currently collapsed
   * @defaultValue `false`
   * @internal
   */
  protected _collapsed: boolean;

  /**
   * @defaultValue
   * ```ts
   * foundry.utils.mergeObject(super.defaultOptions, {
   *   id: "sidebar",
   *   template: "templates/sidebar/sidebar.html",
   *   popOut: false,
   *   width: 300,
   *   tabs: [{navSelector: ".tabs", contentSelector: "#sidebar", initial: "chat"}]
   * }
   * ```
   */
  static override get defaultOptions(): ApplicationOptions;

  /**
   * Return the name of the active Sidebar tab
   */
  get activeTab(): string;

  /**
   * Singleton application instances for each popout tab
   */
  get popouts(): Partial<Record<string, SidebarTab>>;

  override getData(options?: Partial<Options>): MaybePromise<object>;

  /**
   * @internal
   */
  protected override _render(force?: boolean, options?: Application.RenderOptions<Options>): Promise<void>;

  /**
   * Activate a Sidebar tab by it's name
   * @param tabName - The tab name corresponding to it's "data-tab" attribute
   */
  activateTab(tabName: string): void;

  /**
   * Expand the Sidebar container from a collapsed state.
   * Take no action if the sidebar is already expanded.
   */
  expand(): void;

  /**
   * Collapse the sidebar to a minimized state.
   * Take no action if the sidebar is already collapsed.
   */
  collapse(): void;

  override activateListeners(html: JQuery): void;

  /**
   * @internal
   */
  protected override _onChangeTab(event: MouseEvent | null, tabs: Tabs, active: string): void;

  /**
   * Handle the special case of left-clicking a tab when the sidebar is collapsed.
   * @param event - The originating click event
   * @internal
   */
  protected _onLeftClickTab(event: MouseEvent): void;

  /**
   * Handle right-click events on tab controls to trigger pop-out containers for each tab
   * @param event - The originating contextmenu event
   * @internal
   */
  protected _onRightClickTab(event: MouseEvent): void;

  /**
   * Handle toggling of the Sidebar container's collapsed or expanded state
   * @internal
   */
  protected _onToggleCollapse(event: MouseEvent): void;
}
