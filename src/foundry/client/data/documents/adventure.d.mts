import type { FolderDocumentTypes, InexactPartial, FixedInstanceType } from "../../../../utils/index.d.mts";
import type { fields } from "../../../common/data/module.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";

declare global {
  namespace Adventure {
    /**
     * The implementation of the Adventure document instance configured through `CONFIG.Adventure.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredAdventure | `configuration/ConfiguredAdventure`} in fvtt-types.
     */
    type Implementation = Document.ConfiguredInstanceForName<"Adventure">;

    /**
     * The implementation of the Adventure document configured through `CONFIG.Adventure.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ConfiguredClassForName<"Adventure">;

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
      interface Get extends foundry.abstract.types.DatabaseGetOperation<Actor.Parent> {}
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<Actor.CreateData, Actor.Parent, Temporary> {}
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Actor.Parent> {}
      interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Actor.UpdateData, Actor.Parent> {}

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
     * @deprecated - {@link Actor.DatabaseOperation}
     */
    interface DatabaseOperations extends Document.Database.Operations<Adventure> {}

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
  }

  /**
   * The client-side Adventure document which extends the common {@link foundry.documents.BaseAdventure} model.
   */
  class Adventure extends ClientDocumentMixin(foundry.documents.BaseAdventure) {
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
     * defined DRY-ly while also being easily overrideable.
     */

    static override defaultName(context?: Document.DefaultNameContext<"base", Adventure.Parent>): string;

    static override createDialog(
      data: Adventure.CreateData,
      context?: Document.CreateDialogContext<"base", Adventure.Parent>,
    ): Promise<Adventure.Implementation | null | undefined>;

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
    ReturnType<Document.ConfiguredClassForName<K>["defineSchema"]>
  >[];
};

type DocumentResult = {
  [K in AdventureDocumentTypes]?: FixedInstanceType<Document.ConfiguredClassForName<K>>[];
};

type AdventureDocumentTypes = Exclude<FolderDocumentTypes, "Adventure"> | "Folder";
