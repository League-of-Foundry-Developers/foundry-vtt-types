import type { ConfiguredDocumentClass } from "../../../../types/helperTypes";
import type { DocumentModificationOptions } from "../../../common/abstract/document.mjs";
import type { ChatMessageDataConstructorData } from "../../../common/data/data.mjs/chatMessageData";
import type { CombatantDataSource } from "../../../common/data/data.mjs/combatantData";

declare global {
  /**
   * The Combat model definition which defines common behavior of an Combat document between both client and server.
   * Each Combat document contains CombatData which defines its data schema.
   *
   * @see {@link data.CombatData}               The Combat data schema
   * @see {@link documents.Combats}             The world-level collection of Combat documents
   * @see {@link embedded.Combatant}            The Combatant embedded document which exists within a Combat document
   * @see {@link applications.CombatConfig}     The Combat configuration application
   */
  class Combat extends ClientDocumentMixin(foundry.documents.BaseCombat) {
    /**
     * @param data - Initial data provided to construct the Combat document
     */
    constructor(
      data?: ConstructorParameters<ConstructorOf<foundry.documents.BaseCombat>>[0],
      context?: ConstructorParameters<ConstructorOf<foundry.documents.BaseCombat>>[1]
    );

    /** Track the sorted turn order of this combat encounter */
    turns: InstanceType<ConfiguredDocumentClass<typeof Combatant>>[];

    /** Record the current round, turn, and tokenId to understand changes in the encounter state */
    current: RoundData;

    /** Track the previous round, turn, and tokenId to understand changes in the encounter state */
    previous: RoundData;

    /**
     * Track whether a sound notification is currently being played to avoid double-dipping
     * @defaultValue `false`
     * @internal
     */
    protected _soundPlaying: boolean;

    /** The configuration setting used to record Combat preferences */
    static CONFIG_SETTING: "combatTrackerConfig";

    /** Get the Combatant who has the current turn. */
    get combatant(): this["turns"][number] | undefined;

    /** The numeric round of the Combat encounter */
    get round(): number;

    /**
     * A reference to the Scene document within which this Combat encounter occurs.
     * If a specific Scene is not set in the Combat Data, the currently viewed scene is assumed instead.
     */
    get scene(): InstanceType<ConfiguredDocumentClass<typeof Scene>> | undefined;

    /** Return the object of settings which modify the Combat Tracker behavior */
    get settings(): typeof CombatEncounters["settings"];

    /** Has this combat encounter been started? */
    get started(): boolean;

    /** The numeric turn of the combat round in the Combat encounter */
    get turn(): number | null;

    get visible(): true;

    /** Is this combat active in the current scene? */
    get isActive(): boolean;

    /**
     * Set the current Combat encounter as active within the Scene.
     * Deactivate all other Combat encounters within the viewed Scene and set this one as active
     * @param options - Additional context to customize the update workflow
     */
    activate(
      options?: DocumentModificationContext & foundry.utils.MergeObjectOptions
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof Combat>>[]>;

    /** Display a dialog querying the GM whether they wish to end the combat encounter and empty the tracker */
    endCombat(): Promise<InstanceType<ConfiguredDocumentClass<typeof Combat>> | undefined>;

    /**
     * Get a Combatant using its Token id
     * @param tokenId - The id of the Token for which to acquire the combatant
     */
    getCombatantByToken(tokenId: string): InstanceType<ConfiguredDocumentClass<typeof Combatant>> | undefined;

    /**
     * Get a Combatant using its Actor id
     * @param actorId - The id of the Actor for which to acquire the combatant
     */
    getCombatantByActor(actorId: string): InstanceType<ConfiguredDocumentClass<typeof Combatant>> | undefined;

    /** Advance the combat to the next round */
    nextRound(): Promise<this | undefined>;

    /** Advance the combat to the next turn */
    nextTurn(): Promise<this | undefined>;

    override prepareDerivedData(): void;

    /** Rewind the combat to the previous round */
    previousRound(): Promise<this | undefined>;

    /** Rewind the combat to the previous turn */
    previousTurn(): Promise<this | undefined>;

    /** Toggle whether this combat is linked to the scene or globally available. */
    toggleSceneLink(): Promise<this | undefined>;

    /** Reset all combatant initiative scores, setting the turn back to zero */
    resetAll(): Promise<this | undefined>;

    /**
     * Roll initiative for one or multiple Combatants within the Combat document
     * @param ids     - A Combatant id or Array of ids for which to roll
     * @param options - Additional options which modify how initiative rolls are created or presented.
     *                  default `{}`
     * @returns A promise which resolves to the updated Combat document once updates are complete.
     */
    rollInitiative(ids: string | string[], options?: InitiativeOptions): Promise<this>;

    /**
     * Roll initiative for all combatants which have not already rolled
     * @param options - Additional options forwarded to the Combat.rollInitiative method
     *                  default `{}`
     */
    rollAll(options?: InitiativeOptions): Promise<this>;

    /**
     * Roll initiative for all non-player actors who have not already rolled
     * @param options - Additional options forwarded to the Combat.rollInitiative method
     *                  default `{}`
     */
    rollNPC(options?: InitiativeOptions): Promise<this>;

    /**
     * Assign initiative for a single Combatant within the Combat encounter.
     * Update the Combat turn order to maintain the same combatant as the current turn.
     * @param id    - The combatant ID for which to set initiative
     * @param value - A specific initiative value to set
     */
    setInitiative(id: string, value: number): Promise<void>;

    /** Return the Array of combatants sorted into initiative order, breaking ties alphabetically by name. */
    setupTurns(): this["turns"];

    /** Begin the combat encounter, advancing to round 1 and turn 1 */
    startCombat(): Promise<this | undefined>;

    /**
     * Define how the array of Combatants is sorted in the displayed list of the tracker.
     * This method can be overridden by a system or module which needs to display combatants in an alternative order.
     * By default sort by initiative, next falling back to name, lastly tie-breaking by combatant id.
     * @internal
     */
    protected _sortCombatants(
      a: InstanceType<ConfiguredDocumentClass<typeof Combatant>>,
      b: InstanceType<ConfiguredDocumentClass<typeof Combatant>>
    ): number;

    protected override _onCreate(
      data: this["data"]["_source"],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected override _onUpdate(
      changed: DeepPartial<this["data"]["_source"]>,
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected override _onDelete(options: DocumentModificationOptions, userId: string): void;

    protected override _onCreateEmbeddedDocuments(
      type: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof Combatant>>[],
      result: CombatantDataSource[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected override _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof Combatant>>[],
      result: CombatantDataSource[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected override _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof Combatant>>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;
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
  messageOptions?: ChatMessageDataConstructorData;
}

interface RoundData {
  round: number | null;
  turn: number | null;
  tokenId: string | null;
  combatantId: string | null;
}
