declare global {
  /**
   * The client-side TableResult document which extends the common BaseTableResult model.
   * Each TableResult belongs to the results collection of a RollTable entity.
   * Each TableResult contains a TableResultData object which provides its source data.
   *
   * @see {@link data.TableResultData}        The TableResult data schema
   * @see {@link documents.RollTable}         The RollTable document which contains TableResult embedded documents
   */
  class TableResult extends ClientDocumentMixin(foundry.documents.BaseTableResult) {
    /**
     * @param data   - Initial data provided to construct the TableResult document
     * @param parent - The parent RollTable document to which this result belongs
     */
    constructor(...args: ConstructorParameters<typeof foundry.documents.BaseTableResult>);

    /**
     * A path reference to the icon image used to represent this result
     */
    get icon(): string;

    /**
     * Prepare a string representation for the result which (if possible) will be a dynamic link or otherwise plain text
     * @returns The text to display
     */
    getChatText(): string;
  }
}

export {};
