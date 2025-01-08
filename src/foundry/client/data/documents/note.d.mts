import type Document from "../../../common/abstract/document.d.mts";
import type BaseNote from "../../../common/documents/note.d.mts";

declare global {
  namespace NoteDocument {
    type Metadata = Document.MetadataFor<NoteDocument>;

    type ConfiguredClass = Document.ConfiguredClassForName<"Note">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"Note">;

    interface DatabaseOperations extends Document.Database.Operations<NoteDocument> {}

    // Helpful aliases
    type ConstructorData = BaseNote.ConstructorData;
    type UpdateData = BaseNote.UpdateData;
    type Schema = BaseNote.Schema;
    type Source = BaseNote.Source;
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

    static get implementation(): NoteDocument.ConfiguredClass;

    /**
     * The associated JournalEntry which is referenced by this Note
     */
    get entry(): JournalEntry.ConfiguredInstance | undefined;

    /**
     * The specific JournalEntryPage within the associated JournalEntry referenced by this Note.
     */
    get page(): JournalEntryPage.ConfiguredInstance | undefined;

    /**
     * The text label used to annotate this Note
     */
    get label(): string;
  }
}
