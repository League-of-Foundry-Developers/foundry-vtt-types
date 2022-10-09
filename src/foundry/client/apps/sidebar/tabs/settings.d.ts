export {};

declare global {
  /**
   * The sidebar tab which displays various game settings, help messages, and configuration options.
   * The Settings sidebar is the furthest-to-right using a triple-cogs icon.
   * @typeParam Options - The type of the options object
   */
  class Settings<Options extends ApplicationOptions = ApplicationOptions> extends SidebarTab<Options> {
    /**
     * @defaultValue
     * ```typescript
     * const options = super.defaultOptions;
     * options.id = "settings";
     * options.template = "templates/sidebar/settings.html";
     * options.title = "Settings";
     * ```
     */
    static override get defaultOptions(): ApplicationOptions;

    override getData(options?: Partial<Options>): MaybePromise<object>;

    override activateListeners(html: JQuery): void;

    /**
     * Delegate different actions for different settings buttons
     * @internal
     */
    protected _onSettingsButton(event: JQuery.ClickEvent): void;

    /**
     * Executes with the update notification pip is clicked
     * @param event - The originating click event
     * @internal
     */
    protected _onUpdateNotificationClick(event: JQuery.ClickEvent): void;
  }

  /**
   * A simple window application which shows the built documentation pages within an iframe
   * @typeParam Options - the type of the options object
   */
  class FrameViewer<Options extends ApplicationOptions = ApplicationOptions> extends Application<Options> {
    constructor(url: string, options?: Partial<Options>);

    url: string;

    /**
     * @defaultValue
     * ```
     * mergeObject(super.defaultOptions, {
     *   height: window.innerHeight * 0.9,
     *   width: Math.min(window.innerWidth * 0.9, 1200),
     *   top: (window.innerHeight - height) / 2,
     *   left: (window.innerWidth - width) / 2,
     *   id: "documentation",
     *   template: "templates/apps/documentation.html",
     * })
     * ```
     */
    static override get defaultOptions(): typeof Application["defaultOptions"];

    override getData(options?: Partial<Options>): MaybePromise<object>;

    override close(options?: Application.CloseOptions): ReturnType<Application["close"]>;
  }
}
