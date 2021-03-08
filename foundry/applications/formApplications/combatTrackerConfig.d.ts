/**
 * Configure the Combat tracker to display additional information as appropriate
 */
declare class CombatTrackerConfig extends FormApplication<CombatTrackerConfig.Data> {
  /**
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   id: "combat-config",
   *   title: game.i18n.localize("COMBAT.Settings"),
   *   classes: ["sheet", "combat-sheet"],
   *   template: "templates/sheets/combat-config.html",
   *   width: 420
   * });
   * ```
   */
  static get defaultOptions(): FormApplication.Options;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): Promise<CombatTrackerConfig.Data>;

  /**
   * @param event - (unused)
   * @override
   */
  protected _updateObject<F extends Required<Combat.ConfigValue>>(event?: Event, formData?: F): Promise<F>;

  /**
   * Get an Array of attribute choices which could be tracked for Actors in the Combat Tracker
   */
  getAttributeChoices(): ReturnType<typeof TokenConfig['getTrackedAttributeChoices']>;
}

declare namespace CombatTrackerConfig {
  interface Data {
    settings: Combat.ConfigValue;
    attributeChoices: ReturnType<CombatTrackerConfig['getAttributeChoices']>;
  }
}
