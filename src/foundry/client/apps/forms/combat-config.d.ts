export {};

declare global {
  /**
   * The Application responsible for configuring the CombatTracker and its contents.
   * @typeParam Options - The type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class CombatTrackerConfig<
    Options extends FormApplicationOptions = FormApplicationOptions,
    Data extends object = CombatTrackerConfig.Data
  > extends FormApplication<Options, Data, undefined> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "combat-config",
     *   title: game.i18n.localize("COMBAT.Settings"),
     *   classes: ["sheet", "combat-sheet"],
     *   template: "templates/sheets/combat-config.html",
     *   width: 420,
     * })
     * ```
     */
    static override get defaultOptions(): FormApplicationOptions;

    override getData(options?: Partial<Options>): Data | Promise<Data>;

    protected override _updateObject(
      event: Event,
      formData: ClientSettings.Values['core.combatTrackerConfig']
    ): Promise<unknown>;
  }

  namespace CombatTrackerConfig {
    interface Data {
      settings: ClientSettings.Values['core.combatTrackerConfig'];
      attributeChoices: Record<string, string[]>;
    }
  }
}
