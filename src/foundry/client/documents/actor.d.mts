import type { AnyObject, InexactPartial, NullishProps, Merge, Identity } from "#utils";
import type { documents } from "#client/client.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type BaseActor from "#common/documents/actor.d.mts";
import type { ConfiguredActor } from "fvtt-types/configuration";
import type { DataSchema } from "#common/data/fields.d.mts";
import type { PrototypeToken } from "#common/data/data.mjs";
import type { Token } from "#client/canvas/placeables/_module.d.mts";

import fields = foundry.data.fields;

declare namespace Actor {
  /**
   * The document's name.
   */
  type Name = "Actor";

  /**
   * The context used to create an `Actor`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `Actor`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `Actor` document instance configured through `CONFIG.Actor.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} or {@link ConfiguredActor | `fvtt-types/configuration/ConfiguredActor`} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<"Actor">;

  /**
   * The implementation of the `Actor` document configured through `CONFIG.Actor.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<"Actor">;

  /**
   * A document's metadata is special information about the document ranging anywhere from its name,
   * whether it's indexed, or to the permissions a user has over it.
   */
  interface Metadata
    extends Merge<
      Document.Metadata.Default,
      Readonly<{
        name: "Actor";
        collection: "actors";
        indexed: true;
        compendiumIndexFields: ["_id", "name", "img", "type", "sort", "folder"];
        embedded: Metadata.Embedded;
        hasTypeData: true;
        label: string;
        labelPlural: string;
        permissions: Metadata.Permissions;
        schemaVersion: string;
      }>
    > {}

  namespace Metadata {
    /**
     * The embedded metadata
     */
    interface Embedded {
      ActiveEffect: "effects";
      Item: "items";
    }

    /**
     * The permissions for whether a certain user can create, update, or delete this document.
     */
    interface Permissions {
      create(user: User.Internal.Implementation, doc: Implementation): boolean;
      update(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
    }
  }

  /**
   * Allowed subtypes of `Actor`. This is configured through various methods. Modern Foundry
   * recommends registering using [Data Models](https://foundryvtt.com/article/system-data-models/)
   * under {@linkcode CONFIG.Actor.dataModels}. This corresponds to
   * fvtt-type's {@linkcode DataModelConfig}.
   *
   * Subtypes can also be registered through a `template.json` though this is discouraged.
   * The corresponding fvtt-type configs are {@linkcode SourceConfig} and
   * {@linkcode DataConfig}.
   */
  type SubType = foundry.Game.Model.TypeNames<"Actor">;

  /**
   * `ConfiguredSubType` represents the subtypes a user explicitly registered. This excludes
   * subtypes like the Foundry builtin subtype `"base"` and the catch-all subtype for arbitrary
   * module subtypes `${string}.${string}`.
   *
   * @see {@link SubType} for more information.
   */
  type ConfiguredSubType = Document.ConfiguredSubTypeOf<"Actor">;

  /**
   * `Known` represents the types of `Actor` that a user explicitly registered.
   *
   * @see {@link ConfiguredSubType} for more information.
   */
  type Known = Actor.OfType<Actor.ConfiguredSubType>;

  /**
   * `OfType` returns an instance of `Actor` with the corresponding type. This works with both the
   * builtin `Actor` class or a custom subclass if that is set up in
   * {@link ConfiguredActor | `fvtt-types/configuration/ConfiguredActor`}.
   */
  type OfType<Type extends SubType> = Document.Internal.DiscriminateSystem<Name, _OfType, Type, ConfiguredSubType>;

  /** @internal */
  interface _OfType
    extends Identity<{
      [Type in SubType]: Type extends unknown
        ? ConfiguredActor<Type> extends { document: infer Document }
          ? Document
          : // eslint-disable-next-line @typescript-eslint/no-restricted-types
            Actor<Type>
        : never;
    }> {}

  /**
   * `SystemOfType` returns the system property for a specific `Actor` subtype.
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
  type Parent = TokenDocument.Implementation | null;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type DirectDescendant = Item.Stored | ActiveEffect.Stored;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such classes, or never if the document doesn't have any descendants.
   */
  type DirectDescendantClass = Item.ImplementationClass | ActiveEffect.ImplementationClass;

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
  type Pack = foundry.documents.collections.CompendiumCollection.ForDocument<"Actor">;

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
      Actor.Implementation,
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
   * The world collection that contains `Actor`s. Will be `never` if none exists.
   */
  type CollectionClass = foundry.documents.collections.Actors.ConfiguredClass;

