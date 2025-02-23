import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields } from "../../../common/data/module.d.mts";

declare global {
  namespace Setting {
    /**
     * The implementation of the Setting document instance configured through `CONFIG.Setting.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredSetting | `configuration/ConfiguredSetting`} in fvtt-types.
     */
    type Implementation = Document.ImplementationInstanceFor<"Setting">;

    /**
     * The implementation of the Setting document configured through `CONFIG.Setting.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ImplementationClassFor<"Setting">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"Setting"> {}

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = null;

    /**
     * An instance of `Setting` that comes from the database.
     */
    interface Stored extends Document.Stored<Setting.Implementation> {}

    /**
     * The data put in {@link DataModel._source | `DataModel._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link Setting._source | `Setting._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link Setting.create | `Setting.create`}
     * and {@link Setting | `new Setting(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link Setting.name | `Setting#name`}.
     *
     * This is data transformed from {@link Setting.Source | `Setting.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link Setting.update | `Setting#update`}.
     * It is a distinct type from {@link Setting.CreateData | `DeepPartial<Setting.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link Setting | `Setting`}. This is the source of truth for how an Setting document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link Setting | `Setting`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies this Setting document
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      /**
       * The setting key, a composite of \{scope\}.\{name\}
       * @defaultValue `""`
       */
      key: fields.StringField<{
        required: true;
        nullable: false;
        blank: false;
        validate: (k: string) => boolean;
        validationError: "must have the format {scope}.{field}";
      }>;

      /**
       * The setting value, which is serialized to JSON
       * @defaultValue `undefined`
       */
      value: fields.JSONField<{
        required: true;
        nullable: true;
        initial: null;
      }>;

      /**
       * An object of creation and access information
       * @defaultValue see {@link fields.DocumentStatsField}
       */
      _stats: fields.DocumentStatsField;
    }
    namespace DatabaseOperation {
      /** Options passed along in Get operations for Settings */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<Setting.Parent> {}
      /** Options passed along in Create operations for Settings */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<Setting.CreateData, Setting.Parent, Temporary> {}
      /** Options passed along in Delete operations for Settings */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Setting.Parent> {}
      /** Options passed along in Update operations for Settings */
      interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Setting.UpdateData, Setting.Parent> {}

      /** Options for {@link Setting.createDocuments | `Setting.createDocuments`} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link Setting._preCreateOperation | `Setting._preCreateOperation`} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link Setting#_preCreate | `Setting#_preCreate`} */
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      /** Options for {@link Setting#_onCreate | `Setting#_onCreate`} */
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      /** Options for {@link Setting.updateDocuments | `Setting.updateDocuments`} */
      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      /** Options for {@link Setting._preUpdateOperation | `Setting._preUpdateOperation`} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link Setting#_preUpdate | `Setting#_preUpdate`} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      /** Options for {@link Setting#_onUpdate | `Setting#_onUpdate`} */
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      /** Options for {@link Setting.deleteDocuments | `Setting.deleteDocuments`} */
      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      /** Options for {@link Setting._preDeleteOperation | `Setting._preDeleteOperation`} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link Setting#_preDelete | `Setting#_preDelete`} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link Setting#_onDelete | `Setting#_onDelete`} */
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    /**
     * @deprecated - {@link Setting.DatabaseOperation}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<Setting> {}

    /**
     * @deprecated {@link Setting.CreateData | `Setting.CreateData`}
     */
    interface ConstructorData extends Setting.CreateData {}

    /**
     * @deprecated {@link Setting.implementation | `Setting.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link Setting.Implementation | `Setting.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side Setting document which extends the common BaseSetting model.
   *
   * @see {@link WorldSettings}       The world-level collection of Setting documents
   */
  class Setting extends ClientDocumentMixin(foundry.documents.BaseSetting) {
    /**
     * @param data    - Initial data from which to construct the `Setting`
     * @param context - Construction context options
     *
     * @deprecated Constructing `Setting` directly is not advised. While `new Setting(...)` would create a
     * temporary document it would not respect a system's subclass of `Setting`, if any.
     *
     * You should use {@link Setting.implementation | `new Setting.implementation(...)`} instead which
     * will give you a system specific implementation of `Setting`.
     */
    constructor(...args: Document.ConstructorParameters<Setting.CreateData, Setting.Parent>);

    /**
     * @privateRemarks This exists to let ts know that this class has a private property
     */
    static #PRIMITIVE_TYPES: any;

    /**
     * The setting configuration for this setting document.
     */
    get config(): SettingsConfig | undefined;

    // TODO: This is the same as `DataModel._initialize`
    protected _initialize(options?: any): void;

    /**
     * @privateRemarks _onCreate and _preUpdate are overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    /**
     * Cast the value of the Setting into its defined type.
     * @returns The initialized type of the Setting document.
     */
    // TODO: This could probably be derived
    protected _castType(): any;

    /*
     * After this point these are not really overridden methods.
     * They are here because they're static properties but depend on the instance and so can't be
     * defined DRY-ly while also being easily overridable.
     */

    static override defaultName(context?: Document.DefaultNameContext<string, Setting.Parent>): string;

    /**
     * @throws Foundry tries to figure out the folders for the world collection and errors out
     */
    static override createDialog(
      data?: Setting.CreateData,
      context?: Document.CreateDialogContext<string, Setting.Parent>,
    ): never;

    static override fromDropData(
      data: Document.DropData<Setting.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<Setting.Implementation | undefined>;

    static override fromImport(
      source: Setting.Source,
      context?: Document.FromImportContext<Setting.Parent>,
    ): Promise<Setting.Implementation>;
  }
}
