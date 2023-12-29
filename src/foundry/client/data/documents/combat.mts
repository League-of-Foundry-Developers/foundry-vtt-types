import type { ConfiguredDocumentClass } from "../../../../types/helperTypes.mts";
import type { ConstructorOf } from "../../../../types/utils.mts";
import type { DocumentModificationOptions } from "../../../common/abstract/document.mts";
import type BaseCombat from "../../../common/documents/combat.mts";
import type BaseCombatant from "../../../common/documents/combatant.mts";

declare global {
  /**
   * The client-side Combat document which extends the common BaseCombat model.
   *
   * @see {@link Combats}             The world-level collection of Combat documents
   * @see {@link Combatant}                     The Combatant embedded document which exists within a Combat document
   * @see {@link CombatConfig}                  The Combat configuration application
   */
  class Combat extends ClientDocumentMixin(BaseCombat) {
    constructor(
      data?: ConstructorParameters<ConstructorOf<BaseCombat>>[0],
      context?: ConstructorParameters<ConstructorOf<BaseCombat>>[1],
    );

    /**
     * The configuration setting used to record Combat preferences
     * @defaultValue `"combatTrackerConfig"`
     */
    static CONFIG_SETTING: string;

    /**
     * Get the Combatant who has the current turn.
     */
    get combatant(): Combatant;

    /**
     * Get the Combatant who has the next turn.
     */
    get nextCombatant(): Combatant;

    /**
     * Return the object of settings which modify the Combat Tracker behavior
     */
    get settings(): typeof CombatEncounters.settings;

    /**
     * Has this combat encounter been started?
     */
    get started(): boolean;

    get visible(): true;

    /**
     * Is this combat active in the current scene?
     */
    get isActive(): boolean;

    /**
     * Set the current Combat encounter as active within the Scene.
     * Deactivate all other Combat encounters within the viewed Scene and set this one as active
     * @param options   - Additional context to customize the update workflow
     */
    activate(options: ConstructorParameters<ConstructorOf<BaseCombat>>[1]): Promise<Combat>;

    prepareDerivedData(): void;

    /**
     * Get a Combatant using its Token id
     * @param tokenId   - The id of the Token for which to acquire the combatant
     */
    getCombatantByToken(tokenId: string): Combatant;

    /**
     * Get a Combatant using its Actor id
     * @param actorId   - The id of the Actor for which to acquire the combatant
     */
    getCombatantByActor(actorId: string): Combatant;

    /**
     * Begin the combat encounter, advancing to round 1 and turn 1
     */
    startCombat(): Promise<Combat>;

    /**
     * Advance the combat to the next round
     */
    nextRound(): Promise<Combat>;

    /**
     * Rewind the combat to the previous round
     */
    previousRound(): Promise<Combat>;

    /**
     * Advance the combat to the next turn
     */
    nextTurn(): Promise<Combat>;

    /**
     * Rewind the combat to the previous turn
     */
    previousTurn(): Promise<Combat>;

    /**
     * Display a dialog querying the GM whether they wish to end the combat encounter and empty the tracker
     */
    endCombat(): Promise<Combat>;

    /**
     * Toggle whether this combat is linked to the scene or globally available.
     */
    toggleSceneLink(): Promise<Combat>;

    /**
     * Reset all combatant initiative scores, setting the turn back to zero
     */
    resetAll(): Promise<Combat>;

    /**
     * Roll initiative for one or multiple Combatants within the Combat document
     * @param ids       - A Combatant id or Array of ids for which to roll
     * @param options   - Additional options which modify how initiative rolls are created or presented.
     *                  (default: `{}`)
     * @returns A promise which resolves to the updated Combat document once updates are complete.
     */
    rollInitiative(ids: string | string[], options?: RollInitiativeOptions): Promise<Combat>;

    /**
     * Roll initiative for all combatants which have not already rolled
     * @param options   - Additional options forwarded to the Combat.rollInitiative method
     *                  (default: `{}`)
     */
    rollAll(options?: RollInitiativeOptions): Promise<Combat>;

    /**
     * Roll initiative for all non-player actors who have not already rolled
     * @param options   - Additional options forwarded to the Combat.rollInitiative method
     *                  (default: `{}`)
     */
    rollNPC(options?: RollInitiativeOptions): Promise<Combat>;

    /**
     * Assign initiative for a single Combatant within the Combat encounter.
     * Update the Combat turn order to maintain the same combatant as the current turn.
     * @param id      - The combatant ID for which to set initiative
     * @param value   - A specific initiative value to set
     */
    setInitiative(id: string, value: number): Promise<void>;

    /**
     * Return the Array of combatants sorted into initiative order, breaking ties alphabetically by name.
     */
    setupTurns(): Combatant[];

    /**
     * Update active effect durations for all actors present in this Combat encounter.
     */
    updateEffectDurations(): void;

    /**
     * Loads the registered Combat Theme (if any) and plays the requested type of sound.
     * If multiple exist for that type, one is chosen at random.
     * @param type  - One of [ "startEncounter", "nextUp", "yourTurn" ]
     * @internal
     */
    protected _playCombatSound(type: string): void;

    /**
     * Define how the array of Combatants is sorted in the displayed list of the tracker.
     * This method can be overridden by a system or module which needs to display combatants in an alternative order.
     * The default sorting rules sort in descending order of initiative using combatant IDs for tiebreakers.
     * @param a   - Some combatant
     * @param b   - Some other combatant
     * @internal
     */
    protected _sortCombatants(a: Combatant, b: Combatant): number;

    /** @internal */
    protected _onCreate(data: BaseCombat.ConstructorData, options: DocumentModificationOptions, userId: string): void;

    /** @internal */
    protected _onUpdate(data: BaseCombat.UpdateData, options: DocumentModificationOptions, userId: string): void;

    /** @internal */
    protected _onDelete(options: DocumentModificationOptions, userId: string): void;

    /** @internal */
    protected override _onCreateEmbeddedDocuments(
      type: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof Combatant>>[],
      result: BaseCombatant.ConstructorData[],
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    /** @internal */
    protected override _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof Combatant>>[],
      result: BaseCombatant.UpdateData[],
      options: DocumentModificationContext,
      userId: string,
    ): void;

    /** @internal */
    protected override _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof Combatant>>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string,
    ): void;
  }
}

interface RollInitiativeOptions {
  /**
   * A non-default initiative formula to roll. Otherwise, the system
   *                                                default is used.
   * @defaultValue `null`
   */
  formula?: string | null;
  /**
   * Update the Combat turn after adding new initiative scores to
   *                                                keep the turn on the same Combatant.
   * @defaultValue `true`
   */
  updateTurn?: boolean;
  /**
   * Additional options with which to customize created Chat Messages
   * @defaultValue `{}`
   */
  messageOptions?: object;
}
