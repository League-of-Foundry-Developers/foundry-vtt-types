// TODO: Remove when updating this class!!!
// eslint-disable-next-line
// @ts-nocheck

/**
 * Configure the Combat tracker to display additional information as appropriate
 */
declare class CombatTrackerConfig extends FormApplication<FormApplication.Options, CombatTrackerConfig.Data> {
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
  static get defaultOptions(): typeof FormApplication['defaultOptions'];

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): Promise<CombatTrackerConfig.Data>;

  /**
   * @param event - (unused)
   * @override
   */
  protected _updateObject(event?: Event, formData?: Combat.ConfigValue): Promise<Combat.ConfigValue>;

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
