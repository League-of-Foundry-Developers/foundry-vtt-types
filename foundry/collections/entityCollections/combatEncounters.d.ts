/**
 * The Collection of Combat entities
 */
declare class CombatEncounters extends EntityCollection<Combat> {
  /** @override */
  get entity(): string;

  /**
   * Provide the settings object which configures the Combat entity
   * @returns
   */
  get settings(): {
    resource: string;
    skipDefeated: boolean;
  };

  /**
   * Get an Array of Combat instances which apply to the current canvas scene
   */
  get combats(): Combat[];

  /**
   * The currently active Combat instance
   * @returns
   */
  get active(): Combat;

  /**
   * The currently viewed Combat encounter
   * @returns
   */
  get viewed(): Combat | null;

  /** @override */
  static get instance(): CombatEncounters;

  /**
   * When a Token is deleted, remove it as a combatant from any combat encounters which included the Token
   */
  protected _onDeleteToken(sceneId: string, tokenId: string): Promise<void>;
}
