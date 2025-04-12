import type { ConfiguredTableResult } from "../../../../configuration/index.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields } from "../../../common/data/module.d.mts";
import type BaseTableResult from "../../../common/documents/table-result.d.mts";

declare global {
  namespace TableResult {
    /**
     * The document's name.
     */
    type Name = "TableResult";

    /**
     * The arguments to construct the document.
     */
    interface ConstructorArgs extends Document.ConstructorParameters<CreateData, Parent> {}

    /**
     * The documents embedded within TableResult.
     */
    type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

    /**
     * The implementation of the TableResult document instance configured through `CONFIG.TableResult.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredTableResult | `fvtt-types/configuration/ConfiguredTableResult`} in fvtt-types.
     */
    type Implementation = Document.ImplementationFor<Name>;

    /**
     * The implementation of the TableResult document configured through `CONFIG.TableResult.documentClass` in Foundry and
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
    type Known = TableResult.OfType<TableResult.ConfiguredSubTypes>;
    type OfType<Type extends SubType> = Document.Internal.OfType<ConfiguredTableResult<Type>, TableResult<Type>>;

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = RollTable.Implementation | null;

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
    type Pack = CompendiumCollection.ForDocument<"RollTable">;

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

    type ParentCollectionName = Metadata["collection"];

    /**
     * An instance of `TableResult` that comes from the database.
     */
    interface Stored<out Subtype extends SubType = SubType> extends Document.Stored<OfType<Subtype>> {}

    /**
     * The data put in {@link TableResult._source | `TableResult#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link TableResult._source | `TableResult#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link TableResult.create | `TableResult.create`}
     * and {@link TableResult | `new TableResult(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
     * {@link TableResult.name | `TableResult#name`}.
     *
     * This is data transformed from {@link TableResult.Source | `TableResult.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link TableResult.update | `TableResult#update`}.
     * It is a distinct type from {@link TableResult.CreateData | `DeepPartial<TableResult.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link TableResult | `TableResult`}. This is the source of truth for how an TableResult document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link TableResult | `TableResult`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies this TableResult embedded document
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      /**
       * A result subtype from CONST.TABLE_RESULT_TYPES
       * @defaultValue `CONST.TABLE_RESULT_TYPES.TEXT`
       */
      type: fields.DocumentTypeField<
        typeof BaseTableResult,
        {
          initial: typeof CONST.TABLE_RESULT_TYPES.TEXT;
        }
      >;

      /**
       * The text which describes the table result
       * @defaultValue `""`
       */
      text: fields.HTMLField<{ textSearch: true }>;

      /**
       * An image file url that represents the table result
       * @defaultValue `null`
       */
      img: fields.FilePathField<{ categories: ["IMAGE"] }>;

      /**
       * A named collection from which this result is drawn
       * @defaultValue `""`
       */
      documentCollection: fields.StringField;

      /**
       * The _id of a Document within the collection this result references
       * @defaultValue `null`
       */
      documentId: fields.ForeignDocumentField<typeof Document, { idOnly: true }>;

      /**
       * The probabilistic weight of this result relative to other results
       * @defaultValue `null`
       */
      weight: fields.NumberField<{ required: true; integer: true; positive: true; nullable: false; initial: 1 }>;

      /**
       * A length 2 array of ascending integers which defines the range of dice roll
       * @defaultValue `[]`
       */
      range: fields.ArrayField<
        fields.NumberField<{ integer: true }>,
        {
          validate: (r: [start: number, end: number]) => boolean;
          validationError: "must be a length-2 array of ascending integers";
        }
      >;

      /**
       * Has this result already been drawn (without replacement)
       * @defaultValue `false`
       */
      drawn: fields.BooleanField;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<Name>;
    }

    namespace Database {
      /** Options passed along in Get operations for TableResults */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<TableResult.Parent> {}

      /** Options passed along in Create operations for TableResults */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<TableResult.CreateData, TableResult.Parent, Temporary> {
        animate?: boolean;
      }

      /** Options passed along in Delete operations for TableResults */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<TableResult.Parent> {
        animate?: boolean;
      }

      /** Options passed along in Update operations for TableResults */
      interface Update
        extends foundry.abstract.types.DatabaseUpdateOperation<TableResult.UpdateData, TableResult.Parent> {
        animate?: boolean;
      }

      /** Operation for {@link TableResult.createDocuments | `TableResult.createDocuments`} */
      interface CreateDocumentsOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<TableResult.Database.Create<Temporary>> {}

      /** Operation for {@link TableResult.updateDocuments | `TableResult.updateDocuments`} */
      interface UpdateDocumentsOperation
        extends Document.Database.UpdateDocumentsOperation<TableResult.Database.Update> {}

      /** Operation for {@link TableResult.deleteDocuments | `TableResult.deleteDocuments`} */
      interface DeleteDocumentsOperation
        extends Document.Database.DeleteDocumentsOperation<TableResult.Database.Delete> {}

      /** Operation for {@link TableResult.create | `TableResult.create`} */
      interface CreateOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<TableResult.Database.Create<Temporary>> {}

      /** Operation for {@link TableResult.update | `TableResult#update`} */
      interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

      interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

      /** Options for {@link TableResult.get | `TableResult.get`} */
      interface GetOptions extends Document.Database.GetOptions {}

      /** Options for {@link TableResult._preCreate | `TableResult#_preCreate`} */
      interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

      /** Options for {@link TableResult._onCreate | `TableResult#_onCreate`} */
      interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

      /** Operation for {@link TableResult._preCreateOperation | `TableResult._preCreateOperation`} */
      interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<TableResult.Database.Create> {}

      /** Operation for {@link TableResult._onCreateOperation | `TableResult#_onCreateOperation`} */
      interface OnCreateOperation extends TableResult.Database.Create {}

      /** Options for {@link TableResult._preUpdate | `TableResult#_preUpdate`} */
      interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

      /** Options for {@link TableResult._onUpdate | `TableResult#_onUpdate`} */
      interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

      /** Operation for {@link TableResult._preUpdateOperation | `TableResult._preUpdateOperation`} */
      interface PreUpdateOperation extends TableResult.Database.Update {}

      /** Operation for {@link TableResult._onUpdateOperation | `TableResult._preUpdateOperation`} */
      interface OnUpdateOperation extends TableResult.Database.Update {}

      /** Options for {@link TableResult._preDelete | `TableResult#_preDelete`} */
      interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

      /** Options for {@link TableResult._onDelete | `TableResult#_onDelete`} */
      interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

      /** Options for {@link TableResult._preDeleteOperation | `TableResult#_preDeleteOperation`} */
      interface PreDeleteOperation extends TableResult.Database.Delete {}

      /** Options for {@link TableResult._onDeleteOperation | `TableResult#_onDeleteOperation`} */
      interface OnDeleteOperation extends TableResult.Database.Delete {}

      /** Context for {@link TableResult._onDeleteOperation | `TableResult._onDeleteOperation`} */
      interface OnDeleteDocumentsContext extends Document.ModificationContext<TableResult.Parent> {}

      /** Context for {@link TableResult._onCreateDocuments | `TableResult._onCreateDocuments`} */
      interface OnCreateDocumentsContext extends Document.ModificationContext<TableResult.Parent> {}

      /** Context for {@link TableResult._onUpdateDocuments | `TableResult._onUpdateDocuments`} */
      interface OnUpdateDocumentsContext extends Document.ModificationContext<TableResult.Parent> {}

      /**
       * Options for {@link TableResult._preCreateDescendantDocuments | `TableResult#_preCreateDescendantDocuments`}
       * and {@link TableResult._onCreateDescendantDocuments | `TableResult#_onCreateDescendantDocuments`}
       */
      interface CreateOptions extends Document.Database.CreateOptions<TableResult.Database.Create> {}

      /**
       * Options for {@link TableResult._preUpdateDescendantDocuments | `TableResult#_preUpdateDescendantDocuments`}
       * and {@link TableResult._onUpdateDescendantDocuments | `TableResult#_onUpdateDescendantDocuments`}
       */
      interface UpdateOptions extends Document.Database.UpdateOptions<TableResult.Database.Update> {}

      /**
       * Options for {@link TableResult._preDeleteDescendantDocuments | `TableResult#_preDeleteDescendantDocuments`}
       * and {@link TableResult._onDeleteDescendantDocuments | `TableResult#_onDeleteDescendantDocuments`}
       */
      interface DeleteOptions extends Document.Database.DeleteOptions<TableResult.Database.Delete> {}
    }

    interface Flags extends Document.ConfiguredFlagsForName<Name> {}

    namespace Flags {
      type Scope = Document.FlagKeyOf<Flags>;
      type Key<Scope extends Flags.Scope> = Document.FlagKeyOf<Document.FlagGetKey<Flags, Scope>>;
      type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.GetFlag<Name, Scope, Key>;
    }

    /**
     * @deprecated {@link TableResult.Database | `TableResult.DatabaseOperation`}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<TableResult> {}

    /**
     * @deprecated {@link TableResult.Types | `TableResult.SubType`}
     */
    type TypeNames = TableResult.SubType;

    /**
     * @deprecated {@link TableResult.CreateData | `TableResult.CreateData`}
     */
    interface ConstructorData extends TableResult.CreateData {}

    /**
     * @deprecated {@link TableResult.implementation | `TableResult.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link TableResult.Implementation | `TableResult.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side TableResult document which extends the common BaseTableResult model.
   *
   * @see {@link RollTable | `RollTable`}         The RollTable document which contains TableResult embedded documents
   */
  class TableResult<out SubType extends TableResult.SubType = TableResult.SubType> extends ClientDocumentMixin(
    foundry.documents.BaseTableResult,
  )<SubType> {
    /**
     * @param data    - Initial data from which to construct the `TableResult`
     * @param context - Construction context options
     */
    constructor(...args: TableResult.ConstructorArgs);

    /**
     * A path reference to the icon image used to represent this result
     */
    get icon(): string;

    /**
     * Prepare a string representation for the result which (if possible) will be a dynamic link or otherwise plain text
     * @returns The text to display
     */
    getChatText(): string;

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

    // Descendant Document operations have been left out because TableResult does not have any descendant documents.

    static override defaultName(
      context: Document.DefaultNameContext<TableResult.SubType, NonNullable<TableResult.Parent>>,
    ): string;

    static override createDialog(
      data: Document.CreateDialogData<TableResult.CreateData>,
      context: Document.CreateDialogContext<TableResult.SubType, NonNullable<TableResult.Parent>>,
    ): Promise<TableResult.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<TableResult.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<TableResult.Implementation | undefined>;

    static override fromImport(
      source: TableResult.Source,
      context?: Document.FromImportContext<TableResult.Parent>,
    ): Promise<TableResult.Implementation>;

    // Embedded document operations have been left out because TableResult does not have any embedded documents.
  }
}
