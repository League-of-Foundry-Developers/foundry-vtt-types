/**
 * The active Player List application
 */
declare class PlayerList extends Application {
  /**
   * @defaultValue
   * ```typescript
   * {
   *   ...super.defaultOptions,
   *   id: 'players',
   *   template: 'templates/user/players.html',
   *   popOut: false
   * }
   * ```
   */
  static get defaultOptions(): typeof Application['defaultOptions'];

  /** @override */
  activateListeners(html: JQuery): void;

  /** @override */
  getData(options?: Application.RenderOptions): PlayerList.Data | Promise<PlayerList.Data>;

  /** @override */
  render(force?: boolean, options?: Application.RenderOptions): this;

  /**
   * Return the default context options available for the Players application
   */
  private _getUserContextOptions(): ContextMenu.Item[];

  /**
   * Toggle display of the Players hud setting for whether or not to display offline players
   */
  private _onToggleOfflinePlayers(event: JQuery.ClickEvent): void;
}

declare namespace PlayerList {
  /**
   * Data object returned from the PlayerList getData function
   */
  interface Data {
    /** If to hide the player list */
    hide: boolean;
    /** If to show offline users */
    showOffline: boolean;
    /** List of users connected to Foundry */
    users: User[];
  }
}
