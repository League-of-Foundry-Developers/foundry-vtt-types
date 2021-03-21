/**
 * An abstract pattern followed by the different tabs of the sidebar
 */
declare abstract class SidebarTab<P extends SidebarTab.Options = SidebarTab.Options> extends Application<P> {
  /**
   * The base name of this sidebar tab
   */
  tabName: string;

  /**
   * A reference to the pop-out variant of this SidebarTab, if one exists
   */
  protected _popout: SidebarTab | null;

  /**
   * Denote whether or not this is the original version of the sidebar tab, or a pop-out variant
   */
  protected _original: SidebarTab | null;

  /**
   * @override
   */
  static get defaultOptions(): SidebarTab.Options;

  /**
   * @override
   */
  protected _renderInner(data: object): Promise<JQuery>;

  /**
   * @override
   */
  protected _render(force?: boolean, options?: Application.RenderOptions): Promise<void>;

  /**
   * Activate this SidebarTab, switching focus to it
   */
  activate(): void;

  /**
   * @override
   */
  close(options?: Application.CloseOptions): Promise<void | false>;

  /**
   * Create a second instance of this SidebarTab class which represents a singleton popped-out container
   * @returns The popped out sidebar tab instance
   */
  createPopout(): SidebarTab;

  /**
   * Render the SidebarTab as a pop-out container
   */
  renderPopout(): void;

  /**
   * Handle lazy loading for sidebar images to only load them once they become observed
   */
  protected _onLazyLoadImage(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void;
}

declare namespace SidebarTab {
  interface Options extends Application.Options {
    /**
     * @defaultValue `false`
     */
    popOut: boolean;

    /**
     * @defaultValue `300`
     */
    width: number;

    /**
     * @defaultValue `'SidebarTab'`
     */
    baseApplication: string;
  }
}
