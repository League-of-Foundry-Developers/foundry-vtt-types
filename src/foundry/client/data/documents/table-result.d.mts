import type { ConfiguredTableResult } from "../../../../configuration/index.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields } from "../../../common/data/module.d.mts";
import type BaseTableResult from "../../../common/documents/table-result.d.mts";

declare global {
  namespace TableResult {
    /**
     * The implementation of the TableResult document instance configured through `CONFIG.TableResult.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredTableResult | `configuration/ConfiguredTableResult`} in fvtt-types.
     */
    type Implementation = Document.ConfiguredInstanceForName<"TableResult">;

    /**
     * The implementation of the TableResult document configured through `CONFIG.TableResult.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ConfiguredClassForName<"TableResult">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"TableResult"> {}

    type SubType = Game.Model.TypeNames<"TableResult">;
    type ConfiguredSubTypes = Document.ConfiguredSubTypesOf<"TableResult">;
    type Known = TableResult.OfType<TableResult.ConfiguredSubTypes>;
    type OfType<Type extends SubType> = Document.Internal.OfType<ConfiguredTableResult<Type>, TableResult<SubType>>;

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = RollTable.Implementation | null;

    /**
     * An instance of `TableResult` that comes from the database.
     */
    interface Stored<out Subtype extends SubType = SubType> extends Document.Stored<OfType<Subtype>> {}

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
     * The data put in {@link TableResult._source | `TableResult._source`}. This data is what was
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
     * The data after a {@link Document | `Document`} has been initialized, for example
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
      flags: fields.ObjectField.FlagsField<"TableResult">;
    }

    namespace DatabaseOperation {
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

      /** Options for {@link TableResult.createDocuments | `TableResult.createDocuments`} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link TableResult._preCreateOperation | `TableResult._preCreateOperation`} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link TableResult#_preCreate | `TableResult#_preCreate`} */
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      /** Options for {@link TableResult#_onCreate | `TableResult#_onCreate`} */
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      /** Options for {@link TableResult.updateDocuments | `TableResult.updateDocuments`} */
      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      /** Options for {@link TableResult._preUpdateOperation | `TableResult._preUpdateOperation`} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link TableResult#_preUpdate | `TableResult#_preUpdate`} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      /** Options for {@link TableResult#_onUpdate | `TableResult#_onUpdate`} */
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      /** Options for {@link TableResult.deleteDocuments | `TableResult.deleteDocuments`} */
      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      /** Options for {@link TableResult._preDeleteOperation | `TableResult._preDeleteOperation`} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link TableResult#_preDelete | `TableResult#_preDelete`} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link TableResult#_onDelete | `TableResult#_onDelete`} */
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    /**
     * @deprecated - {@link TableResult.DatabaseOperation}
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
   * @see {@link RollTable}         The RollTable document which contains TableResult embedded documents
   */
  class TableResult<out SubType extends TableResult.SubType = TableResult.SubType> extends ClientDocumentMixin(
    foundry.documents.BaseTableResult,
  )<SubType> {
    /**
     * @param data    - Initial data from which to construct the `TableResult`
     * @param context - Construction context options
     *
     * @deprecated Constructing `TableResult` directly is not advised. While `new TableResult(...)` would create a
     * temporary document it would not respect a system's subclass of `TableResult`, if any.
     *
     * You should use {@link TableResult.implementation | `new TableResult.implementation(...)`} instead which
     * will give you a system specific implementation of `TableResult`.
     */
    constructor(...args: Document.ConstructorParameters<TableResult.CreateData, TableResult.Parent>);

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
     * They are here because they're static properties but depend on the instance and so can't be
     * defined DRY-ly while also being easily overridable.
     */

    static override defaultName(
      context: Document.DefaultNameContext<TableResult.SubType, Exclude<TableResult.Parent, null>>,
    ): string;

    static override createDialog(
      data: Document.CreateDialogData<TableResult.CreateData>,
      context: Document.CreateDialogContext<TableResult.SubType, Exclude<TableResult.Parent, null>>,
    ): Promise<TableResult.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<TableResult.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<TableResult.Implementation | undefined>;

    static override fromImport(
      source: TableResult.Source,
      context?: Document.FromImportContext<TableResult.Parent>,
    ): Promise<TableResult.Implementation>;
  }
}
