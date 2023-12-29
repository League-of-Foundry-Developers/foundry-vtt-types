// FOUNDRY_VERSION: 10.291

import type BaseNote from "../../../common/documents/note.mts";

declare global {
  /**
   * The client-side Note document which extends the common BaseNote document model.
   *
   * @see {@link Scene}            The Scene document type which contains Note documents
   * @see {@link NoteConfig}       The Note configuration application
   */
  class NoteDocument extends CanvasDocumentMixin(BaseNote) {
    /**
     * The associated JournalEntry which is referenced by this Note
     */
    get entry(): JournalEntry;

    /**
     * The specific JournalEntryPage within the associated JournalEntry referenced by this Note.
     */
    get page(): JournalEntryPage;

    /**
     * The text label used to annotate this Note
     */
    get label(): string;
  }
}
