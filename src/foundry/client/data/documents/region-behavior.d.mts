import type { ConfiguredRegionBehavior } from "../../../../configuration/index.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { fields } from "../../../common/data/module.d.mts";
import type BaseRegionBehavior from "../../../common/documents/region-behavior.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";

declare global {
  namespace RegionBehavior {
    /**
     * The document's name.
     */
    type Name = "RegionBehavior";

    /**
     * The arguments to construct the document.
     */
    type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

    /**
     * The documents embedded within RegionBehavior.
     */
    type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

    /**
     * The implementation of the RegionBehavior document instance configured through `CONFIG.RegionBehavior.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredRegionBehavior | `fvtt-types/configuration/ConfiguredRegionBehavior`} in fvtt-types.
     */
    type Implementation = Document.ImplementationFor<Name>;

    /**
     * The implementation of the RegionBehavior document configured through `CONFIG.RegionBehavior.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ImplementationClassFor<Name>;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<Name> {}

    type SubType = Game.Model.TypeNames<Name>;
    type ConfiguredSubTypes = Document.ConfiguredSubTypesOf<Name>;
    type Known = RegionBehavior.OfType<RegionBehavior.ConfiguredSubTypes>;
    type OfType<Type extends SubType> = Document.Internal.OfType<
      ConfiguredRegionBehavior<Type>,
      RegionBehavior<SubType>
    >;
    /**
     * A document's parent is something that can contain it.
     * For example an `RegionBehavior` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = RegionDocument.Implementation | null;

    /**
     * A document's descendants are any child documents, grandchild documents, etc.
     * This is a union of all instances, or never if the document doesn't have any descendants.
     */
    type Descendants = never;

    /**
     * A document's descendants are any child documents, grandchild documents, etc.
     * This is a union of all classes, or never if the document doesn't have any descendants.
     */
    type DescendantClasses = never;

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
     * An instance of `RegionBehavior` that comes from the database.
     */
    interface Stored<out Subtype extends SubType = SubType> extends Document.Stored<OfType<Subtype>> {}

    /**
     * The data put in {@link RegionBehavior._source | `RegionBehavior#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link RegionBehavior._source | `RegionBehavior#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link RegionBehavior.create | `RegionBehavior.create`}
     * and {@link RegionBehavior | `new RegionBehavior(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
     * {@link RegionBehavior.name | `RegionBehavior#name`}.
     *
     * This is data transformed from {@link RegionBehavior.Source | `RegionBehavior.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link RegionBehavior.update | `RegionBehavior#update`}.
     * It is a distinct type from {@link RegionBehavior.CreateData | `DeepPartial<RegionBehavior.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link RegionBehavior | `RegionBehavior`}. This is the source of truth for how an RegionBehavior document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link RegionBehavior | `RegionBehavior`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies this RegionBehavior document
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      /**
       * The name used to describe the RegionBehavior
       * @defaultValue `""`
       */
      name: fields.StringField<{ required: true; blank: true; label: string; textSearch: true }>;

      /**
       * An RegionBehavior subtype which configures the system data model applied
       */
      type: fields.DocumentTypeField<typeof BaseRegionBehavior>;

      /**
       * The system data object which is defined by the system template.json model
       */
      system: fields.TypeDataField<typeof BaseRegionBehavior>;

      /**
       * Is the RegionBehavior currently disabled?
       * @defaultValue `false`
       */
      disabled: fields.BooleanField<{ label: "BEHAVIOR.FIELDS.disabled.label"; hint: "BEHAVIOR.FIELDS.disabled.hint" }>;

      /**
       * An object of optional key/value flags
       */
      flags: fields.ObjectField.FlagsField<Name>;

      /**
       * An object of creation and access information
       * @defaultValue see {@link fields.DocumentStatsField | `fields.DocumentStatsField`}
       */
      _stats: fields.DocumentStatsField;
    }

    namespace Database {
      /** Options passed along in Get operations for RegionBehaviors */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<RegionBehavior.Parent> {}

      /** Options passed along in Create operations for RegionBehaviors */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<
          RegionBehavior.CreateData,
          RegionBehavior.Parent,
          Temporary
        > {}

      /** Options passed along in Delete operations for RegionBehaviors */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<RegionBehavior.Parent> {}

      /** Options passed along in Update operations for RegionBehaviors */
      interface Update
        extends foundry.abstract.types.DatabaseUpdateOperation<RegionBehavior.UpdateData, RegionBehavior.Parent> {}

      /** Operation for {@link RegionBehavior.createDocuments | `RegionBehavior.createDocuments`} */
      interface CreateDocumentsOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<RegionBehavior.Database.Create<Temporary>> {}

      /** Operation for {@link RegionBehavior.updateDocuments | `RegionBehavior.updateDocuments`} */
      interface UpdateDocumentsOperation
        extends Document.Database.UpdateDocumentsOperation<RegionBehavior.Database.Update> {}

      /** Operation for {@link RegionBehavior.deleteDocuments | `RegionBehavior.deleteDocuments`} */
      interface DeleteDocumentsOperation
        extends Document.Database.DeleteDocumentsOperation<RegionBehavior.Database.Delete> {}

      /** Operation for {@link RegionBehavior.create | `RegionBehavior.create`} */
      interface CreateOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<RegionBehavior.Database.Create<Temporary>> {}

      /** Operation for {@link RegionBehavior.update | `RegionBehavior#update`} */
      interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

      interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

      /** Options for {@link RegionBehavior.get | `RegionBehavior.get`} */
      interface GetOptions extends Document.Database.GetOptions {}

      /** Options for {@link RegionBehavior._preCreate | `RegionBehavior#_preCreate`} */
      interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

      /** Options for {@link RegionBehavior._onCreate | `RegionBehavior#_onCreate`} */
      interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

      /** Operation for {@link RegionBehavior._preCreateOperation | `RegionBehavior._preCreateOperation`} */
      interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<RegionBehavior.Database.Create> {}

      /** Operation for {@link RegionBehavior._onCreateOperation | `RegionBehavior#_onCreateOperation`} */
      interface OnCreateOperation extends RegionBehavior.Database.Create {}

      /** Options for {@link RegionBehavior._preUpdate | `RegionBehavior#_preUpdate`} */
      interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

      /** Options for {@link RegionBehavior._onUpdate | `RegionBehavior#_onUpdate`} */
      interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

      /** Operation for {@link RegionBehavior._preUpdateOperation | `RegionBehavior._preUpdateOperation`} */
      interface PreUpdateOperation extends RegionBehavior.Database.Update {}

      /** Operation for {@link RegionBehavior._onUpdateOperation | `RegionBehavior._preUpdateOperation`} */
      interface OnUpdateOperation extends RegionBehavior.Database.Update {}

      /** Options for {@link RegionBehavior._preDelete | `RegionBehavior#_preDelete`} */
      interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

      /** Options for {@link RegionBehavior._onDelete | `RegionBehavior#_onDelete`} */
      interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

      /** Options for {@link RegionBehavior._preDeleteOperation | `RegionBehavior#_preDeleteOperation`} */
      interface PreDeleteOperation extends RegionBehavior.Database.Delete {}

      /** Options for {@link RegionBehavior._onDeleteOperation | `RegionBehavior#_onDeleteOperation`} */
      interface OnDeleteOperation extends RegionBehavior.Database.Delete {}

      /** Context for {@link RegionBehavior._onDeleteOperation | `RegionBehavior._onDeleteOperation`} */
      interface OnDeleteDocumentsContext extends Document.ModificationContext<RegionBehavior.Parent> {}

      /** Context for {@link RegionBehavior._onCreateDocuments | `RegionBehavior._onCreateDocuments`} */
      interface OnCreateDocumentsContext extends Document.ModificationContext<RegionBehavior.Parent> {}

      /** Context for {@link RegionBehavior._onUpdateDocuments | `RegionBehavior._onUpdateDocuments`} */
      interface OnUpdateDocumentsContext extends Document.ModificationContext<RegionBehavior.Parent> {}

      /**
       * Options for {@link RegionBehavior._preCreateDescendantDocuments | `RegionBehavior#_preCreateDescendantDocuments`}
       * and {@link RegionBehavior._onCreateDescendantDocuments | `RegionBehavior#_onCreateDescendantDocuments`}
       */
      interface CreateOptions extends Document.Database.CreateOptions<RegionBehavior.Database.Create> {}

      /**
       * Options for {@link RegionBehavior._preUpdateDescendantDocuments | `RegionBehavior#_preUpdateDescendantDocuments`}
       * and {@link RegionBehavior._onUpdateDescendantDocuments | `RegionBehavior#_onUpdateDescendantDocuments`}
       */
      interface UpdateOptions extends Document.Database.UpdateOptions<RegionBehavior.Database.Update> {}

      /**
       * Options for {@link RegionBehavior._preDeleteDescendantDocuments | `RegionBehavior#_preDeleteDescendantDocuments`}
       * and {@link RegionBehavior._onDeleteDescendantDocuments | `RegionBehavior#_onDeleteDescendantDocuments`}
       */
      interface DeleteOptions extends Document.Database.DeleteOptions<RegionBehavior.Database.Delete> {}
    }

    interface Flags extends Document.ConfiguredFlagsForName<Name> {}

    namespace Flags {
      type Scope = Document.FlagKeyOf<Flags>;
      type Key<Scope extends Flags.Scope> = Document.FlagKeyOf<Document.FlagGetKey<Flags, Scope>>;
      type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.GetFlag<Name, Scope, Key>;
    }

    /**
     * @deprecated {@link RegionBehavior.Database | `RegionBehavior.DatabaseOperation`}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<RegionBehavior> {}

    /**
     * @deprecated {@link RegionBehavior.Types | `RegionBehavior.SubType`}
     */
    type TypeNames = RegionBehavior.SubType;

    /**
     * @deprecated {@link RegionBehavior.CreateData | `RegionBehavior.CreateData`}
     */
    interface ConstructorData extends RegionBehavior.CreateData {}

    /**
     * @deprecated {@link RegionBehavior.implementation | `RegionBehavior.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link RegionBehavior.Implementation | `RegionBehavior.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side RegionBehavior document which extends the common BaseRegionBehavior model.
   */
  class RegionBehavior<out SubType extends RegionBehavior.SubType = RegionBehavior.SubType> extends ClientDocumentMixin(
    foundry.documents.BaseRegionBehavior,
  )<SubType> {
    /**
     * @param data    - Initial data from which to construct the `RegionBehavior`
     * @param context - Construction context options
     */
    constructor(...args: RegionBehavior.ConstructorArgs);

    /** A convenience reference to the RegionDocument which contains this RegionBehavior. */
    get region(): RegionDocument.Implementation | null;

    /** A convenience reference to the Scene which contains this RegionBehavior. */
    get scene(): Scene.Implementation | null;

    /** A RegionBehavior is active if and only if it was created, hasn't been deleted yet, and isn't disabled. */
    get active(): boolean;

    /** A RegionBehavior is viewed if and only if it is active and the Scene of its Region is viewed. */
    get viewed(): boolean;

    override prepareBaseData(): void;

    /**
     * Does this RegionBehavior handle the Region events with the given name?
     * @param eventName - The Region event name
     */
    hasEvent(eventName: string): boolean;

    /**
     * Handle the Region Event.
     * @param event - The Region event
     * @internal
     */
    protected _handleRegionEvent(event: RegionDocument.RegionEvent): void;

    static override createDialog(
      data: Document.CreateDialogData<RegionBehavior.CreateData>,
      context: Document.CreateDialogContext<RegionBehavior.SubType, NonNullable<RegionBehavior.Parent>>,
    ): Promise<RegionBehavior.Stored | null | undefined>;

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

    // Descendant Document operations have been left out because RegionBehavior does not have any descendant documents.

    static override defaultName(
      context: Document.DefaultNameContext<RegionBehavior.SubType, NonNullable<RegionBehavior.Parent>>,
    ): string;

    static override fromDropData(
      data: Document.DropData<RegionBehavior.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<RegionBehavior.Implementation | undefined>;

    static override fromImport(
      source: RegionBehavior.Source,
      context?: Document.FromImportContext<RegionBehavior.Parent>,
    ): Promise<RegionBehavior.Implementation>;

    // Embedded document operations have been left out because RegionBehavior does not have any embedded documents.
  }
}
