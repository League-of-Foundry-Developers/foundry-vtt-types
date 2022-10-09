export {};

declare global {
  /**
   * The Application responsible for configuring the CombatTracker and its contents.
   * @typeParam Options - The type of the options object
   */
  class CombatTrackerConfig<Options extends FormApplicationOptions = FormApplicationOptions> extends FormApplication<
    Options,
    undefined
  > {
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

    override getData(options?: Partial<Options>): MaybePromise<object>;

    protected override _updateObject(
      event: Event,
      formData: ClientSettings.Values["core.combatTrackerConfig"]
    ): Promise<unknown>;
  }
}
