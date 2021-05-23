/**
 * The Collection of Combat entities
 */
declare class CombatEncounters extends EntityCollection<Combat> {
  /** @override */
  static get instance(): CombatEncounters;

  /**
   * The currently active Combat instance
   * @returns
   */
  get active(): Combat | undefined;

  /**
   * Get an Array of Combat instances which apply to the current canvas scene
   */
  get combats(): Combat[];

  /** @override */
  get entity(): string;

  /**
   * Provide the settings object which configures the Combat entity
   * @returns
   */
  get settings(): Combat.Settings;

  /**
   * The currently viewed Combat encounter
   * @returns
   */
  get viewed(): Combat | null;

  /**
   * When a Token is deleted, remove it as a combatant from any combat encounters which included the Token
   */
  protected _onDeleteToken(sceneId: string, tokenId: string): Promise<void>;
}
