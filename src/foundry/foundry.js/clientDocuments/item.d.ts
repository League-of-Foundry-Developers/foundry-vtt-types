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
  class Item extends ClientDocumentMixin(foundry.documents.BaseItem) {
    /**
     * A convenience alias of Item#parent which is more semantically intuitive
     */
    get actor(): this['parent'];

    /**
     * A convenience reference to the image path (data.img) used to represent this Item
     */
    get img(): this['data']['img'];

    /**
     * A convenience alias of Item#isEmbedded which is preserves legacy support
     */
    get isOwned(): this['isEmbedded'];

    /**
     * Return an array of the Active Effect instances which originated from this Item.
     * The returned instances are the ActiveEffect instances which exist on the Item itself.
     */
    get transferredEffects(): ActiveEffect[];

    /**
     * A convenience reference to the item type (data.type) of this Item
     */
    get type(): this['data']['type'];

    /**
     * Prepare a data object which defines the data schema used by dice roll commands against this Item
     */
    getRollData(): this['data']['data'];
  }
}

export {};
