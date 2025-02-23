import type Document from "../../../common/abstract/document.d.mts";
import type { fields } from "../../../common/data/module.d.mts";
import type { documents } from "../../../client-esm/client.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { InterfaceToObject, ValueOf } from "../../../../utils/index.d.mts";

declare global {
  namespace JournalEntry {
    /**
     * The implementation of the JournalEntry document instance configured through `CONFIG.JournalEntry.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredJournalEntry | `fvtt-types/configuration/ConfiguredJournalEntry`} in fvtt-types.
     */
    type Implementation = Document.ImplementationInstanceFor<"JournalEntry">;

    /**
     * The implementation of the JournalEntry document configured through `CONFIG.JournalEntry.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ImplementationClassFor<"JournalEntry">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"JournalEntry"> {}

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = null;

    /**
     * An instance of `JournalEntry` that comes from the database.
     */
    interface Stored extends Document.Stored<JournalEntry.Implementation> {}

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
     * The data put in {@link JournalEntry._source | `JournalEntry._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link JournalEntry.create | `JournalEntry.create`}
     * and {@link JournalEntry | `new JournalEntry(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link JournalEntry.name | `JournalEntry#name`}.
     *
     * This is data transformed from {@link JournalEntry.Source | `JournalEntry.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link JournalEntry.update | `JournalEntry#update`}.
     * It is a distinct type from {@link JournalEntry.CreateData | `DeepPartial<JournalEntry.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link JournalEntry | `JournalEntry`}. This is the source of truth for how an JournalEntry document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link JournalEntry | `JournalEntry`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies this JournalEntry document
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      /**
       * The name of this JournalEntry
       */
      name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

      /**
       * The pages contained within this JournalEntry document
       * @defaultValue `[]`
       */
      pages: fields.EmbeddedCollectionField<typeof documents.BaseJournalEntryPage, JournalEntry.Implementation>;

      /**
       * The _id of a Folder which contains this JournalEntry
       * @defaultValue `null`
       */
      folder: fields.ForeignDocumentField<typeof documents.BaseFolder>;

      /**
       * The numeric sort value which orders this JournalEntry relative to its siblings
       * @defaultValue `0`
       */
      sort: fields.IntegerSortField;

      /**
       * An object which configures ownership of this JournalEntry
       * @defaultValue see {@link fields.DocumentOwnershipField | `fields.DocumentOwnershipField`}
       */
      ownership: fields.DocumentOwnershipField;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<"JournalEntry", InterfaceToObject<CoreFlags>>;

      /**
       * An object of creation and access information
       * @defaultValue see {@link fields.DocumentStatsField | `fields.DocumentStatsField`}
       */
      _stats: fields.DocumentStatsField;
    }

    namespace DatabaseOperation {
      /** Options passed along in Get operations for  JournalEntries */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<JournalEntry.Parent> {}
      /** Options passed along in Create operations for  JournalEntries */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<
          JournalEntry.CreateData,
          JournalEntry.Parent,
          Temporary
        > {}
      /** Options passed along in Delete operations for  JournalEntries */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<JournalEntry.Parent> {}
      /** Options passed along in Update operations for  JournalEntries */
      interface Update
        extends foundry.abstract.types.DatabaseUpdateOperation<JournalEntry.UpdateData, JournalEntry.Parent> {}

      /** Options for {@link JournalEntry.createDocuments | `JournalEntry.createDocuments`} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link JournalEntry._preCreateOperation | `JournalEntry._preCreateOperation`} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link JournalEntry._preCreate | `JournalEntry#_preCreate`} */
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      /** Options for {@link JournalEntry._onCreate | `JournalEntry#_onCreate`} */
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      /** Options for {@link JournalEntry.updateDocuments | `JournalEntry.updateDocuments`} */
      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      /** Options for {@link JournalEntry._preUpdateOperation | `JournalEntry._preUpdateOperation`} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link JournalEntry._preUpdate | `JournalEntry#_preUpdate`} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      /** Options for {@link JournalEntry._onUpdate | `JournalEntry#_onUpdate`} */
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      /** Options for {@link JournalEntry.deleteDocuments | `JournalEntry.deleteDocuments`} */
      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      /** Options for {@link JournalEntry._preDeleteOperation | `JournalEntry._preDeleteOperation`} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link JournalEntry._preDelete | `JournalEntry#_preDelete`} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link JournalEntry._onDelete | `JournalEntry#_onDelete`} */
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    interface CoreFlags {
      core?: {
        viewMode?: ValueOf<typeof JournalSheet.VIEW_MODES>;
        searchMode?: CONST.DIRECTORY_SEARCH_MODES;
      };
    }

    /**
     * @deprecated - {@link JournalEntry.DatabaseOperation | `JournalEntry.DatabaseOperation`}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<JournalEntry> {}

    /**
     * @deprecated {@link JournalEntry.CreateData | `JournalEntry.CreateData`}
     */
    interface ConstructorData extends JournalEntry.CreateData {}

    /**
     * @deprecated {@link JournalEntry.implementation | `JournalEntry.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link JournalEntry.Implementation | `JournalEntry.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side JournalEntry document which extends the common BaseJournalEntry model.
   *
   * @see {@link Journal | `Journal`}                  The world-level collection of JournalEntry documents
   * @see {@link JournalSheet | `JournalSheet`}          The JournalEntry configuration application
   */
  class JournalEntry extends ClientDocumentMixin(foundry.documents.BaseJournalEntry) {
    /**
     * @param data    - Initial data from which to construct the `JournalEntry`
     * @param context - Construction context options
     *
     * @deprecated Constructing `JournalEntry` directly is not advised. While `new JournalEntry(...)` would create a
     * temporary document it would not respect a system's subclass of `JournalEntry`, if any.
     *
     * You should use {@link JournalEntry.implementation | `new JournalEntry.implementation(...)`} instead which
     * will give you a system specific implementation of `JournalEntry`.
     */
    constructor(...args: Document.ConstructorParameters<JournalEntry.CreateData, JournalEntry.Parent>);

    /**
     * A boolean indicator for whether or not the JournalEntry is visible to the current user in the directory sidebar
     */
    get visible(): boolean;

    override getUserLevel(user?: User.Implementation): foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | null;

    /**
     * Return a reference to the Note instance for this Journal Entry in the current Scene, if any.
     * If multiple notes are placed for this Journal Entry, only the first will be returned.
     */
    get sceneNote(): Note | null;

    /**
     * Show the JournalEntry to connected players.
     * By default the entry will only be shown to players who have permission to observe it.
     * If the parameter force is passed, the entry will be shown to all players regardless of normal permission.
     *
     * @param force - Display the entry to all players regardless of normal permissions
     *                (default: `false`)
     * @returns A Promise that resolves back to the shown entry once the request is processed
     */
    show(force?: boolean): Promise<this>;

    /**
     * If the JournalEntry has a pinned note on the canvas, this method will animate to that note
     * The note will also be highlighted as if hovered upon by the mouse
     * @param options - Options which modify the pan operation
     * @returns A Promise which resolves once the pan animation has concluded
     */
    panToNote(options?: PanToNoteOptions): Promise<void>;

    /**
     * @privateRemarks _onUpdate and _onDelete are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    /*
     * After this point these are not really overridden methods.
     * They are here because they're static properties but depend on the instance and so can't be
     * defined DRY-ly while also being easily overridable.
     */

    static override defaultName(context?: Document.DefaultNameContext<string, JournalEntry.Parent>): string;

    static override createDialog(
      data?: Document.CreateDialogData<JournalEntry.CreateData>,
      context?: Document.CreateDialogContext<string, JournalEntry.Parent>,
    ): Promise<JournalEntry.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<JournalEntry.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<JournalEntry.Implementation | undefined>;

    static override fromImport(
      source: JournalEntry.Source,
      context?: Document.FromImportContext<JournalEntry.Parent>,
    ): Promise<JournalEntry.Implementation>;
  }
}

interface PanToNoteOptions {
  /**
   * The speed of the pan animation in milliseconds
   * @defaultValue `250`
   */
  duration?: number;

  /**
   * The resulting zoom level
   * @defaultValue `1.5`
   */
  scale?: number;
}
