import type { ConfiguredCombat } from "#configuration";
import type { Identity, InexactPartial, Merge, NullishProps } from "#utils";
import type { documents } from "#client/client.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BaseCombat from "#common/documents/combat.d.mts";
import type { Token } from "#client/canvas/placeables/_module.d.mts";

import fields = foundry.data.fields;

declare namespace Combat {
  /**
   * The document's name.
   */
  type Name = "Combat";

  /**
   * The context used to create a `Combat`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `Combat`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `Combat` document instance configured through `CONFIG.Combat.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} or {@link ConfiguredCombat | `fvtt-types/configuration/ConfiguredCombat`} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `Combat` document configured through `CONFIG.Combat.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  /**
   * A document's metadata is special information about the document ranging anywhere from its name,
   * whether it's indexed, or to the permissions a user has over it.
   */
  interface Metadata
    extends Merge<
      Document.Metadata.Default,
      Readonly<{
        name: "Combat";
        collection: "combats";
        label: string;
        labelPlural: string;
        embedded: Metadata.Embedded;
        hasTypeData: true;
        permissions: Metadata.Permissions;
        schemaVersion: string;
      }>
    > {}

  namespace Metadata {
    /**
     * The embedded metadata
     */
    interface Embedded {
      Combatant: "combatants";
      CombatantGroup: "groups";
    }

    /**
     * The permissions for whether a certain user can create, update, or delete this document.
     */
    interface Permissions {
      update(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
    }
  }

  /**
   * Allowed subtypes of `Combat`. This is configured through various methods. Modern Foundry
   * recommends registering using [Data Models](https://foundryvtt.com/article/system-data-models/)
   * under {@linkcode CONFIG.Combat.dataModels}. This corresponds to
   * fvtt-type's {@linkcode DataModelConfig}.
   *
   * Subtypes can also be registered through a `template.json` though this is discouraged.
   * The corresponding fvtt-type configs are {@linkcode SourceConfig} and
   * {@linkcode DataConfig}.
   */
  type SubType = foundry.Game.Model.TypeNames<"Combat">;

  /**
   * `ConfiguredSubType` represents the subtypes a user explicitly registered. This excludes
   * subtypes like the Foundry builtin subtype `"base"` and the catch-all subtype for arbitrary
   * module subtypes `${string}.${string}`.
   *
   * @see {@link SubType} for more information.
   */
  type ConfiguredSubType = Document.ConfiguredSubTypeOf<"Combat">;

  /**
   * `Known` represents the types of `Combat` that a user explicitly registered.
   *
   * @see {@link ConfiguredSubType} for more information.
   */
  type Known = Combat.OfType<Combat.ConfiguredSubType>;

  /**
   * `OfType` returns an instance of `Combat` with the corresponding type. This works with both the
   * builtin `Combat` class or a custom subclass if that is set up in
   * {@link ConfiguredCombat | `fvtt-types/configuration/ConfiguredCombat`}.
   */
  type OfType<Type extends SubType> = Document.Internal.DiscriminateSystem<Name, _OfType, Type, ConfiguredSubType>;

  /** @internal */
  interface _OfType
    extends Identity<{
      [Type in SubType]: Type extends unknown
        ? ConfiguredCombat<Type> extends { document: infer Document }
          ? Document
          : // eslint-disable-next-line @typescript-eslint/no-restricted-types
            Combat<Type>
        : never;
    }> {}

  /**
   * `SystemOfType` returns the system property for a specific `Combat` subtype.
   */
  type SystemOfType<Type extends SubType> = Document.Internal.SystemOfType<Name, _SystemMap, Type, ConfiguredSubType>;

  /**
   * @internal
   */
  interface _ModelMap extends Document.Internal.ModelMap<Name> {}

  /**
   * @internal
   */
  interface _SystemMap extends Document.Internal.SystemMap<Name> {}

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = null;

  /**
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all instances, or never if the document doesn't have any descendants.
   */
  type DescendantName = "Combatant";

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type DirectDescendant = Combatant.Stored;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such classes, or never if the document doesn't have any descendants.
   */
  type DirectDescendantClass = Combatant.ImplementationClass;

  /**
   * A document's descendants are any documents that are contained within, either within its schema
   * or its descendant's schemas.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type Descendant = DirectDescendant;

  /**
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all classes, or never if the document doesn't have any descendants.
   */
  type DescendantClass = DirectDescendantClass;

