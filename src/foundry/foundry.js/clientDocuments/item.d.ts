// TODO
declare global {
  /**
   * The client-side Item document which extends the common BaseItem abstraction.
   * Each Item document contains ItemData which defines its data schema.
   *
   * @see {@link data.ItemData}              The Item data schema
   * @see {@link documents.Items}            The world-level collection of Item documents
   * @see {@link applications.ItemSheet}     The Item configuration application
   *
   * @param data - Initial data provided to construct the Item document
   */
  class Item extends ClientDocumentMixin(foundry.documents.BaseItem) {}
}

export {};