  /**
   * The world collection that contains `Actor`s. Will be `never` if none exists.
   */
  type Collection = foundry.documents.collections.Actors.Configured;

  /**
   * An instance of `Actor` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `Actor` that comes from the database.
   */
  type Stored<SubType extends Actor.SubType = Actor.SubType> = Document.Internal.Stored<OfType<SubType>>;

  /**
   * The data put in {@link Actor._source | `Actor#_source`}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode Actor.create}
   * and {@link Actor | `new Actor(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
   * {@link Actor.name | `Actor#name`}.
   *
   * This is data transformed from {@linkcode Actor.Source} and turned into more
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
   * The schema for {@linkcode Actor}. This is the source of truth for how an Actor document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode Actor}. For example
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
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    type: fields.DocumentTypeField<typeof BaseActor, {}>;

    /**
     * An image file path which provides the artwork for this Actor
     * @defaultValue `Actor.DEFAULT_ICON`
     */
    img: fields.FilePathField<{ categories: ["IMAGE"]; initial: (data: unknown) => string }>;

    /**
     * Data for an Actor subtype, defined by a System or Module
     * @defaultValue `{}`
     */
    system: fields.TypeDataField<typeof BaseActor>;

    /**
     * Default Token settings which are used for Tokens created from this Actor
     * @defaultValue see {@linkcode PrototypeToken}
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
    flags: fields.DocumentFlagsField<"Actor">;

    /**
     * An object of creation and access information
     * @defaultValue see {@linkcode fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }

  namespace Database {
    /** Options passed along in Get operations for Actors */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<Actor.Parent> {}

    /** Options passed along in Create operations for Actors */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<Actor.CreateData, Actor.Parent, Temporary> {}

    /** Options passed along in Delete operations for Actors */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Actor.Parent> {}

    /** Options passed along in Update operations for Actors */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Actor.UpdateData, Actor.Parent> {}

    /** Operation for {@linkcode Actor.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<Actor.Database.Create<Temporary>> {}

    /** Operation for {@linkcode Actor.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<Actor.Database.Update> {}

    /** Operation for {@linkcode Actor.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<Actor.Database.Delete> {}

    /** Operation for {@linkcode Actor.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<Actor.Database.Create<Temporary>> {}

    /** Operation for {@link Actor.update | `Actor#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode Actor.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link Actor._preCreate | `Actor#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link Actor._onCreate | `Actor#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode Actor._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<Actor.Database.Create> {}

    /** Operation for {@link Actor._onCreateOperation | `Actor#_onCreateOperation`} */
    interface OnCreateOperation extends Actor.Database.Create {}

    /** Options for {@link Actor._preUpdate | `Actor#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link Actor._onUpdate | `Actor#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode Actor._preUpdateOperation} */
    interface PreUpdateOperation extends Actor.Database.Update {}

    /** Operation for {@link Actor._onUpdateOperation | `Actor._preUpdateOperation`} */
    interface OnUpdateOperation extends Actor.Database.Update {}

    /** Options for {@link Actor._preDelete | `Actor#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link Actor._onDelete | `Actor#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link Actor._preDeleteOperation | `Actor#_preDeleteOperation`} */
    interface PreDeleteOperation extends Actor.Database.Delete {}

    /** Options for {@link Actor._onDeleteOperation | `Actor#_onDeleteOperation`} */
    interface OnDeleteOperation extends Actor.Database.Delete {}

    /** Context for {@linkcode Actor._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<Actor.Parent> {}

    /** Context for {@linkcode Actor._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<Actor.Parent> {}

    /** Context for {@linkcode Actor._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<Actor.Parent> {}

    /**
     * Options for {@link Actor._preCreateDescendantDocuments | `Actor#_preCreateDescendantDocuments`}
     * and {@link Actor._onCreateDescendantDocuments | `Actor#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<Actor.Database.Create> {}

    /**
     * Options for {@link Actor._preUpdateDescendantDocuments | `Actor#_preUpdateDescendantDocuments`}
     * and {@link Actor._onUpdateDescendantDocuments | `Actor#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<Actor.Database.Update> {}

    /**
     * Options for {@link Actor._preDeleteDescendantDocuments | `Actor#_preDeleteDescendantDocuments`}
     * and {@link Actor._onDeleteDescendantDocuments | `Actor#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<Actor.Database.Delete> {}

    /**
     * Create options for {@linkcode Actor.createDialog}.
     */
    interface DialogCreateOptions extends InexactPartial<Create> {}
  }

