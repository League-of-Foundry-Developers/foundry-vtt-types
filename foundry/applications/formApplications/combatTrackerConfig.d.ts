/**
 * Configure the Combat tracker to display additional information as appropriate
 */
declare class CombatTrackerConfig extends FormApplication<CombatTrackerConfig.Data> {
  static get defaultOptions(): CombatTrackerConfig.Options;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): Promise<CombatTrackerConfig.Data>;

  /**
   * @param event - (unused)
   * @override
   */
  protected _updateObject(event?: Event, formData?: CombatTrackerConfig.Setting): Promise<CombatTrackerConfig.Setting>;

  /**
   * Get an Array of attribute choices which could be tracked for Actors in the Combat Tracker
   */
  getAttributeChoices(): Promise<Array<unknown>>; // TODO: type when TokenConfig is typed
}

declare namespace CombatTrackerConfig {
  interface Data {
    settings: Setting;
    attributeChoices: ReturnType<CombatTrackerConfig['getAttributeChoices']>;
  }

  interface Options extends FormApplication.Options {
    /**
     * @defaultValue `'combat-config'`
     */
    id: string;

    /**
     * @defaultValue `game.i18n.localize('COMBAT.Settings')`
     */
    title: string;

    /**
     * @defaultValue `['sheet', 'combat-sheet']`
     */
    classes: string[];

    /**
     * @defaultValue `'templates/sheets/combat-config.html'`
     */
    template: string;

    /**
     * @defaultValue `420`
     */
    width: number;
  }

  interface Setting {
    resource: string;
    skipDefeated: boolean;
  }
}
