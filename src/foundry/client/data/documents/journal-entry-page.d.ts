import './utils/primitives.mjs';

declare global {
  /**
   * The client-side JournalEntryPage document which extends the common BaseJournalEntryPage document model.
   *
   * @see {@link JournalEntry} The JournalEntry document type which contains JournalEntryPage embedded documents.
   *
   * @param data - Initial data provided to construct the JournalEntry document
   */
  class JournalEntryPage extends ClientDocumentMixin(foundry.documents.BaseJournalEntryPage) {
    /**
     * Convert a heading into slug suitable for use as an identifier.
     * @param heading - The heading element or some text content.
     */
    static slugifyHeading(heading: HTMLHeadingElement | string): ReturnType<String['slugify']>;
  }
}
export {};
