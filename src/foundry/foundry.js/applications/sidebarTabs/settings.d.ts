/**
 * A SidebarTab for providing help messages and settings configurations.
 * The Settings sidebar is the furthest-to-right using a triple-cogs icon.
 * @typeParam Options - The type of the options object
 */
declare class Settings<Options extends Application.Options = Application.Options> extends SidebarTab<Options> {
  /**
   * @override
   * @defaultValue
   * ```typescript
   * foundry.utils.mergeObject(super.defaultOptions, {
   *   id: "setting",
   *   template: "templates/sidebar/settings.html".
   *   title: "Settings"
   * })
   * ```
   */
  static get defaultOptions(): Application.Options;

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
    system: Game['system'];
    coreVersion: string;
    canConfigure: boolean;
    canSetup: boolean;
    coreUpdate: string | false;
    modules: number;
  }
}