  /**
   * Types of `CompendiumCollection` this document might be contained in.
   * Note that `this.pack` will always return a string; this is the type for `game.packs.get(this.pack)`
   *
   * Will be `never` if cannot be contained in a `CompendiumCollection`.
   */
  // Note: Takes any document in the heritage chain (i.e. itself or any parent, transitive or not) that can be contained in a compendium.
  type Pack = never;

  /**
   * An embedded document is a document contained in another.
   * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
   *
   * If this is `never` it is because there are no embeddable documents (or there's a bug!).
   */
  type Embedded = Document.ImplementationFor<Embedded.Name>;

  namespace Embedded {
    /**
     * An embedded document is a document contained in another.
     * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
     *
     * If this is `never` it is because there are no embeddable documents (or there's a bug!).
     */
    type Name = keyof Metadata.Embedded;

    /**
     * Gets the collection name for an embedded document.
     */
    type CollectionNameOf<CollectionName extends Embedded.CollectionName> = Document.Embedded.CollectionNameFor<
      Metadata.Embedded,
      CollectionName
    >;

    /**
     * Gets the collection document for an embedded document.
     */
    type DocumentFor<CollectionName extends Embedded.CollectionName> = Document.Embedded.DocumentFor<
      Metadata.Embedded,
      CollectionName
    >;

    /**
     * Gets the collection for an embedded document.
     */
    type CollectionFor<CollectionName extends Embedded.CollectionName> = Document.Embedded.CollectionFor<
      Combat.Implementation,
      Metadata.Embedded,
      CollectionName
    >;

    /**
     * A valid name to refer to a collection embedded in this document. For example an `Actor`
     * has the key `"items"` which contains `Item` instance which would make both `"Item" | "Items"`
     * valid keys (amongst others).
     */
    type CollectionName = Document.Embedded.CollectionName<Metadata.Embedded>;
  }

  /**
   * The name of the world or embedded collection this document can find itself in.
   * For example an `Item` is always going to be inside a collection with a key of `items`.
   * This is a fixed string per document type and is primarily useful for {@link ClientDocumentMixin | `Descendant Document Events`}.
   */
  type ParentCollectionName = Metadata["collection"];

  /**
   * The world collection that contains `Combat`s. Will be `never` if none exists.
   */
  type CollectionClass = foundry.documents.collections.CombatEncounters.ImplementationClass;

  /**
   * The world collection that contains `Combat`s. Will be `never` if none exists.
   */
  type Collection = foundry.documents.collections.CombatEncounters.Implementation;

  /**
   * An instance of `Combat` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `Combat` that comes from the database.
   */
  type Stored<SubType extends Combat.SubType = Combat.SubType> = Document.Internal.Stored<OfType<SubType>>;

  /**
   * The data put in {@link Combat._source | `Combat#_source`}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode Combat.create}
   * and {@link Combat | `new Combat(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
   * {@link Combat.name | `Combat#name`}.
   *
   * This is data transformed from {@linkcode Combat.Source} and turned into more
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
   * The schema for {@linkcode Combat}. This is the source of truth for how an Combat document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode Combat}. For example
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

    type: fields.DocumentTypeField<typeof BaseCombat, { initial: typeof CONST.BASE_DOCUMENT_TYPE }>;

    system: fields.TypeDataField<typeof BaseCombat>;

    /**
     * The _id of a Scene within which this Combat occurs
     * @defaultValue `null`
     */
    scene: fields.ForeignDocumentField<typeof documents.BaseScene>;

    /**
     * A Collection of Documents that represent a grouping of individual Combatants
     * @defaultValue `[]`
     */
    groups: fields.EmbeddedCollectionField<typeof documents.BaseCombatantGroup, Combat.Implementation>;

    /**
     * A Collection of Combatant embedded Documents
     * @defaultValue `[]`
     */
    combatants: fields.EmbeddedCollectionField<typeof documents.BaseCombatant, Combat.Implementation>;

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
    }>;

    /**
     * The current turn in the Combat round
     * @defaultValue `null`
     */
    turn: fields.NumberField<{ required: true; integer: true; min: 0; initial: null }>;