  /**
   * If `Temporary` is true then `Actor.Implementation`, otherwise `Actor.Stored`.
   */
  type TemporaryIf<Temporary extends boolean | undefined> = true extends Temporary
    ? Actor.Implementation
    : Actor.Stored;

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

  type PreCreateDescendantDocumentsArgs =
    | Document.PreCreateDescendantDocumentsArgs<Actor.Stored, Actor.DirectDescendant, Actor.Metadata.Embedded>
    | Item.PreCreateDescendantDocumentsArgs;

  type OnCreateDescendantDocumentsArgs =
    | Document.OnCreateDescendantDocumentsArgs<Actor.Stored, Actor.DirectDescendant, Actor.Metadata.Embedded>
    | Item.OnCreateDescendantDocumentsArgs;

  type PreUpdateDescendantDocumentsArgs =
    | Document.PreUpdateDescendantDocumentsArgs<Actor.Stored, Actor.DirectDescendant, Actor.Metadata.Embedded>
    | Item.PreUpdateDescendantDocumentsArgs;

  type OnUpdateDescendantDocumentsArgs =
    | Document.OnUpdateDescendantDocumentsArgs<Actor.Stored, Actor.DirectDescendant, Actor.Metadata.Embedded>
    | Item.OnUpdateDescendantDocumentsArgs;

  type PreDeleteDescendantDocumentsArgs =
    | Document.PreDeleteDescendantDocumentsArgs<Actor.Stored, Actor.DirectDescendant, Actor.Metadata.Embedded>
    | Item.PreDeleteDescendantDocumentsArgs;

  type OnDeleteDescendantDocumentsArgs =
    | Document.OnDeleteDescendantDocumentsArgs<Actor.Stored, Actor.DirectDescendant, Actor.Metadata.Embedded>
    | Item.OnDeleteDescendantDocumentsArgs;

  interface DropData extends Document.Internal.DropData<Name> {}
  interface DropDataOptions extends Document.DropDataOptions {}

  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  interface GetDefaultArtworkReturn {
    img: string;
    texture: GetDefaultArtworkTextureReturn;
  }

  interface GetDefaultArtworkTextureReturn {
    src: string;
  }

  type ItemTypes = {
    // Note(LukeAbby): `keyof Item._SystemMap` is used to preserve optional modifiers
    [SubType in keyof Item._SystemMap]: Array<Item.OfType<SubType>>;
  };

  type GetActiveTokensReturn<Document extends boolean | undefined> = Document extends true
    ? TokenDocument.Implementation[]
    : Token.Implementation[];

  /** @internal */
  type _RollInitiativeOptions = NullishProps<{
    /**
     * Create new Combatant entries for Tokens associated with this actor.
     * @defaultValue `false`
     */
    createCombatants: boolean;

    /**
     * Re-roll the initiative for this Actor if it has already been rolled.
     * @defaultValue `false`
     */
    rerollInitiative: boolean;
  }> &
    InexactPartial<{
      /**
       * Additional options passed to the Combat#rollInitiative method.
       * @defaultValue `{}`
       * @remarks Can't be `null` as it only has a parameter default
       */
      initiativeOptions: Combat.InitiativeOptions;
    }>;

  interface RollInitiativeOptions extends _RollInitiativeOptions {}

  /** @internal */
  type _ToggleStatusEffectOptions = NullishProps<{
    /**
     * Force a certain active state for the effect
     * @defaultValue `undefined`
     * @remarks `null` is treated as `false`, `undefined` or omitted is treated as `true` *if no status
     * with the given ID already exists*, otherwise also as `false`
     */
    active: boolean;

    /**
     * Whether to set the effect as the overlay effect?
     * @defaultValue `false`
     */
    overlay: boolean;
  }>;

  interface ToggleStatusEffectOptions extends _ToggleStatusEffectOptions {}

  /** @internal */
  type _RequestTokenImagesOptions = NullishProps<{
    /**
     * The name of the compendium the actor is in.
     * @defaultValue `null`
     * @remarks The default comes from the `"requestTokenImages"` socket handler in `dist/database/documents/actor.mjs` where it's the parameter default
     */
    pack: string;
  }>;

  interface RequestTokenImagesOptions extends _RequestTokenImagesOptions {}

  /** @internal */
  type _GetDependentTokensOptions = NullishProps<{
    /**
     * A single Scene, or list of Scenes to filter by.
     * @defaultValue `Array.from(this._dependentTokens.keys())`
     */
    scenes: Scene.Implementation | Scene.Implementation[];

    /**
     * Limit the results to tokens that are linked to the actor.
     * @defaultValue `false`
     */
    linked: boolean;
  }>;

