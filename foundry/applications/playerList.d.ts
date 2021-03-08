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
  static get defaultOptions(): Application.Options;

  /** @override */
  render(force?: boolean, options?: Application.RenderOptions): unknown;

  /** @override */
  getData(options?: Application.RenderOptions): PlayerList.Data | Promise<PlayerList.Data>;

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * Return the default context options available for the Players application
   */
  private _getUserContextOptions(): PlayerList.UserContextOptions[];

  /**
   * Toggle display of the Players hud setting for whether or not to display offline players
   */
  private _onToggleOfflinePlayers(event: Event): void;
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

  /**
   * User content options when right clicking on a user in the user list
   */
  interface UserContextOptions {
    /** Name of the context item */
    name: string;
    /** Icon to show beside the name */
    icon: string;
    /** Used to determine if to show the content option to the current user */
    condition: (li: JQuery) => boolean;
    /** Call back when the option is clicked */
    callback: (li: JQuery) => void;
  }
}