    /**
     * The current sort order of this Combat relative to others in the same Scene
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name>;

    /**
     * An object of creation and access information
     * @defaultValue see {@linkcode fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }

  namespace Database {
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

    /** Operation for {@linkcode Combat.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<Combat.Database.Create<Temporary>> {}

    /** Operation for {@linkcode Combat.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<Combat.Database.Update> {}

    /** Operation for {@linkcode Combat.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<Combat.Database.Delete> {}

    /** Operation for {@linkcode Combat.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<Combat.Database.Create<Temporary>> {}

    /** Operation for {@link Combat.update | `Combat#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode Combat.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link Combat._preCreate | `Combat#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link Combat._onCreate | `Combat#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode Combat._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<Combat.Database.Create> {}

    /** Operation for {@link Combat._onCreateOperation | `Combat#_onCreateOperation`} */
    interface OnCreateOperation extends Combat.Database.Create {}

    /** Options for {@link Combat._preUpdate | `Combat#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link Combat._onUpdate | `Combat#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode Combat._preUpdateOperation} */
    interface PreUpdateOperation extends Combat.Database.Update {}

    /** Operation for {@link Combat._onUpdateOperation | `Combat._preUpdateOperation`} */
    interface OnUpdateOperation extends Combat.Database.Update {}

    /** Options for {@link Combat._preDelete | `Combat#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link Combat._onDelete | `Combat#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link Combat._preDeleteOperation | `Combat#_preDeleteOperation`} */
    interface PreDeleteOperation extends Combat.Database.Delete {}

    /** Options for {@link Combat._onDeleteOperation | `Combat#_onDeleteOperation`} */
    interface OnDeleteOperation extends Combat.Database.Delete {}

    /** Context for {@linkcode Combat._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<Combat.Parent> {}

    /** Context for {@linkcode Combat._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<Combat.Parent> {}

    /** Context for {@linkcode Combat._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<Combat.Parent> {}

    /**
     * Options for {@link Combat._preCreateDescendantDocuments | `Combat#_preCreateDescendantDocuments`}
     * and {@link Combat._onCreateDescendantDocuments | `Combat#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<Combat.Database.Create> {}

    /**
     * Options for {@link Combat._preUpdateDescendantDocuments | `Combat#_preUpdateDescendantDocuments`}
     * and {@link Combat._onUpdateDescendantDocuments | `Combat#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<Combat.Database.Update> {}

    /**
     * Options for {@link Combat._preDeleteDescendantDocuments | `Combat#_preDeleteDescendantDocuments`}
     * and {@link Combat._onDeleteDescendantDocuments | `Combat#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<Combat.Database.Delete> {}

    /**
     * Create options for {@linkcode Combat.createDialog}.
     */
    interface DialogCreateOptions extends InexactPartial<Create> {}
  }

  /**
   * If `Temporary` is true then `Combat.Implementation`, otherwise `Combat.Stored`.
   */
  type TemporaryIf<Temporary extends boolean | undefined> = true extends Temporary
    ? Combat.Implementation
    : Combat.Stored;

  /**
   * The flags that are available for this document in the form `{ [scope: string]: { [key: string]: unknown } }`.
   */
  interface Flags extends Document.Internal.ConfiguredFlagsForName<Name> {}

  namespace Flags {
    /**
     * The valid scopes for the flags on this document e.g. `"core"` or `"dnd5e"`.
     */
    type Scope = Document.Internal.FlagKeyOf<Flags>;

    /**
     * The valid keys for a certain scope for example if the scope is "core" then a valid key may be `"sheetLock"` or `"viewMode"`.
     */
    type Key<Scope extends Flags.Scope> = Document.Internal.FlagKeyOf<Document.Internal.FlagGetKey<Flags, Scope>>;

    /**
     * Gets the type of a particular flag given a `Scope` and a `Key`.
     */
    type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.Internal.GetFlag<Flags, Scope, Key>;
  }

  interface DropData extends Document.Internal.DropData<Name> {}
  interface DropDataOptions extends Document.DropDataOptions {}

  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  type PreCreateDescendantDocumentsArgs = Document.PreCreateDescendantDocumentsArgs<
    Combat.Stored,
    Combat.DirectDescendant,
    Combat.Metadata.Embedded
  >;

  type OnCreateDescendantDocumentsArgs = Document.OnCreateDescendantDocumentsArgs<
    Combat.Stored,
    Combat.DirectDescendant,
    Combat.Metadata.Embedded
  >;

  type PreUpdateDescendantDocumentsArgs = Document.PreUpdateDescendantDocumentsArgs<
    Combat.Stored,
    Combat.DirectDescendant,
    Combat.Metadata.Embedded
  >;

  type OnUpdateDescendantDocumentsArgs = Document.OnUpdateDescendantDocumentsArgs<
    Combat.Stored,
    Combat.DirectDescendant,
    Combat.Metadata.Embedded
  >;

  type PreDeleteDescendantDocumentsArgs = Document.PreDeleteDescendantDocumentsArgs<
    Combat.Stored,
    Combat.DirectDescendant,
    Combat.Metadata.Embedded
  >;

  type OnDeleteDescendantDocumentsArgs = Document.OnDeleteDescendantDocumentsArgs<
    Combat.Stored,
    Combat.DirectDescendant,
    Combat.Metadata.Embedded
  >;

  /** @internal */
  type _InitiativeOptions = NullishProps<{
    /**
     * A non-default initiative formula to roll. Otherwise the system default is used.
     * @defaultValue `null`
     */
    formula: string;

    /**
     * Update the Combat turn after adding new initiative scores to keep the turn on the same Combatant.
     * @defaultValue `true`
     */
    updateTurn: boolean;
  }> &
    InexactPartial<{
      /**
       * Additional options with which to customize created Chat Messages
       * @defaultValue `{}`
       * @remarks Can't be `null` as it only has a parameter default
       */
      messageOptions: ChatMessage.CreateData;
    }>;

  interface InitiativeOptions extends _InitiativeOptions {}

  interface HistoryData {
    round: number | null;
    turn: number | null;
    tokenId: string | null;
    combatantId: string | null;
  }

  interface TurnEventContext {
    round: number;
    turn: number;
    skipped: boolean;
  }

  interface RoundEventContext extends Omit<TurnEventContext, "turn"> {}

  type CONFIG_SETTING = "combatTrackerConfig";

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

  /**
   * @deprecated Replaced with {@linkcode Combat.ConfiguredSubType} (will be removed in v14).
   */
  type ConfiguredSubTypes = ConfiguredSubType;
}

