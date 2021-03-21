/**
 * A simple main menu application
 */
declare class MainMenu extends Application {
  /**
   * @override
   * @defaultValue
   * ```typescript
   * {
   *   ...super.defaultOptions,
   *   id: 'menu',
   *   template: 'templates/hud/menu.html',
   *   popOut: false
   * }
   * ```
   * */
  static get defaultOptions(): typeof Application['defaultOptions'];

  /**
   * The structure of menu items
   * @defaultValue
   * ```typescript
   * {
   *   reload: {
   *     label: 'MENU.Reload',
   *     icon: '<i class="fas fa-redo"></i>',
   *     enabled: true,
   *     onClick: () => window.location.reload()
   *   },
   *   logout: {
   *     label: 'MENU.Logout',
   *     icon: '<i class="fas fa-user"></i>',
   *     enabled: true,
   *     onClick: () => game.logOut()
   *   },
   *   players: {
   *     label: 'MENU.Players',
   *     icon: '<i class="fas fa-users"></i>',
   *     enabled: game.user.isGM,
   *     onClick: () => (window.location.href = './players')
   *   },
   *   world: {
   *     label: 'MENU.Setup',
   *     icon: '<i class="fas fa-globe"></i>',
   *     enabled: game.user.isGM,
   *     onClick: () => game.shutDown()
   *   }
   * }
   * ```
   */
  get items(): MainMenu.MenuStructure;

  /** @override */
  getData(): { items: MainMenu.MenuStructure };

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * Toggle display of the menu (or render it in the first place)
   */
  toggle(): void;
}

declare namespace MainMenu {
  interface MenuItem {
    label: string;
    icon: string;
    enabled: boolean;
    onClick: () => void;
  }

  type MenuStructure = { [name: string]: MenuItem };
}
