/**
 * The Collection of Combat entities
 */
declare class CombatEncounters extends EntityCollection<Combat> {
  /** @override */
  get entity (): string

  /**
   * Provide the settings object which configures the Combat entity
   * @returns
   */
  get settings (): {
    resource: string
    skipDefeated: boolean
  }

  /**
   * Get an Array of Combat instances which apply to the current canvas scene
   */
  get combats (): Combat[]

  /**
   * The currently active Combat instance
   * @returns
   */
  get active (): Combat

  /**
   * The currently viewed Combat encounter
   * @returns
   */
  get viewed (): Combat | null

  /** @override */
  static get instance (): CombatEncounters

  /**
   * When a Token is deleted, remove it as a combatant from any combat encounters which included the Token
   */
  _onDeleteToken (sceneId: string, tokenId: string): Promise<void>
}

/**
 * The Combat Entity defines a particular combat encounter which can occur within the game session
 * Combat instances belong to the CombatEncounters collection
 */
declare class Combat<D extends Combat.Data = Combat.Data> extends Entity<D> {
  /**
   * Track the sorted turn order of this combat encounter
   */
  turns: Combat.Combatant[]

  /**
   * Record the current round, turn, and tokenId to understand changes in the encounter state
   */
  current: Combat.CurrentTurn

  /**
   * Track the previous round, turn, and tokenId to understand changes in the encounter state
   */
  previous: Combat.CurrentTurn

  /**
   * Track whether a sound notification is currently being played to avoid double-dipping
   */
  _soundPlaying: boolean

  /**
   * The configuration setting used to record Combat preferences
   */
  static CONFIG_SETTING: string

  /** @override */
  static get config (): Entity.Config

  /**
   * Prepare Embedded Entities which exist within the parent Combat.
   * For example, in the case of an Actor, this method is responsible for preparing the Owned Items the Actor contains.
   */
  prepareEmbeddedEntities (): void

  /**
   * Return the Array of combatants sorted into initiative order, breaking ties alphabetically by name
   */
  setupTurns (): Combat.Combatant[]

  /**
   * Prepare turn data for one specific combatant.
   */
  _prepareCombatant (c: Combat.Combatant, scene: Scene, players: User[], settings?: any): Combat.Combatant

  /**
   * Define how the array of Combatants is sorted in the displayed list of the tracker.
   * This method can be overridden by a system or module which needs to display combatants in an alternative order.
   * By default sort by initiative, falling back to name
   */
  _sortCombatants (a: Combat.Combatant, b: Combat.Combatant): number

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * Get the data object for the Combatant who has the current turn
   */
  get combatant (): Combat.Combatant

  /**
   * A convenience reference to the Array of combatant data within the Combat entity
   */
  get combatants (): Combat.Combatant[]

  /**
   * The numeric round of the Combat encounte
   */
  get round (): number

  /**
   * The numeric turn of the combat round in the Combat encounter
   */
  get turn (): number

  /**
   * Get the Scene entity for this Combat encounter
   */
  get scene (): Scene

  /**
   * Return the object of settings which modify the Combat Tracker behavior
   */
  get settings (): any

  /**
   * Has this combat encounter been started?
   */
  get started (): boolean

  /* -------------------------------------------- */
  /*  Combat Control Methods                      */
  /* -------------------------------------------- */

  /**
   * Set the current Combat encounter as active within the Scene.
   * Deactivate all other Combat encounters within the viewed Scene and set this one as active
   */
  activate (): Promise<this>

  /**
   * Begin the combat encounter, advancing to round 1 and turn 1
   */
  startCombat (): Promise<this>

  /**
   * Advance the combat to the next turn
   */
  nextTurn (): Promise<void>

  /**
   * Rewind the combat to the previous turn
   */
  previousTurn (): Promise<void>

  /**
   * Advance the combat to the next round
   */
  nextRound (): Promise<void>

  /**
   * Rewind the combat to the previous round
   */
  previousRound (): Promise<this>

  /**
   * Reset all combatant initiative scores, setting the turn back to zero
   * @returns
   */
  resetAll (): Promise<this>

  /**
   * Display a dialog querying the GM whether they wish to end the combat encounter and empty the tracker
   */
  endCombat (): Promise<void>

  /* -------------------------------------------- */
  /*  Combatant Management Methods                */
  /* -------------------------------------------- */

  /**
   */
  getCombatant (id: string): Combat.Combatant

