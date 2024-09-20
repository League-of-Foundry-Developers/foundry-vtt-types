import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";
import type { ConstructorOf, InexactPartial } from "../../../../types/utils.d.mts";
import type {
  DocumentDatabaseOperations,
  DocumentOnCreateOptions,
  DocumentOnDeleteOptions,
  DocumentOnUpdateOptions,
} from "../../../common/abstract/document.d.mts";

declare global {
  namespace Combat {
    type ConfiguredClass = ConfiguredDocumentClassForName<"Combat">;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;

    /* eslint-disable @typescript-eslint/no-empty-object-type */
    export interface DatabaseOperations
      extends DocumentDatabaseOperations<
        Combat,
        {},
        { direction: -1 | 1; worldTime: { delta: number }; turnEvents: boolean },
        {}
      > {}
    /* eslint-enable @typescript-eslint/no-empty-object-type */

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
      messageOptions?: foundry.documents.BaseChatMessage.ConstructorData;
    }

    interface CombatHistoryData {
      round: number | null;
      turn: number | null;
      tokenId: string | null;
      combatantId: string | null;
    }
  }

  /**
   * The client-side Combat document which extends the common BaseCombat model.
   *
   * @see {@link Combats}                       The world-level collection of Combat documents
   * @see {@link Combatant}                     The Combatant embedded document which exists within a Combat document
   * @see {@link CombatConfig}                  The Combat configuration application
   */
  class Combat extends ClientDocumentMixin(foundry.documents.BaseCombat) {
    /**
     * @param data - Initial data provided to construct the Combat document
     */
    constructor(
      data?: ConstructorParameters<ConstructorOf<foundry.documents.BaseCombat>>[0],
      context?: ConstructorParameters<ConstructorOf<foundry.documents.BaseCombat>>[1],
    );

    /** Track the sorted turn order of this combat encounter */
    turns: Combatant.ConfiguredInstance[];

    /** Record the current round, turn, and tokenId to understand changes in the encounter state */
    current: Combat.CombatHistoryData;

    /** Track the previous round, turn, and tokenId to understand changes in the encounter state */
    previous: Combat.CombatHistoryData;

    /**
     * The configuration setting used to record Combat preferences
     * Default: `"combatTrackerConfig"`
     */
    static CONFIG_SETTING: string;

    /** Get the Combatant who has the current turn. */
    get combatant(): this["turns"][number] | undefined;

    /**
     * Get the Combatant who has the next turn.
     */
    get nextCombatant(): Combatant.ConfiguredInstance | undefined;

    /** Return the object of settings which modify the Combat Tracker behavior */
    // Type is copied here to avoid recursion issue
    get settings(): ClientSettings.Values[`core.${(typeof Combat)["CONFIG_SETTING"]}`];

    /** Has this combat encounter been started? */
    get started(): boolean;

    get visible(): true;

    /** Is this combat active in the current scene? */
    get isActive(): boolean;

    /**
     * Set the current Combat encounter as active within the Scene.
     * Deactivate all other Combat encounters within the viewed Scene and set this one as active
     * @param options - Additional context to customize the update workflow
     */
    activate(options?: DocumentOnUpdateOptions<"Combat">): Promise<Combat.ConfiguredInstance[]>;

    override prepareDerivedData(): void;

    /**
     * Get a Combatant using its Token id
     * @param token - A Token ID or a TokenDocument instance
     * @returns An array of Combatants which represent the Token.
     */
    getCombatantsByToken(token: string | TokenDocument): Combatant.ConfiguredInstance[];

    /**
     * Get a Combatant that represents the given Actor or Actor ID.
     * @param actorOrId - An Actor ID or an Actor instance.
     */
    getCombatantsByActor(actorOrId: string | Actor): Combatant.ConfiguredInstance[];

    /** Begin the combat encounter, advancing to round 1 and turn 1 */
    startCombat(): Promise<this>;

    /** Advance the combat to the next round */
    nextRound(): Promise<this>;

    /** Rewind the combat to the previous round */
    previousRound(): Promise<this>;

    /** Advance the combat to the next turn */
    nextTurn(): Promise<this>;

    /** Rewind the combat to the previous turn */
    previousTurn(): Promise<this>;

    /** Display a dialog querying the GM whether they wish to end the combat encounter and empty the tracker */
    endCombat(): Promise<this>;

    /** Toggle whether this combat is linked to the scene or globally available. */
    toggleSceneLink(): Promise<this>;

    /** Reset all combatant initiative scores, setting the turn back to zero */
    resetAll(): Promise<this>;

    /**
     * Roll initiative for one or multiple Combatants within the Combat document
     * @param ids     - A Combatant id or Array of ids for which to roll
     * @param options - Additional options which modify how initiative rolls are created or presented.
     *                  default `{}`
     * @returns A promise which resolves to the updated Combat document once updates are complete.
     */
    rollInitiative(ids: string | string[], options?: Combat.InitiativeOptions): Promise<this>;

    /**
     * Roll initiative for all combatants which have not already rolled
     * @param options - Additional options forwarded to the Combat.rollInitiative method
     *                  default `{}`
     */
    rollAll(options?: Combat.InitiativeOptions): Promise<this>;

    /**
     * Roll initiative for all non-player actors who have not already rolled
     * @param options - Additional options forwarded to the Combat.rollInitiative method
     *                  default `{}`
     */
    rollNPC(options?: Combat.InitiativeOptions): Promise<this>;

    /**
     * Assign initiative for a single Combatant within the Combat encounter.
     * Update the Combat turn order to maintain the same combatant as the current turn.
     * @param id    - The combatant ID for which to set initiative
     * @param value - A specific initiative value to set
     */
    setInitiative(id: string, value: number): Promise<void>;

    /** Return the Array of combatants sorted into initiative order, breaking ties alphabetically by name. */
    setupTurns(): this["turns"];

    /**
     * Debounce changes to the composition of the Combat encounter to de-duplicate multiple concurrent Combatant changes.
     * If this is the currently viewed encounter, re-render the CombatTracker application.
     */
    debounceSetup: () => ReturnType<typeof foundry.utils.debounce>;

    /**
     * Update active effect durations for all actors present in this Combat encounter.
     */
    updateCombatantActors(): void;

    /**
     * Loads the registered Combat Theme (if any) and plays the requested type of sound.

   * If multiple exist for that type, one is chosen at random.
     * @param announcement - The announcement that should be played: "startEncounter", "nextUp", or "yourTurn".
     */
    protected _playCombatSound(announcement: foundry.CONST.COMBAT_ANNOUNCEMENTS): void;

    /**
     * Define how the array of Combatants is sorted in the displayed list of the tracker.
     * This method can be overridden by a system or module which needs to display combatants in an alternative order.
     * By default sort by initiative, next falling back to name, lastly tie-breaking by combatant id.
     * @internal
     */
    protected _sortCombatants(a: Combatant.ConfiguredInstance, b: Combatant.ConfiguredInstance): number;

    /**
     * Refresh the Token HUD under certain circumstances.
     * @param documents - A list of Combatant documents that were added or removed.
     */
    protected _refreshTokenHUD(documents: Array<Combatant>): void;

    /**
     * @privateRemarks _onCreate, _onUpdate, and _onDelete  are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    protected override _onCreateDescendantDocuments(
      parent: ClientDocument,
      collection: string,
      documents: ClientDocument[],
      result: unknown[],
      options: DocumentOnCreateOptions<"Combatant"> & InexactPartial<{ combatTurn: number; turnEvents: boolean }>,
      userId: string,
    ): void;

    protected override _onUpdateDescendantDocuments(
      parent: ClientDocument,
      collection: string,
      documents: ClientDocument[],
      changes: unknown[],
      options: DocumentOnUpdateOptions<"Combatant"> & InexactPartial<{ combatTurn: number; turnEvents: boolean }>,
      userId: string,
    ): void;

    protected override _onDeleteDescendantDocuments(
      parent: ClientDocument,
      collection: string,
      documents: ClientDocument[],
      ids: string,
      options: DocumentOnDeleteOptions<"Combatant"> & InexactPartial<{ combatTurn: number; turnEvents: boolean }>,
      userId: string,
    ): void;

    #onModifyCombatants();

    /**
     * Get the current history state of the Combat encounter.
     * @param combatant - The new active combatant
     */
    protected _getCurrentState(combatant: Combatant): Combat.CombatHistoryData;

    /**
     * Manage the execution of Combat lifecycle events.
     * This method orchestrates the execution of four events in the following order, as applicable:
     * 1. End Turn
     * 2. End Round
     * 3. Begin Round
     * 4. Begin Turn
     * Each lifecycle event is an async method, and each is awaited before proceeding.
     * @param adjustedTurn - Optionally, an adjusted turn to commit to the Combat.
     */
    protected _manageTurnEvents(adjustedTurn: number): Promise<void>;

    /**
     * A workflow that occurs at the end of each Combat Turn.
     * This workflow occurs after the Combat document update, prior round information exists in this.previous.
     * This can be overridden to implement system-specific combat tracking behaviors.
     * This method only executes for one designated GM user. If no GM users are present this method will not be called.
     * @param combatant - The Combatant whose turn just ended
     */
    protected _onEndTurn(combatant: Combatant): Promise<void>;

    /**
     * A workflow that occurs at the end of each Combat Round.
     * This workflow occurs after the Combat document update, prior round information exists in this.previous.
     * This can be overridden to implement system-specific combat tracking behaviors.
     * This method only executes for one designated GM user. If no GM users are present this method will not be called.
     */
    protected _onEndRound(): Promise<void>;

    /**
     * A workflow that occurs at the start of each Combat Round.
     * This workflow occurs after the Combat document update, new round information exists in this.current.
     * This can be overridden to implement system-specific combat tracking behaviors.
     * This method only executes for one designated GM user. If no GM users are present this method will not be called.
     */
    protected _onStartRound(): Promise<void>;

    /**
     * A workflow that occurs at the start of each Combat Turn.
     * This workflow occurs after the Combat document update, new turn information exists in this.current.
     * This can be overridden to implement system-specific combat tracking behaviors.
     * This method only executes for one designated GM user. If no GM users are present this method will not be called.
     * @param combatant - The Combatant whose turn just started
     */
    protected _onStartTurn(combatant: Combatant): Promise<void>;

    /**
     * @deprecated Since v11 until v13. Use {@link Combat#updateCombatantActors} instead.
     */
    updateEffectDurations(): void;

    /**
     * @deprecated Since v12. Use {@link Combat#getCombatantsByActor} instead.
     */
    getCombatantByActor(actor: Actor): Combatant[];

    /**
     * @deprecated Since v12. Use {@link Combat#getCombatantsByActor} instead.
     */
    getCombatantByToken(token: Token): Combatant[];
  }
}
