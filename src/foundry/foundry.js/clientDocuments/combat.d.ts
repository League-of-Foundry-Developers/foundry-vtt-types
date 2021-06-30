import { ConfiguredDocumentClass } from '../../../types/helperTypes';
import { DocumentModificationOptions } from '../../common/abstract/document.mjs';

// TODO
declare global {
  /**
   * The client-side Combat document which extends the common BaseCombat abstraction.
   * Each Combat document contains CombatData which defines its data schema.
   *
   * @see {@link data.CombatData}               The Combat data schema
   * @see {@link documents.Combats}             The world-level collection of Combat documents
   * @see {@link embedded.Combatant}            The Combatant embedded document which exists within a Combat document
   * @see {@link applications.CombatConfig}     The Combat configuration application
   *
   * @param data - Initial data provided to construct the Combat document
   */
  class Combat extends ClientDocumentMixin(foundry.documents.BaseCombat) {
    /**
     * The configuration setting used to record Combat preferences
     */
    static CONFIG_SETTING: 'combatTrackerConfig';

    /** Track the sorted turn order of this combat encounter */
    turns: InstanceType<ConfiguredDocumentClass<typeof Combatant>>[];

    /** Record the current round, turn, and tokenId to understand changes in the encounter state */
    protected current: RoundData;

    /** Track the previous round, turn, and tokenId to understand changes in the encounter state */
    protected previous: RoundData;

    /**
     * Track whether a sound notification is currently being played to avoid double-dipping
     * @defaultValue `false`
     */
    protected _soundPlaying: boolean;

    /** Get the Combatant who has the current turn. */
    get combatant(): InstanceType<ConfiguredDocumentClass<typeof Combatant>>;

    /** The numeric round of the Combat encounter */
    get round(): number;

    /**
     * A reference to the Scene document within which this Combat encounter occurs.
     * If a specific Scene is not set in the Combat Data, the currently viewed scene is assumed instead.
     */
    get scene(): InstanceType<ConfiguredDocumentClass<typeof Scene>>;

    /** Return the object of settings which modify the Combat Tracker behavior */
    get settings(): ClientSettings.Values[typeof Combat['CONFIG_SETTING']];

    /** Has this combat encounter been started? */
    get started(): boolean;

    /** The numeric turn of the combat round in the Combat encounter */
    get turn(): number;

    get visible(): true;

    /**
     * Set the current Combat encounter as active within the Scene.
     * Deactivate all other Combat encounters within the viewed Scene and set this one as active
     */
    activate(): Promise<this>;

    /** Display a dialog querying the GM whether they wish to end the combat encounter and empty the tracker */
    endCombat(): Promise<this>;

    /**
     * Get a Combatant using its Token id
     * @param tokenId - The id of the Token for which to acquire the combatant
     */
    getCombatantByToken(tokenId: string): InstanceType<ConfiguredDocumentClass<typeof Combatant>>;

    /** Advance the combat to the next round */
    nextRound(): Promise<this>;

    /** Advance the combat to the next turn */
    nextTurn(): Promise<this>;

    /** @override */
    prepareDerivedData(): void;

    /** Rewind the combat to the previous round */
    previousRound(): Promise<this>;

    /** Rewind the combat to the previous turn */
    previousTurn(): Promise<this>;

    /** Reset all combatant initiative scores, setting the turn back to zero */
    resetAll(): Promise<this>;

    /**
     * Roll initiative for one or multiple Combatants within the Combat entity
     * @param ids - A Combatant id or Array of ids for which to roll
     * @param options - Additional options which modify how initiative rolls are created or presented.
     *                  default `{}`
     * @returns  A promise which resolves to the updated Combat entity once updates are complete.
     */
    rollInitiative(ids: string | string[], options?: InitiativeOptions): Promise<this>;

    /**
     * Roll initiative for all combatants which have not already rolled
     * @param options - Additional options forwarded to the Combat.rollInitiative method
     *                  default `{}`
     */
    rollAll(options?: InitiativeOptions): this['rollInitiative'];

    /**
     * Roll initiative for all non-player actors who have not already rolled
     * @param options - Additional options forwarded to the Combat.rollInitiative method
     *                  default `{}`
     */
    rollNPC(options?: InitiativeOptions): this['rollInitiative'];

    /**
     * Assign initiative for a single Combatant within the Combat encounter.
     * Update the Combat turn order to maintain the same combatant as the current turn.
     * @param id - The combatant ID for which to set initiative
     * @param value - A specific initiative value to set
     */
    setInitiative(id: string, value: number): Promise<void>;

    /** Return the Array of combatants sorted into initiative order, breaking ties alphabetically by name. */
    setupTurns(): InstanceType<ConfiguredDocumentClass<typeof Combatant>>[];

    /** Begin the combat encounter, advancing to round 1 and turn 1 */
    startCombat(): Promise<this>;

    /**
     * Define how the array of Combatants is sorted in the displayed list of the tracker.
     * This method can be overridden by a system or module which needs to display combatants in an alternative order.
     * By default sort by initiative, next falling back to name, lastly tie-breaking by combatant id.
     */
    protected _sortCombatants(
      a: InstanceType<ConfiguredDocumentClass<typeof Combatant>>,
      b: InstanceType<ConfiguredDocumentClass<typeof Combatant>>
    ): number;

    protected _onCreate(data: this['data']['_source'], options: DocumentModificationOptions, userId: string): void;

    protected _onUpdate(
      changed: DeepPartial<this['data']['_source']> & Record<string, unknown>,
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected _onDelete(options: DocumentModificationOptions, userId: string): void;

    protected _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: foundry.abstract.Document<any, any>[],
      result: Record<string, unknown>[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: foundry.abstract.Document<any, any>[],
      result: Record<string, unknown>[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: foundry.abstract.Document<any, any>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;

    /** @deprecated since 0.8.0 */
    getCombatant(id: string): this['combatants']['get'];

    /** @deprecated since 0.8.0 */
    createCombatant(
      data: Array<Record<string, unknown>>,
      context?: DocumentModificationContext
    ): this['createEmbeddedDocuments'];

    /** @deprecated since 0.8.0 */
    updateCombatant(
      data: DeepPartial<Combatant['data']> & Record<string, unknown>,
      context?: DocumentModificationContext
    ): Combatant['update'];

    /** @deprecated since 0.8.0 */
    deleteCombatant(id: string, options?: DocumentModificationContext): Combatant['delete'];
  }
}

interface InitiativeOptions {
  /**
   * A non-default initiative formula to roll. Otherwise the system default is used.
   * @defaultValue `null`
   */
  formula?: string | null;
  /**
   * Update the Combat turn after adding new initiative scores to keep the turn on the same Combatant.
   * @defaultValue `true`
   */
  updateTurn?: boolean;
  /**
   * Additional options with which to customize created Chat Messages
   * @defaultValue `{}`
   */
  messageOptions?: object; //TODO Type properly once ChatMessage is typed
}

interface RoundData {
  round?: number | null;
  turn?: number | null;
  tokenId?: string | null;
  combatantid?: string | null;
}

export {};
