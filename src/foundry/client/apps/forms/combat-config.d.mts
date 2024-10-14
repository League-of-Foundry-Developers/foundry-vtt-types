import type { GetDataReturnType, MaybePromise } from "../../../../types/utils.d.mts";

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

    override getData(
      options?: Partial<Options>,
    ): MaybePromise<GetDataReturnType<CombatTrackerConfig.CombatTrackerConfigData>>;

    protected override _updateObject(
      event: Event,
      formData: ClientSettings.Values["core.combatTrackerConfig"],
    ): Promise<unknown>;

    override activateListeners(html: JQuery<HTMLElement>): void;

    protected override _onChangeInput(event: JQuery.ChangeEvent<any, any, any, any>): Promise<void | object>;
  }

  namespace CombatTrackerConfig {
    type Any = CombatTrackerConfig<any>;

    interface CombatTrackerConfigData extends FormApplication.FormApplicationData {
      settings: ClientSettings.Values["core.combatTrackerConfig"];
      attributeChoices: ReturnType<(typeof TokenDocument)["getTrackedAttributeChoices"]>;
      combatTheme: SettingConfig<string>;
      selectedTheme: ClientSettings.Values["core.combatTheme"];
      user: User;
    }
  }
}
