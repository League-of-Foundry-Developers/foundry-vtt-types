import type { ConfiguredCombat } from "../../../../configuration/index.d.mts";
import type { HandleEmptyObject, InexactPartial } from "../../../../utils/index.d.mts";
import type { documents } from "../../../client-esm/client.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields } from "../../../common/data/module.d.mts";
import type BaseCombat from "../../../common/documents/combat.d.mts";

declare global {
  namespace Combat {
    /**
     * The implementation of the Combat document instance configured through `CONFIG.Combat.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredCombat | `configuration/ConfiguredCombat`} in fvtt-types.
     */
    type Implementation = Document.ConfiguredInstanceForName<"Combat">;

    /**
     * The implementation of the Combat document configured through `CONFIG.Combat.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ConfiguredClassForName<"Combat">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"Combat"> {}

    type SubType = Game.Model.TypeNames<"Combat">;
    type OfType<Type extends SubType> = HandleEmptyObject<ConfiguredCombat<Type>, Combat<SubType>>;

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = Actor.Implementation | Item.Implementation | null;

    /**
     * An instance of `Combat` that comes from the database.
     */
    interface Stored extends Document.Stored<Combat.Implementation> {}

    /**
     * The data put in {@link Document._source | `Document._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link Combat._source | `Combat._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link Combat.create | `Combat.create`}
     * and {@link Combat | `new Combat(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link Combat.name | `Combat#name`}.
     *
     * This is data transformed from {@link Combat.Source | `Combat.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link Combat.update | `Combat#update`}.
     * It is a distinct type from {@link Combat.CreateData | `DeepPartial<Combat.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link Combat | `Combat`}. This is the source of truth for how an Combat document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link Combat | `Combat`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies this Combat document
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      type: fields.DocumentTypeField<typeof BaseCombat, { initial: typeof foundry.CONST.BASE_DOCUMENT_TYPE }>;

      system: fields.TypeDataField<typeof BaseCombat>;

      /**
       * The _id of a Scene within which this Combat occurs
       * @defaultValue `null`
       */
      scene: fields.ForeignDocumentField<typeof documents.BaseScene>;

      /**
       * A Collection of Combatant embedded Documents
       * @defaultValue `[]`
       */
      combatants: fields.EmbeddedCollectionField<typeof documents.BaseCombatant, Combat.ConfiguredInstance>;

      /**
       * Is the Combat encounter currently active?
       * @defaultValue `false`
       */
      active: fields.BooleanField;

      /**
       * The current round of the Combat encounter
       * @defaultValue `0`
       */
      round: fields.NumberField<{
        required: true;
        nullable: false;
        integer: true;
        min: 0;
        initial: 0;
        label: "COMBAT.Round";
      }>;

      /**
       * The current turn in the Combat round
       * @defaultValue `null`
       */
      turn: fields.NumberField<{ required: true; integer: true; min: 0; initial: null; label: "COMBAT.Turn" }>;

      /**
       * The current sort order of this Combat relative to others in the same Scene
       * @defaultValue `0`
       */
      sort: fields.IntegerSortField;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<"Combat">;

      /**
       * An object of creation and access information
       * @defaultValue see {@link fields.DocumentStatsField}
       */
      _stats: fields.DocumentStatsField;
    }
    namespace DatabaseOperation {
      /** Options passed along in Get operations for Combats */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<Combat.Parent> {}
      /** Options passed along in Create operations for Combats */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<Combat.CreateData, Combat.Parent, Temporary> {}
      /** Options passed along in Delete operations for Combats */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Combat.Parent> {}
      /** Options passed along in Update operations for Combats */
      interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Combat.UpdateData, Combat.Parent> {
        direction: -1 | 1;
        worldTime: { delta: number };
        turnEvents: boolean;
      }

      /** Options for {@link Combat.createDocuments} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link Combat._preCreateOperation} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link Combat#_preCreate} */
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      /** Options for {@link Combat#_onCreate} */
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      /** Options for {@link Combat.updateDocuments} */
      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      /** Options for {@link Combat._preUpdateOperation} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link Combat#_preUpdate} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      /** Options for {@link Combat#_onUpdate} */
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      /** Options for {@link Combat.deleteDocuments} */
      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      /** Options for {@link Combat._preDeleteOperation} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link Combat#_preDelete} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link Combat#_onDelete} */
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    /**
     * @deprecated - {@link Combat.DatabaseOperation}
     */
    /* eslint-disable @typescript-eslint/no-empty-object-type */
    interface DatabaseOperations
      extends Document.Database.Operations<
        Combat,
        {},
        { direction: -1 | 1; worldTime: { delta: number }; turnEvents: boolean },
        {}
      > {}
    /* eslint-enable @typescript-eslint/no-empty-object-type */

    /**
     * @deprecated {@link Combat.Types | `Combat.SubType`}
     */
    type TypeNames = Combat.SubType;

    /**
     * @deprecated {@link Combat.CreateData | `Combat.CreateData`}
     */
    interface ConstructorData extends Combat.CreateData {}

    /**
     * @deprecated {@link Combat.implementation | `Combat.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link Combat.Implementation | `Combat.Implementation`}
     */
    type ConfiguredInstance = Implementation;

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

    interface HistoryData {
      round: number | null;
      turn: number | null;
      tokenId: string | null;
      combatantId: string | null;
    }

    type CONFIG_SETTING = "combatTrackerConfig";
  }

  /**
   * The client-side Combat document which extends the common BaseCombat model.
   *
   * @see {@link Combats}                       The world-level collection of Combat documents
   * @see {@link Combatant}                     The Combatant embedded document which exists within a Combat document
   * @see {@link CombatConfig}                  The Combat configuration application
   */
  class Combat<out SubType extends Combat.SubType = Combat.SubType> extends ClientDocumentMixin(
    foundry.documents.BaseCombat,
  )<SubType> {
    static override metadata: Combat.Metadata;

    static get implementation(): Combat.ConfiguredClass;

    /**
     * @param data - Initial data provided to construct the Combat document
     */
    // Note(LukeAbby): TODO, this constructor just copies from the parent. Should this just be removed?
    // constructor(
    //   data?: ConstructorParameters<typeof foundry.documents.BaseCombat>[0],
    //   context?: ConstructorParameters<typeof foundry.documents.BaseCombat>[1],
    // );

    /** Track the sorted turn order of this combat encounter */
    turns: Combatant.ConfiguredInstance[];

    /** Record the current round, turn, and tokenId to understand changes in the encounter state */
    current: Combat.HistoryData;

    /** Track the previous round, turn, and tokenId to understand changes in the encounter state */
    previous: Combat.HistoryData;

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
    get settings(): ClientSettings.SettingInitializedType<"core", Combat.CONFIG_SETTING>;

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
    activate(options?: Document.OnUpdateOptions<"Combat">): Promise<Combat.ConfiguredInstance[]>;

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
      options: Document.OnCreateOptions<"Combatant"> & InexactPartial<{ combatTurn: number; turnEvents: boolean }>,
      userId: string,
    ): void;

    protected override _onUpdateDescendantDocuments(
      parent: ClientDocument,
      collection: string,
      documents: ClientDocument[],
      changes: unknown[],
      options: Document.OnUpdateOptions<"Combatant"> & InexactPartial<{ combatTurn: number; turnEvents: boolean }>,
      userId: string,
    ): void;

    protected override _onDeleteDescendantDocuments(
      parent: ClientDocument,
      collection: string,
      documents: ClientDocument[],
      ids: string[],
      options: Document.OnDeleteOptions<"Combatant"> & InexactPartial<{ combatTurn: number; turnEvents: boolean }>,
      userId: string,
    ): void;

    #onModifyCombatants();

    /**
     * Get the current history state of the Combat encounter.
     * @param combatant - The new active combatant
     */
    protected _getCurrentState(combatant: Combatant): Combat.HistoryData;

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
