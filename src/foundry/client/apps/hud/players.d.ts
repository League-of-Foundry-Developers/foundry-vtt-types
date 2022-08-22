import { ConfiguredDocumentClass } from "../../../../types/helperTypes";

declare global {
  /**
   * The UI element which displays the list of Users who are currently playing within the active World.
   *
   * @typeParam Options - the type of the options object
   */
  class PlayerList<Options extends ApplicationOptions = ApplicationOptions> extends Application<Options> {
    constructor(options?: Partial<Options>);

    /**
     * An internal toggle for whether or not to show offline players or hide them
     * @defaultValue `false`
     */
    protected _showOffline: boolean;

    /**
     * @defaultValue
     * ```typescript
     * mergeObject(super.defaultOptions, {
     *   id: "players",
     *   template: "templates/user/players.html",
     *   popOut: false
     * })
     * ```
     */
    static get defaultOptions(): ApplicationOptions;

    override render(force?: boolean, options?: Application.RenderOptions<Options>): this;

    override getData(options?: Partial<Options>): MaybePromise<object>;

    override activateListeners(html: JQuery): void;

    /**
     * Return the default context options available for the Players application
     */
    protected _getUserContextOptions(): ContextMenuEntry[];

    /**
     * Toggle display of the Players hud setting for whether or not to display offline players
     * @param event - The originating click event
     */
    protected _onToggleOfflinePlayers(event: JQuery.ClickEvent): void;
  }

  namespace PlayerList {
    interface Data {
      users: StoredDocument<InstanceType<ConfiguredDocumentClass<typeof User>>>[];
      showOffline: boolean;
      hide: boolean;
    }
  }
}