/**
 * The client-side Combat document which extends the common BaseCombat model.
 *
 * @see {@linkcode Combats}                       The world-level collection of Combat documents
 * @see {@linkcode Combatant}                     The Combatant embedded document which exists within a Combat document
 * @see {@linkcode CombatConfig}                  The Combat configuration application
 */
declare class Combat<out SubType extends Combat.SubType = Combat.SubType> extends BaseCombat.Internal
  .ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `Combat`
   * @param context - Construction context options
   */
  // Note(LukeAbby): Optional as there are currently no required properties on `CreateData`.
  constructor(data?: Combat.CreateData, context?: Combat.ConstructionContext);

  /** Track the sorted turn order of this combat encounter */
  turns: Combatant.Implementation[];

  /** Record the current round, turn, and tokenId to understand changes in the encounter state */
  current: Combat.HistoryData;

  /**
   * Track the previous round, turn, and tokenId to understand changes in the encounter state
   * @remarks Only `undefined` prior to first {@link Combat._onUpdate | `Combat#_onUpdate`} or {@link Combat.setupTurns | `Combat#setupTurns`} (which is called in
   * {@link Combat.prepareDerivedData | `Combat#prepareDerivedData`}) call
   */
  previous: Combat.HistoryData | undefined;

  /**
   * The configuration setting used to record Combat preferences
   * @defaultValue `"combatTrackerConfig"`
   * @privateRemarks Right now it doesn't make sense to make this not a literal, as `type CONFIG_SETTING` is static, so changing this would
   * just make {@link Combat.settings | `Combat#settings`} and {@linkcode CombatEncounters.settings} incorrect
   */
  // TODO: Make the setting name configurable?
  static CONFIG_SETTING: "combatTrackerConfig";

  /** Get the Combatant who has the current turn. */
  get combatant(): Combatant.Implementation | undefined | null;

  /**
   * Get the Combatant who has the next turn.
   */
  get nextCombatant(): Combatant.Implementation | undefined;

  /** Return the object of settings which modify the Combat Tracker behavior */
  // Type is copied here to avoid recursion issue
  // TODO: Make the setting name configurable?
  get settings(): foundry.helpers.ClientSettings.SettingInitializedType<"core", Combat.CONFIG_SETTING>;

  /** Has this combat encounter been started? */
  get started(): boolean;

  /** @remarks Foundry's implementation in {@linkcode Combat} always returns `true` */
  override get visible(): boolean;

  /** Is this combat active in the current scene? */
  get isActive(): boolean;

  /**
   * Set the current Combat encounter as active within the Scene.
   * Deactivate all other Combat encounters within the viewed Scene and set this one as active
   * @param options - Additional context to customize the update workflow
   */
  activate(options?: Combat.Database.UpdateOperation): Promise<Combat.Implementation[]>;

  /** @remarks Calls {@link Combat.setupTurns | `Combat#setupTurns`} if there is at least one Combatant and `this.turns` is empty */
  override prepareDerivedData(): void;

  /**
   * Get a Combatant using its Token id
   * @param token - A Token ID or a TokenDocument instance
   * @returns An array of Combatants which represent the Token.
   */
  getCombatantsByToken(token: string | TokenDocument.Implementation): Combatant.Implementation[];

  /**
   * Get a Combatant that represents the given Actor or Actor ID.
   * @param actorOrId - An Actor ID or an Actor instance.
   */
  getCombatantsByActor(actorOrId: string | Actor.Implementation): Combatant.Implementation[];

  /**
   * Calculate the time delta between two turns.
   * @param fromRound - The from-round
   * @param fromTurn  - The from-turn
   * @param toRound   - The to-round
   * @param toTurn    - The to-turn
   */
  getTimeDelta(fromRound: number, fromTurn: number | null, toRound: number, toTurn: number | null): number;

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
  resetAll(): Promise<this | undefined>;

  /**
   * Roll initiative for one or multiple Combatants within the Combat document
   * @param ids     - A Combatant id or Array of ids for which to roll
   * @param options - Additional options which modify how initiative rolls are created or presented. (default: `{}`)
   * @returns A promise which resolves to the updated Combat document once updates are complete.
   */
  rollInitiative(ids: string | string[], options?: Combat.InitiativeOptions): Promise<this>;

  /**
   * Roll initiative for all combatants which have not already rolled
   * @param options - Additional options forwarded to the Combat.rollInitiative method (default: `{}`)
   */
  rollAll(options?: Combat.InitiativeOptions): Promise<this>;

  /**
   * Roll initiative for all non-player actors who have not already rolled
   * @param options - Additional options forwarded to the Combat.rollInitiative method (default: `{}`)
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
  setupTurns(): Combatant.Implementation[];

  /**
   * Debounce changes to the composition of the Combat encounter to de-duplicate multiple concurrent Combatant changes.
   * If this is the currently viewed encounter, re-render the CombatTracker application.
   */
  debounceSetup: () => void;

  /**
   * Update active effect durations for all actors present in this Combat encounter.
   */
  updateCombatantActors(): void;

  /**
   * Loads the registered Combat Theme (if any) and plays the requested type of sound.
   * If multiple exist for that type, one is chosen at random.
   * @param announcement - The announcement that should be played: "startEncounter", "nextUp", or "yourTurn".
   */
  protected _playCombatSound(announcement: CONST.COMBAT_ANNOUNCEMENTS): void;

  /**
   * Define how the array of Combatants is sorted in the displayed list of the tracker.
   * This method can be overridden by a system or module which needs to display combatants in an alternative order.
   * The default sorting rules sort in descending order of initiative using combatant IDs for tiebreakers.
   * @param  a - Some combatant
   * @param  b - Some other combatant
   */
  protected _sortCombatants(a: Combatant.Implementation, b: Combatant.Implementation): number;

  /**
   * Refresh the Token HUD under certain circumstances.
   * @param documents - A list of Combatant documents that were added or removed.
   */
  protected _refreshTokenHUD(documents: Combatant.Implementation[]): void;

  /**
   * Clear the movement history of all Tokens within this Combat.
   * or
   * Clear the movement history of the Combatants' Tokens.
   * @param combatants - The combatants whose movement history is cleared
   */
  clearMovementHistories(combatants?: Iterable<Combatant.Implementation>): Promise<void>;

  // _onCreate, _onUpdate, and _onDelete  are all overridden but with no signature changes from BaseCombat.

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class GurpsCombat extends Combat {
   *   protected override _onCreateDescendantDocuments(...args: Combat.OnCreateDescendantDocumentsArgs) {
   *     super._onCreateDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, data, options, userId] = args;
   *     if (collection === "combatants") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onCreateDescendantDocuments(...args: Combat.OnCreateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class Ptr2eCombat extends Combat {
   *   protected override _onUpdateDescendantDocuments(...args: Combat.OnUpdateDescendantDocumentsArgs) {
   *     super._onUpdateDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, changes, options, userId] = args;
   *     if (collection === "combatants") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onUpdateDescendantDocuments(...args: Combat.OnUpdateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class BladesCombat extends Combat {
   *   protected override _onDeleteDescendantDocuments(...args: Combat.OnUpdateDescendantDocuments) {
   *     super._onDeleteDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, ids, options, userId] = args;
   *     if (collection === "combatants") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onDeleteDescendantDocuments(...args: Combat.OnDeleteDescendantDocumentsArgs): void;

  /**
   * This workflow occurs after a Combatant is added to the Combat.
   * This can be overridden to implement system-specific combat tracking behaviors.
   * The default implementation of this function does nothing.
   * This method only executes for one designated GM user. If no GM users are present this method will not be called.
   * @param combatant - The Combatant that entered the Combat
   */
  protected _onEnter(combatant: Combatant.Implementation): Promise<void>;

  /**
   * This workflow occurs after a Combatant is removed from the Combat.
   * This can be overridden to implement system-specific combat tracking behaviors.
   * The default implementation of this function does nothing.
   * This method only executes for one designated GM user. If no GM users are present this method will not be called.
   * @param combatant - The Combatant that exited the Combat
   */
  protected _onExit(combatant: Combatant.Implementation): Promise<void>;

  /**
   * Called after {@link Combat#_onExit} and takes care of clearing the movement history of the
   * Combatant's Token.
   * This function is not called for Combatants that don't have a Token.
   * The default implementation clears the movement history always.
   * @param combatant - The Combatant that exited the Combat
   */
  protected _clearMovementHistoryOnExit(combatant: Combatant.Implementation): Promise<void>;

  /**
   * Get the current history state of the Combat encounter.
   * @param combatant - The new active combatant (default: `this.combatant`)
   */
  protected _getCurrentState(combatant?: Combatant.Implementation): Combat.HistoryData;

  /**
   * Update display of Token combat turn markers.
   */
  protected _updateTurnMarkers(): void;

  /**
   * Manage the execution of Combat lifecycle events.
   * This method orchestrates the execution of four events in the following order, as applicable:
   * 1. End Turn
   * 2. End Round
   * 3. Begin Round
   * 4. Begin Turn
   * Each lifecycle event is an async method, and each is awaited before proceeding.
   */
  protected _manageTurnEvents(): Promise<void>;

  /**
   * A workflow that occurs at the end of each Combat Turn.
   * This workflow occurs after the Combat document update.
   * This can be overridden to implement system-specific combat tracking behaviors.
   * The default implementation of this function does nothing.
   * This method only executes for one designated GM user. If no GM users are present this method will not be called.
   * @param combatant - The Combatant whose turn just ended
   * @param context   - The context of the turn tat just ended
   */
  protected _onEndTurn(combatant: Combatant.Implementation, context: Combat.TurnEventContext): Promise<void>;

  /**
   * A workflow that occurs at the end of each Combat Round.
   * This workflow occurs after the Combat document update.
   * This can be overridden to implement system-specific combat tracking behaviors.
   * The default implementation of this function does nothing.
   * This method only executes for one designated GM user. If no GM users are present this method will not be called.
   * @param context - The context of the round that just ended
   */
  protected _onEndRound(context: Combat.RoundEventContext): Promise<void>;

  /**
   * A workflow that occurs at the start of each Combat Round.
   * This workflow occurs after the Combat document update.
   * This can be overridden to implement system-specific combat tracking behaviors.
   * The default implementation of this function does nothing.
   * This method only executes for one designated GM user. If no GM users are present this method will not be called.
   * @param context - The context of the round that just started
   */
  protected _onStartRound(context: Combat.RoundEventContext): Promise<void>;

  /**
   * A workflow that occurs at the start of each Combat Turn.
   * This workflow occurs after the Combat document update.
   * This can be overridden to implement system-specific combat tracking behaviors.
   * The default implementation of this function does nothing.
   * This method only executes for one designated GM user. If no GM users are present this method will not be called.
   * @param combatant - The Combatant whose turn just started
   * @param context   - The context of the turn that just started
   */
  protected _onStartTurn(combatant: Combatant.Implementation, context: Combat.TurnEventContext): Promise<void>;

  /**
   * Called after {@link Combat#_onStartTurn} and takes care of clearing the movement history of the
   * Combatant's Token.
   * This function is not called for Combatants that don't have a Token.
   * The default implementation clears the movement history always.
   * @param combatant - The Combatant whose turn just started
   * @param context   - The context of the turn that just started
   */
  protected _clearMovementHistoryOnStartTurn(
    combatant: Combatant.Implementation,
    context: Combat.TurnEventContext,
  ): Promise<void>;

  /**
   * When Tokens are deleted, handle actions to update/delete Combatants of these Tokens.
   * @param tokens    - An array of Tokens which have been deleted
   * @param operation - The operation that deleted the Tokens
   * @param user      - The User that deleted the Tokens
   */
  protected static _onDeleteTokens(
    tokens: TokenDocument.Implementation[],
    operation: Combat.Database.DeleteOperation,
    user: User.Implementation,
  ): void;

  /**
   * @deprecated Since v12, no stated end
   * @remarks Foundry provides no deprecation warning; use {@link Combat.getCombatantsByActor | `Combat#getCombatantsByActor`} instead.
   */
  getCombatantByActor(actor: string | Actor.Implementation): Combatant.Implementation | null;

  /**
   * @deprecated Since v12, no stated end
   * @remarks Foundry provides no deprecation warning; use {@link Combat.getCombatantsByActor | `Combat#getCombatantsByActor`} instead.
   */
  getCombatantByToken(token: string | Token.Implementation): Combatant.Implementation | null;

  /*
   * After this point these are not really overridden methods.
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  // ClientDocument overrides

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class SwadeCombat extends Combat {
   *   protected override _preCreateDescendantDocuments(...args: Combat.PreCreateDescendantDocumentsArgs) {
   *     super._preCreateDescendantDocuments(...args);
   *
   *     const [parent, collection, data, options, userId] = args;
   *     if (collection === "combatants") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preCreateDescendantDocuments(...args: Combat.PreCreateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class LancerCombat extends Combat {
   *   protected override _preUpdateDescendantDocuments(...args: Combat.OnUpdateDescendantDocuments) {
   *     super._preUpdateDescendantDocuments(...args);
   *
   *     const [parent, collection, changes, options, userId] = args;
   *     if (collection === "combatants") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preUpdateDescendantDocuments(...args: Combat.PreUpdateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class KultCombat extends Combat {
   *   protected override _preDeleteDescendantDocuments(...args: Combat.PreDeleteDescendantDocumentsArgs) {
   *     super._preDeleteDescendantDocuments(...args);
   *
   *     const [parent, collection, ids, options, userId] = args;
   *     if (collection === "combatants") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preDeleteDescendantDocuments(...args: Combat.PreDeleteDescendantDocumentsArgs): void;

  static override defaultName(context?: Combat.DefaultNameContext): string;

  static override createDialog(
    data?: Combat.CreateDialogData,
    createOptions?: Combat.Database.DialogCreateOptions,
    options?: Combat.CreateDialogOptions,
  ): Promise<Combat.Stored | null | undefined>;

  override deleteDialog(
    options?: InexactPartial<foundry.applications.api.DialogV2.ConfirmConfig>,
    operation?: Document.Database.DeleteOperationForName<"Combat">,
  ): Promise<this | false | null | undefined>;

  static override fromDropData(
    data: Combat.DropData,
    options?: Combat.DropDataOptions,
  ): Promise<Combat.Implementation | undefined>;

  static override fromImport(
    source: Combat.Source,
    context?: Document.FromImportContext<Combat.Parent> | null,
  ): Promise<Combat.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;

  #Combat: true;
}

export default Combat;
