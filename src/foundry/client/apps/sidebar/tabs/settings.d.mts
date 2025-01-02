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
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "settings",
     *   template: "templates/sidebar/settings.html",
     *   title: "Settings"
     * });
     * ```
     */
    static override get defaultOptions(): ApplicationOptions;

    // TODO: Implement GetDataReturnType
    override getData(options?: Partial<Options>): Promise<object>;

    override activateListeners(html: JQuery): void;

    /**
     * Delegate different actions for different settings buttons
     * @param event - The originating click event
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
     * const options = super.defaultOptions;
     * const h = window.innerHeight * 0.9;
     * const w = Math.min(window.innerWidth * 0.9, 1200);
     * options.height = h;
     * options.width = w;
     * options.top = (window.innerHeight - h) / 2;
     * options.left = (window.innerWidth - w) / 2;
     * options.id = "documentation";
     * options.template = "templates/apps/documentation.html";
     * return options;
     * ```
     */
    static override get defaultOptions(): typeof Application.defaultOptions;

    override getData(options?: Partial<Options>): Promise<{ src: string }>;

    override close(options?: Application.CloseOptions): ReturnType<Application["close"]>;
  }
}
