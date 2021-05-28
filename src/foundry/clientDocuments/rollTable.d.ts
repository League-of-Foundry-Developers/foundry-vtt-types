// TODO
declare global {
  /**
   * The client-side RollTable document which extends the common BaseRollTable abstraction.
   * Each RollTable document contains RollTableData which defines its data schema.
   *
   * @see {@link data.RollTableData}              The RollTable data schema
   * @see {@link documents.RollTables}            The world-level collection of RollTable documents
   * @see {@link applications.RollTableConfig}    The RollTable configuration application
   *
   * @param data - Initial data provided to construct the RollTable document
   */
  class RollTable extends ClientDocumentMixin(foundry.documents.BaseRollTable) {}
}

export {};
