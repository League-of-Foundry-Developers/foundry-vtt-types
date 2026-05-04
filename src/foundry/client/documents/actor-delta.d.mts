import type { ConfiguredActorDelta } from "#configuration";
import type { Identity, InexactPartial, MaybeArray, Merge, NullishProps } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { BaseActorDelta } from "#common/documents/_module.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

declare namespace ActorDelta {
  /**
   * The document's name.
   */
  type Name = "ActorDelta";

  /**
   * The context used to create a `ActorDelta`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `ActorDelta`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `ActorDelta` document instance configured through
   * {@linkcode CONFIG.ActorDelta.documentClass} in Foundry and {@linkcode DocumentClassConfig} or
   * {@linkcode ConfiguredActorDelta | fvtt-types/configuration/ConfiguredActorDelta} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `ActorDelta` document configured through
   * {@linkcode CONFIG.ActorDelta.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  /**
   * A document's metadata is special information about the document ranging anywhere from its name,
   * whether it's indexed, or to the permissions a user has over it.
   */
  interface Metadata extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "ActorDelta";
      collection: "delta";
      label: "DOCUMENT.ActorDelta";
      labelPlural: "DOCUMENT.ActorDeltas";
      isEmbedded: true;
      embedded: Metadata.Embedded;
      permissions: Metadata.Permissions;
      schemaVersion: "13.341";
    }>
  > {}

  namespace Metadata {
    /**
     * The embedded metadata
     */
    interface Embedded {
      Item: "items";
      ActiveEffect: "effects";
    }

    interface Permissions {
      create: "OWNER";
      delete: "OWNER";
    }
  }

  /**
   * Allowed subtypes of `ActorDelta`. Due to the implementation of the `ActorDelta` document,
   * the SubType is the same as the `Actor`'s SubType.
   *
   * {@linkcode Actor.SubType}
   */
  type SubType = Actor.SubType;

  /**
   * `ConfiguredSubType` represents the subtypes a user explicitly registered. This excludes
   * subtypes like the Foundry builtin subtype `"base"` and the catch-all subtype for arbitrary
   * module subtypes `${string}.${string}`.
   *
   * @see {@linkcode ActorDelta.SubType} for more information.
   */
  type ConfiguredSubType = Actor.ConfiguredSubType;

  /**
   * `Known` represents the types of `ActorDelta` that a user explicitly registered.
   *
   * @see {@link ConfiguredSubType} for more information.
   */
  type Known = ActorDelta.OfType<ActorDelta.ConfiguredSubType>;

  /**
   * `OfType` returns an instance of `ActorDelta` with the corresponding type. This works with both the
   * builtin `ActorDelta` class or a custom subclass if that is set up in
   * {@linkcode ConfiguredActorDelta | fvtt-types/configuration/ConfiguredActorDelta}.
   */
  type OfType<Type extends SubType> = Document.Internal.DiscriminateSystem<Name, _OfType, Type, ConfiguredSubType>;

  /** @internal */
  interface _OfType extends Identity<{
    [Type in SubType]: Type extends unknown
      ? ConfiguredActorDelta<Type> extends { document: infer Document }
        ? Document
        : // eslint-disable-next-line @typescript-eslint/no-restricted-types
          ActorDelta<Type>
      : never;
  }> {}

  /**
   * `SystemOfType` returns the system property for a specific `ActorDelta` subtype.
   */
  type SystemOfType<Type extends SubType> = Document.Internal.SystemOfType<Name, _SystemMap, Type, ConfiguredSubType>;

  /**
   * @internal
   */
  // Actor and ActorDelta have the same subtype setup.
  interface _ModelMap extends Actor._ModelMap {}

  /**
   * @internal
   */
  // Actor and ActorDelta have the same subtype setup.
  interface _SystemMap extends Actor._SystemMap {}

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   *
   * @remarks `ActorDelta` requires a parent, even for `new ActorDelta`, so `null` is not an option here.
   */
  type Parent = TokenDocument.Implementation;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type DirectDescendantName = "Item" | "ActiveEffect";

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
  type Descendant = DirectDescendant | Item.Descendant;

  /**
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all classes, or never if the document doesn't have any descendants.
   */
  type DescendantClass = DirectDescendantClass | Item.DescendantClass;

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
      ActorDelta.Implementation,
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
   * This is a fixed string per document type and is primarily useful for the descendant Document operation methods, e.g
   * {@linkcode ClientDocumentMixin.AnyMixed._preCreateDescendantDocuments | ClientDocument._preCreateDescendantDocuments}.
   */
  type ParentCollectionName = Metadata["collection"];

  /**
   * The world collection that contains this document type. Will be `never` if none exists.
   */
  type CollectionClass = never;

  /**
   * The world collection that contains this document type. Will be `never` if none exists.
   */
  type Collection = never;

  /**
   * An instance of `ActorDelta` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `ActorDelta` that comes from the database.
   */
  type Stored = Document.Internal.Stored<ActorDelta.Implementation>;

  /**
   * The data put in {@linkcode ActorDelta._source | ActorDelta#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source<SubType extends ActorDelta.SubType = ActorDelta.SubType> extends fields.SchemaField
    .SourceData<Schema> {
    type: SubType | null;
  }

  /**
   * The data necessary to create a document. Used in places like {@linkcode ActorDelta.create}
   * and {@linkcode ActorDelta | new ActorDelta(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData<SubType extends ActorDelta.SubType = ActorDelta.SubType> extends fields.SchemaField
    .CreateData<Schema> {
    type?: SubType | null | undefined;
  }

  /**
   * Used in the {@linkcode ActorDelta.create} and {@linkcode ActorDelta.createDocuments} signatures, and
   * {@linkcode ActorDelta.Database.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode ActorDelta.create}, returning (a single | an array of) (temporary | stored)
   * `ActorDelta`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput>
      ? Array<ActorDelta.TemporaryIf<Temporary>>
      : ActorDelta.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode ActorDelta.name | ActorDelta#name}.
   *
   * This is data transformed from {@linkcode ActorDelta.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode ActorDelta.update | ActorDelta#update}.
   * It is a distinct type from {@linkcode ActorDelta.CreateData | DeepPartial<ActorDelta.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode ActorDelta.update | ActorDelta#update} and
   * {@linkcode ActorDelta.updateDocuments} signatures, and {@linkcode ActorDelta.Database.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode ActorDelta}. This is the source of truth for how an ActorDelta document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode ActorDelta}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends fields.DataSchema {
    /**
     * The _id which uniquely identifies this ActorDelta document.
     */
    _id: fields.DocumentIdField;

    /**
     * The name override, if any.
     * @defaultValue `null`
     */
    name: fields.StringField<{ required: false; nullable: true; initial: null }>;

    /**
     * The type override, if any.
     * @defaultValue `null`
     */
    type: fields.StringField<{ required: false; nullable: true; initial: null }>;

    /**
     * The image override, if any.
     * @defaultValue `null`
     */
    img: fields.FilePathField<{ categories: ["IMAGE"]; nullable: true; initial: null; required: false }>;

    /**
     * The system data model override.
     */
    system: fields.ObjectField;

    /**
     * An array of embedded item data overrides.
     */
    items: fields.EmbeddedCollectionDeltaField<typeof foundry.documents.BaseItem, ActorDelta.Implementation>;

    /**
     * An array of embedded active effect data overrides.
     */
    effects: fields.EmbeddedCollectionDeltaField<typeof foundry.documents.BaseActiveEffect, ActorDelta.Implementation>;

    /**
     * Ownership overrides.
     * @defaultValue `null`
     */
    ownership: fields.DocumentOwnershipField<{ required: false; nullable: true; initial: null }>;

    /**
     * An object of actor flag overrides.
     */
    flags: fields.DocumentFlagsField<"Actor">;
  }

  namespace Database {
    /** Options passed along in Get operations for ActorDeltas */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<ActorDelta.Parent> {}

    /** Options passed along in Create operations for ActorDeltas */
    interface Create<Temporary extends boolean | undefined = boolean | undefined> extends foundry.abstract.types
      .DatabaseCreateOperation<ActorDelta.CreateData, ActorDelta.Parent, Temporary> {}

    /** Options passed along in Delete operations for ActorDeltas */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<ActorDelta.Parent> {}

    /** Options passed along in Update operations for ActorDeltas */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<ActorDelta.UpdateData, ActorDelta.Parent> {}

    /** Operation for {@linkcode ActorDelta.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined> extends Document.Database.CreateOperation<
      ActorDelta.Database.Create<Temporary>
    > {}

    /** Operation for {@linkcode ActorDelta.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<ActorDelta.Database.Update> {}

    /** Operation for {@linkcode ActorDelta.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<ActorDelta.Database.Delete> {}

    /** Operation for {@linkcode ActorDelta.create} */
    interface CreateOperation<Temporary extends boolean | undefined> extends Document.Database.CreateOperation<
      ActorDelta.Database.Create<Temporary>
    > {}

    /** Operation for {@linkcode ActorDelta.update | ActorDelta#update} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode ActorDelta.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@linkcode ActorDelta._preCreate | ActorDelta#_preCreate} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@linkcode ActorDelta._onCreate | ActorDelta#_onCreate} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode ActorDelta._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<ActorDelta.Database.Create> {}

    /** Operation for {@linkcode ActorDelta._onCreateOperation | ActorDelta#_onCreateOperation} */
    interface OnCreateOperation extends ActorDelta.Database.Create {}

    /** Options for {@linkcode ActorDelta._preUpdate | ActorDelta#_preUpdate} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@linkcode ActorDelta._onUpdate | ActorDelta#_onUpdate} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode ActorDelta._preUpdateOperation} */
    interface PreUpdateOperation extends ActorDelta.Database.Update {}

    /** Operation for {@linkcode ActorDelta._onUpdateOperation | ActorDelta._preUpdateOperation} */
    interface OnUpdateOperation extends ActorDelta.Database.Update {}

    /** Options for {@linkcode ActorDelta._preDelete | ActorDelta#_preDelete} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@linkcode ActorDelta._onDelete | ActorDelta#_onDelete} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@linkcode ActorDelta._preDeleteOperation | ActorDelta#_preDeleteOperation} */
    interface PreDeleteOperation extends ActorDelta.Database.Delete {}

    /** Options for {@linkcode ActorDelta._onDeleteOperation | ActorDelta#_onDeleteOperation} */
    interface OnDeleteOperation extends ActorDelta.Database.Delete {}

    /** Context for {@linkcode ActorDelta._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<ActorDelta.Parent> {}

    /** Context for {@linkcode ActorDelta._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<ActorDelta.Parent> {}

    /** Context for {@linkcode ActorDelta._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<ActorDelta.Parent> {}

    /**
     * Options for {@linkcode ActorDelta._preCreateDescendantDocuments | ActorDelta#_preCreateDescendantDocuments}
     * and {@linkcode ActorDelta._onCreateDescendantDocuments | ActorDelta#_onCreateDescendantDocuments}
     */
    interface CreateOptions extends Document.Database.CreateOptions<ActorDelta.Database.Create> {}

    /**
     * Options for {@linkcode ActorDelta._preUpdateDescendantDocuments | ActorDelta#_preUpdateDescendantDocuments}
     * and {@linkcode ActorDelta._onUpdateDescendantDocuments | ActorDelta#_onUpdateDescendantDocuments}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<ActorDelta.Database.Update> {}

    /**
     * Options for {@linkcode ActorDelta._preDeleteDescendantDocuments | ActorDelta#_preDeleteDescendantDocuments}
     * and {@linkcode ActorDelta._onDeleteDescendantDocuments | ActorDelta#_onDeleteDescendantDocuments}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<ActorDelta.Database.Delete> {}

    /**
     * Create options for {@linkcode ActorDelta.createDialog}.
     */
    interface DialogCreateOptions extends InexactPartial<Create> {}
  }

  /**
   * If `Temporary` is true then {@linkcode ActorDelta.Implementation}, otherwise {@linkcode ActorDelta.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? ActorDelta.Implementation : ActorDelta.Stored;

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

  /* ***********************************************
   *       CLIENT DOCUMENT TEMPLATE TYPES          *
   *************************************************/

  type PreCreateDescendantDocumentsArgs =
    | Document.Internal.PreCreateDescendantDocumentsArgs<
        ActorDelta.Stored,
        ActorDelta.DirectDescendantName,
        ActorDelta.Metadata.Embedded
      >
    | Item.PreCreateDescendantDocumentsArgs;

  type OnCreateDescendantDocumentsArgs =
    | Document.Internal.OnCreateDescendantDocumentsArgs<
        ActorDelta.Stored,
        ActorDelta.DirectDescendantName,
        ActorDelta.Metadata.Embedded
      >
    | Item.OnCreateDescendantDocumentsArgs;

  type PreUpdateDescendantDocumentsArgs =
    | Document.Internal.PreUpdateDescendantDocumentsArgs<
        ActorDelta.Stored,
        ActorDelta.DirectDescendantName,
        ActorDelta.Metadata.Embedded
      >
    | Item.PreUpdateDescendantDocumentsArgs;

  type OnUpdateDescendantDocumentsArgs =
    | Document.Internal.OnUpdateDescendantDocumentsArgs<
        ActorDelta.Stored,
        ActorDelta.DirectDescendantName,
        ActorDelta.Metadata.Embedded
      >
    | Item.OnUpdateDescendantDocumentsArgs;

  type PreDeleteDescendantDocumentsArgs =
    | Document.Internal.PreDeleteDescendantDocumentsArgs<
        ActorDelta.Stored,
        ActorDelta.DirectDescendantName,
        ActorDelta.Metadata.Embedded
      >
    | Item.PreDeleteDescendantDocumentsArgs;

  type OnDeleteDescendantDocumentsArgs =
    | Document.Internal.OnDeleteDescendantDocumentsArgs<
        ActorDelta.Stored,
        ActorDelta.DirectDescendantName,
        ActorDelta.Metadata.Embedded
      >
    | Item.OnDeleteDescendantDocumentsArgs;

  interface DropData extends Document.Internal.DropData<Name> {}
  interface DropDataOptions extends Document.DropDataOptions {}

  interface DefaultNameContext extends Document.DefaultNameContext<Name, NonNullable<Parent>> {}

  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /* ***********************************************
   *           ACTOR-DELTA-SPECIFIC TYPES          *
   *************************************************/

  /** @internal */
  type _InitializeOptions = NullishProps<{
    /**
     * @remarks Is this initialization part of a {@linkcode Scene.reset | Scene#reset} call? (skips further initialization if truthy)
     * @defaultValue `false`
     */
    sceneReset: boolean;
  }>;

  interface InitializeOptions extends Document.InitializeOptions, _InitializeOptions {}

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended. This type will be removed in v14.
   * @privateRemarks This is off-template, as ActorDelta throws if not provided a valid TokenDocument
   * parent in the construction context for any construction, not just `.create`ion
   */
  interface ConstructorArgs extends Identity<[data: CreateData | undefined, context: ConstructionContext]> {}

  /**
   * @deprecated Replaced with {@linkcode ActorDelta.ConfiguredSubType} (will be removed in v14).
   */
  type ConfiguredSubTypes = ConfiguredSubType;
}

