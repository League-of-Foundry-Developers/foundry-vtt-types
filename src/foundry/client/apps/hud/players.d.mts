import type { GetDataReturnType, MaybePromise } from "../../../../types/utils.d.mts";

declare global {
  /**
   * The UI element which displays the list of Users who are currently playing within the active World.
   *
   * @typeParam Options - the type of the options object
   */
  class PlayerList<Options extends ApplicationOptions = ApplicationOptions> extends Application<Options> {
    constructor(options?: Partial<Options>);

    /**
     * An internal toggle for whether to show offline players or hide them
     * @defaultValue `false`
     */
    protected _showOffline: boolean;

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "players",
     *   template: "templates/user/players.html",
     *   popOut: false
     * })
     * ```
     */
    static get defaultOptions(): ApplicationOptions;

    /**
     * Whether the players list is in a configuration where it is hidden
     */
    get isHidden(): boolean;

    override render(force?: boolean, options?: Application.RenderOptions<Options>): this;

    override getData(options?: Partial<Options>): MaybePromise<GetDataReturnType<PlayerList.Data>>;

    /**
     * Prepare a displayed name string for the User which includes their name, pronouns, character, or GM tag.
     */
    protected _getDisplayName(user: User): string;

    /**
     * Position this Application in the main DOM appropriately.
     */
    protected _positionInDOM(): void;

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
    interface UserData {
      active: User["active"];
      isGM: User["isGM"];
      isSelf: User["isSelf"];
      charname: string;
      color: string;
      border: string;
      displayName: string;
    }

    interface Data {
      users: UserData[];
      showOffline: boolean;
      hide: boolean;
    }
  }
}
