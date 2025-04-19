import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

declare global {
  /**
   * The Application responsible for configuring the CombatTracker and its contents.
   * @typeParam Options - The type of the options object
   */
  class CombatTrackerConfig<Options extends FormApplication.Options = FormApplication.Options> extends FormApplication<
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
    static override get defaultOptions(): FormApplication.Options;

    override getData(
      options?: Partial<Options>,
    ): MaybePromise<GetDataReturnType<CombatTrackerConfig.CombatTrackerConfigData>>;

    protected override _updateObject(
      event: Event,
      formData: SettingConfig["core.combatTrackerConfig"],
    ): Promise<unknown>;

    override activateListeners(html: JQuery<HTMLElement>): void;

    protected override _onChangeInput(event: JQuery.ChangeEvent<any, any, any, any>): Promise<void | object>;
  }

  namespace CombatTrackerConfig {
    interface Any extends CombatTrackerConfig<any> {}

    interface CombatTrackerConfigData extends FormApplication.FormApplicationData {
      settings: SettingConfig["core.combatTrackerConfig"];
      attributeChoices: ReturnType<typeof TokenDocument.getTrackedAttributeChoices>;
      combatTheme: ClientSettings.SettingConfig<string>;
      selectedTheme: SettingConfig["core.combatTheme"];
      user: User.Implementation;
    }
  }
}
