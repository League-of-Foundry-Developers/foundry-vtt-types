/**
 * An abstract pattern followed by the different tabs of the sidebar
 * @typeParam Options - The type of the options object
 */
declare abstract class SidebarTab<
  Options extends ApplicationOptions = ApplicationOptions
> extends Application<Options> {
  constructor(...args: ConstructorParameters<typeof Application>);
  /**
   * The base name of this sidebar tab
   * @defaultValue `""`
   */
  tabName: string;

  /**
   * A reference to the pop-out variant of this SidebarTab, if one exists
   * @defaultValue `null`
   */
  protected _popout: this | null;

  /**
   * Denote whether or not this is the original version of the sidebar tab, or a pop-out variant
   * @defaultValue `null`
   */
  protected _original: this | null;

  /**
   * @defaultValue
   * ```typescript
   * foundry.utils.mergeObject(super.defaultOptions, {
   *   popOut: false,
   *   width: 300,
   *   height: "auto",
   *   baseApplication: "SidebarTab"
   * });
   * ```
   */
  static override get defaultOptions(): ApplicationOptions;

  protected override _render(force?: boolean, options?: Application.RenderOptions<Options>): Promise<void>;

  protected override _renderInner(data: object): Promise<JQuery>;

  /**
   * Activate this SidebarTab, switching focus to it
   */
  activate(): void;

  override close(options?: Application.CloseOptions): Promise<void>;

  /**
   * Create a second instance of this SidebarTab class which represents a singleton popped-out container
   * @returns The popped out sidebar tab instance
   */
  createPopout(): this;

  /**
   * Render the SidebarTab as a pop-out container
   */
  renderPopout(): void;

  /**
   * Handle lazy loading for sidebar images to only load them once they become observed
   * @param entries  - The entries which are now observed
   * @param observer - The intersection observer instance
   */
  protected _onLazyLoadImage(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void;
}