  interface GetDependentTokensOptions extends _GetDependentTokensOptions {}

  interface ModifyTokenAttributeData {
    /** The attribute path */
    attribute: string;

    /** The target attribute value */
    value: number;

    /** Whether the number represents a relative change (true) or an absolute change (false) */
    isDelta: boolean;

    /** Whether the new value is part of an attribute bar, or just a direct value */
    isBar: boolean;
  }

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

  /**
   * @deprecated Replaced with {@linkcode Actor.ConfiguredSubType} (will be removed in v14).
   */
  type ConfiguredSubTypes = ConfiguredSubType;
}

/**
 * The client-side Actor document which extends the common BaseActor model.
 *
 *  ### Hook Events
 * {@linkcode hookEvents.applyCompendiumArt}
 *
 * @see {@linkcode Actors}            The world-level collection of Actor documents
 * @see {@linkcode ActorSheet}     The Actor configuration application
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
declare class Actor<out SubType extends Actor.SubType = Actor.SubType> extends foundry.documents.BaseActor.Internal
  .ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `Actor`
   * @param context - Construction context options
   */
  constructor(data: Actor.CreateData, context?: Actor.ConstructionContext);

  protected override _configure(options?: Document.ConfigureOptions): void;

  /**
   * Maintain a list of Token Documents that represent this Actor, stored by Scene.
   * @remarks Doesn't exist prior to being `defineProperty`'d in {@link Actor._configure | `Actor#_configure`}
   */
  protected _dependentTokens?: foundry.utils.IterableWeakMap<
    Scene.Implementation,
    foundry.utils.IterableWeakSet<TokenDocument.Implementation>
  >;

  /** @remarks `||=`s the `prototypeToken`'s `name` and `texture.src` fields with the main actor's values */
  protected override _initializeSource(
    data: this | Actor.CreateData,
    options?: Document.InitializeSourceOptions,
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

  /** @deprecated Foundry made this property truly private in v13 (this warning will be removed in v14) */
  protected _tokenImages: never;

  /** @deprecated Foundry made this property truly private in v13 (this warning will be removed in v14) */
  protected _lastWildcard: never;

  /**
   * Provide a thumbnail image path used to represent this document.
   */
  get thumbnail(): string | null;

  /**
   * A convenience getter to an object that organizes all embedded Item instances by subtype. The object is cached and
   * lazily re-computed as needed.
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
  get temporaryEffects(): ActiveEffect.Implementation[];

  /**
   * Return a reference to the TokenDocument which owns this Actor as a synthetic override
   */
  get token(): TokenDocument.Implementation | null;

  /**
   * Whether the Actor has at least one Combatant in the active Combat that represents it.
   */
  get inCombat(): boolean;

  override clone<Save extends boolean | null | undefined = false>(
    data?: Actor.CreateData,
    context?: Document.CloneContext<Save>,
  ): Document.Clone<this, Save>;

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
   * @param document - Return the Document instance rather than the PlaceableObject
   *                   (default: `false`)
   * @returns An array of Token instances in the current Scene which reference this Actor.
   */
  getActiveTokens<ReturnDocument extends boolean | undefined = false>(
    linked?: boolean,
    document?: ReturnDocument,
  ): Actor.GetActiveTokensReturn<ReturnDocument>;

  /**
   * Get all ActiveEffects that may apply to this Actor.
   * If CONFIG.ActiveEffect.legacyTransferral is true, this is equivalent to actor.effects.contents.
   * If CONFIG.ActiveEffect.legacyTransferral is false, this will also return all the transferred ActiveEffects on any
   * of the Actor's owned Items.
   */
  allApplicableEffects(): Generator<ActiveEffect.Implementation, void, undefined>;

  /**
   * Prepare a data object which defines the data schema used by dice roll commands against this Actor
   * @remarks defaults to this.system, but provided as object for flexible overrides
   */
  getRollData(): AnyObject;

  /**
   * Create a new TokenData object which can be used to create a Token representation of the Actor.
   * @param data - Additional data, such as x, y, rotation, etc. for the created token data (default: `{}`)
   * @returns The created TokenData instance
   */
  getTokenDocument(
    data?: TokenDocument.CreateData,
    options?: TokenDocument.ConstructionContext,
  ): Promise<TokenDocument.Implementation>;

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
  // Note: Must be kept in sync with `Actor.ModifyTokenAttributeData`
  modifyTokenAttribute(
    attribute: string,
    // TODO: tighten Combatant.Resource with the justification of this being simply `number`
    value: number,
    isDelta?: boolean,
    isBar?: boolean,
  ): Promise<this | undefined>;

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
    options?: Actor.ToggleStatusEffectOptions,
  ): Promise<ActiveEffect.Implementation | boolean | undefined>;

  /**
   * Get this actor's dependent tokens.
   * If the actor is a synthetic token actor, only the exact Token which it represents will be returned.
   */
  getDependentTokens(options?: Actor.GetDependentTokensOptions): TokenDocument.Implementation[];

  /**
   * Register a token as a dependent of this actor.
   * @param token - The Token
   * @internal
   */
  protected _registerDependantToken(token: TokenDocument.Implementation): void;

  /**
   * Remove a token from this actor's dependents.
   * @param token - The Token
   * @internal
   */
  protected _unregisterDependentToken(token: TokenDocument.Implementation): void;

  /**
   * Prune a whole scene from this actor's dependent tokens.
   * @param scene - The scene
   * @internal
   */
  protected _unregisterDependentScene(scene: Scene.Implementation): void;

  // _onUpdate is overridden but with no signature changes from BaseActor.

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class GurpsActor extends Actor {
   *   protected override _onCreateDescendantDocuments(...args: Actor.OnCreateDescendantDocumentsArgs) {
   *     super._onCreateDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, data, options, userId] = args;
   *     if (collection === "effects") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onCreateDescendantDocuments(...args: Actor.OnCreateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class Ptr2eActor extends Actor {
   *   protected override _onUpdateDescendantDocuments(...args: Actor.OnUpdateDescendantDocumentsArgs) {
   *     super._onUpdateDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, changes, options, userId] = args;
   *     if (collection === "effects") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onUpdateDescendantDocuments(...args: Actor.OnUpdateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class BladesActor extends Actor {
   *   protected override _onDeleteDescendantDocuments(...args: Actor.OnUpdateDescendantDocuments) {
   *     super._onDeleteDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, ids, options, userId] = args;
   *     if (collection === "effects") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onDeleteDescendantDocuments(...args: Actor.OnDeleteDescendantDocumentsArgs): void;

  /**
   * Additional workflows to perform when any descendant document within this Actor changes.
   */
  protected _onEmbeddedDocumentChange(): void;

  /**
   * Update the active TokenDocument instances which represent this Actor.
   * @param update  - The update delta.
   * @param options - The update context.
   * @remarks Forwards to {@link Token._onUpdateBaseActor | `Token#_onUpdateBaseActor`}
   */
  protected _updateDependentTokens(update: Actor.UpdateData, options: Actor.Database.UpdateOperation): void;

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
   * class SwadeActor extends Actor {
   *   protected override _preCreateDescendantDocuments(...args: Actor.PreCreateDescendantDocumentsArgs) {
   *     super._preCreateDescendantDocuments(...args);
   *
   *     const [parent, collection, data, options, userId] = args;
   *     if (collection === "effects") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preCreateDescendantDocuments(...args: Actor.PreCreateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class LancerActor extends Actor {
   *   protected override _preUpdateDescendantDocuments(...args: Actor.OnUpdateDescendantDocuments) {
   *     super._preUpdateDescendantDocuments(...args);
   *
   *     const [parent, collection, changes, options, userId] = args;
   *     if (collection === "effects") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preUpdateDescendantDocuments(...args: Actor.PreUpdateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class KultActor extends Actor {
   *   protected override _preDeleteDescendantDocuments(...args: Actor.PreDeleteDescendantDocumentsArgs) {
   *     super._preDeleteDescendantDocuments(...args);
   *
   *     const [parent, collection, ids, options, userId] = args;
   *     if (collection === "effects") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preDeleteDescendantDocuments(...args: Actor.PreDeleteDescendantDocumentsArgs): void;

  static override defaultName(context?: Actor.DefaultNameContext): string;

  static override createDialog(
    data?: Actor.CreateDialogData,
    createOptions?: Actor.Database.DialogCreateOptions,
    options?: Actor.CreateDialogOptions,
  ): Promise<Actor.Stored | null | undefined>;

  override deleteDialog(
    options?: InexactPartial<foundry.applications.api.DialogV2.ConfirmConfig>,
    operation?: Document.Database.DeleteOperationForName<"Actor">,
  ): Promise<this | false | null | undefined>;

  static override fromDropData(
    data: Actor.DropData,
    options?: Actor.DropDataOptions,
  ): Promise<Actor.Implementation | undefined>;

  static override fromImport(
    source: Actor.Source,
    context?: Document.FromImportContext<Actor.Parent> | null,
  ): Promise<Actor.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;

  #Actor: true;
}

export default Actor;
