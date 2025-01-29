import type { DeepPartial, InexactPartial } from "../../../../utils/index.d.mts";
import type { documents } from "../../../client-esm/client.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type EmbeddedCollection from "../../../common/abstract/embedded-collection.d.mts";
import type BaseActor from "../../../common/documents/actor.d.mts";
import type { fields, PrototypeToken } from "../../../common/data/module.d.mts";
import type { ConfiguredActor } from "../../../../configuration/index.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";

declare global {
  namespace Actor {
    /**
     * The implementation of the Actor document instance configured through `CONFIG.Actor.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredActor | `configuration/ConfiguredActor`} in fvtt-types.
     */
    type Implementation = Document.ConfiguredInstanceForName<"Actor">;

    /**
     * The implementation of the Actor document configured through `CONFIG.Actor.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ConfiguredClassForName<"Actor">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"Actor"> {}

    type SubType = Game.Model.TypeNames<"Actor">;
    type OfType<Type extends SubType> = Document.Internal.OfType<ConfiguredActor<Type>, Actor<Type>>;

    /**
     * A document's parent is something that can contain it.
     * For example an `Actor` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = null;

    /**
     * An instance of `Actor` that comes from the database.
     */
    interface Stored extends Document.Stored<Actor.Implementation> {}

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
     * The data put in {@link Actor._source | `Actor._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link Actor.create | `Actor.create`}
     * and {@link Actor | `new Actor(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link Actor.name | `Actor#name`}.
     *
     * This is data transformed from {@link Actor.Source | `Actor.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link Actor.update | `Actor#update`}.
     * It is a distinct type from {@link Actor.CreateData | `DeepPartial<Actor.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link Actor | `Actor`}. This is the source of truth for how an Actor document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link Actor | `Actor`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies this Actor document
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      /** The name of this Actor */
      name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

      /** An Actor subtype which configures the system data model applied */
      type: fields.DocumentTypeField<typeof BaseActor>;

      /**
       * An image file path which provides the artwork for this Actor
       * @defaultValue `null`
       */
      img: fields.FilePathField<{ categories: "IMAGE"[]; initial: (data: unknown) => string }>;

      /**
       * The system data object which is defined by the system template.json model
       * @defaultValue `{}`
       */
      system: fields.TypeDataField<typeof BaseActor>;

      /**
       * Default Token settings which are used for Tokens created from this Actor
       * @defaultValue see {@link PrototypeToken}
       */
      prototypeToken: fields.EmbeddedDataField<typeof PrototypeToken>;

      /**
       * A Collection of Item embedded Documents
       * @defaultValue `[]`
       */
      items: fields.EmbeddedCollectionField<typeof documents.BaseItem, Actor.Implementation>;

      /**
       * A Collection of ActiveEffect embedded Documents
       * @defaultValue `[]`
       */
      effects: fields.EmbeddedCollectionField<typeof documents.BaseActiveEffect, Actor.Implementation>;

      /**
       * The _id of a Folder which contains this Actor
       * @defaultValue `null`
       */
      folder: fields.ForeignDocumentField<typeof documents.BaseFolder>;

      /**
       * The numeric sort value which orders this Actor relative to its siblings
       * @defaultValue `0`
       */
      sort: fields.IntegerSortField;

      /**
       * An object which configures ownership of this Actor
       * @defaultValue `{ default: DOCUMENT_OWNERSHIP_LEVELS.NONE }`
       */
      ownership: fields.DocumentOwnershipField;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<"Actor">;

      /**
       * An object of creation and access information
       * @defaultValue see {@link fields.DocumentStatsField}
       */
      _stats: fields.DocumentStatsField;
    }

    namespace DatabaseOperation {
      interface Get extends foundry.abstract.types.DatabaseGetOperation<Actor.Parent> {}
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<Actor.CreateData, Actor.Parent, Temporary> {}
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Actor.Parent> {}
      interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Actor.UpdateData, Actor.Parent> {}

      /** Options for {@link Actor.createDocuments | `Actor.createDocuments`} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link Actor._preCreateOperation | `Actor._preCreateOperation`} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link Actor#_preCreate | `Actor#_preCreate`} */
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      /** Options for {@link Actor#_onCreate | `Actor#_onCreate`} */
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      /** Options for {@link Actor.updateDocuments | `Actor.updateDocuments`} */
      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      /** Options for {@link Actor._preUpdateOperation | `Actor._preUpdateOperation`} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link Actor#_preUpdate | `Actor#_preUpdate`} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      /** Options for {@link Actor#_onUpdate | `Actor#_onUpdate`} */
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      /** Options for {@link Actor.deleteDocuments | `Actor.deleteDocuments`} */
      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      /** Options for {@link Actor._preDeleteOperation | `Actor._preDeleteOperation`} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link Actor#_preDelete | `Actor#_preDelete`} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link Actor#_onDelete | `Actor#_onDelete`} */
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    /**
     * @deprecated - {@link Actor.DatabaseOperation}
     */
    interface DatabaseOperations extends Document.Database.Operations<Actor> {}

    /**
     * @deprecated {@link Actor.Types | `Actor.SubType`}
     */
    type TypeNames = Actor.SubType;

    /**
     * @deprecated {@link Actor.CreateData | `Actor.CreateData`}
     */
    interface ConstructorData extends Actor.CreateData {}

    /**
     * @deprecated {@link Actor.implementation | `Actor.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link Actor.Implementation | `Actor.Implementation`}
     */
    type ConfiguredInstance = Implementation;

    type ItemTypes = {
      [K in Game.Model.TypeNames<"Item">]: Array<
        // TODO(LukeAbby): Looks like a `Item.OfType` helper would be useful.
        Item.Implementation & {
          type: K;
        } & (DataModelConfig extends { Item: { readonly [_ in K]?: infer SystemData } }
            ? {
                system: SystemData;
              } // eslint-disable-next-line @typescript-eslint/no-empty-object-type
            : {})
      >;
    };

    interface RollInitiativeOptions {
      /**
       * Create new Combatant entries for Tokens associated with this actor.
       * @defaultValue `false`
       */
      createCombatants?: boolean;

      /**
       * Re-roll the initiative for this Actor if it has already been rolled.
       * @defaultValue `false`
       */
      rerollInitiative?: boolean;

      /**
       * Additional options passed to the Combat#rollInitiative method.
       * @defaultValue `{}`
       */
      initiativeOptions?: Combat.InitiativeOptions;
    }
  }

  /**
   * The client-side Actor document which extends the common BaseActor model.
   *
   *  ### Hook Events
   * {@link hookEvents.applyCompendiumArt}
   *
   * @see {@link Actors}            The world-level collection of Actor documents
   * @see {@link ActorSheet}     The Actor configuration application
   *
   * @example <caption>Create a new Actor</caption>
   * ```typescript
   * let actor = await Actor.create({
   *   name: "New Test Actor",
   *   type: "character",
   *   img: "artwork/character-profile.jpg"
   * });
   * ```
   *
   * @example <caption>Retrieve an existing Actor</caption>
   * ```typescript
   * let actor = game.actors.get(actorId);
   * ```
   */
  class Actor<out SubType extends Actor.SubType = Actor.SubType> extends ClientDocumentMixin(
    foundry.documents.BaseActor,
  )<SubType> {
    static override metadata: Actor.Metadata;

    protected override _configure(options?: { pack?: string | null }): void;

    /**
     * Maintain a list of Token Documents that represent this Actor, stored by Scene.
     */
    protected _dependentTokens: foundry.utils.IterableWeakMap<Scene.Implementation, TokenDocument.Implementation>;

    protected override _initializeSource(
      data: this | Actor.CreateData,
      options?: Omit<foundry.abstract.DataModel.DataValidationOptions, "parent">,
    ): Actor.Source;

    /**
     * An object that tracks which tracks the changes to the data model which were applied by active effects
     * @defaultValue `{}`
     */
    overrides: Record<string, unknown>;

    /**
     * The statuses that are applied to this actor by active effects
     */
    statuses: Set<string>;

    /**
     * A cached array of image paths which can be used for this Actor's token.
     * Null if the list has not yet been populated.
     * @defaultValue `null`
     */
    protected _tokenImages: string[] | null;

    /**
     * Cache the last drawn wildcard token to avoid repeat draws
     * @defaultValue `null`
     */
    protected _lastWildcard: string | null;

    /**
     * Provide a thumbnail image path used to represent this document.
     */
    get thumbnail(): this["img"];

    /**
     * Provide an object which organizes all embedded Item instances by their type
     */
    get itemTypes(): Actor.ItemTypes;

    /**
     * Test whether an Actor document is a synthetic representation of a Token (if true) or a full Document (if false)
     */
    get isToken(): boolean;

    /**
     * Retrieve the list of ActiveEffects that are currently applied to this Actor.
     */
    get appliedEffects(): ActiveEffect.Implementation[];

    /**
     * An array of ActiveEffect instances which are present on the Actor which have a limited duration.
     */
    get temporaryEffects(): EmbeddedCollection<ActiveEffect.Implementation, Actor.Implementation>;

    /**
     * Return a reference to the TokenDocument which owns this Actor as a synthetic override
     */
    get token(): TokenDocument.Implementation | null;

    /**
     * Whether the Actor has at least one Combatant in the active Combat that represents it.
     */
    get inCombat(): boolean;

    /**
     * Apply any transformations to the Actor data which are caused by ActiveEffects.
     */
    applyActiveEffects(): void;

    /**
     * Retrieve an Array of active tokens which represent this Actor in the current canvas Scene.
     * If the canvas is not currently active, or there are no linked actors, the returned Array will be empty.
     * If the Actor is a synthetic token actor, only the exact Token which it represents will be returned.
     *
     * @param linked   - Limit results to Tokens which are linked to the Actor. Otherwise return all
     *                   Tokens even those which are not linked. (default: `false`)
     * @param document - Return the Document instance rather than the PlaceableObject (default: `false`)
     * @returns An array of Token instances in the current Scene which reference this Actor.
     */
    getActiveTokens<ReturnDocument extends boolean = false>(
      linked?: boolean,
      document?: ReturnDocument,
    ): ReturnDocument extends true ? TokenDocument.Implementation[] : Token.Implementation[];

    /**
     * Get all ActiveEffects that may apply to this Actor.
     * If CONFIG.ActiveEffect.legacyTransferral is true, this is equivalent to actor.effects.contents.
     * If CONFIG.ActiveEffect.legacyTransferral is false, this will also return all the transferred ActiveEffects on any
     * of the Actor's owned Items.
     */
    allApplicableEffects(): Generator<ActiveEffect.Implementation>;

    /**
     * Prepare a data object which defines the data schema used by dice roll commands against this Actor
     * @remarks defaults to this.system, but provided as object for flexible overrides
     */
    getRollData(): object;

    /**
     * Create a new TokenData object which can be used to create a Token representation of the Actor.
     * @param data - Additional data, such as x, y, rotation, etc. for the created token data (default: `{}`)
     * @returns The created TokenData instance
     */
    getTokenDocument(data?: foundry.documents.BaseToken.ConstructorData): Promise<TokenDocument.Implementation>;

    /**
     * Get an Array of Token images which could represent this Actor
     */
    getTokenImages(): Promise<string[]>;

    /**
     * Handle how changes to a Token attribute bar are applied to the Actor.
     * This allows for game systems to override this behavior and deploy special logic.
     * @param attribute - The attribute path
     * @param value     - The target attribute value
     * @param isDelta   - Whether the number represents a relative change (true) or an absolute change (false) (default: `false`)
     * @param isBar     - Whether the new value is part of an attribute bar, or just a direct value (default: `true`)
     * @returns The updated Actor document
     */
    modifyTokenAttribute(attribute: string, value: number, isDelta: boolean, isBar: boolean): Promise<this | undefined>;

    override prepareData(): void;

    override prepareEmbeddedDocuments(): void;

    /**
     * Roll initiative for all Combatants in the currently active Combat encounter which are associated with this Actor.
     * If viewing a full Actor document, all Tokens which map to that actor will be targeted for initiative rolls.
     * If viewing a synthetic Token actor, only that particular Token will be targeted for an initiative roll.
     *
     * @param options - Configuration for how initiative for this Actor is rolled.
     * @returns A promise which resolves to the Combat document once rolls are complete.
     */
    rollInitiative(options?: Actor.RollInitiativeOptions): Promise<void>;

    /**
     * Toggle a configured status effect for the Actor.
     * @param statusId  - A status effect ID defined in CONFIG.statusEffects
     * @param options   - Additional options which modify how the effect is created
     * @returns A promise which resolves to one of the following values:
     *            - ActiveEffect if a new effect need to be created
     *            - true if was already an existing effect
     *            - false if an existing effect needed to be removed
     *            - undefined if no changes need to be made
     */
    toggleStatusEffect(
      statusId: string,
      options?: InexactPartial<{
        /** Force the effect to be active or inactive regardless of its current state. */
        active: boolean;
        /** Display the toggled effect as an overlay. Default `false`. */
        overlay: boolean;
      }>,
    ): Promise<ActiveEffect.Implementation | boolean | undefined>;

    /**
     * Request wildcard token images from the server and return them.
     * @param actorId - The actor whose prototype token contains the wildcard image path.
     * @internal
     */
    protected static _requestTokenImages(
      actorId: string,
      options?: {
        /** The name of the compendium the actor is in. */
        pack: string;
      },
    ): Promise<string[]>;

    /**
     * Get this actor's dependent tokens.
     * If the actor is a synthetic token actor, only the exact Token which it represents will be returned.
     */
    getDependentTokens(
      options?: InexactPartial<{
        /**
         * A single Scene, or list of Scenes to filter by.
         */
        scenes: Scene | Scene[];
        /**
         * Limit the results to tokens that are linked to the actor.
         * @defaultValue `false`
         */
        linked: boolean;
      }>,
    ): TokenDocument.Implementation[];

    /**
     * Register a token as a dependent of this actor.
     * @param token - The Token
     */
    protected _registerDependantToken(token: TokenDocument): void;

    /**
     * Remove a token from this actor's dependents.
     * @param token - The Token
     */
    protected _unregisterDependentToken(token: TokenDocument): void;

    /**
     * Prune a whole scene from this actor's dependent tokens.
     * @param scene - The scene
     */
    protected _unregisterDependentScene(scene: Scene): void;

    /**
     * @privateRemarks _preCreate, _onUpdate, onCreateDescendantDocuments, onUpdateDescendantDocuments, and _onDeleteDescendentDocuments are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    /**
     * Additional workflows to perform when any descendant document within this Actor changes.
     * @internal
     */
    protected _onEmbeddedDocumentChange(): void;

    /**
     * Update the active TokenDocument instances which represent this Actor.
     * @param update  - The update delta.
     * @param options - The update context.
     */
    protected _updateDependentTokens(
      update: DeepPartial<TokenDocument["_source"]>,
      options: Document.OnUpdateOptions<"Token">,
    ): void;

    /*
     * After this point these are not really overridden methods.
     * They are here because they're static properties but depend on the instance and so can't be
     * defined DRY-ly while also being easily overridable.
     */

    static override defaultName(context?: Document.DefaultNameContext<Actor.SubType, Actor.Parent>): string;

    static override createDialog(
      data?: Actor.CreateData,
      context?: Document.CreateDialogContext<Actor.SubType, Actor.Parent>,
    ): Promise<Actor.Implementation | null | undefined>;

    static override fromDropData(
      data: Document.DropData<Actor.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<Actor.Implementation | undefined>;

    static override fromImport(
      source: Actor.Source,
      context?: Document.FromImportContext<Actor.Parent>,
    ): Promise<Actor.Implementation>;
  }
}
