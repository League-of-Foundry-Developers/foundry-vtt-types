import type { FolderDocumentTypes, InexactPartial, FixedInstanceType } from "fvtt-types/utils";
import type { fields } from "../../../common/data/module.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";

declare global {
  namespace Adventure {
    /**
     * The implementation of the Adventure document instance configured through `CONFIG.Adventure.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredAdventure | `configuration/ConfiguredAdventure`} in fvtt-types.
     */
    type Implementation = Document.ImplementationInstanceFor<"Adventure">;

    /**
     * The implementation of the Adventure document configured through `CONFIG.Adventure.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ImplementationClassFor<"Adventure">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"Adventure"> {}

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = null;

    /**
     * An instance of `Adventure` that comes from the database.
     */
    interface Stored extends Document.Stored<Adventure.Implementation> {}

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
     * The data put in {@link Adventure._source | `Adventure._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link Adventure.create | `Adventure.create`}
     * and {@link Adventure | `new Adventure(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link Adventure.name | `Adventure#name`}.
     *
     * This is data transformed from {@link Adventure.Source | `Adventure.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link Adventure.update | `Adventure#update`}.
     * It is a distinct type from {@link Adventure.CreateData | `DeepPartial<Adventure.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link Adventure | `Adventure`}. This is the source of truth for how an Adventure document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link Adventure | `Adventure`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies this Adventure document
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      /**
       * The human-readable name of the Adventure
       */
      name: fields.StringField<{
        required: true;
        blank: false;
        label: "ADVENTURE.Name";
        hint: "ADVENTURE.NameHint";
        textSearch: true;
      }>;

      /**
       * The file path for the primary image of the adventure
       * @defaultValue `null`
       */
      img: fields.FilePathField<{ categories: ["IMAGE"]; label: "ADVENTURE.Image"; hint: "ADVENTURE.ImageHint" }>;

      /**
       * A string caption displayed under the primary image banner
       * @defaultValue `""`
       */
      caption: fields.HTMLField<{ label: "ADVENTURE.Caption"; hint: "ADVENTURE.CaptionHint" }>;

      /**
       * An HTML text description for the adventure
       * @defaultValue `""`
       */
      description: fields.HTMLField<{
        label: "ADVENTURE.Description";
        hint: "ADVENTURE.DescriptionHint";
        textSearch: true;
      }>;

      /**
       * An array of Actor documents which are included in the adventure
       * @defaultValue `new Set()`
       */
      actors: fields.SetField<fields.EmbeddedDataField<typeof foundry.documents.BaseActor>>;

      /**
       * An array of Combat documents which are included in the adventure
       * @defaultValue `new Set()`
       */
      combats: fields.SetField<fields.EmbeddedDataField<typeof foundry.documents.BaseCombat>>;

      /**
       * An array of Item documents which are included in the adventure
       * @defaultValue `new Set()`
       */
      items: fields.SetField<fields.EmbeddedDataField<typeof foundry.documents.BaseItem>>;

      /**
       * An array of JournalEntry documents which are included in the adventure
       * @defaultValue `new Set()`
       */
      journal: fields.SetField<fields.EmbeddedDataField<typeof foundry.documents.BaseJournalEntry>>;

      /**
       * An array of Scene documents which are included in the adventure
       * @defaultValue `new Set()`
       */
      scenes: fields.SetField<fields.EmbeddedDataField<typeof foundry.documents.BaseScene>>;

      /**
       * An array of RollTable documents which are included in the adventure
       * @defaultValue `new Set()`
       */
      tables: fields.SetField<fields.EmbeddedDataField<typeof foundry.documents.BaseRollTable>>;

      /**
       * An array of Macro documents which are included in the adventure
       * @defaultValue `new Set()`
       */
      macros: fields.SetField<fields.EmbeddedDataField<typeof foundry.documents.BaseMacro>>;

      /**
       * An array of Cards documents which are included in the adventure
       * @defaultValue `new Set()`
       */
      cards: fields.SetField<fields.EmbeddedDataField<typeof foundry.documents.BaseCards>>;

      /**
       * An array of Playlist documents which are included in the adventure
       * @defaultValue `new Set()`
       */
      playlists: fields.SetField<fields.EmbeddedDataField<typeof foundry.documents.BasePlaylist>>;

      /**
       * An array of Folder documents which are included in the adventure
       * @defaultValue `new Set()`
       */
      folders: fields.SetField<fields.EmbeddedDataField<typeof foundry.documents.BaseFolder>>;

      folder: fields.ForeignDocumentField<typeof foundry.documents.BaseFolder>;

      /**
       * The sort order of this adventure relative to its siblings
       * @defaultValue `0`
       */
      sort: fields.IntegerSortField;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<"Adventure">;

      /**
       * An object of creation and access information
       * @defaultValue see {@link fields.DocumentStatsField}
       */
      _stats: fields.DocumentStatsField;
    }

    namespace DatabaseOperation {
      /** Options passed along in Get operations for Adventures */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<Adventure.Parent> {}
      /** Options passed along in Create operations for Adventures */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<Adventure.CreateData, Adventure.Parent, Temporary> {}
      /** Options passed along in Delete operations for Adventures */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Adventure.Parent> {}
      /** Options passed along in Update operations for Adventures */
      interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Adventure.UpdateData, Adventure.Parent> {}

      /** Options for {@link Adventure.createDocuments | `Adventure.createDocuments`} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link Adventure._preCreateOperation | `Adventure._preCreateOperation`} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link Adventure#_preCreate | `Adventure#_preCreate`} */
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      /** Options for {@link Adventure#_onCreate | `Adventure#_onCreate`} */
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      /** Options for {@link Adventure.updateDocuments | `Adventure.updateDocuments`} */
      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      /** Options for {@link Adventure._preUpdateOperation | `Adventure._preUpdateOperation`} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link Adventure#_preUpdate | `Adventure#_preUpdate`} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      /** Options for {@link Adventure#_onUpdate | `Adventure#_onUpdate`} */
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      /** Options for {@link Adventure.deleteDocuments | `Adventure.deleteDocuments`} */
      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      /** Options for {@link Adventure._preDeleteOperation | `Adventure._preDeleteOperation`} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link Adventure#_preDelete | `Adventure#_preDelete`} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link Adventure#_onDelete | `Adventure#_onDelete`} */
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    interface PrepareImportOptions {
      /**
       * A subset of adventure fields to import.
       */
      // TODO: This isn't *quite* right as the keyof is including all the nevers.
      importFields: Array<keyof typeof foundry.documents.BaseAdventure.contentFields | "all">;
    }

    interface ImportOptions extends PrepareImportOptions {
      /**
       * Display a warning dialog if existing documents would be overwritten
       * @defaultValue `true`
       */
      dialog: boolean;
    }

    /**
     * @deprecated - {@link Adventure.DatabaseOperation}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<Adventure> {}

    /**
     * @deprecated {@link Adventure.CreateData | `Adventure.CreateData`}
     */
    interface ConstructorData extends Adventure.CreateData {}

    /**
     * @deprecated {@link Adventure.implementation | `Adventure.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link Adventure.Implementation | `Adventure.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side Adventure document which extends the common {@link foundry.documents.BaseAdventure} model.
   */
  class Adventure extends ClientDocumentMixin(foundry.documents.BaseAdventure) {
    /**
     * @param data    - Initial data from which to construct the `Adventure`
     * @param context - Construction context options
     *
     * @deprecated Constructing `Adventure` directly is not advised. While `new Adventure(...)` would create a
     * temporary document it would not respect a system's subclass of `Adventure`, if any.
     *
     * You should use {@link Adventure.implementation | `new Adventure.implementation(...)`} instead which
     * will give you a system specific implementation of `Adventure`.
     */
    constructor(...args: Document.ConstructorParameters<Adventure.CreateData, Adventure.Parent>);

    /**
     * Perform a full import workflow of this Adventure.
     * Create new and update existing documents within the World.
     * @param options - Options which configure and customize the import process
     * @returns The import result
     */
    import(options?: InexactPartial<Adventure.ImportOptions>): Promise<AdventureImportResult>;

    /**
     * Prepare Adventure data for import into the World.
     * @param options - Options passed in from the import dialog to configure the import behavior
     * @returns A subset of adventure fields to import.
     */
    prepareImport(options?: InexactPartial<Adventure.PrepareImportOptions>): Promise<AdventureImportData>;

    /**
     * Execute an Adventure import workflow, creating and updating documents in the World.
     */
    importContent(data?: InexactPartial<AdventureImportData>): Promise<AdventureImportResult>;

    /*
     * After this point these are not really overridden methods.
     * They are here because they're static properties but depend on the instance and so can't be
     * defined DRY-ly while also being easily overridable.
     */

    static override defaultName(context: Document.DefaultNameContext<"base", Adventure.Parent>): string;

    static override createDialog(
      data: Document.CreateDialogData<Adventure.CreateData>,
      context: Document.CreateDialogContext<string, Adventure.Parent>,
    ): Promise<Adventure.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<Adventure.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<Adventure.Implementation | undefined>;

    static override fromImport(
      source: Adventure.Source,
      context?: Document.FromImportContext<Adventure.Parent>,
    ): Promise<Adventure.Implementation>;
  }

  interface AdventureImportData {
    toCreate?: DocumentDataRecord;
    toUpdate?: DocumentDataRecord;
    documentCount: number;
  }

  interface AdventureImportResult {
    created: DocumentResult;
    updated: DocumentResult;
  }
}

type DocumentDataRecord = {
  [K in AdventureDocumentTypes]?: foundry.data.fields.SchemaField.AssignmentData<
    ReturnType<Document.ImplementationClassFor<K>["defineSchema"]>
  >[];
};

type DocumentResult = {
  [K in AdventureDocumentTypes]?: FixedInstanceType<Document.ImplementationClassFor<K>>[];
};

type AdventureDocumentTypes = Exclude<FolderDocumentTypes, "Adventure"> | "Folder";
