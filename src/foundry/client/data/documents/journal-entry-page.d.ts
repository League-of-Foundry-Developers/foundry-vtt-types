export {};

declare global {
  /**
   * The client-side JournalEntryPage document which extends the common BaseJournalEntryPage document model.
   *
   * @see {@link JournalEntry}  The JournalEntry document type which contains JournalEntryPage embedded documents.
   */
  class JournalEntryPage extends ClientDocumentMixin(foundry.documents.BaseJournalEntryPage) {}
}
