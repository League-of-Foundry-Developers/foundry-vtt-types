import type { SchemaField } from "../../../common/data/fields.d.mts";
import type { BaseActor, BaseActorDelta } from "../../../common/documents/_module.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { fields } from "../../../common/data/module.d.mts";
import type { HandleEmptyObject } from "../../../../utils/index.d.mts";
import type { ConfiguredActorDelta } from "../../../../configuration/index.d.mts";

import DataSchema = foundry.data.fields.DataSchema;

declare global {
  namespace ActorDelta {
    /**
     * The implementation of the ActorDelta document instance configured through `CONFIG.ActorDelta.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredActorDelta | `configuration/ConfiguredActorDelta`} in fvtt-types.
     */
    type Implementation = Document.ConfiguredInstanceForName<"ActorDelta">;

    /**
     * The implementation of the ActorDelta document configured through `CONFIG.ActorDelta.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ConfiguredClassForName<"ActorDelta">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"ActorDelta"> {}

    // This is NOT a mistake. Due to the implementation of the ActorDelta document, the SubType is the same as the Actor's SubType.
    type SubType = Game.Model.TypeNames<"ActorDelta">;
    type OfType<Type extends SubType> = HandleEmptyObject<ConfiguredActorDelta<Type>, ActorDelta<SubType>>;

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = null;

    /**
     * An instance of `ActorDelta` that comes from the database.
     */
    interface Stored extends Document.Stored<ActorDelta.Implementation> {}

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
     * The data put in {@link ActorDelta._source | `ActorDelta._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
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
     * The data after a {@link Document | `Document`} has been initialized, for example
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

    namespace DatabaseOperation {
      interface Get extends foundry.abstract.types.DatabaseGetOperation<ActiveEffect.Parent> {}
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<
          ActiveEffect.CreateData,
          ActiveEffect.Parent,
          Temporary
        > {}
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<ActiveEffect.Parent> {}
      interface Update
        extends foundry.abstract.types.DatabaseUpdateOperation<ActiveEffect.UpdateData, ActiveEffect.Parent> {}

      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    /**
     * @deprecated - {@link ActorDelta.DatabaseOperation}
     */
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
   * @see {@link TokenDocument}  The TokenDocument document type which contains ActorDelta embedded documents.
   */
  class ActorDelta<SubType extends ActorDelta.SubType = ActorDelta.SubType> extends ClientDocumentMixin(
    BaseActorDelta,
  )<SubType> {
    protected override _configure(options?: { pack?: string | null }): void;

    protected override _initialize(options?: any): void;
    protected override _initialize(): void;

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
     * @privateRemarks _onUpdate and _onDelete are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    protected override _dispatchDescendantDocumentEvents(
      event: ClientDocument.LifeCycleEventName,
      collection: string,
      args: unknown[],
      _parent: ClientDocument,
    ): void;

    /**
     * After this point these are not really overridden methods.
     * They are here because they're static properties but depend on the instance and so can't be
     * defined DRY-ly while also being easily overrideable.
     */

    static override metadata: ActorDelta.Metadata;

    static get implementation(): ActorDelta.ImplementationClass;

    static override defaultName(context?: Document.DefaultNameContext<ActorDelta.SubType, ActorDelta.Parent>): string;

    static override createDialog(
      data: ActorDelta.CreateData,
      context?: Document.CreateDialogContext<ActorDelta.SubType, ActorDelta.Parent>,
    ): Promise<ActorDelta.Implementation | null | undefined>;

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
