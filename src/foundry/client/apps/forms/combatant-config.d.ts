export {};

declare global {
  /**
   * The Application responsible for configuring a single Combatant document within a parent Combat.
   *
   * @typeParam Options - the type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class CombatantConfig<
    Options extends DocumentSheetOptions = CombatantConfig.Options,
    Data extends CombatantConfig.Data<Options> = CombatantConfig.Data<Options>
  > extends DocumentSheet<Options, Data, InstanceType<ConfiguredCombatant>> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "combatant-config",
     *   title: game.i18n.localize("COMBAT.CombatantConfig"),
     *   classes: ["sheet", "combat-sheet"],
     *   template: "templates/sheets/combatant-config.html",
     *   width: 420
     * });
     * ```
     */
    static override get defaultOptions(): CombatantConfig.Options;

    override get title(): string;

    protected override _updateObject(event: Event, formData: CombatantConfig.FormData): Promise<unknown>;
  }

  namespace CombatantConfig {
    interface Options extends DocumentSheetOptions {
      id: 'combatant-config';
      title: string;
      classes: string[];
      template: string;
      width: number;
    }

    type Data<Options extends DocumentSheetOptions> = DocumentSheet.Data<InstanceType<ConfiguredCombatant>, Options>;

    type FormData = Pick<Combatant['_source'], 'defeated' | 'hidden' | 'img' | 'initiative' | 'name'>;
  }
}