  /**
   * Get a Combatant using its Token id
   * @param tokenId - The id of the Token for which to acquire the combatant
   */
  getCombatantByToken (tokenId: string): Combat.Combatant

  /**
   * Set initiative for a single Combatant within the Combat encounter. Turns will be updated to keep the same combatant as current in the turn order
   * @param id    - The combatant ID for which to set initiative
   * @param value - A specific initiative value to set
   */
  setInitiative (id: string, value: number): Promise<void>

  /**
   * Roll initiative for one or multiple Combatants within the Combat entity
   * @param ids            - A Combatant id or Array of ids for which to roll
   * @param formula        - A non-default initiative formula to roll. Otherwise the system default is used.
   * @param updateTurn     - Update the Combat turn after adding new initiative scores to keep the turn on
   *                         the same Combatant.
   * @param messageOptions - Additional options with which to customize created Chat Messages
   * @returns A promise which resolves to the updated Combat entity once updates are complete.
   */
  rollInitiative (
    ids: string[] | string,
    { formula, updateTurn, messageOptions }?: {
      formula?: string|null
      updateTurn?: boolean
      messageOptions?: any
    }
  ): Promise<Combat>

  /**
   * Acquire the default dice formula which should be used to roll initiative for a particular combatant.
   * Modules or systems could choose to override or extend this to accommodate special situations.
   *
   * @param combatant - Data for the specific combatant for whom to acquire an initiative formula. This
   *                                is not used by default, but provided to give flexibility for modules and systems.
   * @returns The initiative formula to use for this combatant.
   */
  _getInitiativeFormula (combatant: Combat.Combatant): string|null

  /**
   * Get a Roll object which represents the initiative roll for a given combatant.
   * @param combatant - Data for the specific combatant for whom to acquire an initiative formula. This
   *                                is not used by default, but provided to give flexibility for modules and systems.
   * @param formula - An explicit Roll formula to use for the combatant.
   * @returns The Roll instance to use for the combatant.
   */
  _getInitiativeRoll (combatant: Combat.Combatant, formula: string): Roll

  /**
   * Roll initiative for all non-player actors who have not already rolled
   * @param args - Additional arguments forwarded to the Combat.rollInitiative method
   * @returns A promise which resolves to the updated Combat entity once updates are complete.
   */
  rollNPC (args?: {
    formula?: string|null
    updateTurn?: boolean
    messageOptions?: any
  }): Promise<Combat>

  /**
   * Roll initiative for all combatants which have not already rolled
   * @param args - Additional arguments forwarded to the Combat.rollInitiative method
   * @returns A promise which resolves to the updated Combat entity once updates are complete.
   */
  rollAll (args?: {
    formula?: string|null
    updateTurn?: boolean
    messageOptions?: any
  }): Promise<Combat>

  /**
   * Create a new Combatant embedded entity
   * @see {@link Combat#createEmbeddedEntity}
   */
  createCombatant (data: Combat.Combatant|Combat.Combatant[], options?: any): Promise<any>

  /** @override */
  updateCombatant (data: Combat.Combatant|Combat.Combatant[], options?: any): Promise<any>

  /** @override */
  deleteCombatant (id: string|string[], options?: any): Promise<any>

  /* -------------------------------------------- */
  /*  Socket Events and Handlers                  */
  /* -------------------------------------------- */

  /** @override */
  _onCreate (data: D, options: any, userId: string): void

  /** @override */
  _onUpdate (data: Partial<D>, options: Entity.UpdateOptions, userId: string): void

  /** @override */
  _onDelete (options: Entity.DeleteOptions, userId: string): void

  /** @override */
  _onDeleteEmbeddedEntity (
    embeddedName: string,
    child: Combat.Combatant,
    options: Entity.UpdateOptions,
    userId: string
  ): void

  /** @override */
  _onModifyEmbeddedEntity (
    embeddedName: string,
    changes: any[],
    options: any,
    userId: string,
    context?: any
  ): void
}

declare namespace Combat {
/**
 * Data extension for Combat
 */
  interface Data extends Entity.Data {
    active: boolean
    combatants: any[]
    round: number
    turn: number
    scene: string
  }

  /**
 * Stores the round, turn and tokenId for the current turn. Also used for the
 * previous turn.
 */
  interface CurrentTurn {
    round: number
    turn: number
    tokenId: string|null
  }

  interface Combatant {
    [propName: string]: any
  }
}
