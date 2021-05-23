/**
 * A SidebarTab for providing help messages and settings configurations.
 * The Settings sidebar is the furthest-to-right using a triple-cogs icon.
 */
declare class Settings extends SidebarTab<Settings.Options> {
  /**
   * @override
   */
  static get defaultOptions(): Settings.Options;

  /**
   * @override
   */
  activateListeners(html: JQuery): void;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): Settings.Data;

  /**
   * Delegate different actions for different settings buttons
   */
  protected _onSettingsButton(event: JQuery.ClickEvent): void;
}

declare namespace Settings {
  interface Data {
    canConfigure: boolean;
    canSetup: boolean;
    coreUpdate: string | false;
    coreVersion: string;
    modules: number;
    system: Game['system'];
    user: User;
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
