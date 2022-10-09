/**
 * The client-side Note document which extends the common BaseNote model.
 * Each Note document contains NoteData which defines its data schema.
 *
 * @see {@link data.NoteData}                 The Note data schema
 * @see {@link documents.Scene}               The Scene document type which contains Note embedded documents
 * @see {@link applications.NoteConfig}       The Note configuration application
 */
declare class NoteDocument extends CanvasDocumentMixin(foundry.documents.BaseNote) {
  /**
   * The associated JournalEntry which is referenced by this Note
   */
  get entry(): ReturnType<Journal["get"]>;

  /**
   * The text label used to annotate this Note
   */
  get label(): string;
}