/**
 * The client-side ActorDelta embedded document which extends the common BaseActorDelta document model.
 * @see {@linkcode TokenDocument}  The TokenDocument document type which contains ActorDelta embedded documents.
 */
declare class ActorDelta<out SubType extends ActorDelta.SubType = ActorDelta.SubType> extends BaseActorDelta.Internal
  .ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `ActorDelta`
   * @param context - Construction context options
   */
  // Note(LukeAbby): `data` is not actually required but `context.parent` is.
  constructor(data: ActorDelta.CreateData<SubType> | undefined, context: ActorDelta.ConstructionContext);

  protected override _configure(options?: Document.ConfigureOptions): void;

  protected override _initialize(options?: ActorDelta.InitializeOptions): void;

  /** Pass-through the type from the synthetic Actor, if it exists. */
  get type(): SubType;

  set type(type);

  protected _type: string;

  /**
   * Apply this ActorDelta to the base Actor and return a synthetic Actor.
   * @param context - Context to supply to synthetic Actor instantiation.
   * @remarks Forwards `context` to {@linkcode BaseActorDelta.applyDelta | this.constructor.applyDelta(this, this.parent.baseActor, context)}
   */
  apply(context?: BaseActorDelta.ApplyDeltaContext): Actor.Implementation | null;

  /** @remarks `"The synthetic actor prepares its items in the appropriate context of an actor. The actor delta does not need to prepare its items, and would do so in the incorrect context."` */
  override prepareEmbeddedDocuments(): void;

  // TODO: accurately type changes and return type
  override updateSource(
    // Note(LukeAbby): This must be valid for both `new ActorDelta.implementation(actorChanges, { parent: this.parent });` and `super.updateSource`.
    // However it's likely the overlap between these two types is pretty high.
    changes?: ActorDelta.Source,
    options?: DataModel.UpdateOptions,
  ): object;

  override reset(): void;

  /**
   * Generate a synthetic Actor instance when constructed, or when the represented Actor, or actorLink status changes.
   */
  protected _createSyntheticActor(options?: {
    /**
     * Whether to fully re-initialize this ActorDelta's collections in
     * order to re-retrieve embedded Documents from the synthetic
     * Actor.
     */
    reinitializeCollections: boolean;
  }): void;

  /**
   * Update the synthetic Actor instance with changes from the delta or the base Actor.
   */
  updateSyntheticActor(): void;

  /**
   * Restore this delta to empty, inheriting all its properties from the base actor.
   * @returns The restored synthetic Actor.
   */
  restore(): Promise<Actor.Implementation>;

  /**
   * Ensure that the embedded collection delta is managing any entries that have had their descendants updated.
   * @param doc - The parent whose immediate children have been modified.
   */
  _handleDeltaCollectionUpdates(doc: Document.Any): void;

  /** @remarks `"No-op as ActorDeltas do not have sheets."` */
  protected override _onSheetChange(): Promise<void>;

  protected override _prepareDeltaUpdate(changes?: ActorDelta.UpdateData, options?: DataModel.UpdateOptions): void;

  // _onUpdate and _onDelete are all overridden but with no signature changes from BaseActorDelta.

  protected override _dispatchDescendantDocumentEvents(
    event: ClientDocument.LifeCycleEventName,
    collection: string,
    args: unknown[],
    _parent: ClientDocument,
  ): void;

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

  protected override _preCreateDescendantDocuments(...args: ActorDelta.PreCreateDescendantDocumentsArgs): void;

  protected override _onCreateDescendantDocuments(...args: ActorDelta.OnCreateDescendantDocumentsArgs): void;

  protected override _preUpdateDescendantDocuments(...args: ActorDelta.PreUpdateDescendantDocumentsArgs): void;

  protected override _onUpdateDescendantDocuments(...args: ActorDelta.OnUpdateDescendantDocumentsArgs): void;

  protected override _preDeleteDescendantDocuments(...args: ActorDelta.PreDeleteDescendantDocumentsArgs): void;

  protected override _onDeleteDescendantDocuments(...args: ActorDelta.OnDeleteDescendantDocumentsArgs): void;

  /** @remarks `context` must contain a `pack` or `parent`. */
  static override defaultName(context: ActorDelta.DefaultNameContext): string;

  /** @remarks `createOptions` must contain a `pack` or `parent`. */
  static override createDialog(
    data: ActorDelta.CreateDialogData | undefined,
    createOptions: ActorDelta.Database.DialogCreateOptions,
    options?: ActorDelta.CreateDialogOptions,
  ): Promise<ActorDelta.Stored | null | undefined>;

  override deleteDialog(
    options?: InexactPartial<DialogV2.ConfirmConfig>,
    operation?: ActorDelta.Database.DeleteOperation,
  ): Promise<this | false | null | undefined>;

  static override fromDropData(
    data: ActorDelta.DropData,
    options?: ActorDelta.DropDataOptions,
  ): Promise<ActorDelta.Implementation | undefined>;

  static override fromImport(
    source: ActorDelta.Source,
    context?: Document.FromImportContext<ActorDelta.Parent> | null,
  ): Promise<ActorDelta.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default ActorDelta;
