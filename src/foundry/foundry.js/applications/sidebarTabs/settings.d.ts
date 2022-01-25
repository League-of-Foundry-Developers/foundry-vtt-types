import { ConfiguredDocumentClass } from '../../../../types/helperTypes';

declare global {
  /**
   * The sidebar tab which displays various game settings, help messages, and configuration options.
   * The Settings sidebar is the furthest-to-right using a triple-cogs icon.
   * @typeParam Options - The type of the options object
   */
  class Settings<Options extends ApplicationOptions = ApplicationOptions> extends SidebarTab<Options> {
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
    static get defaultOptions(): ApplicationOptions;

    /**
     * @param options - (unused)
     * @override
     */
    getData(options?: Partial<Options>): Settings.Data;

    /**
     * @override
     */
    activateListeners(html: JQuery): void;

    /**
     * Delegate different actions for different settings buttons
     */
    protected _onSettingsButton(event: JQuery.ClickEvent): void;

    /**
     * Executes with the update notification pip is clicked
     * @param event - The originating click event
     */
    protected _onUpdateNotificationClick(event: JQuery.ClickEvent): void;
  }

  namespace Settings {
    interface Data {
      user: InstanceType<ConfiguredDocumentClass<typeof User>>;
      system: Game['system'];
      coreVersion: Game['data']['version'];
      isDemo: boolean;
      canConfigure: boolean;
      canSetup: boolean;
      coreUpdate: string | false;
      systemUpdate: string | false;
      modules: number;
    }
  }
}
