import type { documents } from "../../../client-esm/client.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields, TextureData } from "../../../common/data/module.d.mts";
import type BaseNote from "../../../common/documents/note.d.mts";

declare global {
  namespace NoteDocument {
    /**
     * The implementation of the NoteDocument document instance configured through `CONFIG.Note.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredNoteDocument | `configuration/ConfiguredNoteDocument`} in fvtt-types.
     */
    type Implementation = Document.ConfiguredInstanceForName<"Note">;

    /**
     * The implementation of the NoteDocument document configured through `CONFIG.Note.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ConfiguredClassForName<"Note">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"Note"> {}

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = Scene.Implementation | null;

    /**
     * An instance of `NoteDocument` that comes from the database.
     */
    interface Stored extends Document.Stored<NoteDocument.Implementation> {}

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
     * The data put in {@link NoteDocument._source | `NoteDocument._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link NoteDocument.create | `NoteDocument.create`}
     * and {@link NoteDocument | `new NoteDocument(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link NoteDocument.name | `NoteDocument#name`}.
     *
     * This is data transformed from {@link NoteDocument.Source | `NoteDocument.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link NoteDocument.update | `NoteDocument#update`}.
     * It is a distinct type from {@link NoteDocument.CreateData | `DeepPartial<NoteDocument.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link NoteDocument | `NoteDocument`}. This is the source of truth for how an NoteDocument document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link NoteDocument | `NoteDocument`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies this BaseNote embedded document
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      /**
       * The _id of a JournalEntry document which this Note represents
       * @defaultValue `null`
       */
      entryId: fields.ForeignDocumentField<typeof documents.BaseJournalEntry, { idOnly: true }>;

      /**
       * The _id of a specific JournalEntryPage document which this Note represents
       * @defaultValue `null`
       */
      pageId: fields.ForeignDocumentField<typeof documents.BaseJournalEntryPage, { idOnly: true }>;

      /**
       * The x-coordinate position of the center of the note icon
       * @defaultValue `0`
       */
      x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "XCoord" }>;

      /**
       * The y-coordinate position of the center of the note icon
       * @defaultValue `0`
       */
      y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "YCoord" }>;

      /**
       * An image icon used to represent this note
       * @defaultValue `BaseNote.DEFAULT_ICON`
       */
      texture: TextureData<{
        categories: ["IMAGE"];
        initial: () => typeof BaseNote.DEFAULT_ICON;
        label: "NOTE.EntryIcon";
      }>;

      /**
       * The pixel size of the map note icon
       * @defaultValue `40`
       */
      iconSize: fields.NumberField<{
        required: true;
        integer: true;
        min: 32;
        initial: 40;
        validationError: "must be an integer greater than 32";
        label: "NOTE.IconSize";
      }>;

      /**
       * Optional text which overrides the title of the linked Journal Entry
       * @defaultValue `""`
       */
      text: fields.StringField<{ label: "NOTE.TextLabel"; textSearch: true }>;

      /**
       * The font family used to display the text label on this note, defaults to CONFIG.defaultFontFamily
       * @defaultValue `globalThis.CONFIG?.defaultFontFamily || "Signika"`
       */
      fontFamily: fields.StringField<{ required: true; label: "NOTE.FontFamily"; initial: () => string }>;

      /**
       * The font size used to display the text label on this note
       * @defaultValue `32`
       */
      fontSize: fields.NumberField<{
        required: true;
        integer: true;
        min: 8;
        max: 128;
        initial: 32;
        validationError: "must be an integer between 8 and 128";
        label: "NOTE.FontSize";
      }>;

      /**
       * A value in CONST.TEXT_ANCHOR_POINTS which defines where the text label anchors to the note icon.
       * @defaultValue `CONST.TEXT_ANCHOR_POINTS.BOTTOM`
       */
      textAnchor: fields.NumberField<{
        required: true;
        choices: foundry.CONST.TEXT_ANCHOR_POINTS[];
        initial: typeof CONST.TEXT_ANCHOR_POINTS.BOTTOM;
        label: "NOTE.AnchorPoint";
        validationError: "must be a value in CONST.TEXT_ANCHOR_POINTS";
      }>;

      /**
       * The string that defines the color with which the note text is rendered
       * @defaultValue `#FFFFFF`
       */
      textColor: fields.ColorField<{ initial: "#FFFFFF"; label: "NOTE.TextColor" }>;

      /**
       * Whether this map pin is globally visible or requires LoS to see.
       * @defaultValue `false`
       */
      global: fields.BooleanField;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<"Note">;
    }
    namespace DatabaseOperation {
      /** Options passed along in Get operations for NoteDocuments */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<NoteDocument.Parent> {}
      /** Options passed along in Create operations for NoteDocuments */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<
          NoteDocument.CreateData,
          NoteDocument.Parent,
          Temporary
        > {}
      /** Options passed along in Delete operations for NoteDocuments */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<NoteDocument.Parent> {}
      /** Options passed along in Update operations for NoteDocuments */
      interface Update
        extends foundry.abstract.types.DatabaseUpdateOperation<NoteDocument.UpdateData, NoteDocument.Parent> {}

      /** Options for {@link NoteDocument.createDocuments} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link NoteDocument._preCreateOperation} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link NoteDocument#_preCreate} */
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      /** Options for {@link NoteDocument#_onCreate} */
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      /** Options for {@link NoteDocument.updateDocuments} */
      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      /** Options for {@link NoteDocument._preUpdateOperation} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link NoteDocument#_preUpdate} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      /** Options for {@link NoteDocument#_onUpdate} */
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      /** Options for {@link NoteDocument.deleteDocuments} */
      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      /** Options for {@link NoteDocument._preDeleteOperation} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link NoteDocument#_preDelete} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link NoteDocument#_onDelete} */
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    /**
     * @deprecated - {@link NoteDocument.DatabaseOperation}
     */
    interface DatabaseOperations extends Document.Database.Operations<NoteDocument> {}

    /**
     * @deprecated {@link NoteDocument.CreateData | `NoteDocument.CreateData`}
     */
    interface ConstructorData extends NoteDocument.CreateData {}

    /**
     * @deprecated {@link NoteDocument.implementation | `NoteDocument.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link NoteDocument.Implementation | `NoteDocument.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side Note document which extends the common BaseNote model.
   * Each Note document contains NoteData which defines its data schema.
   *
   * @see {@link Scene}               The Scene document type which contains Note embedded documents
   * @see {@link NoteConfig}          The Note configuration application
   */
  class NoteDocument extends CanvasDocumentMixin(foundry.documents.BaseNote) {
    static override metadata: NoteDocument.Metadata;

    static get implementation(): NoteDocument.ImplementationClass;

    /**
     * The associated JournalEntry which is referenced by this Note
     */
    get entry(): JournalEntry.ImplementationClass | undefined;

    /**
     * The specific JournalEntryPage within the associated JournalEntry referenced by this Note.
     */
    get page(): JournalEntryPage.ImplementationClass | undefined;

    /**
     * The text label used to annotate this Note
     */
    get label(): string;
  }
}
