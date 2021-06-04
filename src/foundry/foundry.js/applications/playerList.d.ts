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
  render(force?: boolean, options?: Application.RenderOptions): this;

  /** @override */
  getData(options?: Application.RenderOptions): PlayerList.Data | Promise<PlayerList.Data>;

  /** @override */
  activateListeners(html: JQuery): void;

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
    /** List of users connected to Foundry */
    users: User[];
    /** If to show offline users */
    showOffline: boolean;
    /** If to hide the player list */
    hide: boolean;
  }
}
