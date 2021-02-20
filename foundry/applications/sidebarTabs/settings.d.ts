/**
 * A SidebarTab for providing help messages and settings configurations.
 * The Settings sidebar is the furthest-to-right using a triple-cogs icon.
 */
declare class Settings extends SidebarTab {
  /**
   * @override
   */
  static get defaultOptions(): Settings.Options;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): Settings.Data;

  /**
   * @override
   */
  activateListeners(html: JQuery): void;

  /**
   * Delegate different actions for different settings buttons
   */
  protected _onSettingsButton(event: JQuery.ClickEvent): void;
}

declare namespace Settings {
  interface Data {
    user: User;
    system: any; // TODO: update when System is typed
    coreVersion: string;
    canConfigure: boolean;
    canSetup: boolean;
    coreUpdate: string | false;
    modules: number;
  }

  interface Options extends SidebarTab.Options {
    /**
     * @defaultValue `'settings'`
     */
    id: string;

    /**
     * @defaultValue `'templates/sidebar/settings.html'`
     */
    template: string;

    /**
     * @defaultValue `'Setttings'`
     */
    title: string;
  }
}
