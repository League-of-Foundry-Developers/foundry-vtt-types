import type { MaybePromise, Identity } from "fvtt-types/utils";

declare global {
  /**
   * The main menu application which is toggled via the ESC key.
   */
  class MainMenu extends Application {
    /**
     * @defaultValue
     * ```typescript
     * return foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "menu",
     *   template: "templates/hud/menu.html",
     *   popOut: false
     * });
     * ```
     * */
    static override get defaultOptions(): ApplicationOptions;

    /**
     * The structure of menu items
     * @defaultValue
     * ```typescript
     * {
     *   reload: {
     *     label: "MENU.Reload",
     *     icon: "<i class="fas fa-redo"></i>",
     *     enabled: true,
     *     onClick: () => window.location.reload()
     *   },
     *   logout: {
     *     label: "MENU.Logout",
     *     icon: "<i class="fas fa-user"></i>",
     *     enabled: true,
     *     onClick: () => game.logOut()
     *   },
     *   players: {
     *     label: "MENU.Players",
     *     icon: "<i class="fas fa-users"></i>",
     *     enabled: game.user.isGM && !game.data.demoMode,
     *     onClick: () => (window.location.href = "./players")
     *   },
     *   world: {
     *     label: "GAME.ReturnSetup",
     *     icon: "<i class="fas fa-globe"></i>",
     *     enabled: game.user.hasRole("GAMEMASTER")  && !game.data.demoMode,
     *     onClick: () => {
     *       this.close();
     *       game.shutDown();
     *     }
     *   }
     * }
     * ```
     */
    get items(): MainMenu.MenuStructure;

    override getData(options?: Partial<ApplicationOptions>): MaybePromise<object>;

    override activateListeners(html: JQuery): void;

    /**
     * Toggle display of the menu (or render it in the first place)
     */
    toggle(): void;
  }

  namespace MainMenu {
    interface Any extends AnyMainMenu {}
    interface AnyConstructor extends Identity<typeof AnyMainMenu> {}

    interface MenuItem {
      label: string;
      icon: string;
      enabled: boolean;
      onClick: () => void;
    }

    type MenuStructure = Record<string, MenuItem>;
  }
}

declare abstract class AnyMainMenu extends MainMenu {
  constructor(arg0: never, ...args: never[]);
}
