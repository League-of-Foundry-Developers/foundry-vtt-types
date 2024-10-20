import type {
  ConfiguredDocumentClassForName,
  ConfiguredDocumentInstanceForName,
} from "../../../../types/helperTypes.d.mts";

declare global {
  namespace NoteDocument {
    type ConfiguredClass = ConfiguredDocumentClassForName<"Note">;
    type ConfiguredInstance = ConfiguredDocumentInstanceForName<"Note">;
  }

  /**
   * The client-side Note document which extends the common BaseNote model.
   * Each Note document contains NoteData which defines its data schema.
   *
   * @see {@link Scene}               The Scene document type which contains Note embedded documents
   * @see {@link NoteConfig}          The Note configuration application
   */
  class NoteDocument extends CanvasDocumentMixin(foundry.documents.BaseNote) {
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
