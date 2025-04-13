import type { SchemaField, DataSchema } from "../../../common/data/fields.d.mts";
import type { BaseActor, BaseActorDelta } from "../../../common/documents/_module.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { fields } from "../../../common/data/module.d.mts";
import type { ConfiguredActorDelta } from "../../../../configuration/index.d.mts";

declare global {
  namespace ActorDelta {
    /**
     * The document's name.
     */
    type Name = "ActorDelta";

    /**
     * The arguments to construct the document.
     */
    interface ConstructorArgs extends Document.ConstructorParameters<CreateData, Parent> {}

    /**
     * The documents embedded within ActorDelta.
     */
    type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

    /**
     * The implementation of the ActorDelta document instance configured through `CONFIG.ActorDelta.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredActorDelta | `fvtt-types/configuration/ConfiguredActorDelta`} in fvtt-types.
     */
    type Implementation = Document.ImplementationFor<Name>;

    /**
     * The implementation of the ActorDelta document configured through `CONFIG.ActorDelta.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ImplementationClassFor<Name>;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<Name> {}

    // This is NOT a mistake. Due to the implementation of the ActorDelta document, the SubType is the same as the Actor's SubType.
    type SubType = Game.Model.TypeNames<Name>;
    type ConfiguredSubTypes = Document.ConfiguredSubTypesOf<Name>;
    type Known = ActorDelta.OfType<ActorDelta.ConfiguredSubTypes>;
    type OfType<Type extends SubType> = Document.Internal.OfType<ConfiguredActorDelta<Type>, ActorDelta<Type>>;

    /**
     * `SystemOfType` returns the system property for a specific `ActorDelta` subtype.
     */
    type SystemOfType<Type extends SubType> = Document.Internal.SystemOfType<_SystemMap, Type>;

    /**
     * @internal
     */
    interface _SystemMap extends Document.Internal.SystemMap<"ActorDelta"> {}
    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = TokenDocument.Implementation | null;

    /**
     * A document's descendants are any child documents, grandchild documents, etc.
     * This is a union of all instances, or never if the document doesn't have any descendants.
     *
     */
    type Descendants = Item.Stored | ActiveEffect.Stored;

    /**
     * A document's descendants are any child documents, grandchild documents, etc.
     * This is a union of all classes, or never if the document doesn't have any descendants.
     */
    type DescendantClasses = Item.ImplementationClass | ActiveEffect.ImplementationClass;

    /**
     * The valid `parent` entries for descendant document operations.
     * This includes the current document as well as any descendants that have descendants.
     */
    type DescendantParents = Stored | Item.Stored;

    /**
     * Types of CompendiumCollection this document might be contained in.
     * Note that `this.pack` will always return a string; this is the type for `game.packs.get(this.pack)`
     */
    type Pack = CompendiumCollection.ForDocument<"Scene">;

    /**
     * An embedded document is a document contained in another.
     * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
     *
     * If this is `never` it is because there are no embeddable documents (or there's a bug!).
     */
    type Embedded = Document.ImplementationFor<EmbeddedName>;

    /**
     * An embedded document is a document contained in another.
     * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
     *
     * If this is `never` it is because there are no embeddable documents (or there's a bug!).
     */
    type EmbeddedName = Document.EmbeddableNamesFor<Metadata>;

    type CollectionNameOf<CollectionName extends EmbeddedName> = CollectionName extends keyof Metadata["embedded"]
      ? Metadata["embedded"][CollectionName]
      : CollectionName;

    type EmbeddedCollectionName = Document.CollectionNamesFor<Metadata>;

    /**
     * The name of the world or embedded collection this document can find itself in.
     * For example an `Item` is always going to be inside a collection with a key of `items`.
     * This is a fixed string per document type and is primarily useful for {@link ClientDocumentMixin | `Descendant Document Events`}.
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
     * An instance of `ActorDelta` that comes from the database.
     */
    interface Stored extends Document.Stored<ActorDelta.Implementation> {}

    /**
     * The data put in {@link ActorDelta._source | `ActorDelta#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link ActorDelta._source | `ActorDelta#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link ActorDelta.create | `ActorDelta.create`}
     * and {@link ActorDelta | `new ActorDelta(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
     * {@link ActorDelta.name | `ActorDelta#name`}.
     *
     * This is data transformed from {@link ActorDelta.Source | `ActorDelta.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link ActorDelta.update | `ActorDelta#update`}.
     * It is a distinct type from {@link ActorDelta.CreateData | `DeepPartial<ActorDelta.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link ActorDelta | `ActorDelta`}. This is the source of truth for how an ActorDelta document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link ActorDelta | `ActorDelta`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies this ActorDelta document.
       */
      _id: fields.DocumentIdField;

      /**
       * The name override, if any.
       */
      name: fields.StringField<{ required: false; nullable: true; initial: null }>;

      /**
       * The type override, if any.
       */
      type: fields.StringField<{ required: false; nullable: true; initial: null }>;

      /**
       * The image override, if any.
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
      effects: fields.EmbeddedCollectionDeltaField<
        typeof foundry.documents.BaseActiveEffect,
        ActorDelta.Implementation
      >;

      /**
       * Ownership overrides.
       */
      ownership: fields.DocumentOwnershipField<{ required: false; nullable: true; initial: null }>;

      /**
       * An object of actor flag overrides.
       */
      flags: fields.ObjectField.FlagsField<"Actor">;
    }

    namespace Database {
      /** Options passed along in Get operations for ActorDeltas */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<ActorDelta.Parent> {}

      /** Options passed along in Create operations for ActorDeltas */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<ActorDelta.CreateData, ActorDelta.Parent, Temporary> {}

      /** Options passed along in Delete operations for ActorDeltas */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<ActorDelta.Parent> {}

      /** Options passed along in Update operations for ActorDeltas */
      interface Update
        extends foundry.abstract.types.DatabaseUpdateOperation<ActorDelta.UpdateData, ActorDelta.Parent> {}

      /** Operation for {@link ActorDelta.createDocuments | `ActorDelta.createDocuments`} */
      interface CreateDocumentsOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<ActorDelta.Database.Create<Temporary>> {}

      /** Operation for {@link ActorDelta.updateDocuments | `ActorDelta.updateDocuments`} */
      interface UpdateDocumentsOperation
        extends Document.Database.UpdateDocumentsOperation<ActorDelta.Database.Update> {}

      /** Operation for {@link ActorDelta.deleteDocuments | `ActorDelta.deleteDocuments`} */
      interface DeleteDocumentsOperation
        extends Document.Database.DeleteDocumentsOperation<ActorDelta.Database.Delete> {}

      /** Operation for {@link ActorDelta.create | `ActorDelta.create`} */
      interface CreateOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<ActorDelta.Database.Create<Temporary>> {}

      /** Operation for {@link ActorDelta.update | `ActorDelta#update`} */
      interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

      interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

      /** Options for {@link ActorDelta.get | `ActorDelta.get`} */
      interface GetOptions extends Document.Database.GetOptions {}

      /** Options for {@link ActorDelta._preCreate | `ActorDelta#_preCreate`} */
      interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

      /** Options for {@link ActorDelta._onCreate | `ActorDelta#_onCreate`} */
      interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

      /** Operation for {@link ActorDelta._preCreateOperation | `ActorDelta._preCreateOperation`} */
      interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<ActorDelta.Database.Create> {}

      /** Operation for {@link ActorDelta._onCreateOperation | `ActorDelta#_onCreateOperation`} */
      interface OnCreateOperation extends ActorDelta.Database.Create {}

      /** Options for {@link ActorDelta._preUpdate | `ActorDelta#_preUpdate`} */
      interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

      /** Options for {@link ActorDelta._onUpdate | `ActorDelta#_onUpdate`} */
      interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

      /** Operation for {@link ActorDelta._preUpdateOperation | `ActorDelta._preUpdateOperation`} */
      interface PreUpdateOperation extends ActorDelta.Database.Update {}

      /** Operation for {@link ActorDelta._onUpdateOperation | `ActorDelta._preUpdateOperation`} */
      interface OnUpdateOperation extends ActorDelta.Database.Update {}

      /** Options for {@link ActorDelta._preDelete | `ActorDelta#_preDelete`} */
      interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

      /** Options for {@link ActorDelta._onDelete | `ActorDelta#_onDelete`} */
      interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

      /** Options for {@link ActorDelta._preDeleteOperation | `ActorDelta#_preDeleteOperation`} */
      interface PreDeleteOperation extends ActorDelta.Database.Delete {}

      /** Options for {@link ActorDelta._onDeleteOperation | `ActorDelta#_onDeleteOperation`} */
      interface OnDeleteOperation extends ActorDelta.Database.Delete {}

      /** Context for {@link ActorDelta._onDeleteOperation | `ActorDelta._onDeleteOperation`} */
      interface OnDeleteDocumentsContext extends Document.ModificationContext<ActorDelta.Parent> {}

      /** Context for {@link ActorDelta._onCreateDocuments | `ActorDelta._onCreateDocuments`} */
      interface OnCreateDocumentsContext extends Document.ModificationContext<ActorDelta.Parent> {}

      /** Context for {@link ActorDelta._onUpdateDocuments | `ActorDelta._onUpdateDocuments`} */
      interface OnUpdateDocumentsContext extends Document.ModificationContext<ActorDelta.Parent> {}

      /**
       * Options for {@link ActorDelta._preCreateDescendantDocuments | `ActorDelta#_preCreateDescendantDocuments`}
       * and {@link ActorDelta._onCreateDescendantDocuments | `ActorDelta#_onCreateDescendantDocuments`}
       */
      interface CreateOptions extends Document.Database.CreateOptions<ActorDelta.Database.Create> {}

      /**
       * Options for {@link ActorDelta._preUpdateDescendantDocuments | `ActorDelta#_preUpdateDescendantDocuments`}
       * and {@link ActorDelta._onUpdateDescendantDocuments | `ActorDelta#_onUpdateDescendantDocuments`}
       */
      interface UpdateOptions extends Document.Database.UpdateOptions<ActorDelta.Database.Update> {}

      /**
       * Options for {@link ActorDelta._preDeleteDescendantDocuments | `ActorDelta#_preDeleteDescendantDocuments`}
       * and {@link ActorDelta._onDeleteDescendantDocuments | `ActorDelta#_onDeleteDescendantDocuments`}
       */
      interface DeleteOptions extends Document.Database.DeleteOptions<ActorDelta.Database.Delete> {}
    }

    interface Flags extends Document.ConfiguredFlagsForName<Name> {}

    namespace Flags {
      type Scope = Document.FlagKeyOf<Flags>;
      type Key<Scope extends Flags.Scope> = Document.FlagKeyOf<Document.FlagGetKey<Flags, Scope>>;
      type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.GetFlag<Name, Scope, Key>;
    }

    /**
     * @deprecated {@link ActorDelta.Database | `ActorDelta.DatabaseOperation`}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<ActorDelta.Implementation> {}

    /**
     * @deprecated {@link ActorDelta.Types | `ActorDelta.SubType`}
     */
    type TypeNames = ActorDelta.SubType;

    /**
     * @deprecated {@link ActorDelta.CreateData | `ActorDelta.CreateData`}
     */
    interface ConstructorData extends ActorDelta.CreateData {}

    /**
     * @deprecated {@link ActorDelta.implementation | `ActorDelta.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link ActorDelta.Implementation | `ActorDelta.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side ActorDelta embedded document which extends the common BaseActorDelta document model.
   * @see {@link TokenDocument | `TokenDocument`}  The TokenDocument document type which contains ActorDelta embedded documents.
   */
  class ActorDelta<out SubType extends ActorDelta.SubType = ActorDelta.SubType> extends ClientDocumentMixin(
    BaseActorDelta,
  )<SubType> {
    /**
     * @param data    - Initial data from which to construct the `ActorDelta`
     * @param context - Construction context options
     */
    constructor(...args: ActorDelta.ConstructorArgs);

    protected override _configure(options?: { pack?: string | null }): void;

    protected override _initialize(options?: any): void;

    /** Pass-through the type from the synthetic Actor, if it exists. */
    _type: string;

    /**
     * Apply this ActorDelta to the base Actor and return a synthetic Actor.
     * @param context - Context to supply to synthetic Actor instantiation.
     */
    apply(context: unknown): Actor.Implementation;

    /** @remarks `"The synthetic actor prepares its items in the appropriate context of an actor. The actor delta does not need to prepare its items, and would do so in the incorrect context."` */
    override prepareEmbeddedDocuments(): void;

    override updateSource(
      changes?: SchemaField.AssignmentData<BaseActor.Schema>,
      options?: { dryRun?: boolean; fallback?: boolean; recursive?: boolean },
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

    /**
     * @privateRemarks _onUpdate and _onDelete are all overridden but with no signature changes from BaseActorDelta.
     */

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

    protected override _preCreateDescendantDocuments<
      DescendantDocumentType extends ActorDelta.DescendantClasses,
      Parent extends ActorDelta.DescendantParents,
      CreateData extends Document.CreateDataFor<DescendantDocumentType>,
      Operation extends foundry.abstract.types.DatabaseCreateOperation<CreateData, Parent, false>,
    >(
      parent: Parent,
      collection: DescendantDocumentType["metadata"]["collection"],
      data: CreateData[],
      options: Document.Database.CreateOptions<Operation>,
      userId: string,
    ): void;

    protected override _onCreateDescendantDocuments<
      DescendantDocumentType extends ActorDelta.DescendantClasses,
      Parent extends ActorDelta.DescendantParents,
      CreateData extends Document.CreateDataFor<DescendantDocumentType>,
      Operation extends foundry.abstract.types.DatabaseCreateOperation<CreateData, Parent, false>,
    >(
      parent: Parent,
      collection: DescendantDocumentType["metadata"]["collection"],
      documents: InstanceType<DescendantDocumentType>,
      data: CreateData[],
      options: Document.Database.CreateOptions<Operation>,
      userId: string,
    ): void;

    protected override _preUpdateDescendantDocuments<
      DescendantDocumentType extends ActorDelta.DescendantClasses,
      Parent extends ActorDelta.DescendantParents,
      UpdateData extends Document.UpdateDataFor<DescendantDocumentType>,
      Operation extends foundry.abstract.types.DatabaseUpdateOperation<UpdateData, Parent>,
    >(
      parent: Parent,
      collection: DescendantDocumentType["metadata"]["collection"],
      changes: UpdateData[],
      options: Document.Database.UpdateOptions<Operation>,
      userId: string,
    ): void;

    protected override _onUpdateDescendantDocuments<
      DescendantDocumentType extends ActorDelta.DescendantClasses,
      Parent extends ActorDelta.DescendantParents,
      UpdateData extends Document.UpdateDataFor<DescendantDocumentType>,
      Operation extends foundry.abstract.types.DatabaseUpdateOperation<UpdateData, Parent>,
    >(
      parent: Parent,
      collection: DescendantDocumentType["metadata"]["collection"],
      documents: InstanceType<DescendantDocumentType>,
      changes: UpdateData[],
      options: Document.Database.UpdateOptions<Operation>,
      userId: string,
    ): void;

    protected _preDeleteDescendantDocuments<
      DescendantDocumentType extends ActorDelta.DescendantClasses,
      Parent extends ActorDelta.DescendantParents,
      Operation extends foundry.abstract.types.DatabaseDeleteOperation<Parent>,
    >(
      parent: Parent,
      collection: DescendantDocumentType["metadata"]["collection"],
      ids: string[],
      options: Document.Database.DeleteOptions<Operation>,
      userId: string,
    ): void;

    protected _onDeleteDescendantDocuments<
      DescendantDocumentType extends ActorDelta.DescendantClasses,
      Parent extends ActorDelta.DescendantParents,
      Operation extends foundry.abstract.types.DatabaseDeleteOperation<Parent>,
    >(
      parent: Parent,
      collection: DescendantDocumentType["metadata"]["collection"],
      documents: InstanceType<DescendantDocumentType>,
      ids: string[],
      options: Document.Database.DeleteOptions<Operation>,
      userId: string,
    ): void;

    static override defaultName(
      context: Document.DefaultNameContext<ActorDelta.SubType, NonNullable<ActorDelta.Parent>>,
    ): string;

    static override createDialog(
      data: Document.CreateDialogData<ActorDelta.CreateData>,
      context: Document.CreateDialogContext<ActorDelta.SubType, NonNullable<ActorDelta.Parent>>,
    ): Promise<ActorDelta.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<ActorDelta.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<ActorDelta.Implementation | undefined>;

    static override fromImport(
      source: ActorDelta.Source,
      context?: Document.FromImportContext<ActorDelta.Parent>,
    ): Promise<ActorDelta.Implementation>;
  }
}
