/**
 * Configure or create a single Combatant within a Combat entity.
 */
declare class CombatantConfig extends FormApplication {
  static get defaultOptions(): CombatantConfig.Options;

  /**
   * @override
   */
  get title(): string;

  /**
   * @param event - (unused)
   * @override
   */
  protected _updateObject<U>(
    event: Event,
    formData: Expanded<U> extends DeepPartial<Combat.Combatant> ? U : DeepPartial<Combat.Combatant>
  ): Promise<U>;
}

declare namespace CombatantConfig {
  interface Options extends FormApplication.Options {
    /**
     * @defaultValue `'combatant-config'`
     */
    id: string;

    /**
     * @defaultValue `game.i18n.localize('COMBAT.CombatantConfig')`
     */
    title: string;

    /**
     * @defaultValue `['sheet', 'combat-sheet']`
     */
    classes: string[];

    /**
     * @defaultValue `'templates/sheets/combatant-config.html'`
     */
    template: string;

    /**
     * @defaultValue `420`
     */
    width: number;
  }
}
